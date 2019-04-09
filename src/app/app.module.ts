import {NgModule, OnInit} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {Router, RouteReuseStrategy} from '@angular/router';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {
    IonicModule,
    IonicRouteStrategy,
    LoadingController,
    ModalController,
    NavParams,
    Events,
    Platform
} from '@ionic/angular';
import {SplashScreen} from '@ionic-native/splash-screen/ngx';
import {StatusBar} from '@ionic-native/status-bar/ngx';
import {IonicStorageModule} from '@ionic/storage';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {SearchModalPageModule} from './search-modal/search-modal.module';
import {EditnameModalPageModule} from './editname-modal/editname-modal.module';
import {DistanceModalPageModule} from './distance-modal/distance-modal.module';
import {PasswordModalPageModule} from './password-modal/password-modal.module';
import {Storage} from "@ionic/storage";
import { NativeGeocoder } from '@ionic-native/native-geocoder/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { Camera } from '@ionic-native/Camera/ngx';
import { File } from '@ionic-native/File/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import { AppAvailability } from '@ionic-native/app-availability/ngx';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import {main} from "./protos/message";
import AuthMessage = main.AuthMessage;
import WSMessage = main.WSMessage;
import Message = main.Message;
//import { SocketIoConfig,SocketIoModule} from 'ng-socket-io'
//const config :SocketIoConfig = { url:"ws://127.0.0.1:8080/ws", options:{} }
@NgModule({
    declarations: [AppComponent],
    entryComponents: [],
    imports: [BrowserModule, IonicModule.forRoot(),
        //SocketIoModule.forRoot(config),
        HttpClientModule, AppRoutingModule, SearchModalPageModule, EditnameModalPageModule,DistanceModalPageModule,PasswordModalPageModule
        , IonicStorageModule.forRoot(), IonicModule.forRoot({
            rippleEffect: false,
            mode: 'md'
        })],
    providers: [
        StatusBar,
        AppAvailability,
        InAppBrowser,
        Geolocation,
        NativeGeocoder,
        SplashScreen,
        WebView,
        Camera,
        File,
        FilePath,
        {provide: RouteReuseStrategy, useClass: IonicRouteStrategy}
    ],
    bootstrap: [AppComponent]
})
export class AppModule  implements OnInit  {

    public api_url: string = "http://192.168.0.108:8083";
    public token: string = "";
    public account: string = "";
    public distance: number = 10;
    public nick_name: string = "";
    public token_expire: number = 0;
    //控制商品详情的心心是否点亮
    public like_goods: boolean = false;
    public websocket:WebSocket;
    public websocket_is_connect = false;
    constructor(public modalController: ModalController, public storage: Storage, private router: Router,public events: Events
        , private http: HttpClient, public loadingController: LoadingController) {

        //app初始化读取登录信息。
        this.storage.get('token').then((val) => {
            this.token = val;
        });
        this.storage.get('token_expire').then((val) => {
            this.token_expire = <any>val;
        });
        this.storage.get('account').then((val) => {
            this.account = <any>val;
        });
        this.storage.get('nick_name').then((val) => {
            this.nick_name = <any>val;
        });
        this.storage.get('distance').then((val) => {
            this.distance = <any>val;
        });


    }

    ngOnInit() {
    }

    websocket_onmessage(evt){
        //如果不是这个商家发过来的，忽略掉消息
        var reader = new FileReader();
        reader.readAsArrayBuffer(evt.data);
        reader.onload = function (e) {
            var buf: Uint8Array = new Uint8Array(<any>reader.result);
            var content = WSMessage.decode(buf).content;
            var message = Message.decode(content);
            this.events.publish('my-message', message);
        }.bind(this)

    }
    websocket_onopen(evt){
        this.storage.get('token').then((val) => {
            this.token = val;
            this.websocket_is_connect = true;
            var authmessage = AuthMessage.create({token: this.token});
            var content_buffer = AuthMessage.encode(authmessage).finish()
            var wsmessage = WSMessage.create({type: "buyer_auth", content: content_buffer});
            var buffer = WSMessage.encode(wsmessage).finish();
            this.websocket.send(buffer);
        });
        this.events.publish('ws_status_message', 'connect_success');
    }

    websocket_init(){

        this.websocket = new WebSocket("ws://192.168.0.108:8080/ws");
        this.websocket.onopen = function (evt) {
            this.websocket_onopen(evt);
        }.bind(this);
        this.websocket.onclose = function (evt) {
            this.websocket_is_connect = false;
        }.bind(this);;
        this.websocket.onmessage = function (evt) {
            this.websocket_onmessage(evt);
        }.bind(this);
        this.websocket.onerror = function (evt) {
            this.websocket_is_connect = false;
            this.events.publish('ws_status_message', 'connect_error');
        }.bind(this);;
    }

    public check_login(juml_url) {
        this.storage.get('token').then((val) => {
            this.token = val;
        });
        this.storage.get('token_expire').then((val) => {
            this.token_expire = <any>val;
            let now_time = (new Date()).getTime();
            if( this.token != "" && now_time <  this.token_expire ){
                return true;
            }else{
                if( juml_url ){
                    this.storage.set('login_jump_url',  juml_url);
                }
                this.router.navigate(["/login"]);
                return false;
            }
        });
    }

    public get_login_status() {
        let now_time = (new Date()).getTime();
        //alert(this.token);
        //alert(this.token_expire);
        if( this.token != "" && now_time <  this.token_expire ){
            return true;
        }else{
            return false;
        }
    }

}
