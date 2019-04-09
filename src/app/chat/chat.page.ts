import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Camera, CameraOptions, PictureSourceType } from '@ionic-native/Camera/ngx';
import { ActionSheetController,Events, ToastController, Platform, LoadingController } from '@ionic/angular';
import { File, FileEntry } from '@ionic-native/File/ngx';
import { HttpClient } from '@angular/common/http';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { Storage } from '@ionic/storage';
import { FilePath } from '@ionic-native/file-path/ngx';
import { finalize } from 'rxjs/operators';
const STORAGE_KEY = 'my_images';
import { ViewChild, ElementRef} from '@angular/core';
import { ModalController,NavController,IonContent,IonList } from '@ionic/angular';
import * as $ from 'jquery';
import { EditnameModalPage } from '../editname-modal/editname-modal.page';
import { DistanceModalPage } from '../distance-modal/distance-modal.page';
import { PasswordModalPage } from '../password-modal/password-modal.page';
import {Location} from "@angular/common";
import {AppModule} from "../app.module";
import {ActivatedRoute, Router} from "@angular/router";
import {main} from "../protos/message";
import AuthMessage = main.AuthMessage;
import WSMessage = main.WSMessage;
import Message = main.Message;

@Component({
  selector: 'app-chat',
  templateUrl: 'chat.page.html',
  styleUrls: ['chat.page.scss']
})
export class ChatPage implements OnInit {

    postCfg:object = {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    };
    api_url:string = "";
    chats:Array<Object> = [

    ];
    input_text = "";
    input_img = "";
    history_page = 1;
    shop_id = 0;
    no_more_history = false;
    is_loading_history = false;
    shop_info:object = {"shop_id":0,"shop_name":""};

    @ViewChild(IonContent) contentArea: IonContent;
    @ViewChild(IonList, {read: ElementRef}) chatList: ElementRef;

    private message: string = '';
    private mutationObserver: MutationObserver;

    constructor(public modalController: ModalController,public storage: Storage,  private plt: Platform,private file: File,
                private router: Router, private routeInfo: ActivatedRoute,private camera: Camera, private filePath: FilePath,public events: Events
                ,private http: HttpClient,  public loadingController: LoadingController,public toastController: ToastController,private actionSheetController: ActionSheetController,
                public appModule: AppModule, private webview: WebView,
                private ref: ChangeDetectorRef) {

        this.shop_id  = this.routeInfo.snapshot.queryParams["shop_id"];
        appModule.check_login("/chat?shop_id="+this.shop_id);
        //main.WSMessage.decode();


    }
    async ngOnInit(){
        console.log("ChatNgOnInit");
        this.mutationObserver = new MutationObserver((mutations) => {
            this.contentArea.scrollToBottom();
        });

        this.mutationObserver.observe(this.chatList.nativeElement, {
            childList: true
        });

        if (false == this.appModule.websocket_is_connect) {
            this.appModule.websocket_init();
        }
        this.events.subscribe('my-message', (message) =>{
            this.receive_message(message)
        });

        //查询出店铺信息
        this.shop_info_init();
        this.init_history_chat();
    }

    init_history_chat(){

        this.storage.get('token').then((token) => {
            this.api_url = this.appModule.api_url+'/Chat/getchathistory';
            var  post_data:object = {
                'shop_id':this.shop_id,
                'token': token,
                'p':  this.history_page,
            };
            this.http.post(this.api_url,$.param(post_data),this.postCfg).subscribe((response) => {
                for (let e of (<any>response)) {
                    this.chats.unshift(e);
                }
            });
            this.make_session_read();
        });

    }

    load_next_history_chat(event){
        if (this.is_loading_history == false) {
            this.is_loading_history = true;
            this.history_page++;
            this.api_url = this.appModule.api_url + '/Chat/getchathistory';
            var post_data: object = {
                'shop_id': this.shop_id,
                'token': this.appModule.token,
                'p': this.history_page,
            };
            this.http.post(this.api_url, $.param(post_data), this.postCfg).subscribe((response) => {
                if (0 == (<any>response).length) {
                    //显示没有更多了。
                    this.no_more_history = true;
                    event.target.complete();
                } else {
                    for (let e of (<any>response)) {
                        this.chats.unshift(e);
                    }
                    event.target.complete();
                }
                this.is_loading_history = false;
            });
        }

    }


    shop_info_init(){
        //查询出店铺信息
        this.api_url = this.appModule.api_url+'/index/shopinfo';
        var  post_data:object = {
            'shop_id':this.shop_id,
        };
        this.http.post(this.api_url,$.param(post_data),this.postCfg).subscribe((response) => {
            this.shop_info = (<object>response);
        });
    }

    async reconnect_ws(){
        const loading = await this.loadingController.create({
            message: '正在连接....',
            translucent: true,
        });
        await loading.present();
        this.appModule.websocket_init();
        this.events.subscribe('ws_status_message', (message) =>{
            loading.dismiss();
            if( 'connect_error' == message ){
                this.presentToast('连接失败');
            }
        });
    }

    make_session_read(){
        //查询出店铺信息
        this.api_url = this.appModule.api_url+'/Chat/sessionread';
        var  post_data:object = {
            'shop_id':this.shop_id,
            'token': this.appModule.token,
        };
        this.http.post(this.api_url,$.param(post_data),this.postCfg).subscribe((response) => {
            console.log(response);
        });
    }

    send_text_message(){
        if (false == this.appModule.websocket_is_connect) {
            return 0;
        }
        if( this.input_text ){
            var message = Message.create({
                from: "buyer",
                messageType: "text",
                fromUserId: 0,
                toUserId: this.shop_id,
                content: this.input_text,
            });
            var content_buffer = Message.encode(message).finish()
            var wsmessage = WSMessage.create({type: "message", content: content_buffer});
            var text_buffer = WSMessage.encode(wsmessage).finish();
            this.appModule.websocket.send(text_buffer);
            this.chats.push(message);
            this.input_text = "";
        }
    }

    receive_message(message:any){
        console.log(message);
        //t判断店铺ID是否是当前的店铺ID
        //如果是当前的店铺ID，标记会话已读
        if( this.shop_id == message.fromUserId ) {
            this.chats.push(message);
            this.make_session_read();
        }
    }

    async selectImage() {
        if (false == this.appModule.websocket_is_connect) {
            return 0;
        }
        const actionSheet = await this.actionSheetController.create({
            header: "选择图片来源",
            buttons: [{
                text: '相册',
                handler: () => {
                    this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY);
                }
            },
                {
                    text: '拍照',
                    handler: () => {
                        this.takePicture(this.camera.PictureSourceType.CAMERA);
                    }
                },
                {
                    text: '取消',
                    role: 'cancel'
                }
            ]
        });
        await actionSheet.present();
    }

    readFile(file: any) {
        console.log("loken-test readFile "+file.name);
        const reader = new FileReader();
        reader.onloadend = () => {
            const formData = new FormData();
            const imgBlob = new Blob([reader.result], {
                type: file.type
            });
            formData.append('file', imgBlob, file.name);
            this.uploadImageData(formData);
        };
        reader.readAsArrayBuffer(file);
    }

    async uploadImageData(formData: FormData) {
        const loading = await this.loadingController.create({
            message: '正在上传',
            translucent: true,
        });
        await loading.present();

        this.http.post("http://192.168.0.120:8080/Index/uploadImMultipleGoodsPicture", formData)
            .pipe(
                finalize(() => {
                    loading.dismiss();
                })
            )
            .subscribe(res => {
                if (res['status']) {
                    //this.presentToast('File upload complete.')
                    var message = Message.create({
                        from: "buyer",
                        messageType: "img",
                        fromUserId: 0,
                        toUserId: this.shop_id,
                        content: res['image_info'][0]['image_name'],
                    });
                    var content_buffer = Message.encode(message).finish()
                    var wsmessage = WSMessage.create({type: "message", content: content_buffer});
                    var text_buffer = WSMessage.encode(wsmessage).finish();
                    this.appModule.websocket.send(text_buffer);
                    this.chats.push(message);
                } else {
                    this.presentToast(res['message'])
                }
            });
    }

    takePicture(sourceType: PictureSourceType) {

        var options: CameraOptions = {
            quality: 100,
            sourceType: sourceType,
            saveToPhotoAlbum: false,
            correctOrientation: true
        };

        this.camera.getPicture(options).then(imagePath => {
            if (this.plt.is('android') && sourceType === this.camera.PictureSourceType.PHOTOLIBRARY) {
                this.filePath.resolveNativePath(imagePath)
                    .then(filePath => {
                        let correctPath = filePath.substr(0, filePath.lastIndexOf('/') + 1);
                        let currentName = imagePath.substring(imagePath.lastIndexOf('/') + 1, imagePath.lastIndexOf('?'));
                        this.file.resolveLocalFilesystemUrl(correctPath+currentName)
                            .then(entry => {
                                ( < FileEntry > entry).file(file => this.readFile(file))
                            })
                            .catch(err => {
                                this.presentToast('Error while reading file.');
                            });
                        //this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
                    });
            } else {
                var currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
                var correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
                //this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
                //开始上传图片
                this.file.resolveLocalFilesystemUrl(correctPath+currentName)
                    .then(entry => {
                        ( < FileEntry > entry).file(file => this.readFile(file))
                    })
                    .catch(err => {
                        this.presentToast('Error while reading file.');
                    });
            }
        });

    }

    async presentToast(text) {
        const toast = await this.toastController.create({
            message: text,
            position: 'bottom',
            duration: 3000
        });
        toast.present();
    }
}
