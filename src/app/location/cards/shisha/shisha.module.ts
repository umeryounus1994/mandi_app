import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ShishaPage } from './shisha.page';
import { TranslateModule } from '@ngx-translate/core';
import {NgxMaskModule} from 'ngx-mask'

const routes: Routes = [
  {
    path: '',
    component: ShishaPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NgxMaskModule,
    RouterModule.forChild(routes),
    TranslateModule
  ],
  declarations: [ShishaPage]
})
export class ShishaPageModule {}
