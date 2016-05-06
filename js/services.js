angular.module('starter.services', ['starter.location_services'])

  .factory('Chats', function () {

    // Might use a resource here that returns a JSON array

    // Some fake testing data
    var chats = [{
      id: 0,
      name: 'Ben Sparrow',
      lastText: 'You on your way?',
      face: 'img/ben.png'
    }, {
      id: 1,
      name: 'Max Lynx',
      lastText: 'Hey, it\'s me',
      face: 'img/max.png'
    }];

    return {

      all: function () {
        return chats;
      },
      remove: function (chat) {
        chats.splice(chats.indexOf(chat), 1);
      },
      get: function (chatId) {
        for (var i = 0; i < chats.length; i++) {
          if (chats[i].id === parseInt(chatId)) {
            return chats[i];
          }
        }
        return null;
      }
    };
  })



  .factory('Device', function () {

    return {

      get_client_type:function(){

      }

    };
  })

  .factory('Base', function ($ionicLoading) {

    return {
       loading:function(message){
         if( message == undefined ){
           message = 'loading...';
         }
         $ionicLoading.show({
           template: '<ion-spinner class="spinner-light" icon="spiral"></ion-spinner><br/>'+message
         });
       },
       hideLoading:function(){
         $ionicLoading.hide();
       }

    };
  })



  .factory('Setting', function ($ionicLoading,Device,$http) {

    return {

      app_server_url:'http://192.168.1.153:8086/',
      pull_setting:function(){

      },
      get_app_server_url:function(){
        return this.app_server_url;
      },
      save_app_id:function(){
        $http.get(this.app_server_url+'App/setAppId').
        success(function(app_id_info, status, headers, config) {
          if( app_id_info['status'] == 1 ){
            if (Device.get_client_type() == 'web') {

              //H5 store
              window.localStorage["app_id"] = app_id_info['app_id'];


            } else {
              //todo,sqlite store
              /*
               var db = window.sqlitePlugin.openDatabase({name: "my.db", location: 1}, function(){
               alert(111);
               }, function(){
               alert(211);
               });
               */
              //alert(window.localStorage["app_id"]);
              return app_id;
            }
          }
        }).
        error(function(data, status, headers, config) {
        });
      },
      get_app_id:function(){
        console.log('client_type:'+Device.get_client_type());
        if (Device.get_client_type() == 'web') {
          return window.localStorage["app_id"];
        } else {
          //todo,sqlite store
          /*
           var db = window.sqlitePlugin.openDatabase({name: "my.db", location: 1}, function(){
           alert(111);
           }, function(){
           alert(211);
           });
           */
          //alert(window.localStorage["app_id"]);
          return app_id;
        }
      },



    };
  });


