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
    selector: 'app-session',
    templateUrl: 'session.page.html',
    styleUrls: ['session.page.scss']
})
export class SessionPage implements OnInit {

    api_url:string = "";
    postCfg:object = {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    };
    session_list:any;

    constructor(private http: HttpClient,private router: Router,public appModule: AppModule,
                private routeInfo: ActivatedRoute,private location: Location,public storage: Storage,
                private sanitizer: DomSanitizer) {
        this.api_url = appModule.api_url+"/Chat/sessionlist";
        this.storage.get('token').then((token) => {
            this.appModule.token = token;
            this.init_data();
        });
    }


    ngOnInit() {

    }

    select_session(shop_id:any){
        console.log(shop_id);
        for (let session_info of (this.session_list)) {
            if( session_info.shop_id == shop_id ){
                session_info.client_read = 1;
            }
        }
        this.router.navigateByUrl("/chat?shop_id="+shop_id);
    }


    init_data(){
        var  post_data:object = {
            'token': this.appModule.token,
        };
        this.http.post(this.api_url,$.param(post_data),this.postCfg).subscribe((response) => {
            console.log(response);
            this.session_list = <any>response;
        });
    }

    doRefresh(event) {
        this.init_data();

        event.target.complete();
    }



}

