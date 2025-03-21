import { defineStore } from 'pinia'
export const useTabbarStore = defineStore('store-tabbar', {
    state: () => {
        return {
            tabs: [{
                alias: 'home', title: '首页', check_title: '首页', is_show_number: false, number: '',default_image: 'wap-home-o', selection_image: 'wap-home-o',url: '/',
            },{
                alias: 'cart', title: '购物车', check_title: '购物车', is_show_number: true, number: '10',default_image: 'shopping-cart-o', selection_image: 'shopping-cart-o',url: '/cart',
            },{
                alias: 'ucenter', title: '我的', check_title: '我的', is_show_number: false, number: '',default_image: 'friends-o', selection_image: 'friends-o',url: '/ucenter',
            }]
        }
    },
    actions: {
        setTabs(data) {
            this.tabs = data
        },
    }
})

