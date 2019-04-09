import { Component,ViewChild } from '@angular/core';
import {IonInfiniteScroll, LoadingController} from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { ModalController } from '@ionic/angular';
import * as $ from 'jquery';
import { SearchModalPage } from '../search-modal/search-modal.page';
import {Location} from "@angular/common";
import {AppModule} from "../app.module";
import {Router} from "@angular/router";
@Component({
  selector: 'app-collect',
  templateUrl: 'collect.page.html',
  styleUrls: ['collect.page.scss']
})
export class CollectPage {

    items: any;
    is_loading_data: boolean=false;
    no_more:boolean = false;
    collect_nothing:boolean = false;
    current_page:number = 1;
    api_url:string = "";
    postCfg:object = {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    };

    constructor(public modalController: ModalController,private router: Router
                ,private http: HttpClient,  public loadingController: LoadingController,
                public appModule: AppModule) {
        this.api_url = appModule.api_url + "/User/collect";

        var post_data: object = {
            'token': this.appModule.token,
        };
        this.http.post(this.api_url, $.param(post_data), this.postCfg).subscribe((response) => {
            if (-1 ==  (<any>response).status) {
                this.router.navigate(["/login"]);
            } else {
                this.items = (<any>response).goods_data;
            }
        });
    }

    doRefresh(event) {
        var  post_data:object = {
            'token': this.appModule.token,
        };
        this.http.post(this.api_url,$.param(post_data),this.postCfg).subscribe((response) => {
            this.items = (<any>response).goods_data;
            //重置状态
            this.is_loading_data = false;
            this.no_more = false;
            this.current_page = 1;
            event.target.complete();
        });
    }

    loadData(event) {
        if( this.is_loading_data == false ){
            this.is_loading_data = true;
            this.current_page++;
            var  post_data:object = {
                'p':this.current_page,
                'token': this.appModule.token,
            };
            this.http.post(this.api_url,$.param(post_data),this.postCfg).subscribe((response) => {
                if( 0 == (<any>response).goods_data.length ){
                    //显示没有更多了。
                    this.no_more = true;
                    event.target.complete();
                }else{
                    for (let e of (<any>response).goods_data){
                        this.items.push(e);
                    }
                    event.target.complete();
                    this.is_loading_data = false;
                }
            });
        }
    }

}
