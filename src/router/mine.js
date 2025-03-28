const mine = [
    // 收货地址-列表
    {
        path: '/address',
        name: 'address',
        component: () => import('@/views/address/List.vue')
    },
    // 收货地址-表单
    {
        path: '/address/:id',
        name: 'addressForm',
        component: () => import('@/views/address/Form.vue')
    },
    // 商品收藏
    {
        path: '/attention',
        name: 'attention',
        component: () => import('@/views/attention/attention.vue')
    },
    // 浏览记录
    {
        path: '/record',
        name: 'record',
        component: () => import('@/views/record/record.vue')
    },
]
export default mine
