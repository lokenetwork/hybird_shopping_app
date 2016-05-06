angular.module('starter.goods_services', ['starter.location_services', 'starter.my_http_services', 'starter.picture_services'])


  .factory('HotGoods', function (Setting, LocationData, myHttp, Base) {

    // Might use a resource here that returns a JSON array

    // Some fake testing data
    var hot_goods_list = [];
    var have_more_hot_goods = true;

    var hot_goods_current_page = 0;
    return {

      initial_hot_goods_data: function (initial_hot_goods_data_call_back) {
        var app_latitude = LocationData.get_latitude();
        var app_longitude = LocationData.get_longitude();
        //need get the location before.initial_hot_goods_data may be asynchronous
        if (app_latitude && app_longitude) {
          hot_goods_current_page = 1;
          var getHotDataSuccessAction = function (hot_respond) {
            //console.log("initial_hot_goods_data is  "+hot_respond.data['have_more_hot_goods']);
            //clear data
            hot_goods_list.splice(0, hot_goods_list.length);
            for (var i = 0; i < hot_respond.data['goods_list'].length; i++) {
              hot_goods_list[i] = hot_respond.data['goods_list'][i];
            }
            have_more_hot_goods = hot_respond.data['have_more_hot_goods'];
            if (initial_hot_goods_data_call_back != undefined) {
              initial_hot_goods_data_call_back();
            }
          };
          var getHotDataErrorAction = function () {
          };
          var getHotPostData = "page=1&latitude=" + app_latitude + "&longitude=" + app_longitude;
          myHttp.post(Setting.app_server_url + 'Goods/hot', getHotPostData, getHotDataSuccessAction, getHotDataErrorAction);
        }
      },

      get_more_hot_goods_data: function (get_more_hot_goods_data_call_back) {
        if (hot_goods_current_page >= 1) {
          //console.log("hot_goods_current_page->"+hot_goods_current_page);
          var page = hot_goods_current_page + 1;
          var app_latitude = LocationData.get_latitude();
          var app_longitude = LocationData.get_longitude();
          //console.log("page is "+page);
          var getHotDataSuccessAction = function (hot_respond) {
            //console.log("hot_respond.data['have_more_hot_goods'] is "+hot_respond.data['have_more_hot_goods']);
            have_more_hot_goods = hot_respond.data['have_more_hot_goods'];
            if (hot_respond.data['goods_list'].length > 0) {
              for (var i = 0; i < hot_respond.data['goods_list'].length; i++) {
                hot_goods_list.push(hot_respond.data['goods_list'][i]);
              }
              hot_goods_current_page++;
              get_more_hot_goods_data_call_back();
            } else {
              have_more_hot_goods = false;
            }
          };
          var getHotDataErrorAction = function () {
            get_more_hot_goods_data_call_back();
          };
          var getHotPostData = "page=" + page + "&latitude=" + app_latitude + "&longitude=" + app_longitude;
          myHttp.post(Setting.app_server_url + 'Goods/hot', getHotPostData, getHotDataSuccessAction, getHotDataErrorAction);
        }
      },

      all_hot_goods: function () {
        return hot_goods_list;
      },

      moreHotGoodsCanBeLoaded: function () {
        //console.log('have_more_hot_goods is '+have_more_hot_goods);
        //console.log('hot_goods_current_page is '+hot_goods_current_page);
        if (have_more_hot_goods && hot_goods_current_page >= 1) {
          return true;
        } else {
          return false;
        }
      },

      hideNotMoreGoodsTips: function () {
        return have_more_hot_goods;
      },
      _test: function () {
        /*
         console.log("sdsdsd");
         console.log(test);
         */
        return test;
      }
    };
  })

  .factory('GoodsDetail', function (Setting, LocationData, myHttp, Base, PictureSetting, Picture) {

    // Might use a resource here that returns a JSON array

    var service_goods_id = 0;
    var goods_picture_list = [];
    var goods_base_info = {};
    var goods_sku_attr_list = [];
    var goods_sku_price_list = [];
    var selected_sku_attr_list = [];
    var current_sku_combination = '';

    //goods_sku_attr_list.push({'p':'4545'});
    return {
      http_get_goods_base_info: function (goods_id) {
        var getGoodsBaseInfoSuccessAction = function (respond) {
          for (var p in respond.data) {
            if (p == 'first_picture')[
              respond.data[p] = Picture.get_responsive_picture_url(respond.data[p],'large')
            ]
            eval('goods_base_info.' + p + ' = respond.data[p]');
          }
        }
        var getGoodsBaseInfoErrorAction = function () {
        };
        var detail_url = Setting.app_server_url + 'Goods/baseInfo?goods_id=' + goods_id;
        myHttp.post(detail_url, '', getGoodsBaseInfoSuccessAction, getGoodsBaseInfoErrorAction);

      },
      init_data: function (goods_id) {
        this.http_get_goods_base_info(goods_id);
        this.http_get_goods_sku_info(goods_id);
        service_goods_id = goods_id;
      },

      http_get_goods_pictures: function (goods_id, call_back) {
        var getGoodsPicturesSuccessAction = function (respond) {
          //clear data in "goods_picture"
          goods_picture_list.splice(0, goods_picture_list.length);
          for (var p in respond.data) {
            respond.data[p]['goods_picture'] = Picture.get_responsive_picture_url(respond.data[p]['goods_picture'],'large');
            goods_picture_list.push(respond.data[p])
          }
          if (call_back !== undefined) {
            call_back();
          }
        }
        var getGoodsPicturesErrorAction = function () {
        };
        var picture_api_url = Setting.app_server_url + 'Goods/goodsPictures?goods_id=' + goods_id;
        myHttp.post(picture_api_url, '', getGoodsPicturesSuccessAction, getGoodsPicturesErrorAction);
      },
      http_get_goods_sku_info: function (goods_id) {
        var getGoodsSkuInfoSuccessAction = function (respond) {
          goods_sku_attr_list.splice(0, goods_sku_attr_list.length);
          goods_sku_price_list.splice(0, goods_sku_price_list.length);
          selected_sku_attr_list.splice(0, selected_sku_attr_list.length);

          current_sku_combination = '';
          // insert sku attribute
          for (attr_index in respond.data['attr']) {
            current_sku_combination += respond.data['attr'][attr_index]['name'] + ':';

            goods_sku_attr_list.push(respond.data['attr'][attr_index]);

            //loop insert active attribute
            for (attr_value_index in respond.data['attr'][attr_index]['attr_values']) {
              if( respond.data['attr'][attr_index]['attr_values'][attr_value_index]['is_active'] == 'active' ){
                current_sku_combination += respond.data['attr'][attr_index]['attr_values'][attr_value_index]['value'] + ' '
                var single_select_sku_attr = {
                  'name':respond.data['attr'][attr_index]['name'],
                  'value':respond.data['attr'][attr_index]['attr_values'][attr_value_index]['value'],
                };
                //console.log(single_select_sku_attr);
                selected_sku_attr_list.push(single_select_sku_attr);
              }
            }
          }
          current_sku_combination = current_sku_combination.trim();

          //insert sku price
          for (price_index in respond.data['price']) {
            goods_sku_price_list.push(respond.data['price'][price_index]);
          }

        }
        var getGoodsSkuInfoErrorAction = function () {
        };
        var picture_api_url = Setting.app_server_url + 'Goods/goodsSkuInfo?goods_id=' + goods_id;
        myHttp.post(picture_api_url, '', getGoodsSkuInfoSuccessAction, getGoodsSkuInfoErrorAction);
      },

      get_goods_base_info: function () {
        return goods_base_info;
      }
      ,
      get_goods_picture_list: function () {
        return goods_picture_list;
      },

      get_goods_sku_attr: function () {
        return goods_sku_attr_list;
      },
      set_goods_sku_attr_active: function (sku_attr_name, sku_attr_value) {
        selected_sku_attr_list.splice(0, selected_sku_attr_list.length);


        for (goods_sku_attr_index in goods_sku_attr_list) {
          if (goods_sku_attr_list[goods_sku_attr_index]['name'] == sku_attr_name) {
            for (goods_sku_attr_value_index in goods_sku_attr_list[goods_sku_attr_index]['attr_values']) {
              if (goods_sku_attr_list[goods_sku_attr_index]['attr_values'][goods_sku_attr_value_index]['value'] == sku_attr_value) {
                goods_sku_attr_list[goods_sku_attr_index]['attr_values'][goods_sku_attr_value_index]['is_active'] = 'active';
              } else {
                goods_sku_attr_list[goods_sku_attr_index]['attr_values'][goods_sku_attr_value_index]['is_active'] = '';
              }
            }
          }
        }
        current_sku_combination = '';
        for (goods_sku_attr_index in goods_sku_attr_list) {
          current_sku_combination += goods_sku_attr_list[goods_sku_attr_index]['name'] + ':';
          for (goods_sku_attr_value_index in goods_sku_attr_list[goods_sku_attr_index]['attr_values']) {
            if (goods_sku_attr_list[goods_sku_attr_index]['attr_values'][goods_sku_attr_value_index]['is_active'] == 'active') {

              var single_select_sku_attr = {
                'name':goods_sku_attr_list[goods_sku_attr_index]['name'],
                'value':goods_sku_attr_list[goods_sku_attr_index]['attr_values'][goods_sku_attr_value_index]['value'],
              };
              console.log(single_select_sku_attr);
              selected_sku_attr_list.push(single_select_sku_attr);

              current_sku_combination += goods_sku_attr_list[goods_sku_attr_index]['attr_values'][goods_sku_attr_value_index]['value'] + ' '
            }
          }
        }
        current_sku_combination = current_sku_combination.trim();
        this.update_goods_sku_price(current_sku_combination);
      },

      get_goods_sku_price: function () {
        return goods_sku_price_list;
      },

      update_goods_sku_price: function (current_sku_combination) {
        for (goods_sku_price_index in goods_sku_price_list) {
          if ((goods_sku_price_list[goods_sku_price_index]['sku_value']) == current_sku_combination) {
            goods_base_info['goods_price'] = goods_sku_price_list[goods_sku_price_index]['goods_price'];
          }
        }
      },
      get_selected_sku_attr_list:function(){
        return selected_sku_attr_list;
      },

      add_cart:function(){
        console.log(current_sku_combination);
        console.log(service_goods_id);
        var cartAddSuccessAction = function (respond) {
            console.log(respond);
        }
        var cartAddErrorAction = function () {
        };
        var cart_add_url = Setting.app_server_url + 'Cart/add';
        var cart_add_data = 'goods_id='+service_goods_id+"&goods_sku="+current_sku_combination;
        myHttp.post(cart_add_url,cart_add_data, cartAddSuccessAction, cartAddErrorAction);
      }

    };
  })


;
