import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { EditnameModalPage } from './editname-modal.page';
import { ModalController } from '@ionic/angular';
const routes: Routes = [
  {
    path: '',
    component: EditnameModalPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [EditnameModalPage]
})
export class EditnameModalPageModule {



  constructor(public modalController: ModalController) {


  }


}
