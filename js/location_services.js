angular.module('starter.location_services', ['starter.goods_services'])
  .factory('LocationAction', function ($ionicLoading, HotGoods) {

    return {

      update_location: function () {
        this.loading();
        var LocationObject = this;
        ionic.Platform.ready(function () {
          //todo,google api is blocked.make a deal.
          if (window.device != undefined && window.device.platform == 'android') {

          } else {
            navigator.geolocation.getCurrentPosition(
              function (position) {
                //check the client type,store the location info.
                ionic.Platform.ready(function () {
                  function save_location_in_h5_storage() {
                    var location = {};
                    location['latitude'] = position.coords.latitude;
                    location['longitude'] = position.coords.longitude;
                    location['altitude'] = position.coords.altitude;
                    location['accuracy'] = position.coords.accuracy;
                    location['altitudeAccuracy'] = position.coords.altitudeAccuracy;
                    location['heading'] = position.coords.heading;
                    location['speed'] = position.coords.speed;
                    location['timestamp'] = position.coords.timestamp;
                    //web h5 store
                    window.localStorage["location_info"] = JSON.stringify(location);
                  }
                  if (window.device != undefined) {
                    //todo,sqlite to store
                    save_location_in_h5_storage();
                  } else {
                    save_location_in_h5_storage();
                  }
                  LocationObject.location_change_event();
                  $ionicLoading.hide();
                });


              },
              function onError(error) {
                $ionicLoading.hide();
                //todo,use ip to get the locaiton,If GPS can not use.
                alert('code: ' + error.code + '\n' +
                  'message: ' + error.message + '\n');
              }
            );
          }
        });
      },

      loading: function () {
        $ionicLoading.show({
          template: '<ion-spinner class="spinner-light" icon="spiral"></ion-spinner><br/>locating...'
        });
      },

      location_change_event: function () {
        //hot goods data will change
        console.log(window.localStorage["location_info"]);
        HotGoods.initial_hot_goods_data();
        window.localStorage["show_location_info"] = 1;

      },

      hide_location_info: function () {
        window.localStorage.removeItem('show_location_info');
      },

      show_location_info: function () {
        window.localStorage["show_location_info"] = 1;

      },

      get_location_name: function () {
        return '110 Repulse Bay Rd, Hong Kong';
      },

    };
  })

  //get the location info from store.
  .factory('LocationData', function ($ionicLoading) {

    return {
      get_latitude: function () {
        if (window.localStorage["location_info"] != undefined) {
          location_info = JSON.parse(window.localStorage["location_info"]);
          return location_info.latitude;
        } else {
          return false;
        }
      },
      get_longitude: function () {
        if (window.localStorage["location_info"] != undefined) {
          location_info = JSON.parse(window.localStorage["location_info"]);
          return location_info.longitude;
        } else {
          return false;
        }
      },
      get_base_location_info_fadeLeftClass:function(){
        if (window.localStorage["show_location_info"] != undefined && window.localStorage["show_location_info"] == 1 ) {
          return 'fadeInDown';
        } else {
          return 'fadeOutUp';
        }
      }

    };
  });


