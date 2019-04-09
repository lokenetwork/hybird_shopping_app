import {Component, Injectable, OnInit, ViewChild} from '@angular/core';
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
  selector: 'app-cloth',
  templateUrl: 'cloth.page.html',
  styleUrls: ['cloth.page.scss']
})
@Injectable()
export class ClothPage implements OnInit {

    geoLatitude: number;
    geoLongitude: number;
    geoAccuracy:number;
    geoAddress: string;
    watchLocationUpdates:any;
    loading:any;
    isWatching:boolean;

    items: any;
    is_loading_data: boolean=false;
    search_word_dispaly:boolean = false;
    no_more:boolean = false;
    search_nothing:boolean = false;
    search_word:string = "";
    current_page:number = 1;
    min_price:number = 0;
    max_price:number = 2000;
    near_no_goods:boolean = false;
    api_url:string = "";
    //搜索缓存ID
    search_cache_id:string = "";
    postCfg:object = {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    };

    constructor(public modalController: ModalController,public geolocation: Geolocation,public storage: Storage,
                private nativeGeocoder: NativeGeocoder
                ,private http: HttpClient,  public loadingController: LoadingController,
                public appModule: AppModule) {
        console.log("constructor");

        this.api_url = appModule.api_url;

        this.geolocation.getCurrentPosition().then((resp) => {
            this.storage.get('distance').then((distance) => {
                this.geoLatitude = resp.coords.latitude;
                this.geoLongitude = resp.coords.longitude;


            });

        }).catch((error) => {
            alert('Error getting location'+ JSON.stringify(error));
        });

        var  post_data:object = {
            'longitude':this.geoLongitude,
            'latitude': this.geoLatitude,
            'distance': '',
        };
        this.http.post(this.api_url,$.param(post_data),this.postCfg).subscribe((response) => {
            if( 0 == (<any>response).goods_data.length ){
                this.near_no_goods = true;
            }else{
                this.near_no_goods = false;
                this.items = (<any>response).goods_data;
                this.search_cache_id = (<any>response).search_cache_id;
            }
        });

    }


    ngOnInit() {
        console.log("ngOnInit");

    }

    async openSearchModal() {
        const modal = await this.modalController.create({
            component: SearchModalPage,
            componentProps: {
                "modelId": 1,
                "modalTitle": "搜索附近服装"
            }
        });

        modal.onDidDismiss().then(async (dataReturned) => {
            console.log(dataReturned);

            if (dataReturned.data.search_name && dataReturned.data.search_name !== null) {
                this.search_word = dataReturned.data.search_name;
                this.min_price = dataReturned.data.saturation.lower;
                this.max_price = dataReturned.data.saturation.upper;
                console.log('Modal Sent Data :', dataReturned);
                var post_data: object = {
                    'query': this.search_word,
                    'min_price': this.min_price,
                    'max_price': this.max_price,
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
                    this.items = (<any>response).goods_data;
                    if( 0 == (<any>response).goods_data.length ){
                        this.search_nothing = true;
                    }else{
                        this.search_nothing = false;
                    }
                    this.search_cache_id = (<any>response).search_cache_id;
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
            this.items = (<any>response).goods_data;
            this.search_cache_id = "";
            this.search_word = "";
            this.search_nothing = false;
            this.search_word_dispaly = false;
            loading.dismiss();
        });
    }


    doRefresh(event) {

        this.geolocation.getCurrentPosition().then((resp) => {
            this.geoLatitude = resp.coords.latitude;
            this.geoLongitude = resp.coords.longitude;
            console.log( resp.coords.latitude);
            console.log( resp.coords.longitude);

            var  post_data:object = {
                'query':this.search_word,
                'min_price': this.min_price,
                'max_price': this.max_price,
                'search_cache_id':this.search_cache_id,
                'longitude':this.geoLongitude,
                'latitude': this.geoLatitude,
                'distance': this.appModule.distance,
            };
            this.http.post(this.api_url,$.param(post_data),this.postCfg).subscribe((response) => {
                this.items = (<any>response).goods_data;
                //重置状态
                this.is_loading_data = false;
                this.no_more = false;
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
                'search_cache_id':this.search_cache_id,
                'p':this.current_page,
                'min_price': this.min_price,
                'max_price': this.max_price,
                'longitude':this.geoLongitude,
                'latitude': this.geoLatitude,
                'distance': this.appModule.distance,
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
