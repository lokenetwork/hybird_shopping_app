import { Component,ViewChild } from '@angular/core';
import {IonInfiniteScroll, LoadingController, ToastController} from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { ModalController } from '@ionic/angular';
import * as $ from 'jquery';
import { EditnameModalPage } from '../editname-modal/editname-modal.page';
import { DistanceModalPage } from '../distance-modal/distance-modal.page';
import { PasswordModalPage } from '../password-modal/password-modal.page';
import {Location} from "@angular/common";
import {AppModule} from "../app.module";
import {Storage} from "@ionic/storage";
import {Router} from "@angular/router";
import {main} from "../protos/message";
import AuthMessage = main.AuthMessage;
import WSMessage = main.WSMessage;
import Message = main.Message;

@Component({
  selector: 'app-me',
  templateUrl: 'me.page.html',
  styleUrls: ['me.page.scss']
})
export class MePage {

    postCfg:object = {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    };
    api_url:string = "";

    constructor(public modalController: ModalController,public storage: Storage,  private router: Router
                ,private http: HttpClient,  public loadingController: LoadingController,public toastController: ToastController,
                public appModule: AppModule) {
        this.api_url = appModule.api_url+"/User/editpassword";
        appModule.check_login("");
        //main.WSMessage.decode();
    }



    async edit_name(){
        const modal = await this.modalController.create({
            component: EditnameModalPage,
            componentProps: {
                "modelId": 1,
                "modalTitle": "修改昵称",
                "nick_name": this.appModule.nick_name,
            }
        });
        modal.onDidDismiss().then(async (dataReturned) => {
            if (dataReturned.data.nick_name) {
                var post_data: object = {
                    'name': this.appModule.nick_name,
                    'token': this.appModule.token,
                };
                const loading = await this.loadingController.create({
                    message: '正在修改',
                    translucent: true,
                });
                loading.present();
                this.http.post(this.api_url,$.param(post_data),this.postCfg).subscribe((response) => {
                    console.log(response);
                    if( -1 == (<any> response).status ){
                        this.router.navigate(["/login"] );
                    }else if(  1 ==  (<any> response).status ){
                        this.appModule.nick_name = dataReturned.data.nick_name;
                        this.storage.set('nick_name',   dataReturned.data.nick_name);
                    }
                    loading.dismiss();
                });
            }
        });
        return await modal.present();
    }

    async edit_distance(){
        const modal = await this.modalController.create({
            component: DistanceModalPage,
            componentProps: {
                "modelId": 1,
                "modalTitle": "修改范围半径",
                "distance": this.appModule.distance,
            }
        });
        modal.onDidDismiss().then(async (dataReturned) => {
            if (dataReturned.data.distance) {
                var post_data: object = {
                    'token': this.appModule.token,
                    'distance': dataReturned.data.distance,
                };
                const loading = await this.loadingController.create({
                    message: '正在修改',
                    translucent: true,
                });
                loading.present();
                this.http.post(this.appModule.api_url+"/User/editdistance",$.param(post_data),this.postCfg).subscribe((response) => {
                    console.log(response);
                    if( -1 == (<any> response).status ){
                        this.router.navigate(["/login"] );
                    }else if(  1 ==  (<any> response).status ){
                        this.appModule.distance = dataReturned.data.distance;
                        this.storage.set('distance',   dataReturned.data.distance);
                    }
                    loading.dismiss();
                });
            }
        });
        return await modal.present();
    }

    async edit_password(){
        const modal = await this.modalController.create({
            component: PasswordModalPage,
            componentProps: {
                "modelId": 1,
                "modalTitle": "修改密码",
            }
        });
        modal.onDidDismiss().then(async (dataReturned) => {
            if (dataReturned.data.old_password && dataReturned.data.new_password) {
                var post_data: object = {
                    'token': this.appModule.token,
                    'old_password': dataReturned.data.old_password,
                    'new_password': dataReturned.data.new_password,
                };
                const loading = await this.loadingController.create({
                    message: '正在修改',
                    translucent: true,
                });
                loading.present();
                this.http.post(this.appModule.api_url+"/User/editpassword",$.param(post_data),this.postCfg).subscribe(async (response) => {
                    console.log(response);
                    if( -2 == (<any> response).status ){
                        const toast = await this.toastController.create({
                            message: (<any>response).status_name,
                            showCloseButton: true,
                            position: 'bottom',
                            closeButtonText: '关闭',
                            duration: 5000
                        });
                        toast.present();
                    }else if(  1 ==  (<any> response).status ){
                        const toast = await this.toastController.create({
                            message: "密码已更新",
                            showCloseButton: true,
                            position: 'bottom',
                            closeButtonText: '关闭',
                            duration: 5000
                        });
                        toast.present();
                    }
                    loading.dismiss();
                });
            }
        });
        return await modal.present();
    }


    logout(){
        this.storage.remove('token');
        this.storage.remove('token_expire');
        this.storage.remove('nick_name');
        this.storage.remove('account');
        this.storage.remove('distance');
        this.appModule.account ="";
        this.appModule.nick_name = "";
        this.router.navigate(["/login"] );
    }

}
