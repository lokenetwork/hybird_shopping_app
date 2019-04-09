import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';

@Component({
  selector: 'app-search-modal',
  templateUrl: './search-modal.page.html',
  styleUrls: ['./search-modal.page.scss'],
})
export class SearchModalPage implements OnInit {

  modalTitle:string;
  modelId:number;
  search_name:string = "";
  show_price:boolean;
  private saturation = { lower: 0, upper: 2000 } ;

  constructor(
      private modalController: ModalController,
      private navParams: NavParams
  ) { }

  ngOnInit() {
    this.modelId = this.navParams.data.modelId;
    this.modalTitle = this.navParams.data.modalTitle;
    if( this.modalTitle == '搜索附近店铺' ){
      this.show_price= false;
    }else{
      this.show_price= true;
    }
  }

  async closeModal() {
    var onClosedData:object = {'search_name':this.search_name,'saturation':this.saturation}
    await this.modalController.dismiss(onClosedData);
  }

  async search(){
    var return_obj:object = {'search_name':this.search_name,'saturation':this.saturation}
    await this.modalController.dismiss(return_obj);
  }



}

