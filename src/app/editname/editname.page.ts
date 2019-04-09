import { Component,ViewChild } from '@angular/core';
import {IonInfiniteScroll, LoadingController} from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { ModalController } from '@ionic/angular';
import * as $ from 'jquery';
import { SearchModalPage } from '../search-modal/search-modal.page';
import {Location} from "@angular/common";
import {AppModule} from "../app.module";
import {Router} from "@angular/router";
import {Storage} from "@ionic/storage";
import { NavController } from '@ionic/angular';
@Component({
  selector: 'app-editname',
  templateUrl: 'editname.page.html',
  styleUrls: ['editname.page.scss']
})
export class EditnamePage {

    api_url:string = "";
    public  nick_name:string = "";
    postCfg:object = {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    };

    constructor(public modalController: ModalController,  private router: Router,public storage: Storage
                ,private http: HttpClient,  public loadingController: LoadingController,public navController: NavController,
                public appModule: AppModule) {
        this.api_url = appModule.api_url+"/User/editname";
        storage.get('nick_name').then((val) => {
            this.nick_name = val;
        });
    }

     async submit() {
        var post_data: object = {
            'name': this.nick_name,
        };
        const loading = await this.loadingController.create({
            message: '正在修改',
            translucent: true,
        });
        loading.present();
        this.http.post(this.api_url,$.param(post_data),this.postCfg).subscribe((response) => {
            console.log(this.nick_name);
            this.storage.set('nick_name', this.nick_name);
            loading.dismiss();
            //this.navController.push(["/tabs/me",{name:this.nick_name}])
            //this.router.navigate(["/tabs/me/",{name:this.nick_name}]);

        });

    }

}
