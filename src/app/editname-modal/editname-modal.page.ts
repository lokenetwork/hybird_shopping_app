import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import {AppModule} from "../app.module";
import {Router} from "@angular/router";
import {Storage} from "@ionic/storage";
@Component({
  selector: 'app-editname-modal',
  templateUrl: './editname-modal.page.html',
  styleUrls: ['./editname-modal.page.scss'],
})
export class EditnameModalPage implements OnInit {

  modalTitle:string;
  modelId:number;
  nick_name:string  = "";
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
    this.nick_name = this.navParams.data.nick_name;
  }

  async closeModal() {
    const onClosedData: string = null;
    await this.modalController.dismiss(onClosedData);
  }

  async submit(){
    var return_obj:object = {'nick_name':this.nick_name}
    await this.modalController.dismiss(return_obj);
  }



}

