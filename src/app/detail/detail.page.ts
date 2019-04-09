import {Component, ViewChild,OnInit, Inject } from '@angular/core';
import {IonInfiniteScroll} from '@ionic/angular';
import {HttpClient} from '@angular/common/http';
import {ModalController,NavParams} from '@ionic/angular';
import * as $ from 'jquery';
import {SearchModalPage} from '../search-modal/search-modal.page';
import { Router,ActivatedRoute } from '@angular/router'; //导入router服务
import { Location } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import {AppModule} from "../app.module";
import {Storage} from "@ionic/storage";
@Component({
    selector: 'app-detail',
    templateUrl: 'detail.page.html',
    styleUrls: ['detail.page.scss']
})
export class DetailPage implements OnInit {

    intro:string = "";
    goods_id:number ;
    goods_info:any = {'goods_name':'',"goods_price":''};
    goods_img:any;
    sku:any = [{'sku_name':'','sku_id':'','sku_color':''}];
    api_url:string = "";
    postCfg:object = {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    };

    constructor(private http: HttpClient,private router: Router,public appModule: AppModule,
                private routeInfo: ActivatedRoute,private location: Location,public storage: Storage,
                private sanitizer: DomSanitizer) {
        this.api_url = appModule.api_url+"/Goods/detail";
        this.goods_id  = this.routeInfo.snapshot.queryParams["id"];

        storage.get('token').then((token) => {
            var post_data: object = {
                'goods_id': this.goods_id,
                'token': token,
            };
            this.http.post(this.api_url,$.param(post_data),this.postCfg).subscribe((response) => {
                this.goods_info = (<any>response).info;
                this.goods_img = (<any>response).img;
                appModule.like_goods = (<any>response).like;
                this.sku = (<any>response).sku;
                this.intro = (<any>response).intro;

                //记录商品浏览记录
                this.view(token);
            });

        });

    }

    choose_sku(sku_id){
        for (let e of this.sku){
            if( e.sku_id == sku_id ){
                e.sku_color = 'primary';
                this.goods_info.goods_price = e.sku_price;
            }else{
                e.sku_color = 'dark';
            }
        }
    }


    ngOnInit() {


    }

    view(token){
        var post_data: object = {
            'goods_id': this.goods_id,
            'shop_id': this.goods_info.shop_id,
            'token': token,
        };
        this.http.post(this.appModule.api_url+"/Goods/view",$.param(post_data),this.postCfg).subscribe((response) => {
            console.log(response);
        });
    }

    collect() {
        //判断用户是否登录
        let login_status:boolean = this.appModule.get_login_status();
        if( !login_status ){
            //todo,没有登录，保存goods_id，登录后的跳转页面
            this.storage.set('collect_goods_id',  this.goods_id);
            this.storage.set('login_jump_url',  "/detail?id="+this.goods_id);
            this.router.navigateByUrl("/login")
        }else{
            let post_like:number;
            if( this.appModule.like_goods ){
                post_like = 0;
                this.appModule.like_goods = false;
            }else{
                post_like = 1;
                this.appModule.like_goods = true;
            }
            var post_data: object = {
                'goods_id': this.goods_id,
                'like': post_like,
                'token': this.appModule.token
            };
            this.http.post(this.appModule.api_url+"/User/like",$.param(post_data),this.postCfg).subscribe((response) => {
            });
        }
    }

    shop_page(){
        this.router.navigateByUrl("tabs/cloth")
    }

}

