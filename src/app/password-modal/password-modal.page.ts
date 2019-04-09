import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import {AppModule} from "../app.module";
import {Router} from "@angular/router";
import {Storage} from "@ionic/storage";
@Component({
  selector: 'app-password-modal',
  templateUrl: './password-modal.page.html',
  styleUrls: ['./password-modal.page.scss'],
})
export class PasswordModalPage implements OnInit {

  modalTitle:string;
  modelId:number;
  old_pw:string="" ;
  new_pw:string="";

  constructor(
      private modalController: ModalController,
      private navParams: NavParams
  ) {

  }

  ngOnInit() {
    this.modelId = this.navParams.data.modelId;
    this.modalTitle = this.navParams.data.modalTitle;
    console.log(this.navParams.data.password);
  }

  async closeModal() {
    const onClosedData: string = null;
    await this.modalController.dismiss(onClosedData);
  }

  async submit(){
    var return_obj:object = {'old_password':this.old_pw,'new_password':this.new_pw};
    await this.modalController.dismiss(return_obj);
  }



}

