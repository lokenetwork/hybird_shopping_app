import {Component, ViewChild, OnInit, Inject, Injectable} from '@angular/core';
import {IonInfiniteScroll, LoadingController} from '@ionic/angular';
import {HttpClient} from '@angular/common/http';
import {ModalController,NavParams} from '@ionic/angular';
import * as $ from 'jquery';
import {SearchModalPage} from '../search-modal/search-modal.page';
import { Router,ActivatedRoute } from '@angular/router'; //导入router服务
import { Location } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import {AppModule} from "../app.module";
import { ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { MePageModule } from '../me/me.module';
import { MePage } from '../me/me.page';
import * as treeKill from "tree-kill";
@Component({
    selector: 'app-login',
    templateUrl: 'login.page.html',
    styleUrls: ['login.page.scss']
})
export class LoginPage implements OnInit {

    account:string = "13723772347";
    password:string = "88888888";
    collect_goods_id:number = 0;
    login_jump_url:string = "";
    api_url:string = "";
    postCfg:object = {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    };

    constructor(private http: HttpClient,
                private router: Router,public appModule: AppModule,public storage: Storage,
                private sanitizer: DomSanitizer,public toastController: ToastController) {
        this.api_url = appModule.api_url+'/Login';

        let login_status:boolean = this.appModule.get_login_status();
        if( login_status ){
            this.router.navigate(["/tabs/cloth"] );
        }
    }

    ngOnInit() {
        this.storage.get('collect_goods_id').then((val) => {
            this.collect_goods_id = val;
        });
        this.storage.get('login_jump_url').then((val) => {
            this.login_jump_url = val;
        });
    }

    login(){

        var  post_data:object = {
            'account':this.account,
            'password':this.password,
        };
        this.http.post(this.api_url,$.param(post_data),this.postCfg).subscribe(async (response) => {
            var status:number = (<any>response).status;
            var status_name:string = (<any>response).status_name;
            if( status > 0 ){
                this.storage.set('token', (<any>response).token);
                var expire = (new Date()).getTime() + (  (<any>response).token_time * 1000 );
                this.storage.set('token_expire', expire);
                this.storage.set('nick_name',  (<any>response).nick_name);
                this.storage.set('account',  (<any>response).account);
                this.storage.set('distance',  (<any>response).distance);
                this.appModule.token = (<any>response).token;
                this.appModule.token_expire = (<any>response).token_expire;
                this.appModule.account = (<any>response).account;
                this.appModule.nick_name = (<any>response).nick_name;
                this.appModule.distance = (<any>response).distance;

                //判断有没需要收藏的商品，
                if(this.collect_goods_id){
                    //开始收藏商品
                    var post_data: object = {
                        'goods_id': this.collect_goods_id,
                        'like': true,
                        'token': (<any>response).token
                    };
                    this.http.post(this.appModule.api_url+"/User/like",$.param(post_data),this.postCfg).subscribe((response) => {
                        this.router.navigateByUrl(this.login_jump_url);
                        this.appModule.like_goods = true;
                        //清空收藏数据
                        this.storage.remove('collect_goods_id');
                        this.storage.remove('login_jump_url');
                    });
                }else{
                    if( this.login_jump_url ){
                        this.storage.remove('login_jump_url');
                        this.router.navigateByUrl(this.login_jump_url);
                    }else{
                        this.router.navigate(["/tabs/me"] );
                    }
                }
            }else{
                const toast = await this.toastController.create({
                    message: status_name,
                    showCloseButton: true,
                    position: 'bottom',
                    closeButtonText: '关闭',
                    duration: 5000
                });
                toast.present();
            }

        });
    }
}

