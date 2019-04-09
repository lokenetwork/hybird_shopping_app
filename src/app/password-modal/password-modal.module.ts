import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { PasswordModalPage } from './password-modal.page';
import { ModalController } from '@ionic/angular';
const routes: Routes = [
  {
    path: '',
    component: PasswordModalPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [PasswordModalPage]
})
export class PasswordModalPageModule {



  constructor(public modalController: ModalController) {


  }


}
