<template>
    <section class="recommend-column-container">
        <div class="recommend-title" v-if="showTitle">{{ title }}</div>
        <slot name="title" v-else></slot>
        <div class="waterfall-container">
            <div v-for="(item, index) in goods" :key="item.goods_id" class="waterfall-item">
                <goods-image v-bind="{width: '3.5rem', height: '3.5rem', src: item.goods_thumb}"></goods-image>
                <div class="item-info">
                    <van-text-ellipsis class="title" :content="item.goods_name" rows="2"/>
                    <van-text-ellipsis class="subtitle" :content="item.goods_subtitle" rows="1"/>
                    <div class="s-flex jc-bt" style="align-items: flex-end;">
                        <goods-price v-bind="{price: item.shop_price, unit: item.unit}"></goods-price>
                        <span class="sold-out">已售10+</span>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup>
import GoodsImage from '@/components/goods/image'
import GoodsPrice from '@/components/goods/price'
import { defineProps } from 'vue'

const props = defineProps({
    title: {
        type: String,
        default: '为您推荐'
    },
    showTitle: {
        type: Boolean,
        default: true
    },
    goods: {
        type: Array,
        default: () => [
            {
                "shop_price": "18.6",
                "unit": "\u5343\u514b",
                "goods_name": "\u9053\u6069\u949b\u4e1aR2295\u949b\u767d\u7c89 \u9506\u94dd\u5305\u819c\u91d1\u7ea2\u77f3\u578b \u8010\u6e29\u8010\u5019\u767d\u5ea6\u597d",
                "goods_thumb": "https:\/\/cdn.toodudu.com\/2019\/01\/09\/nk0mSH9IIlnDjq0BzUpr9Rf0zVRoDMmTvLfVVZCa.jpeg",
                "goods_id": 4688,
                "image": "https:\/\/cdn.toodudu.com\/2019\/01\/09\/nk0mSH9IIlnDjq0BzUpr9Rf0zVRoDMmTvLfVVZCa.jpeg",
                "seller_id": 413,
                "shop_name": "\u5c71\u4e1c\u5b8f\u6da6\u989c\u6599",
                "cat_id": 1432,
                "is_group": false,
                "act_type": 9,
                "activity_info": {
                    "act_type": 9,
                    "activity_price": "18.60",
                    "min_number": 25
                },
                "goods_subtitle": "R2295\u949b\u767d\u7c89",
                "pc_url": "https:\/\/test-tooduduitem.ptdplat.com\/goods\/4688.html",
                "is_ziying": 0,
                "type": 1,
                "sign": "\u96c6\u5e02",
                "ziying_sign": "\u96c6\u5e02",
                "attribute_source": "",
                "goods_type": "",
                "hot_heat": null,
                "frequent_visits": null,
                "coupon": "",
                "sign_type": 4
            },
            {
                "shop_price": "14800",
                "unit": "\u5428",
                "goods_name": "\u9ad8\u76df\u65b0\u67501260 \u6c34\u6027\u82ef\u4e19\u4e73\u6db2 \u5de5\u4e1a\u9632\u62a4\u6d82\u6599\u7528 \u9ad8\u9644\u7740\u529b\u9ad8\u8010\u6c34\u6027",
                "goods_thumb": "https:\/\/cdn.toodudu.com\/tdd\/images\/201607\/thumb_img\/2419_thumb_G_1469070692929.jpg",
                "goods_id": 2419,
                "image": "https:\/\/cdn.toodudu.com\/tdd\/images\/201607\/thumb_img\/2419_thumb_G_1469070692929.jpg",
                "seller_id": 240,
                "shop_name": "\u5317\u4eac\u9ad8\u76df\u65b0\u6750\u6599\u80a1\u4efd\u6709\u9650\u516c\u53f8",
                "cat_id": 1245,
                "is_group": false,
                "act_type": 9,
                "activity_info": {
                    "act_type": 9,
                    "activity_price": "14800.00",
                    "min_number": 1
                },
                "goods_subtitle": "0",
                "pc_url": "https:\/\/test-tooduduitem.ptdplat.com\/goods\/2419.html",
                "is_ziying": 0,
                "type": 1,
                "sign": "\u96c6\u5e02",
                "ziying_sign": "\u96c6\u5e02",
                "attribute_source": "",
                "goods_type": "",
                "hot_heat": null,
                "frequent_visits": null,
                "coupon": "",
                "sign_type": 0
            },
            {
                "shop_price": "1",
                "unit": "\u5428",
                "goods_name": "\u6c34\u6ce52",
                "goods_thumb": "https:\/\/cdn.toodudu.com\/2023\/03\/01\/ZeVZM6DCVUK87CjGFKe0laKXh69W4nLZdOE2lcs7.jpg",
                "goods_id": 6742,
                "image": "https:\/\/cdn.toodudu.com\/2023\/03\/01\/ZeVZM6DCVUK87CjGFKe0laKXh69W4nLZdOE2lcs7.jpg",
                "seller_id": 80,
                "shop_name": "\u6d82\u591a\u591a\u81ea\u8425\u5e97\u94fa",
                "cat_id": 1454,
                "is_group": false,
                "act_type": 9,
                "activity_info": {
                    "act_type": 9,
                    "activity_price": "1.00",
                    "min_number": 7
                },
                "goods_subtitle": "",
                "pc_url": "https:\/\/test-tooduduitem.ptdplat.com\/goods\/6742.html",
                "is_ziying": 1,
                "type": 1,
                "sign": "\u81ea\u8425",
                "ziying_sign": "\u81ea\u8425",
                "attribute_source": "",
                "goods_type": "",
                "hot_heat": null,
                "frequent_visits": null,
                "coupon": "",
                "sign_type": 0
            },
            {
                "shop_price": "13000",
                "unit": "\u5428",
                "goods_name": "\u7389\u95e8\u9759\u6d0b \u9510\u949b\u578b\u949b\u767d\u7c89HA-100 \u6d82\u6599\u9020\u7eb8\u7528\u4e8c\u6c27\u5316\u949b \u5408\u683c\u54c1",
                "goods_thumb": "https:\/\/cdn.toodudu.com\/2018\/10\/30\/x1pVU1sEQIMgUg4pSiPutrpdwIkLIe0dskIgKYUP.jpeg",
                "goods_id": 4564,
                "image": "https:\/\/cdn.toodudu.com\/2018\/10\/30\/x1pVU1sEQIMgUg4pSiPutrpdwIkLIe0dskIgKYUP.jpeg",
                "seller_id": 389,
                "shop_name": "\u7389\u95e8\u9759\u6d0b\u949b\u767d\u7c89\u65d7\u8230\u5e97",
                "cat_id": 1432,
                "is_group": false,
                "act_type": 9,
                "activity_info": {
                    "act_type": 9,
                    "activity_price": "13000.00",
                    "min_number": 1
                },
                "goods_subtitle": "\u7389\u95e8\u9759\u6d0b \u9510\u949b\u578b\u949b\u767d\u7c89HA-100 \u6d82\u6599\u9020\u7eb8\u7528\u4e8c\u6c27\u5316\u949b \u5408\u683c\u54c1",
                "pc_url": "https:\/\/test-tooduduitem.ptdplat.com\/goods\/4564.html",
                "is_ziying": 0,
                "type": 1,
                "sign": "\u96c6\u5e02",
                "ziying_sign": "\u96c6\u5e02",
                "attribute_source": "",
                "goods_type": "",
                "hot_heat": null,
                "frequent_visits": null,
                "coupon": "",
                "sign_type": 4
            },
            {
                "shop_price": "16.8",
                "unit": "\u5343\u514b",
                "goods_name": "\u7eb3\u7c73\u91d1\u7ea2\u77f3\u578b\u949b\u767d\u7c89R-258 \u901a\u7528\u6d82\u6599\u5316\u5de5\u539f\u6599\u4e8c\u6c27\u5316\u949b \u73b0\u8d27\u4f9b\u5e94",
                "goods_thumb": "https:\/\/cdn.toodudu.com\/2019\/04\/09\/R7pFB8GcUpfmfX5lvH0oljy1aGtASY9PtSbRw76h.jpeg",
                "goods_id": 5476,
                "image": "https:\/\/cdn.toodudu.com\/2019\/04\/09\/R7pFB8GcUpfmfX5lvH0oljy1aGtASY9PtSbRw76h.jpeg",
                "seller_id": 515,
                "shop_name": "\u4e0a\u6d77\u6c83\u4e45\u77ff\u4ea7\u54c1\u6709\u9650\u516c\u53f8",
                "cat_id": 1432,
                "is_group": false,
                "act_type": 9,
                "activity_info": {
                    "act_type": 9,
                    "activity_price": "16.80",
                    "min_number": 500
                },
                "goods_subtitle": "\u73b0\u8d27\u4f9b\u5e94\u6279\u53d1\u949b\u767d\u7c89",
                "pc_url": "https:\/\/test-tooduduitem.ptdplat.com\/goods\/5476.html",
                "is_ziying": 0,
                "type": 1,
                "sign": "\u96c6\u5e02",
                "ziying_sign": "\u96c6\u5e02",
                "attribute_source": "",
                "goods_type": "",
                "hot_heat": null,
                "frequent_visits": null,
                "coupon": "",
                "sign_type": 4
            },
            {
                "shop_price": "17400",
                "unit": "\u5428",
                "goods_name": "\u6500\u94a2\u91d1\u7ea2\u77f3\u949b\u767d\u7c89CR-350",
                "goods_thumb": "https:\/\/cdn.toodudu.com\/2019\/03\/16\/NPDgnWET1S4dapBSyF6mZqCJUT95qeOZo3awQkV6.png",
                "goods_id": 5251,
                "image": "https:\/\/cdn.toodudu.com\/2019\/03\/16\/NPDgnWET1S4dapBSyF6mZqCJUT95qeOZo3awQkV6.png",
                "seller_id": 482,
                "shop_name": "\u4fe1\u4e2d\u539f\u6d82\u6750",
                "cat_id": 1432,
                "is_group": false,
                "act_type": 9,
                "activity_info": {
                    "act_type": 9,
                    "activity_price": "17400.00",
                    "min_number": 1
                },
                "goods_subtitle": "\u6c2f\u5316\u6cd5\u949b\u767d\u7c89",
                "pc_url": "https:\/\/test-tooduduitem.ptdplat.com\/goods\/5251.html",
                "is_ziying": 0,
                "type": 1,
                "sign": "\u96c6\u5e02",
                "ziying_sign": "\u96c6\u5e02",
                "attribute_source": "",
                "goods_type": "",
                "hot_heat": null,
                "frequent_visits": null,
                "coupon": "",
                "sign_type": 4
            },
            {
                "shop_price": "16200",
                "unit": "\u5428",
                "goods_name": "\u6500\u94a2\u91d1\u7ea2\u77f3\u949b\u767d\u7c89R-298",
                "goods_thumb": "https:\/\/cdn.toodudu.com\/2019\/03\/15\/a9ZZLvDdkneLKkkOHgle3b0GMTRXjqxHKRR3fctC.png",
                "goods_id": 5235,
                "image": "https:\/\/cdn.toodudu.com\/2019\/03\/15\/a9ZZLvDdkneLKkkOHgle3b0GMTRXjqxHKRR3fctC.png",
                "seller_id": 482,
                "shop_name": "\u4fe1\u4e2d\u539f\u6d82\u6750",
                "cat_id": 1432,
                "is_group": false,
                "act_type": 9,
                "activity_info": {
                    "act_type": 9,
                    "activity_price": "16200.00",
                    "min_number": 1
                },
                "goods_subtitle": "R-298\u662f\u6500\u94a2\u96c6\u56e2\u5f00\u53d1\u7684\u65b0\u4e00\u4ee3\u9ad8\u6863\u901a\u7528\u578b\u91d1\u7ea2\u77f3\u949b\u767d\u7c89\u3002",
                "pc_url": "https:\/\/test-tooduduitem.ptdplat.com\/goods\/5235.html",
                "is_ziying": 0,
                "type": 1,
                "sign": "\u96c6\u5e02",
                "ziying_sign": "\u96c6\u5e02",
                "attribute_source": "",
                "goods_type": "",
                "hot_heat": null,
                "frequent_visits": null,
                "coupon": "",
                "sign_type": 4
            },
            {
                "shop_price": "16500",
                "unit": "\u5428",
                "goods_name": "\u5e7f\u897f\u91d1\u9f99\u91d1\u7ea2\u77f3\u578bJLR221",
                "goods_thumb": "https:\/\/cdn.toodudu.com\/2019\/01\/20\/gue8slnHNIBLFIVBumLmUhLp9VZJjoVo26OJ7PTm.jpeg",
                "goods_id": 4775,
                "image": "https:\/\/cdn.toodudu.com\/2019\/01\/20\/gue8slnHNIBLFIVBumLmUhLp9VZJjoVo26OJ7PTm.jpeg",
                "seller_id": 423,
                "shop_name": "\u9752\u5c9b\u84dd\u5e06\u5316\u5de5\u6709\u9650\u516c\u53f8",
                "cat_id": 1432,
                "is_group": false,
                "act_type": 9,
                "activity_info": {
                    "act_type": 9,
                    "activity_price": "16500.00",
                    "min_number": 5
                },
                "goods_subtitle": "\u4e3b\u8981\u7528\u4f5c\u6d82\u6599\u3001\u9020\u7eb8\u3001\u5851\u6599\u7b49\u884c\u4e1a",
                "pc_url": "https:\/\/test-tooduduitem.ptdplat.com\/goods\/4775.html",
                "is_ziying": 0,
                "type": 1,
                "sign": "\u96c6\u5e02",
                "ziying_sign": "\u96c6\u5e02",
                "attribute_source": "",
                "goods_type": "",
                "hot_heat": null,
                "frequent_visits": null,
                "coupon": "",
                "sign_type": 4
            },
            {
                "shop_price": "18000",
                "unit": "\u5428",
                "goods_name": "\u5316\u539f\u5929\u53cb \u4f70\u5229\u8054BILLIONS\u91d1\u7ea2\u77f3\u578b\u949b\u767d\u7c89BLR-601",
                "goods_thumb": "https:\/\/cdn.toodudu.com\/2019\/01\/09\/t2zYPMu09tp8Hfyo6hVAWI6FUHAjHRoLmHPlwO1s.jpeg",
                "goods_id": 4703,
                "image": "https:\/\/cdn.toodudu.com\/2019\/01\/09\/t2zYPMu09tp8Hfyo6hVAWI6FUHAjHRoLmHPlwO1s.jpeg",
                "seller_id": 419,
                "shop_name": "\u5929\u6d25\u5316\u539f\u5929\u53cb\u5316\u5de5\u4ea7\u54c1\u8d38\u6613\u6709\u9650\u516c\u53f8",
                "cat_id": 1432,
                "is_group": false,
                "act_type": 9,
                "activity_info": {
                    "act_type": 9,
                    "activity_price": "18000.00",
                    "min_number": 1
                },
                "goods_subtitle": "\u5316\u539f\u5929\u53cb \u4f70\u5229\u8054BILLIONS\u91d1\u7ea2\u77f3\u578b\u949b\u767d\u7c89BLR-601",
                "pc_url": "https:\/\/test-tooduduitem.ptdplat.com\/goods\/4703.html",
                "is_ziying": 0,
                "type": 1,
                "sign": "\u96c6\u5e02",
                "ziying_sign": "\u96c6\u5e02",
                "attribute_source": "",
                "goods_type": "",
                "hot_heat": null,
                "frequent_visits": null,
                "coupon": "",
                "sign_type": 4
            },
            {
                "shop_price": "18000",
                "unit": "\u5428",
                "goods_name": "\u5316\u539f\u5929\u53cb \u4f70\u5229\u8054BILLIONS\u91d1\u7ea2\u77f3\u578b\u949b\u767d\u7c89BLR-688",
                "goods_thumb": "https:\/\/cdn.toodudu.com\/2019\/01\/09\/pgxz48JkwX2LfBz2ppvNNoEu5w7sS8MWWivMSWjH.jpeg",
                "goods_id": 4702,
                "image": "https:\/\/cdn.toodudu.com\/2019\/01\/09\/pgxz48JkwX2LfBz2ppvNNoEu5w7sS8MWWivMSWjH.jpeg",
                "seller_id": 419,
                "shop_name": "\u5929\u6d25\u5316\u539f\u5929\u53cb\u5316\u5de5\u4ea7\u54c1\u8d38\u6613\u6709\u9650\u516c\u53f8",
                "cat_id": 1432,
                "is_group": false,
                "act_type": 9,
                "activity_info": {
                    "act_type": 9,
                    "activity_price": "18000.00",
                    "min_number": 1
                },
                "goods_subtitle": "\u5316\u539f\u5929\u53cb \u4f70\u5229\u8054BILLIONS\u91d1\u7ea2\u77f3\u578b\u949b\u767d\u7c89BLR-688",
                "pc_url": "https:\/\/test-tooduduitem.ptdplat.com\/goods\/4702.html",
                "is_ziying": 0,
                "type": 1,
                "sign": "\u96c6\u5e02",
                "ziying_sign": "\u96c6\u5e02",
                "attribute_source": "",
                "goods_type": "",
                "hot_heat": null,
                "frequent_visits": null,
                "coupon": "",
                "sign_type": 4
            },
            {
                "shop_price": "18000",
                "unit": "\u5428",
                "goods_name": "\u5316\u539f\u5929\u53cb \u5b81\u6ce2\u65b0\u798f\u91d1\u7ea2\u77f3\u578b\u949b\u767d\u7c89NTR-606",
                "goods_thumb": "https:\/\/cdn.toodudu.com\/2019\/01\/09\/uOyBUIwTaVAL0dpZzpY4OLCcuol3enXPapg2xxRq.jpeg",
                "goods_id": 4701,
                "image": "https:\/\/cdn.toodudu.com\/2019\/01\/09\/uOyBUIwTaVAL0dpZzpY4OLCcuol3enXPapg2xxRq.jpeg",
                "seller_id": 419,
                "shop_name": "\u5929\u6d25\u5316\u539f\u5929\u53cb\u5316\u5de5\u4ea7\u54c1\u8d38\u6613\u6709\u9650\u516c\u53f8",
                "cat_id": 1432,
                "is_group": false,
                "act_type": 9,
                "activity_info": {
                    "act_type": 9,
                    "activity_price": "18000.00",
                    "min_number": 1
                },
                "goods_subtitle": "\u5316\u539f\u5929\u53cb \u5b81\u6ce2\u65b0\u798f\u91d1\u7ea2\u77f3\u578b\u949b\u767d\u7c89NTR-606",
                "pc_url": "https:\/\/test-tooduduitem.ptdplat.com\/goods\/4701.html",
                "is_ziying": 0,
                "type": 1,
                "sign": "\u96c6\u5e02",
                "ziying_sign": "\u96c6\u5e02",
                "attribute_source": "",
                "goods_type": "",
                "hot_heat": null,
                "frequent_visits": null,
                "coupon": "",
                "sign_type": 4
            },
            {
                "shop_price": "18000",
                "unit": "\u5428",
                "goods_name": "\u5316\u539f\u5929\u53cb \u4f70\u5229\u8054BILLIONS\u91d1\u7ea2\u77f3\u578b\u949b\u767d\u7c89BLR-896",
                "goods_thumb": "https:\/\/cdn.toodudu.com\/2019\/01\/09\/RzJwAbcwDsU6nwmwBTEYQU32K1peV8TEdQrrGgeG.jpeg",
                "goods_id": 4697,
                "image": "https:\/\/cdn.toodudu.com\/2019\/01\/09\/RzJwAbcwDsU6nwmwBTEYQU32K1peV8TEdQrrGgeG.jpeg",
                "seller_id": 419,
                "shop_name": "\u5929\u6d25\u5316\u539f\u5929\u53cb\u5316\u5de5\u4ea7\u54c1\u8d38\u6613\u6709\u9650\u516c\u53f8",
                "cat_id": 1432,
                "is_group": false,
                "act_type": 9,
                "activity_info": {
                    "act_type": 9,
                    "activity_price": "18000.00",
                    "min_number": 1
                },
                "goods_subtitle": "\u5316\u539f\u5929\u53cb \u4f70\u5229\u8054BILLIONS\u91d1\u7ea2\u77f3\u578b\u949b\u767d\u7c89BLR-896",
                "pc_url": "https:\/\/test-tooduduitem.ptdplat.com\/goods\/4697.html",
                "is_ziying": 0,
                "type": 1,
                "sign": "\u96c6\u5e02",
                "ziying_sign": "\u96c6\u5e02",
                "attribute_source": "",
                "goods_type": "",
                "hot_heat": null,
                "frequent_visits": null,
                "coupon": "",
                "sign_type": 4
            },
            {
                "shop_price": "18000",
                "unit": "\u5428",
                "goods_name": "\u5316\u539f\u5929\u53cb \u4f70\u5229\u8054BILLIONS\u91d1\u7ea2\u77f3\u578b\u949b\u767d\u7c89BLR-895",
                "goods_thumb": "https:\/\/cdn.toodudu.com\/2019\/01\/09\/TLKpKf0T6wri693NeZBWFmnQWBsxLatjq5oP8twT.jpeg",
                "goods_id": 4695,
                "image": "https:\/\/cdn.toodudu.com\/2019\/01\/09\/TLKpKf0T6wri693NeZBWFmnQWBsxLatjq5oP8twT.jpeg",
                "seller_id": 419,
                "shop_name": "\u5929\u6d25\u5316\u539f\u5929\u53cb\u5316\u5de5\u4ea7\u54c1\u8d38\u6613\u6709\u9650\u516c\u53f8",
                "cat_id": 1432,
                "is_group": false,
                "act_type": 9,
                "activity_info": {
                    "act_type": 9,
                    "activity_price": "18000.00",
                    "min_number": 1
                },
                "goods_subtitle": "\u5316\u539f\u5929\u53cb \u4f70\u5229\u8054BILLIONS\u91d1\u7ea2\u77f3\u578b\u949b\u767d\u7c89BLR-895",
                "pc_url": "https:\/\/test-tooduduitem.ptdplat.com\/goods\/4695.html",
                "is_ziying": 0,
                "type": 1,
                "sign": "\u96c6\u5e02",
                "ziying_sign": "\u96c6\u5e02",
                "attribute_source": "",
                "goods_type": "",
                "hot_heat": null,
                "frequent_visits": null,
                "coupon": "",
                "sign_type": 4
            },
            {
                "shop_price": "18000",
                "unit": "\u5428",
                "goods_name": "\u5316\u539f\u5929\u53cb \u4f70\u5229\u8054BILLIONS\u91d1\u7ea2\u77f3\u578b\u949b\u767d\u7c89BLR-699",
                "goods_thumb": "https:\/\/cdn.toodudu.com\/2019\/01\/09\/zRgH9GkzaTKzNq1ilII7eEhd7plavYsSWairGbmr.jpeg",
                "goods_id": 4691,
                "image": "https:\/\/cdn.toodudu.com\/2019\/01\/09\/zRgH9GkzaTKzNq1ilII7eEhd7plavYsSWairGbmr.jpeg",
                "seller_id": 419,
                "shop_name": "\u5929\u6d25\u5316\u539f\u5929\u53cb\u5316\u5de5\u4ea7\u54c1\u8d38\u6613\u6709\u9650\u516c\u53f8",
                "cat_id": 1432,
                "is_group": false,
                "act_type": 9,
                "activity_info": {
                    "act_type": 9,
                    "activity_price": "18000.00",
                    "min_number": 1
                },
                "goods_subtitle": "\u5316\u539f\u5929\u53cb \u4f70\u5229\u8054BILLIONS\u91d1\u7ea2\u77f3\u578b\u949b\u767d\u7c89BLR-699",
                "pc_url": "https:\/\/test-tooduduitem.ptdplat.com\/goods\/4691.html",
                "is_ziying": 0,
                "type": 1,
                "sign": "\u96c6\u5e02",
                "ziying_sign": "\u96c6\u5e02",
                "attribute_source": "",
                "goods_type": "",
                "hot_heat": null,
                "frequent_visits": null,
                "coupon": "",
                "sign_type": 4
            },
            {
                "shop_price": "13000",
                "unit": "\u5428",
                "goods_name": "\u7389\u95e8\u9759\u6d0b \u9510\u949b\u578b\u949b\u767d\u7c89HA-100 \u6d82\u6599\u9020\u7eb8\u7528\u4e8c\u6c27\u5316\u949b \u4e00\u7b49\u54c1",
                "goods_thumb": "https:\/\/cdn.toodudu.com\/2018\/10\/30\/BW3cwT33Wn5ofGr2Q3QcxZnU9WIJeo4AmNwnlmFX.jpeg",
                "goods_id": 4563,
                "image": "https:\/\/cdn.toodudu.com\/2018\/10\/30\/BW3cwT33Wn5ofGr2Q3QcxZnU9WIJeo4AmNwnlmFX.jpeg",
                "seller_id": 389,
                "shop_name": "\u7389\u95e8\u9759\u6d0b\u949b\u767d\u7c89\u65d7\u8230\u5e97",
                "cat_id": 1432,
                "is_group": false,
                "act_type": 9,
                "activity_info": {
                    "act_type": 9,
                    "activity_price": "13000.00",
                    "min_number": 1
                },
                "goods_subtitle": "\u7389\u95e8\u9759\u6d0b \u9510\u949b\u578b\u949b\u767d\u7c89HA-100 \u6d82\u6599\u9020\u7eb8\u7528\u4e8c\u6c27\u5316\u949b \u4e00\u7b49\u54c1",
                "pc_url": "https:\/\/test-tooduduitem.ptdplat.com\/goods\/4563.html",
                "is_ziying": 0,
                "type": 1,
                "sign": "\u96c6\u5e02",
                "ziying_sign": "\u96c6\u5e02",
                "attribute_source": "",
                "goods_type": "",
                "hot_heat": null,
                "frequent_visits": null,
                "coupon": "",
                "sign_type": 4
            },
            {
                "shop_price": "25000",
                "unit": "\u5428",
                "goods_name": "\u7f8e\u56fd\u675c\u90a6Dupont\u949b\u767d\u7c89\/\u4e8c\u6c27\u5316\u949bR-902",
                "goods_thumb": "https:\/\/cdn.toodudu.com\/tdd\/images\/201803\/thumb_img\/4156_thumb_G_1520487497894.jpg",
                "goods_id": 4156,
                "image": "https:\/\/cdn.toodudu.com\/tdd\/images\/201803\/thumb_img\/4156_thumb_G_1520487497894.jpg",
                "seller_id": 363,
                "shop_name": "\u5e7f\u5dde\u5e02\u7a57\u73a5\u8d38\u6613\u6709\u9650\u8d23\u4efb\u516c\u53f8",
                "cat_id": 1432,
                "is_group": false,
                "act_type": 9,
                "activity_info": {
                    "act_type": 9,
                    "activity_price": "25000.00",
                    "min_number": 1
                },
                "goods_subtitle": "0",
                "pc_url": "https:\/\/test-tooduduitem.ptdplat.com\/goods\/4156.html",
                "is_ziying": 0,
                "type": 1,
                "sign": "\u96c6\u5e02",
                "ziying_sign": "\u96c6\u5e02",
                "attribute_source": "",
                "goods_type": "",
                "hot_heat": null,
                "frequent_visits": null,
                "coupon": "",
                "sign_type": 0
            },
            {
                "shop_price": "18000",
                "unit": "\u5428",
                "goods_name": "\u91d1\u6d77 \u91d1\u7ea2\u77f3\u578b\u949b\u767d\u7c89R-6618 \u949b\u767d\u7c89",
                "goods_thumb": "https:\/\/cdn.toodudu.com\/tdd\/images\/201801\/thumb_img\/4069_thumb_G_1515978565051.jpg",
                "goods_id": 4069,
                "image": "https:\/\/cdn.toodudu.com\/tdd\/images\/201801\/thumb_img\/4069_thumb_G_1515978565051.jpg",
                "seller_id": 377,
                "shop_name": "\u5b81\u6ce2\u9876\u521b\u592a\u5316\u65b0\u6750\u6599\u6709\u9650\u516c\u53f8",
                "cat_id": 1432,
                "is_group": false,
                "act_type": 9,
                "activity_info": {
                    "act_type": 9,
                    "activity_price": "18000.00",
                    "min_number": 1
                },
                "goods_subtitle": "",
                "pc_url": "https:\/\/test-tooduduitem.ptdplat.com\/goods\/4069.html",
                "is_ziying": 0,
                "type": 1,
                "sign": "\u96c6\u5e02",
                "ziying_sign": "\u96c6\u5e02",
                "attribute_source": "",
                "goods_type": "",
                "hot_heat": null,
                "frequent_visits": null,
                "coupon": "",
                "sign_type": 0
            },
            {
                "shop_price": "14000",
                "unit": "\u5428",
                "goods_name": "\u660a\u9f99 \u9510\u949b\u578bHLA-110\u949b\u767d\u7c89",
                "goods_thumb": "https:\/\/cdn.toodudu.com\/tdd\/images\/201609\/source_img\/2967_G_1473328240940.jpg",
                "goods_id": 2967,
                "image": "https:\/\/cdn.toodudu.com\/tdd\/images\/201609\/source_img\/2967_G_1473328240940.jpg",
                "seller_id": 314,
                "shop_name": "\u5bcc\u6c11\u9f99\u817e\u949b\u4e1a\u6709\u9650\u516c\u53f8",
                "cat_id": 1432,
                "is_group": false,
                "act_type": 9,
                "activity_info": {
                    "act_type": 9,
                    "activity_price": "14000.00",
                    "min_number": 1
                },
                "goods_subtitle": "",
                "pc_url": "https:\/\/test-tooduduitem.ptdplat.com\/goods\/2967.html",
                "is_ziying": 1,
                "type": 1,
                "sign": "\u81ea\u8425",
                "ziying_sign": "\u81ea\u8425",
                "attribute_source": "",
                "goods_type": "",
                "hot_heat": null,
                "frequent_visits": null,
                "coupon": "",
                "sign_type": 0
            },
            {
                "shop_price": "23",
                "unit": "\u516c\u65a4",
                "goods_name": "\u8fdb\u53e3\u91d1\u7ea2\u77f3\u578b\u7eb3\u7c73\u949b\u767d\u7c89CR-828 \u901a\u7528\u6d82\u6599\u5316\u5de5\u539f\u6599\u4e8c\u6c27\u5316\u949b",
                "goods_thumb": "https:\/\/cdn.toodudu.com\/2019\/04\/15\/1RQ8Ke0jcMwPjMDW8yg4sxXzqMV5b4XHAsAugmke.jpeg",
                "goods_id": 5631,
                "image": "https:\/\/cdn.toodudu.com\/2019\/04\/15\/1RQ8Ke0jcMwPjMDW8yg4sxXzqMV5b4XHAsAugmke.jpeg",
                "seller_id": 515,
                "shop_name": "\u4e0a\u6d77\u6c83\u4e45\u77ff\u4ea7\u54c1\u6709\u9650\u516c\u53f8",
                "cat_id": 1432,
                "is_group": false,
                "act_type": 9,
                "activity_info": {
                    "act_type": 9,
                    "activity_price": "23.00",
                    "min_number": 500
                },
                "goods_subtitle": "\u7f8e\u56fd\u7279\u8bfa(\u79d1\u7f8e\u57fa)\u8fdb\u53e3\u949b\u767d\u7c89\u73b0\u8d27\u4f9b\u5e94\u6279\u53d1",
                "pc_url": "https:\/\/test-tooduduitem.ptdplat.com\/goods\/5631.html",
                "is_ziying": 0,
                "type": 1,
                "sign": "\u96c6\u5e02",
                "ziying_sign": "\u96c6\u5e02",
                "attribute_source": "",
                "goods_type": "",
                "hot_heat": null,
                "frequent_visits": null,
                "coupon": "",
                "sign_type": 4
            },
            {
                "shop_price": "900",
                "unit": "\u5428",
                "goods_name": "\u6d88\u6bd2\u6db2-\u534e\u590f\u6d4b\u8bd5\u4e8c",
                "goods_thumb": "https:\/\/cdn.toodudu.com\/2020\/03\/26\/A81pvjHz7w7auEInijPuxQKX67zI85O2oQXinjaE.jpeg",
                "goods_id": 5961,
                "image": "https:\/\/cdn.toodudu.com\/2020\/03\/26\/A81pvjHz7w7auEInijPuxQKX67zI85O2oQXinjaE.jpeg",
                "seller_id": 580,
                "shop_name": "\u534e\u590f\u6d4b\u8bd5\u4e8c",
                "cat_id": 1432,
                "is_group": false,
                "act_type": 9,
                "activity_info": {
                    "act_type": 9,
                    "activity_price": "900.00",
                    "min_number": 1
                },
                "goods_subtitle": "\u6d88\u6bd2\u6db2-\u534e\u590f\u6d4b\u8bd5\u4e8c",
                "pc_url": "https:\/\/test-tooduduitem.ptdplat.com\/goods\/5961.html",
                "is_ziying": 0,
                "type": 1,
                "sign": "\u96c6\u5e02",
                "ziying_sign": "\u96c6\u5e02",
                "attribute_source": "",
                "goods_type": "",
                "hot_heat": null,
                "frequent_visits": null,
                "coupon": "",
                "sign_type": 4
            }
        ]
    }
})



</script>

<style lang='scss' scoped>
.recommend-column-container{
    width: 100%;
    max-width: 7.5rem;
    color: var(--color-text);
    font-size: var(--base-font-size);
    .recommend-title{
        width: fit-content;
        max-width: 100%;
        padding: .26rem 0.66rem;
        margin: 0 auto;
        text-align: center;
        position: relative;
        &::before{
            content: '';
            display: block;
            width: .36rem;
            height: .31rem;
            background: url('@/assets/images/common/recommend-left.png') 100% no-repeat;
            background-size: cover;
            position: absolute;
            left: 0;
            top: 0;
            bottom: 0;
            margin: auto 0;
        }
        &::after{
            content: '';
            display: block;
            width: .36rem;
            height: .31rem;
            background: url('@/assets/images/common/recommend-right.png') 100% no-repeat;
            background-size: cover;
            position: absolute;
            right: 0;
            top: 0;
            bottom: 0;
            margin: auto 0;
        }
    }
    .waterfall-container {
        width: 100%;
        padding: 0 .2rem;
        box-sizing: border-box;
        column-count: 2; /* 两列 */
        column-gap: 0.1rem; /* 列间距 */
        .waterfall-item {
            width: 3.5rem;
            margin-bottom: .1rem;
            background-color: #fff;
            border-radius: .1rem;
            overflow: hidden;
            .item-info{
                padding: .1rem .15rem .2rem;
                .subtitle {
                    color: var(--main-color);
                    font-size: .22rem;
                }
                .sold-out{
                    font-size: .22rem;
                    color: #999;
                }
            }
        }
    }
}
</style>