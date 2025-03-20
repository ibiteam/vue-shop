### 1.项目说明

项目地址：[https://github.com/ibiteam/vue-shop](https://github.com/ibiteam/vue-shop "https://github.com/ibiteam/vue-shop")

演示地址：[https://vue-shop.ptdmeta.cn/](https://vue-shop.ptdmeta.cn/ "https://vue-shop.ptdmeta.cn/")

### 2.开发说明

#### 项目架构
使用vue3组合式写法进行开发 [https://cn.vuejs.org/](https://cn.vuejs.org/)
状态管理使用pinia [https://pinia.vuejs.org/](https://pinia.vuejs.org/)
UI库采用vant4版本 [https://vant-ui.github.io/vant/#/zh-CN/home](https://vant-ui.github.io/vant/#/zh-CN/home)

#### 命名规范

##### 组件/页面 一律使用大驼峰命名 如：Home.vue

##### class命名使用小写字母和“-”中划线命名  如：
```
<div class="home-banner"></div>
```

#### 页面颜色/字体(所有常规色值需要这样写样式，特殊色值除外)，也可对vant组件库的色值进行全局覆盖
```
:root {
  --main-color: #278ff0; // 主色
  --page-bg-color: #f2f2f2; // 空白主背景色
  --red-color: #f71111; // 红色主色
  --color-text: #333; // 常规字体颜色
  --color-text-desc: #999; // 描述性字体颜色
  --base-font-size: 0.24rem; // 基本字体大小，本项目以750设计图分辨率,即 750像素设计图中24px在这用0.24rem转化
}

// 如：
.home-banner{
	color:var(--color-text);
	background:var(--page-bg-color);
}
.home-banner .btn{
	color:var(--main-color);
}
```
也可根据后台配置进行各种色值更换
```
	let root = document.querySelector(":root")
	root.style.setProperty("--main-color", '此处为后端返回色值字段')
	root.style.setProperty("--page-bg-color", '此处为后端返回色值字段')
```
也可对vant组件库的色值进行全局覆盖
```
:root {
	--van-primary-color: #278ff0; // vant组件库的色值进行全局覆盖
}

```
#### 提示框/确认框  使用全局方法，方便整体风格统一
```
<script setup>
	import { getCurrentInstance  } from 'vue'
	const cns = getCurrentInstance().appContext.config.globalProperties

	cns.$dialog.confirm({
		title: '标题',
		message: '内容',
		cancelButtonText: '取消',
		confirmButtonText: '确定'
	}).then(() => {
		console.log('确定')
	}).catch(() => {
		console.log('取消')
	}
</script>
```

#### 接口请求
@/src/api 目录 自定义模块名称
```
import $http from '@/utils/http.js'

export function getHomeData() {
    return $http.doGet('v4/home')
}
```
在页面按需引入即可
```
<script setup>
	import { onMounted } from "vue";
	import { getHomeData } from "@/api/home.js";
	onMounted(() => {
		getHomeData().then(res => {
			console.log(res);
		});
	});
</script>
```

### 3.启动说明
根目录下 .env 文件，可设置网站名称，logo, 接口请求地址，本地运行地址（需配置host）

```
NODE_ENV = 'development'
VITE_APP_CURRENTMODE = 'dev' // 运行环境
VITE_APP_URL = ''  // 接口请求地址
VITE_APP_NAME = '多多商城'  // 网站名称
VITE_APP_LOGO = ''  // 网站logo
```

如有其它需要，可增加变量

安装
```sh
npm install
```
运行
```sh
npm run dev
```
打包
```sh
npm run build
```

运行和打包命令定义,可以自定义环境变量
```
"scripts": {
    "custom": "vite --mode custom",
    "dev": "vite --mode dev",
    "build": "vite build --mode prod"
}
```