const user = [
    /*登录*/
    {
        path: '/login',
        name: 'login',
        component: () => import('@/views/user/Login.vue'),
    },
    /*手机验证码*/
    {
        path: '/phone',
        name: 'phone',
        component: () => import('@/views/user/Phone.vue'),
    },
    /*注册*/
    {
        path: '/register',
        name: 'register',
        component: () => import('@/views/user/Register.vue'),
    },
    /*找回密码/修改密码*/
    {
        path: '/getPassword',
        name: 'getPassword',
        component: () => import('@/views/user/GetPassword.vue')
    },
]
export default user