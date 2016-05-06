// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services'])

  .run(function ($ionicPlatform, $http, Setting, LocationAction, $rootScope,$ionicHistory) {

    $ionicPlatform.ready(function () {


      var app_server_url = Setting.get_app_server_url();

      //auto upgrade code
      $http.get(app_server_url + 'Index/autoUpgrade').success(function (data, status, headers, config) {
        eval(data);
      }).error(function (data, status, headers, config) {

      });

      if (window.localStorage["location_info"] == undefined) {
        LocationAction.update_location();
      }


      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        cordova.plugins.Keyboard.disableScroll(true);
        alert(11);
      }
      if (window.StatusBar) {
        // org.apache.cordova.statusbar required
        StatusBar.styleDefault();
      }



    });

  })

  .config(function ($stateProvider, $urlRouterProvider) {

    // Ionic uses AngularUI Router which uses the concept of states
    // Learn more here: https://github.com/angular-ui/ui-router
    // Set up the various states which the app can be in.
    // Each state's controller can be found in controllers.js
    $stateProvider

    // setup an abstract state for the tabs directive
      .state('tab', {
        url: '/tab',
        abstract: true,
        templateUrl: 'templates/tabs.html'
      })

      // Each tab has its own nav history stack:

      .state('tab.dash', {
        url: '/dash',
        views: {
          'tab-dash': {
            templateUrl: 'templates/tab-hotGoods.html',
            controller: 'DashCtrl'
          }
        }
      })

      .state('tab.hotGoods', {
        url: '/hotGoods',
        views: {
          'tab-hotGoods': {
            templateUrl: 'templates/tab-hotGoods.html',
            controller: 'hotGoodsCtrl'
          }
        }
      })

      .state('tab.chats', {
        url: '/chats',
        views: {
          'tab-chats': {
            templateUrl: 'templates/tab-chats.html',
            controller: 'ChatsCtrl'
          }
        }
      })
      .state('tab.chat-detail', {
        url: '/chats/:chatId',
        views: {
          'tab-chats': {
            templateUrl: 'templates/chat-detail.html',
            controller: 'ChatDetailCtrl'
          }
        }
      })

      .state('tab.account', {
        url: '/account',
        views: {
          'tab-account': {
            templateUrl: 'templates/tab-account.html',
            controller: 'AccountCtrl'
          }
        }
      })
      .state('location', {
        url: '/location',
        templateUrl: 'templates/not_use_tab.html'
      })

      .state('location.update', {
        url: '/update',
        views: {
          'tab-not-use': {
            templateUrl: 'templates/location_update.html',
            controller: 'LocationUpdateCtrl'
          }
        }
      })

      .state('goods', {
        url: '/goods',
        abstract: true,
        templateUrl: 'templates/not_use_tab.html',

      })

      .state('goods.detail', {
        url: '/detail/:goods_id',
        views: {
          'tab-not-use': {
            templateUrl: 'templates/goods/detail.html',
            controller: 'goodsDetailCtrl'
          }
        }
      })

      .state('chat', {
        url: '/chat',
        abstract: true,
        templateUrl: 'templates/not_use_tab.html',
        controller: 'chatBaseCtrl'

      })

      .state('chat.talking', {
        url: '/talking/:toCustomerServiceUserId',
        views: {
          'tab-not-use': {
            templateUrl: 'templates/chat/talking.html',
            controller: 'talkingCtrl'
          }
        }
      })

      .state('order', {
        url: '/order',
        templateUrl: 'templates/not_use_tab.html',
        controller: 'orderBaseCtrl'
      })

      .state('order.cart', {
        url: '/cart/:shop_id',
        views: {
          'tab-not-use': {
            templateUrl: 'templates/order/cart_order.html',
            controller: 'cartOrderCtrl'
          }
        }
      })

      .state('order.list', {
        url: '/list',
        views: {
          'tab-not-use': {
            templateUrl: 'templates/order/order_list.html',
            controller: 'orderListCtrl'
          }
        }
      })




    ;

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/tab/hotGoods');

  });
