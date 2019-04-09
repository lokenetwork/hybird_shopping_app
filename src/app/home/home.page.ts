import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Camera, CameraOptions, PictureSourceType } from '@ionic-native/Camera/ngx';
import { ActionSheetController, ToastController, Platform, LoadingController } from '@ionic/angular';
import { File, FileEntry } from '@ionic-native/File/ngx';
import { HttpClient } from '@angular/common/http';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { Storage } from '@ionic/storage';
import { FilePath } from '@ionic-native/file-path/ngx';
import { finalize } from 'rxjs/operators';
const STORAGE_KEY = 'my_images';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})

export class HomePage  implements OnInit {

    images = [];

    constructor(private camera: Camera, private file: File, private http: HttpClient, private webview: WebView,
                private actionSheetController: ActionSheetController, private toastController: ToastController,
                private storage: Storage, private plt: Platform, private loadingController: LoadingController,
                private ref: ChangeDetectorRef, private filePath: FilePath) { }

    ngOnInit() {
        this.plt.ready().then(() => {
            this.loadStoredImages();
        });
    }

    loadStoredImages() {
        this.storage.get(STORAGE_KEY).then(images => {
            if (images) {
                console.log("loken-test images is :");
                console.log(images);
                let arr = JSON.parse(images);
                console.log("loken-test arr is :");
                console.log(arr);
                this.images = [];
                for (let img of arr) {
                    let filePath = this.file.dataDirectory + img;
                    let resPath = this.pathForImage(filePath);
                    console.log("loken-test filePath is "+filePath);
                    console.log("loken-test resPath is "+resPath);
                    this.images.push({ name: img, path: resPath, filePath: filePath });
                }
            }
        });
    }

    pathForImage(img) {
        if (img === null) {
            return '';
        } else {
            let converted = this.webview.convertFileSrc(img);
            return converted;
        }
    }

    async presentToast(text) {
        const toast = await this.toastController.create({
            message: text,
            position: 'bottom',
            duration: 3000
        });
        toast.present();
    }

    // Next functions follow here...
    async selectImage() {
        const actionSheet = await this.actionSheetController.create({
            header: "Select Image source",
            buttons: [{
                text: 'Load from Library',
                handler: () => {
                    this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY);
                }
            },
                {
                    text: 'Use Camera',
                    handler: () => {
                        this.takePicture(this.camera.PictureSourceType.CAMERA);
                    }
                },
                {
                    text: 'Cancel',
                    role: 'cancel'
                }
            ]
        });
        await actionSheet.present();
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
                console.log("here 1");
                this.filePath.resolveNativePath(imagePath)
                    .then(filePath => {
                        let correctPath = filePath.substr(0, filePath.lastIndexOf('/') + 1);
                        let currentName = imagePath.substring(imagePath.lastIndexOf('/') + 1, imagePath.lastIndexOf('?'));

                        console.log("loken-test 开始上传图片2 "+correctPath+currentName);
                        this.file.resolveLocalFilesystemUrl(correctPath+currentName)
                            .then(entry => {
                                ( < FileEntry > entry).file(file => this.readFile(file))
                            })
                            .catch(err => {
                                this.presentToast('Error while reading file.');
                            });
                        this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
                    });
            } else {
                var currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
                console.log("loken-test currentName is "+currentName);
                var correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
                console.log("loken-test  correctPath is "+correctPath);
                this.copyFileToLocalDir(correctPath, currentName, this.createFileName());

                //todo,开始上传图片
                console.log("loken-test 开始上传图片 "+correctPath+currentName);
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

    createFileName() {
        var d = new Date(),
            n = d.getTime(),
            newFileName = n + ".jpg";
        return newFileName;
    }

    copyFileToLocalDir(namePath, currentName, newFileName) {
        this.file.copyFile(namePath, currentName, this.file.dataDirectory, newFileName).then(success => {
            this.updateStoredImages(newFileName);
        }, error => {
            this.presentToast('Error while storing file.');
        });
    }

    updateStoredImages(name) {
        this.storage.get(STORAGE_KEY).then(images => {
            let arr = JSON.parse(images);
            if (!arr) {
                let newImages = [name];
                this.storage.set(STORAGE_KEY, JSON.stringify(newImages));
            } else {
                arr.push(name);
                this.storage.set(STORAGE_KEY, JSON.stringify(arr));
            }

            let filePath = this.file.dataDirectory + name;
            let resPath = this.pathForImage(filePath);

            let newEntry = {
                name: name,
                path: resPath,
                filePath: filePath
            };

            this.images = [newEntry, ...this.images];
            this.ref.detectChanges(); // trigger change detection cycle
        });
    }

    deleteImage(imgEntry, position) {
        this.images.splice(position, 1);

        this.storage.get(STORAGE_KEY).then(images => {
            let arr = JSON.parse(images);
            let filtered = arr.filter(name => name != imgEntry.name);
            this.storage.set(STORAGE_KEY, JSON.stringify(filtered));

            var correctPath = imgEntry.filePath.substr(0, imgEntry.filePath.lastIndexOf('/') + 1);

            this.file.removeFile(correctPath, imgEntry.name).then(res => {
                this.presentToast('File removed.');
            });
        });
    }

    startUpload(imgEntry) {
        console.log("loken-test imgEntry.filePath is "+imgEntry.filePath);
        this.file.resolveLocalFilesystemUrl(imgEntry.filePath)
            .then(entry => {
                ( < FileEntry > entry).file(file => this.readFile(file))
            })
            .catch(err => {
                this.presentToast('Error while reading file.');
            });
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
            message: '正在修改',
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
                console.log("loken-test upload res");
                console.log(res);
                console.log("loken-test upload res status "+res['status']);
                console.log("loken-test upload res status "+res['image_info']['image_name']);
                if (res['success']) {
                    this.presentToast('File upload complete.')
                } else {
                    this.presentToast('File upload failed.')
                }
            });
    }

}
