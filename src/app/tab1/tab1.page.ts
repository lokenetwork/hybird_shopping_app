import { Component,ViewChild } from '@angular/core';
import { IonInfiniteScroll } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { ModalController } from '@ionic/angular';
import { SearchModalPage } from '../search-modal/search-modal.page';
@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

    items: any[] = [];

    constructor(public modalController: ModalController) {

        for (let i = 0; i < 100; i++) {
            this.items.push({
                name: i + ' - ' + 'OCO2018春季新品灯笼袖收腰显瘦翻领长袖连衣裙',
                imgSrc: getImgSrc(),
                avatarSrc: getImgSrc(),
                imgHeight: Math.floor(Math.random() * 50 + 150),
                content: lorem.substring(0, Math.random() * (lorem.length - 100) + 100)
            });

            rotateImg++;
            if (rotateImg === images.length) {
                rotateImg = 0;
            }
        }

    }

    async openModal() {
        const modal = await this.modalController.create({
            component: SearchModalPage,
            componentProps: {
                "modelId": 123,
                "modalTitle": "Test Title"
            }
        });

        modal.onDidDismiss().then((dataReturned) => {
            if (dataReturned !== null) {
                console.log('Modal Sent Data :', dataReturned);
            }
        });

        return await modal.present();
    }
}

const lorem = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, seddo eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';

const images = [
    'bandit',
    'batmobile',
    'blues-brothers',
    'bueller',
    'delorean',
    'eleanor',
    'general-lee',
    'ghostbusters',
    'knight-rider',
    'mirth-mobile'
];

function getImgSrc() {
    //const src = 'https://dummyimage.com/600x400/${Math.round( Math.random() * 99999)}/fff.png';
    const src = 'http://192.168.0.105:9016/goods/20190201/45.jpg';
    rotateImg++;
    if (rotateImg === images.length) {
        rotateImg = 0;
    }
    return src;
}

let rotateImg = 0;
let foo = "228px";
