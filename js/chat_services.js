angular.module('starter.chat_services', [])


  .factory('Websocket', function ($rootScope,myHttp,Setting) {


    var ws;
    var auto_connect_number;
    var re_connecting = false;
    var auto_connect_times = 0;
    var login_token;
    var message_list = [];

    var _recieve_msg = function (e) {
      console.log(e.data);
    };
    var _error_deal = function () {
      //Todo, submit the error log to server.
    };

    var _server_close_deal = function (event) {
      if( !re_connecting ){
        re_connecting = true;
        _auto_connect();
      }
    };

    var _send_msg = function (data) {
      ws.send(JSON.stringify(data));
    };

    var _login_auth = function () {
      //500毫秒读一次看看login_token,又没获取到了
      var check_login_token_intervel = setInterval(
        function () {
          if( login_token != undefined ){
            clearInterval(check_login_token_intervel);
            //发送消息,认证此websocket链接
            var login_message = {
              command:'set_login_info',
              //content是登陆token
              content:{
                "loginToken":login_token
              },
            };
            _send_msg(login_message);

          

          }
        }, 500
      )

    }
    var _get_login_token = function () {
      //Todo,get the login token from php server.
      login_token = "HqjeQWbBMiyPSkSxUeDVLfNKJwCQCT";
    }

    var _connect = function () {
      auto_connect_times++;
      if (auto_connect_times > 10) {
        _del_auto_connect();
      }

      if (ws == undefined || ws.readyState == 0 || ws.readyState == 2 || ws.readyState == 3) {
        ws = new WebSocket("ws://192.168.1.153:9080/buyer-entry");
        ws.onopen = function () {
          _login_auth();
          _del_auto_connect();
        };
        ws.onmessage = _recieve_msg;
        ws.onerror = _error_deal;
        ws.onclose = _server_close_deal;
      }

    };


    var _auto_connect = function () {
        auto_connect_number = setInterval(
          _connect, 5000
        );
    };

    var _del_auto_connect = function () {
      clearInterval(auto_connect_number);
      auto_connect_times = 0;
      re_connecting = false;
    }

    return {

      init:function () {
        _get_login_token();
        this.connect();
      },

      connect: function () {
        _connect();
      },

      server_close_deal: function (event) {
        _server_close_deal(event);
      },

      get_connect: function () {
        this.connect();
        return ws;
      },

      send_msg: function (normal_message) {
        _send_msg(normal_message);
        console.log(normal_message)
        if( normal_message.command == 'send_message' ){
          var message_item = {
            type: "reply",
            message: normal_message.content.message
          }

          message_list[normal_message.content.toCustomerServiceUserId].push(message_item);
          console.log(message_list)
        }
      },

      recieve_msg: function (e) {
        _recieve_msg(e);
      },

      get_message_list:function (toCustomerServiceUserId) {
        if( message_list[toCustomerServiceUserId] == undefined ){
          message_list[toCustomerServiceUserId] = [];
        }
        return message_list[toCustomerServiceUserId]
      }


    }

  })


;
