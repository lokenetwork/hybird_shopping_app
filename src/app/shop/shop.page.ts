import {Component, ViewChild} from '@angular/core';
import {IonInfiniteScroll} from '@ionic/angular';
import {HttpClient} from '@angular/common/http';
import {ModalController} from '@ionic/angular';
import {Platform} from '@ionic/angular';
import {Location} from '@angular/common';
import * as $ from 'jquery';
import {ActivatedRoute} from "@angular/router";
import {AppModule} from "../app.module";
import {LoadingController} from '@ionic/angular';
import {SearchModalPage} from "../search-modal/search-modal.page";
import {Storage} from "@ionic/storage";
import {AppAvailability} from '@ionic-native/app-availability/ngx';
import {InAppBrowser, InAppBrowserObject} from '@ionic-native/in-app-browser/ngx';

@Component({
    selector: 'app-shop',
    templateUrl: 'shop.page.html',
    styleUrls: ['shop.page.scss']
})
export class ShopPage {

    items: any;
    shop_id: number;
    is_loading_data: boolean = false;
    search_word_dispaly: boolean = false;
    no_more: boolean = false;
    search_nothing: boolean = false;
    search_word: string = "";
    current_page: number = 1;
    min_price: number = 0;
    max_price: number = 2000;
    goods_type: any = [
        {
            'type_id': 0,
            'type_color': 'dark',
            'type': "全部",
            'type_data': "",
        },
        {
            'type_id': 1,
            'type_color': 'primary',
            'type': "新品",
            'type_data': "new",
        },
        {
            'type_id': 2,
            'type_color': 'dark',
            'type': "热销",
            'type_data': "hot",
        },
        {
            'type_id': 3,
            'type_color': 'dark',
            'type': "特价",
            'type_data': "cheap",
        },
    ];
    select_goods_type: string = 'new';
    api_url: string = "";
    search_cache_id: string = "";
    scheme: any;
    plat: any;
    shop_info:any;
    postCfg: object = {
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
    };

    constructor(public modalController: ModalController,
                private http: HttpClient, private appAvailability: AppAvailability,
                private platform: Platform, private iab: InAppBrowser,
                private location: Location, public appModule: AppModule, private routeInfo: ActivatedRoute, public storage: Storage,
                public loadingController: LoadingController) {
        this.api_url = appModule.api_url + '/index/shop';
        this.shop_id = this.routeInfo.snapshot.queryParams["id"];

        var post_data: object = {
            'query': this.search_word,
            'shop_id': this.shop_id,
            'goods_type': this.select_goods_type,
            'min_price': this.min_price,
            'max_price': this.max_price,
        };
        this.http.post(this.api_url, $.param(post_data), this.postCfg).subscribe((response) => {
            this.items = (<any>response).goods_data;
        });

        storage.get('token').then((token) => {
            var post_data: object = {
                'shop_id': this.shop_id,
                'token': token,
            };
            this.http.post(this.appModule.api_url + "/Shop/view", $.param(post_data), this.postCfg).subscribe((response) => {
                console.log(response);
            });
        });

        //查询出店铺信息
        var  post_data:object = {
            'shop_id':this.shop_id,
        };
        this.http.post(this.appModule.api_url+'/index/shopinfo',$.param(post_data),this.postCfg).subscribe((response) => {
            this.shop_info = (<object>response);
        });

        this.init_map_app();
    }

    goBack() {
        this.location.back();
    }

    async openSearchModal() {
        const modal = await this.modalController.create({
            component: SearchModalPage,
            componentProps: {
                "modelId": 2,
                "modalTitle": "搜索店铺服装"
            }
        });

        modal.onDidDismiss().then(async (dataReturned) => {
            if (dataReturned.data.search_name !== null && dataReturned.data.search_name) {
                this.search_word = dataReturned.data.search_name;
                this.min_price = dataReturned.data.saturation.lower;
                this.max_price = dataReturned.data.saturation.upper;
                console.log('Modal Sent Data :', dataReturned);
                var post_data: object = {
                    'query': this.search_word,
                    'shop_id': this.shop_id,
                    'min_price': this.min_price,
                    'max_price': this.max_price
                };

                const loading = await this.loadingController.create({
                    message: '正在加载',
                    translucent: true,
                });
                loading.present();

                this.http.post(this.api_url, $.param(post_data), this.postCfg).subscribe((response) => {
                    this.items = (<any>response).goods_data;
                    if (0 == (<any>response).goods_data.length) {
                        this.search_nothing = true;
                    } else {
                        this.search_nothing = false;
                    }
                    this.search_cache_id = (<any>response).search_cache_id;
                    this.is_loading_data = false;
                    this.no_more = false;
                    this.current_page = 1;

                    this.search_word_dispaly = true;
                    //选择全部
                    for (let e of this.goods_type) {
                        if (e.type_id == 0) {
                            e.type_color = 'primary';
                            this.select_goods_type = e.type_data;
                        } else {
                            e.type_color = 'dark';
                        }
                    }
                    loading.dismiss();
                });

            }
        });

        return await modal.present();
    }


    async clearSearch() {
        var post_data: object = {
            'shop_id': this.shop_id,
            'goods_type': this.select_goods_type,
        };
        const loading = await this.loadingController.create({
            message: '正在加载',
            translucent: true,
        });
        loading.present();
        this.http.post(this.api_url, $.param(post_data), this.postCfg).subscribe((response) => {
            this.items = (<any>response).goods_data;
            this.search_cache_id = "";
            this.search_word = "";
            this.search_nothing = false;
            this.search_word_dispaly = false;
            loading.dismiss();
        });
    }


    doRefresh(event) {
        var post_data: object = {
            'query': this.search_word,
            'shop_id': this.shop_id,
            'goods_type': this.select_goods_type,
            'min_price': this.min_price,
            'max_price': this.max_price,
            'search_cache_id': this.search_cache_id
        };
        this.http.post(this.api_url, $.param(post_data), this.postCfg).subscribe((response) => {
            this.items = (<any>response).goods_data;
            //重置状态
            this.is_loading_data = false;
            this.no_more = false;
            this.current_page = 1;
            event.target.complete();
        });
    }

    loadData(event) {
        if (this.is_loading_data == false) {
            this.is_loading_data = true;
            this.current_page++;
            var post_data: object = {
                'query': this.search_word,
                'search_cache_id': this.search_cache_id,
                'shop_id': this.shop_id,
                'p': this.current_page,
                'goods_type': this.select_goods_type,
                'min_price': this.min_price,
                'max_price': this.max_price
            };
            this.http.post(this.api_url, $.param(post_data), this.postCfg).subscribe((response) => {
                if (0 == (<any>response).goods_data.length) {
                    //显示没有更多了。
                    this.no_more = true;
                    event.target.complete();
                } else {
                    for (let e of (<any>response).goods_data) {
                        this.items.push(e);
                    }
                    event.target.complete();
                    this.is_loading_data = false;
                }
            });
        }


    }

    async choose_type(type_id) {
        for (let e of this.goods_type) {
            if (e.type_id == type_id) {
                e.type_color = 'primary';
                this.select_goods_type = e.type_data;
            } else {
                e.type_color = 'dark';
            }
        }
        const loading = await this.loadingController.create({
            message: '正在加载',
            translucent: true,
        });
        loading.present();
        var post_data: object = {
            'query': this.search_word,
            'search_cache_id': this.search_cache_id,
            'shop_id': this.shop_id,
            'goods_type': this.select_goods_type,
            'min_price': this.min_price,
            'max_price': this.max_price,
        };
        this.http.post(this.api_url, $.param(post_data), this.postCfg).subscribe((response) => {
            this.items = (<any>response).goods_data;
            //重置状态
            this.current_page = 1;
            loading.dismiss();
        });
    }


    //初始化地图软件，判断手机安装了那些地图
    tencent_map: boolean;
    gaode_map: boolean;
    baidu_map: boolean;

    init_map_app() {
        if (this.platform.is('ios')) {
            var gaode_scheme = 'iosamap://';
            var baidu_scheme = 'iosamap://';
            var tencent_scheme = 'iosamap://';
        } else if (this.platform.is('android')) {
            var gaode_scheme = 'com.autonavi.minimap';
            var baidu_scheme = 'com.baidu.BaiduMap';
            var tencent_scheme = 'com.tencent.map';
        }
        /* 检测高德地图是否安装在手机上 */
        this.appAvailability.check(gaode_scheme)
            .then(
                (yes: boolean) => {
                    this.gaode_map = true;
                },
                (no: boolean) => {
                    this.gaode_map = false;
                }
            );

        this.appAvailability.check(baidu_scheme)
            .then(
                (yes: boolean) => {
                    this.baidu_map = true;
                },
                (no: boolean) => {
                    this.baidu_map = false;
                }
            );

        this.appAvailability.check(tencent_scheme)
            .then(
                (yes: boolean) => {
                    this.tencent_map = true;
                },
                (no: boolean) => {
                    this.tencent_map = false;
                }
            );
    }

    open_map(){
        if( this.baidu_map ){
            const browser: InAppBrowserObject = this.iab.create('baidumap://map/marker?location='+this.shop_info.latitude+','+this.shop_info.longitude+'&title='+this.shop_info.shop_name+'&content='+this.shop_info.address_display+'&traffic=on&src=io.ionic.starter', '_system');
        }else if( this.tencent_map ){
            const browser: InAppBrowserObject = this.iab.create('qqmap://map/marker?marker=coord:'+this.shop_info.latitude+','+this.shop_info.longitude+';title:'+this.shop_info.shop_name+';addr:'+this.shop_info.address_display+'&referer=BC3BZ-FS36O-DE3WP-S3JRW-VK2SK-NWFRC', '_system');
        }else if( this.gaode_map){
            const browser: InAppBrowserObject = this.iab.create('androidamap://viewMap?sourceApplication=io.ionic.starter&poiname='+this.shop_info.shop_name+'&lat='+this.shop_info.latitude+'&lon='+this.shop_info.longitude+'&dev=0', '_system');
        }else{
            const browser: InAppBrowserObject = this.iab.create('http://api.map.baidu.com/marker?location='+this.shop_info.shop_name+':'+this.shop_info.latitude+'&title='+this.shop_info.shop_name+'&content='+this.shop_info.address_display+'&output=html', '_system');
        }
    }


}
