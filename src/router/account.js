const user = [
    /*用户信息*/
    {
        path: '/account/userInfo',
        name: 'userInfo',
        component: () => import('@/views/account/UserInfo.vue'),
    },
    /*用户设置*/
    {
        path: '/account/Set',
        name: 'set',
        component: () => import('@/views/account/Set.vue'),
    },
    /*账户安全*/
    {
        path: '/account/security',
        name: 'security',
        component: () => import('@/views/account/Security.vue'),
    },
    /*意见反馈*/
    {
        path: '/account/feedback',
        name: 'feedback',
        component: () => import('@/views/account/Feedback.vue'),
    },
]
export default user
