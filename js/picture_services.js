angular.module('starter.picture_services', [])

  .factory('PictureSetting', function () {

    // Might use a resource here that returns a JSON array


    return {

      image_domain:'http://192.168.1.188/',



    };
  })


  .factory('Picture', function (PictureSetting) {

    // Might use a resource here that returns a JSON array

    var goods_picture_list = ['wwwww'];
    var goods_base_info = {};


    return {


      get_responsive_picture_url: function (picture_base_url,size_type) {

        var goods_picture_size_path = '.';
        if( size_type == 'small' ){

        }else if( size_type == 'middle' ){
          if( window.innerWidth <= 320  ){
            goods_picture_size_path = '_140x140.';
          }else{
            goods_picture_size_path = '_400x400.';
          }

        }else if ( size_type == 'large' ){
          if( window.innerWidth <= 320  ){
            goods_picture_size_path = '_400x400.';
          }

        }
        var picture_size_url = picture_base_url.replace(/\./,goods_picture_size_path);
        var get_picture_url = PictureSetting.image_domain+picture_size_url
        return get_picture_url;

      },

      get_fix_size_picture_url:function(picture_base_url,size){
        var goods_picture_size_path = '_'+size+'.';
        var picture_size_url = picture_base_url.replace(/\./,goods_picture_size_path);
        var get_picture_url = PictureSetting.image_domain+picture_size_url
        return get_picture_url;

      },


    };
  })


;
