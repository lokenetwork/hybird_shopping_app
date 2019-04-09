import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { DistanceModalPage } from './distance-modal.page';
import { ModalController } from '@ionic/angular';
const routes: Routes = [
  {
    path: '',
    component: DistanceModalPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [DistanceModalPage]
})
export class DistanceModalPageModule {



  constructor(public modalController: ModalController) {


  }


}
