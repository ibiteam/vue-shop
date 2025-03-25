import $http from '@/utils/http.js'


export function  getDataAxios() {
  // return $http.doGet('v3/cart/index')
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        "message": "success",
        "code": 200,
        "data": {
          "shop": [
            {
              "shop_name": "\u591a\u591a\u7504\u9009\u65d7\u8230\u5e97\u8c22\u5c0f\u8c22",
              "seller_id": 710,
              "goods": [
                {
                  "goods_id": 7341,
                  "goods_name": "\u5c0f\u989d\u591a\u89c4\u683c\u590d\u5408\u80a5\u590d\u5408\u80a5\u590d\u5408\u80a5\u591a\u89c4\u683c\u6d4b\u8bd5\u54c8\u54c8\u54c8\u54c8\u54c8\u54c8\u54c8\u54c8\u54c8\u54c8",
                  "goods_thumb": "https:\/\/cdn.toodudu.com\/2024\/09\/10\/G9O6U6XpS9WtrlwiP1OoRPZn4jimbTlM3H4XhsKZ.png",
                  "can_use_decimal": false,
                  "goods_number": 1,
                  "min_number": 1,
                  "max_number": 996,
                  "goods_price": "0.02",
                  "subtotal": 0.02,
                  "act_type": 9,
                  "cost_id": 0,
                  "limit_number": 0,
                  "unit": "\u5428",
                  "increase_desc": "",
                  "reselect": false,
                  "reselect_to_good": false,
                  "is_pay": "0",
                  "is_invalid": false,
                  "sku_desc": "\u989c\u8272:\u767d\u8272;\u5f62\u72b6:\u957f\u65b9\u5f62;\u4f53\u79ef:\u5927;",
                  "sku_id": "37773",
                  "rec_id": 16716,
                  "cost_info": "",
                  "end_time": "",
                  "gift": null
                }
              ],
              "shop_select": false,
              "is_coupon": 1
            },
            {
              "shop_name": "\u563b\u591a\u591a1",
              "seller_id": 641,
              "goods": [
                {
                  "goods_id": 6932,
                  "goods_name": "\u6d4b\u8bd50427\u56de\u5f52",
                  "goods_thumb": "https:\/\/cdn.toodudu.com\/2023\/04\/27\/muA4hpQvEkKOaSbgeFppYz4MfTjcdP9WWUDU6yKb.jpg",
                  "can_use_decimal": false,
                  "goods_number": 1,
                  "min_number": 1,
                  "max_number": 95,
                  "goods_price": "1000.00",
                  "subtotal": 1000,
                  "act_type": 9,
                  "cost_id": 0,
                  "limit_number": 0,
                  "unit": "\u5428",
                  "increase_desc": "",
                  "reselect": false,
                  "reselect_to_good": false,
                  "is_pay": "0",
                  "is_invalid": false,
                  "sku_desc": "",
                  "sku_id": "0",
                  "rec_id": 16278,
                  "cost_info": "",
                  "end_time": "",
                  "gift": null
                }
              ],
              "shop_select": false,
              "is_coupon": 0
            }
          ],
          "pay_goods_count": 0,
          "invalid_count": 2,
          "invalid_goods": [
            {
              "rec_id": 16280,
              "goods_id": 7293,
              "goods_name": "\u6d82\u6599",
              "goods_thumb": "https:\/\/cdn.toodudu.com\/2024\/08\/08\/WEGGZ5FusrnUFyeqo4yPNhcvxegqb6IJnK1lkcBI.png",
              "invalid_type": "is_delete",
              "cat_id": 1518,
              "cat_name": "\u561f\u561f\u561f\u5206\u7c7b"
            },
            {
              "rec_id": 16277,
              "goods_id": 2969,
              "goods_name": "\u660a\u9f99 \u9510\u949b\u578bHLA-300\u949b\u767d\u7c89",
              "goods_thumb": "https:\/\/cdn.toodudu.com\/tdd\/images\/201609\/source_img\/2969_G_1473328681453.jpg",
              "invalid_type": "out_of_stock",
              "cat_id": 1432
            }
          ],
          "total": {
            "total_price_format": "\u00a50.00",
            "total_price": "0.00"
          },
          "service_time": 1742527032,
          "cart_num": 2
        }
      })
    },1000)
  })
}

export function deleteAxios(){
  return new Promise.resolve({"message":"\u5220\u9664\u6210\u529f","code":200,"data":[]})
}

export function newAddAttensionAxios(){
  return new Promise.resolve({"message":"\u5173\u6ce8\u6210\u529f","code":200,"data":[]})
}

export function editByShopAxios(){
  return  $http.doPost('v3/cart/editByShop', {seller_id: item.seller_id, is_pay: item.shop_select ? '1' : '0'})
}

export function editByGoodsAxios(){
  return $http.doPost('v3/cart/editByGoods', {goods_id: item.goods_id, is_pay: item.is_pay>0 ? '1' : '0',sku_id:item.sku_id})
}

export function emptyInvalidAxios(){
  return $http.doPost('v3/cart/emptyInvalid')
}

export function getZhiRecommendAxios(){
  return $http.doGet('v3/home/getZhiRecommend')
}

export function getCouponAxios(param){
  return $http.doGet('v3/coupon/get_coupon', param)
}

export function usercouponAddAxios(param){
  return $http.doPost('v3/usercoupon/add', param)
}

export function placeOrderAxios(){
  return $http.doGet('v3/cart/placeOrder')
}

export function cartAxios(){
  return $http.doGet('v3/buried/data/cart')
}
