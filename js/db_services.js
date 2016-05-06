angular.module('starter.services', ['starter.goods_services'])

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


  // DB service
  .factory('DB', function($q, DB_CONFIG) {
    var self = this;
    self.db = null;

    self.init = function() {
      // DB init from config.js
      self.db = window.openDatabase(DB_CONFIG.name, '1.0', 'database', -1);
      angular.forEach(DB_CONFIG.tables, function(table) {
        var columns = [];
        angular.forEach(table.columns, function(column) {
          columns.push(column.name + ' ' + column.type);
        });
        var query = 'CREATE TABLE IF NOT EXISTS ' + table.name + ' (' + columns.join(',') + ')';
        console.log('Création de la table ' + table.name);
        self.db.query(query);
      });
    };

    self.query = function(query, bindings) {
      bindings = typeof bindings !== 'undefined' ? bindings : [];
      var deferred = $q.defer();
      self.db.transaction(function(transaction) {
        return transaction.executeSql(query, bindings);
      });
      return deferred.promise;
    };

    return self;
  })

  .factory('Device', function () {

    return {

      save_device_info_in_h5_storage:function(){
        ionic.Platform.ready(function () {
          if( window.device != undefined ){
            window.localStorage["app_client_type"] = window.device.platform;
          }else{
            window.localStorage["app_client_type"] = 'web';
          }
        });
      },

      get_client_type:function(){

        var app_client_type = '';
        if( window.localStorage["app_client_type"] != undefined  ){
          app_client_type = window.localStorage["app_client_type"];
        };
        if( app_client_type == '' ){
          this.save_device_info_in_h5_storage();
        }
        var max_time = 1500;
        var time = 0;
        while( window.localStorage["app_client_type"] == undefined && time < max_time ){
          time++
        };
        return app_client_type;
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
      save_app_id_location:function(){
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
          //H5 store
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
      }


    };
  });


