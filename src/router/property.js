const property = [
    /*优惠券*/
    {
        path: '/property/coupon',
        name: 'coupon',
        component: () => import('@/views/property/coupon.vue'),
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
