angular.module('starter.keyboard_services', [])


  .factory('AppKeyboard', function () {

    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      return {
        close: function () {
          cordova.plugins.Keyboard.close();
        }
      }
    }else{
      return {
        close: function () {
        }
      }
    };

  })


;
