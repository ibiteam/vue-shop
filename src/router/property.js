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
    /*优惠券-不可使用*/
    {
        path: '/property/coupon/unchange',
        name: 'couponUnchange',
        component: () => import('@/views/property/coupon/unchange.vue'),
    },
    /*红包*/
    {
        path: '/property/redPack',
        name: 'redPack',
        component: () => import('@/views/property/redPack.vue'),
    },
    /*积分*/
    {
        path: '/property/integral',
        name: 'integral',
        component: () => import('@/views/property/integral.vue'),
    },
    /*余额*/
    {
        path: '/property/balance',
        name: 'balance',
        component: () => import('@/views/property/balance.vue'),
    },
]
export default property
