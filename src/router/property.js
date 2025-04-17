const property = [
    /*优惠券*/
    {
        path: '/property/coupon',
        name: 'coupon',
        component: () => import('@/views/property/coupon/coupon.vue'),
    },
    /*优惠券使用说明*/
    {
        path: '/property/coupon/explain',
        name: 'couponExplain',
        component: () => import('@/views/property/coupon/explain.vue'),
    },
    /*红包*/
    {
        path: '/property/redPack',
        name: 'redPack',
        component: () => import('@/views/property/redPack/redPack.vue'),
    },
    /*红包使用说明*/
    {
        path: '/property/redPack/explain',
        name: 'redPackExplain',
        component: () => import('@/views/property/redPack/explain.vue'),
    },
    /*红包-不可使用*/
    {
        path: '/property/redPack/unchange',
        name: 'redPackUnchange',
        component: () => import('@/views/property/redPack/unchange.vue'),
    },
    /*积分*/
    {
        path: '/property/integral',
        name: 'integral',
        component: () => import('@/views/property/integral/integral.vue'),
    },
]
export default property
