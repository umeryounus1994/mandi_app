import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
admin.initializeApp(functions.config().firebase);
 
exports.pushNotifications = functions.firestore
.document('notifications/{notificationId}')
.onCreate(async (snapshot, context ) => {  
    const data = snapshot.data();
  
    const payload = {
        notification: {
            title: data.title,
            body:  data.body,
            icon: 'notification_icon',
            sound: 'default',
            vibrate: 'true',
            priority: 'high',

        }
    }
 
    // ref to the device collection for the user
    const db = admin.firestore()
    const devicesRef = db.collection('devices').where('userId','==',data.userId);
    const devices = await devicesRef.get();

    const tokens : any = [];

    // send a notification to each device token
    devices.forEach(result => {
      const token = result.data().token;

      tokens.push( token )
    })

    
    // get the user's tokens and send notifications
     

    return admin.messaging().sendToDevice(tokens, payload) 
});  