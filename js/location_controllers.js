angular.module('starter.location_controllers', ['starter.location_services'])

  .controller('LocationUpdateCtrl', function ($scope, $ionicHistory) {
    $scope.back = function () {
      $ionicHistory.goBack();
    }
  })
  .controller('LocationInfoCtrl', function ($scope, LocationAction, LocationData) {
    $scope.getFadeLeftClass = function () {
      return LocationData.get_base_location_info_fadeLeftClass();
    };
    $scope.closeLocationInfo = function () {
      LocationAction.hide_location_info();
    }

    $scope.location_name = function () {
      return LocationAction.get_location_name();
    }


    $scope.goods_list_scroll_action = function () {
      console.log('scroll ..');
    }

    $scope.isShowLocationInfo = function () {
      if (window.localStorage["show_location_info"] == undefined) {
        return false;
      } else if (window.localStorage["show_location_info"] == 1) {
        return true;
      }
    };
  });
