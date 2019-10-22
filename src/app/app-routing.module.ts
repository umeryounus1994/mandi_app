import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'start', pathMatch: 'full' },
  { path: 'start', loadChildren: './start/start.module#StartPageModule' },
  { path: 'start/login', loadChildren: './start/login/login.module#LoginPageModule' },
  { path: 'start/login/passwordReset', loadChildren: './start/login/password-reset/password-reset.module#PasswordResetPageModule' },
  { path: 'start/register', loadChildren: './start/register/register.module#RegisterPageModule' },
  { path: 'home', loadChildren: './home/home.module#HomePageModule' },
  { path: 'search', loadChildren: './search/search.module#SearchPageModule' },
  { path: 'profile', loadChildren: './profile/profile.module#ProfilePageModule' },
  // { path: 'profile/receipts', loadChildren: './user-profile/receipts/receipts.module#ReceiptsPageModule' },
  // { path: 'profile/receipts/receipt', loadChildren: './profile/receipts/receipt/receipt.module#ReceiptPageModule' },
  { path: 'profile/settings', loadChildren: './profile/settings/settings.module#SettingsPageModule' },
  { path: 'location/:id', loadChildren: './location/location.module#LocationPageModule' },
  { path: 'location/card/shisha/:id', loadChildren: './location/cards/shisha/shisha.module#ShishaPageModule' },
  { path: 'location/card/drinks/:id', loadChildren: './location/cards/drinks/drinks.module#DrinksPageModule' },
  { path: 'location/card/foods/:id', loadChildren: './location/cards/foods/foods.module#FoodsPageModule' },
  { path: 'location/card/snacks', loadChildren: './location/cards/snacks/snacks.module#SnacksPageModule' },
  { path: 'location/order/cart/:id', loadChildren: './location/order/cart/cart.module#CartPageModule' },
  { path: 'location/order/payment/:id', loadChildren: './location/order/payment/payment.module#PaymentPageModule' },
  { path: 'location/order/confirmation/:id', loadChildren: './location/order/confirmation/confirmation.module#ConfirmationPageModule' },
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
