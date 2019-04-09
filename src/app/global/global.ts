import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Component,ViewChild } from '@angular/core';
import { IonInfiniteScroll } from '@ionic/angular';
import { ModalController } from '@ionic/angular';
import { Location } from '@angular/common';
import * as $ from 'jquery';
import {ActivatedRoute} from "@angular/router";
/*
  Generated class for the GlobalProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class GlobalProvider {
//this is a global variable
    public api_url = "http://172.16.137.17/";

    constructor(public http: HttpClient) {
        console.log('Hello GlobalProvider Provider');
    }

}
