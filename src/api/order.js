import $http from '@/utils/http.js'

export function getCheckoutData() {
    //return $http.doGet('v4/order/checkout')
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve({
                "message": "success",
                "code": 200,
                "data": {
                    "delivery_default_method": {
                        "default_list": [
                            {
                                "label": "送货上门",
                                "value": 1
                            },
                            {
                                "label": "上门自提",
                                "value": 2
                            }
                        ],
                        "checked": 1
                    },
                    "delivery_type_options": null,
                    "goods": [
                        {
                            "seller_id": 531,
                            "shop_name": "上海训达新材料科技有限公司",
                            "goods": [
                                {
                                    "act_type": 9,
                                    "goods_id": 5712,
                                    "goods_name": "水性自交联丙烯酸乳液",
                                    "goods_thumb": "https://cdn.toodudu.com/2019/04/18/Q5zE7Y73iXADdMSnKSlCmz1HwLXXAqLU1cDfdtKp.png",
                                    "unit": "公斤",
                                    "number": 2,
                                    "cotton_batch": "",
                                    "cotton_basis": "",
                                    "shop_price": "¥22.00",
                                    "goods_amount": "¥44.00",
                                    "use_plan": [
                                        {
                                            "time": 1744785998,
                                            "number": 2
                                        }
                                    ],
                                    "give_good": null,
                                    "region_limit": null,
                                    "goods_attr": "",
                                    "url": ""
                                }
                            ],
                            "url": ""
                        }
                    ],
                    "address": {
                        "address_id": 4832,
                        "consignee": "gdd",
                        "country": 0,
                        "province": "北京",
                        "city": "北京",
                        "district": "西城区",
                        "address": "丰台区总部基地六区三号楼",
                        "tel": "",
                        "mobile": "185****7430",
                        "address_type": "家",
                        "used": 1,
                        "all_mobile_phone": "18513007430"
                    },
                    "regionLimitInfo": {
                        "message": "",
                        "isLimit": false,
                        "allTheFailure": false
                    },
                    "showPlan": false,
                    "invalidationGoods": {
                        "deleteGoods": [],
                        "soldOut": [],
                        "canDone": true
                    },
                    "paymentMethod": [
                        {
                            "id": 1,
                            "code": "online",
                            "desc": "支持大小额订单使用，与多家银行、微信支付合作，提供安全、便捷的支付流程，随时随地支付。",
                            "name": "在线支付",
                            "selected": true
                        },
                        {
                            "id": 2,
                            "code": "company",
                            "desc": "您提交订单后，我们会向您展示商家的收款对公账户，您需使用公司对公账户通过银行网银等渠道进行付款。",
                            "name": "公司转账",
                            "selected": false
                        }
                    ],
                    "bonusId": [],
                    "bonusList": [],
                    "cannotUseBonusList": [
                        {
                            "bonusId": 4070,
                            "name": "现金红包",
                            "money": "10",
                            "minAmount": "10",
                            "endTime": "2027.02.28",
                            "starTime": "2025.01.14",
                            "limitTitle": null,
                            "limitDesc": null,
                            "limitInfo": "仅限满减可用",
                            "canUse": 0,
                            "isNewGuest": 0,
                            "isAdditivity": 0,
                            "goods": null
                        },
                        {
                            "bonusId": 4071,
                            "name": "现金红包",
                            "money": "10",
                            "minAmount": "10",
                            "endTime": "2027.02.28",
                            "starTime": "2025.01.14",
                            "limitTitle": null,
                            "limitDesc": null,
                            "limitInfo": "仅限满减可用",
                            "canUse": 0,
                            "isNewGuest": 0,
                            "isAdditivity": 0,
                            "goods": null
                        }
                    ],
                    "couponId": [],
                    "couponsList": [],
                    "cannotUseCouponList": [],
                    "integral": {
                        "pay_points": 10020,
                        "integral": 0,
                        "integral_money": 0
                    },
                    "total": {
                        "goodsPrice": "44.00",
                        "ship_price": "0.00",
                        "fullReduction": "0.00",
                        "coupon": "0.00",
                        "deposit": "0.00",
                        "bonus": "0.00",
                        "integral": 0,
                        "integral_money": 0,
                        "groupPrice": "0.00",
                        "gb_coupon": "0.00",
                        "total": "44.00",
                        "deposit_price": "0.00"
                    }
                }
            })
        })
    })
}