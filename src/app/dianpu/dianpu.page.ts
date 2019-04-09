import { Component,ViewChild } from '@angular/core';
import {IonInfiniteScroll, LoadingController} from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { ModalController } from '@ionic/angular';
import * as $ from 'jquery';
import { SearchModalPage } from '../search-modal/search-modal.page';
import {Location} from "@angular/common";
import {AppModule} from "../app.module";
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { NativeGeocoder,NativeGeocoderOptions,NativeGeocoderReverseResult } from '@ionic-native/native-geocoder/ngx';
import {Storage} from "@ionic/storage";
@Component({
  selector: 'app-dianpu',
  templateUrl: 'dianpu.page.html',
  styleUrls: ['dianpu.page.scss']
})
export class DianpuPage {
    geoLatitude: number;
    geoLongitude: number;
    geoAccuracy:number;
    geoAddress: string;
    watchLocationUpdates:any;
    loading:any;
    isWatching:boolean;

    shop_list: any;
    is_loading_data: boolean=false;
    search_word_dispaly:boolean = false;
    no_more:boolean = false;
    search_nothing:boolean = false;
    search_word:string = "";
    current_page:number = 1;
    api_url:string = "";
    near_no_shop:boolean = false;
    postCfg:object = {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    };

    constructor(public modalController: ModalController,public geolocation: Geolocation,public storage: Storage
                ,private http: HttpClient,  public loadingController: LoadingController,
                public appModule: AppModule) {
        this.api_url = appModule.api_url+"/index/dianpu";

        this.geolocation.getCurrentPosition().then((resp) => {


            this.geoLatitude = resp.coords.latitude;
            this.geoLongitude = resp.coords.longitude;

            this.storage.get('distance').then((distance) => {
                var  post_data:object = {
                    'longitude':this.geoLongitude,
                    'latitude': this.geoLatitude,
                    'distance': distance,
                };
                this.http.post(this.api_url,$.param(post_data),this.postCfg).subscribe((response) => {
                    if( 0 == (<any>response).shop_list.length ){
                        this.near_no_shop = true;
                    }else{
                        this.shop_list = (<any>response).shop_list;
                        this.near_no_shop = false;
                    }
                });
            });
        }).catch((error) => {
            alert('Error getting location'+ JSON.stringify(error));
        });


    }

    async openSearchModal() {
        const modal = await this.modalController.create({
            component: SearchModalPage,
            componentProps: {
                "modelId": 15,
                "modalTitle": "搜索附近店铺"
            }
        });

        modal.onDidDismiss().then(async (dataReturned) => {

            if (dataReturned.data.search_name && dataReturned.data.search_name !== null) {
                this.search_word = dataReturned.data.search_name;
                console.log('Modal Sent Data :', dataReturned);
                var post_data: object = {
                    'query': this.search_word,
                    'longitude':this.geoLongitude,
                    'latitude': this.geoLatitude,
                    'distance': this.appModule.distance,
                };
                const loading = await this.loadingController.create({
                    message: '正在加载',
                    translucent: true,
                });
                loading.present();
                this.http.post(this.api_url,$.param(post_data),this.postCfg).subscribe((response) => {
                    this.shop_list = (<any>response).shop_list;
                    if( 0 == (<any>response).shop_list.length ){
                        this.search_nothing = true;
                    }else{
                        this.search_nothing = false;
                    }
                    this.is_loading_data = false;
                    this.no_more = false;
                    this.current_page = 1;
                    this.search_word_dispaly = true;
                    loading.dismiss();
                });
            }
        });

        return await modal.present();
    }

    async clearSearch(){
        const loading = await this.loadingController.create({
            message: '正在加载',
            translucent: true,
        });
        loading.present();
        var  post_data:object = {
            'longitude':this.geoLongitude,
            'latitude': this.geoLatitude,
            'distance': this.appModule.distance,
        };
        this.http.post(this.api_url,$.param(post_data),this.postCfg).subscribe((response) => {
            this.shop_list = (<any>response).shop_list;
            this.search_word = "";
            this.search_nothing = false;
            this.search_word_dispaly = false;
            loading.dismiss();
        });
    }


    doRefresh(event) {
        //每次请求都要获取地理位置

        this.geolocation.getCurrentPosition().then((resp) => {
            this.geoLatitude = resp.coords.latitude;
            this.geoLongitude = resp.coords.longitude;

            var  post_data:object = {
                'query':this.search_word,
                'longitude':this.geoLongitude,
                'latitude': this.geoLatitude,
                'distance': this.appModule.distance,
            };
            this.http.post(this.api_url,$.param(post_data),this.postCfg).subscribe((response) => {
                this.shop_list = (<any>response).shop_list;
                //重置状态
                this.is_loading_data = false;
                this.no_more = false;
                this.near_no_shop = false;
                this.current_page = 1;
                event.target.complete();
            });

        }).catch((error) => {
            alert('Error getting location'+ JSON.stringify(error));
        });

    }

    loadData(event) {
        if( this.is_loading_data == false ){
            this.is_loading_data = true;
            this.current_page++;
            var  post_data:object = {
                'query':this.search_word,
                'p':this.current_page,
                'longitude':this.geoLongitude,
                'latitude': this.geoLatitude,
                'distance': this.appModule.distance,
            };
            this.http.post(this.api_url,$.param(post_data),this.postCfg).subscribe((response) => {
                if( 0 == (<any>response).shop_list.length ){
                    //显示没有更多了。
                    this.no_more = true;
                    event.target.complete();
                }else{
                    for (let e of (<any>response).shop_list){
                        this.shop_list.push(e);
                    }
                    event.target.complete();
                    this.is_loading_data = false;
                }
            });
        }
    }

}
