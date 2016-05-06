angular.module('starter.order_services', [])


  .factory('CartOrder', function (Setting, myHttp, Picture, $ionicPopup, Base, $timeout) {

    var shop_name = '';
    var cart_goods_list = [];
    var service_shop_id = 0;
    var order_amount = '';
    var goods_number_amount = '';
    var service_form_data = {};

    return {

      init_data: function (shop_id) {
        service_shop_id = shop_id
        this.http_get_shop_name();
        this.http_get_cart_goods_list();
      },

      http_get_shop_name: function () {
        var getShopNameSuccessAction = function (respond) {
          //console.log(respond);
          shop_name = respond.data['shop_name'];
        }
        var getShopNameErrorAction = function () {
        };
        var shop_name_api_url = Setting.app_server_url + 'ShopInfo/shopName?shop_id=' + service_shop_id;
        myHttp.post(shop_name_api_url, '', getShopNameSuccessAction, getShopNameErrorAction);
      },

      get_shop_name: function () {
        return shop_name;
      },

      http_get_cart_goods_list: function () {
        var getCartOrderInfoSuccessAction = function (respond) {
          order_amount = respond.data['order_amount'];
          goods_number_amount = respond.data['goods_number_amount'];

          console.log(respond);
          cart_goods_list.splice(0, cart_goods_list.length);

          for (var p in respond.data['cart_goods_list']) {
            respond.data['cart_goods_list'][p]['goods_picture'] = Picture.get_responsive_picture_url(respond.data['cart_goods_list'][p]['goods_picture'], 'middle');
            cart_goods_list.push(respond.data['cart_goods_list'][p])
          }
          console.log(cart_goods_list);
        }
        var getCartOrderInfoErrorAction = function () {
        };
        var car_goods_list_api_url = Setting.app_server_url + 'Order/cartOrderInfo?shop_id=' + service_shop_id;
        myHttp.post(car_goods_list_api_url, '', getCartOrderInfoSuccessAction, getCartOrderInfoErrorAction);
      },

      get_cart_goods_list: function () {
        return cart_goods_list;
      },
      get_goods_number_amount: function () {
        return goods_number_amount;
      },
      get_order_amount: function () {
        return order_amount;
      },

      create_cart_order_success_tips: function () {
        var successPopup = $ionicPopup.alert({
          title: 'Order submit success!',
          template: ''
        });

        successPopup.then(function (res) {
          //todo,this no finished,jump to not pay order now.
          window.location = '#/tab/hotGoods';
        });

        $timeout(function () {
          successPopup.close(); //close the popup after 3 seconds for some reason
        }, 3000);

      },

      http_create_cart_order: function () {
        var _CartOrder = this;
        var createCartOrderSuccessAction = function (respond) {
          if (respond.data['status'] == 'no_problem') {
            Base.hideLoading();
            eval('_CartOrder.' + service_form_data.pay_type + '()');
          }
        }
        var createCartOrderErrorAction = function () {
        };
        var createCartOrder_api_url = Setting.app_server_url + 'Order/createCartOrder';
        var createCartOrder_data = 'shop_id=' + service_shop_id + '&pay_type=' + service_form_data.pay_type + '&message_to_shopkeeper=' + service_form_data.message_to_shopkeeper;
        myHttp.post(createCartOrder_api_url, createCartOrder_data, createCartOrderSuccessAction, createCartOrderErrorAction);

        //todo,The third pay will do other action.

      },

      wechat_pay: function () {
        console.log('wechat_pay');
      },

      alipay_pay: function () {
        console.log('alipay_pay');

      },

      arrivel_pay: function () {
        this.create_cart_order_success_tips();
      },

      submitOrder: function (formData) {
        service_form_data = formData;

        this.http_create_cart_order();


      },

      _test: function () {
        return test;
      },
    };
  })

  .factory('OrderList', function (Setting, myHttp, Picture, $ionicPopup, Base, $timeout) {

    var order_list = [];
    var order_list_current_page = 0;
    var moreOrderCanBeLoaded = true;


    return {

      clean_order_list: function (callback) {
        order_list_current_page = 0;
        order_list.splice(0, order_list.length);
        console.log(order_list);
        if( callback != undefined ){
          this.http_get_more_order(callback);
        }else{
          this.http_get_more_order();
        }
        /*
        for (var order_list_index in order_list) {
          unset(order_list[order_list_index])
        }
        */
      },

      get_the_order_goods_picture: function (_order_list) {
        for (var order_list_index in _order_list) {
          for (var order_goods_index in _order_list[order_list_index]['order_goods_list']) {
            _order_list[order_list_index]['order_goods_list'][order_goods_index]['goods_picture'] = Picture.get_responsive_picture_url(_order_list[order_list_index]['order_goods_list'][order_goods_index]['goods_picture'], 'middle')
          }
        }
      },

      set_order_type: function (_order_list) {
        for (var order_list_index in _order_list) {
          if (_order_list[order_list_index]['order_goods_list'].length == 1) {
            _order_list[order_list_index]['single_goods_order'] = true;
          } else {
            _order_list[order_list_index]['single_goods_order'] = false;
          }
        }
      },

      reminder_order: function () {
        console.log('reminder_order');
      },

      evaluate_order: function () {

      },
      buy_again: function () {

      },


      get_order_status_string: function (_order_list) {
        for (var order_list_index in _order_list) {
          console.log(_order_list[order_list_index]['pay_type']);

          if (_order_list[order_list_index]['pay_type'] == 3) {
            if (_order_list[order_list_index]['transport_status'] == 0) {
              _order_list[order_list_index]['order_status_string'] = 'Need Shipped';
            } else {
              _order_list[order_list_index]['order_status_string'] = 'Shipped';
            }
          }
        }
      },


      http_get_more_order: function (callback) {
        var page = order_list_current_page + 1;
        var OrderList = this;

        var getOrderListSuccessAction = function (respond) {
          console.log(respond);
          if (respond.data.length > 0) {

            //little low performance,but understand better.
            OrderList.get_the_order_goods_picture(respond.data);
            OrderList.set_order_type(respond.data);
            OrderList.get_order_status_string(respond.data);

            for (var order_list_index in respond.data) {
              order_list.push(respond.data[order_list_index]);
            }

            console.log(order_list);

            moreOrderCanBeLoaded = true;
            order_list_current_page++;
          } else {
            moreOrderCanBeLoaded = false;
          }
          if( callback != undefined ){
            callback();
          }
        };
        var getOrderListErrorAction = function () {
          callback();
        };
        var postData = "page=" + page;
        myHttp.post(Setting.app_server_url + 'Order/list', postData, getOrderListSuccessAction, getOrderListErrorAction);
      },

      get_order_list: function () {
        return order_list;
      },
      getMoreOrderCanBeLoaded: function () {
        return moreOrderCanBeLoaded;
      },

      _test: function () {
        return test;
      },
    };
  })


;
