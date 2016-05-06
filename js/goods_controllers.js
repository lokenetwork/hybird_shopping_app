angular.module('starter.goods_controllers', ['starter.goods_services','starter.location_controllers','ionicLazyLoad'])

  .controller('goodsBaseCtrl', function ($scope,$stateParams) {
    console.log('enter goods control contruction');
  })

  .controller('hotGoodsCtrl', function ($scope,HotGoods,$ionicScrollDelegate,$ionicModal,LocationAction) {

    $scope.all_goods = HotGoods.all_hot_goods();
    $scope.$on('$ionicView.loaded', function(e) {
      HotGoods.initial_hot_goods_data()
    });

    function get_more_hot_goods_data_call_back(){
      $scope.$broadcast('scroll.infiniteScrollComplete');
    }

    $scope.loadMoreHotGoods = function() {
      HotGoods.get_more_hot_goods_data(get_more_hot_goods_data_call_back);
    };

    $scope.moreHotGoodsCanBeLoaded = function() {
      //console.log("HotGoods.moreHotGoodsCanBeLoaded() is "+HotGoods.moreHotGoodsCanBeLoaded());
      return HotGoods.moreHotGoodsCanBeLoaded();
    };

    $scope.hideNotMoreGoodsTips = function() {
      return HotGoods.hideNotMoreGoodsTips();
    };

    $scope.$on('$stateChangeSuccess', function() {
      //$scope.loadMoreHotGoods();
    });

    $scope.scrollMainToTop = function() {
      $ionicScrollDelegate.$getByHandle('mainScroll').scrollTop();
    };

    $scope.scrollSmallToTop = function() {
      $ionicScrollDelegate.$getByHandle('small').scrollTop();
    };

    $scope.isShowLocationInfo = false;

    var showLocationInfo = function () {
      $scope.isShowLocationInfo = true;
    }

    var hideLocationInfo = function(){
      $scope.isShowLocationInfo = false;
    }

    $scope.closeLocationInfo = function () {
      hideLocationInfo();
    }


    var hotGoodsRefreshComplete = function () {
      $scope.$broadcast('scroll.refreshComplete');
    }

    $scope.doRefresh = function () {
      HotGoods.initial_hot_goods_data(hotGoodsRefreshComplete)
    }

    $scope.update_location = function(){
      LocationAction.update_location();
    }
    $scope.test = function(){
      alert(1);
    }

  })

  .controller('goodsDetailCtrl', function ($scope,$stateParams,$ionicModal,GoodsDetail,Setting,$ionicSlideBoxDelegate) {
    GoodsDetail.init_data($stateParams.goods_id);
    var http_get_goods_pictures_call_back = function(){
      $ionicSlideBoxDelegate.update();
    }
    GoodsDetail.http_get_goods_pictures($stateParams.goods_id,http_get_goods_pictures_call_back);
    $scope.goods_base_info = GoodsDetail.get_goods_base_info();
    $scope.goods_picture_list = GoodsDetail.get_goods_picture_list();
    $scope.goods_sku_attr_list = GoodsDetail.get_goods_sku_attr();
    $scope.goods_sku_price_list = GoodsDetail.get_goods_sku_price();

    $scope.goods_price = function(){
      return $scope.goods_base_info['goods_price'];
    }

    $scope.show_sku_row =function(){
      if( $scope.goods_sku_attr_list.length > 0 ){
        return true;
      }else{
        return false;
      }
    }

    $scope.goods_selected_sku_attr_list = GoodsDetail.get_selected_sku_attr_list();


    function update_goods_sku_price(current_sku_combination){
      for (goods_sku_price_index in $scope.goods_sku_price_list) {
        if( ($scope.goods_sku_price_list[goods_sku_price_index]['sku_value']) == current_sku_combination ){
          $scope.goods_base_info['goods_price'] = $scope.goods_sku_price_list[goods_sku_price_index]['goods_price'];
        }
      }
    }

    $scope.select_sku_attr = function(sku_attr_name,sku_attr_value){
      GoodsDetail.set_goods_sku_attr_active(sku_attr_name,sku_attr_value);
    }

    $scope.add_cart = function(){
      GoodsDetail.add_cart();
    }
    $scope.bottom_add_cart = function() {
      if( $scope.show_sku_row() ){
        $scope.openSpecialAttributesModal();
      }else{
        GoodsDetail.add_cart();
      }
    }




    $ionicModal.fromTemplateUrl('special_attributes.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.specialAttributesModal = modal;
    });
    $scope.openSpecialAttributesModal = function() {
      $scope.specialAttributesModal.show();
    };

    $scope.closeSpecialAttributesModal = function() {
      $scope.specialAttributesModal.hide();
    };



  })
  .controller('GoodsEvaluateCtrl', function ($scope) {
    console.log('GoodsEvaluateCtrl ');


  })
  .controller('ShopInfoCtrl', function ($scope) {
    console.log('ShopInfoCtrl ');


  })
  .controller('GoodsRecommendCtrl', function ($scope) {
    console.log('GoodsRecommendCtrl ');


  });