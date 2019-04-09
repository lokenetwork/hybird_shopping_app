import { Component,ViewChild } from '@angular/core';
import {IonInfiniteScroll, LoadingController} from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { ModalController } from '@ionic/angular';
import * as $ from 'jquery';
import { SearchModalPage } from '../search-modal/search-modal.page';
import {Location} from "@angular/common";
import {AppModule} from "../app.module";
@Component({
  selector: 'app-cuxiao',
  templateUrl: 'cuxiao.page.html',
  styleUrls: ['cuxiao.page.scss']
})
export class CuxiaoPage {

    shop_list: any;
    is_loading_data: boolean=false;
    search_word_dispaly:boolean = false;
    no_more:boolean = false;
    search_nothing:boolean = false;
    search_word:string = "";
    current_page:number = 1;
    api_url:string = "";
    postCfg:object = {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    };

    constructor(public modalController: ModalController
                ,private http: HttpClient,  public loadingController: LoadingController,
                public appModule: AppModule) {
        this.api_url = appModule.api_url+"/index/cuxiao";


    }


}
