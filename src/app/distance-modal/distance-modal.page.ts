import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import {AppModule} from "../app.module";
import {Router} from "@angular/router";
import {Storage} from "@ionic/storage";
@Component({
  selector: 'app-distance-modal',
  templateUrl: './distance-modal.page.html',
  styleUrls: ['./distance-modal.page.scss'],
})
export class DistanceModalPage implements OnInit {

  modalTitle:string;
  modelId:number;
  distance:number=0;
  api_url:string = "";
  postCfg:object = {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  };
  constructor(
      private modalController: ModalController,
      private navParams: NavParams
  ) {

  }

  ngOnInit() {
    this.modelId = this.navParams.data.modelId;
    this.modalTitle = this.navParams.data.modalTitle;
    this.distance = this.navParams.data.distance;
    console.log(this.navParams.data.distance);
  }

  async closeModal() {
    var return_obj:object = {'distance':0};
    await this.modalController.dismiss(return_obj);
  }

  async submit(){
    var return_obj:object = {'distance':this.distance};
    await this.modalController.dismiss(return_obj);
  }



}

