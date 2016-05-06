angular.module('starter.order_controllers', ['starter.order_services'])

  .controller('orderBaseCtrl', function ($scope,$stateParams) {
    console.log('enter orderBaseCtrl control contruction');
  })

  .controller('cartOrderCtrl', function ($scope,CartOrder,$stateParams,Base) {



    $scope.$on('$ionicView.loaded', function(){
      CartOrder.init_data($stateParams.shop_id);
    });

    $scope.shop_name = function(){
      return CartOrder.get_shop_name();
    }


    $scope.cart_goods_list = CartOrder.get_cart_goods_list()


    $scope.order_amount = function(){
      return CartOrder.get_order_amount();
    }

    $scope.goods_number_amount = function(){
      return CartOrder.get_goods_number_amount();
    }

    $scope.cart_order_submit = function(pay_type){
      Base.loading('Submiting');
      $scope.formData.pay_type = pay_type;
      console.log( $scope.formData);
      CartOrder.submitOrder($scope.formData);
    }


    $scope.formData = {'message_to_shopkeeper':''};

  })

  .controller('orderListCtrl', function ($scope,OrderList) {

    $scope.order_list = OrderList.get_order_list();
    $scope.$on('$ionicView.loaded', function(e) {
    });

    $scope.moreOrderCanBeLoaded = function() {
      return OrderList.getMoreOrderCanBeLoaded();
    };

    function loadMoreOrderCallBack(){
      $scope.$broadcast('scroll.infiniteScrollComplete');
    }

    $scope.loadMoreOrder = function(){
      OrderList.http_get_more_order(loadMoreOrderCallBack);
    }

    function orderListRefreshCallBack(){
      $scope.$broadcast('scroll.refreshComplete');
    }

    $scope.doRefresh = function () {
      OrderList.clean_order_list(orderListRefreshCallBack);
    }

    $scope.reminder_order = function(){
      console.log(1213213);
    }

    $scope.view_order_detail = function(){
      console.log('view_order_detail');
    }

  })

;1