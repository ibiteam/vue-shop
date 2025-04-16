<template>
	<div class="good-detail" :style="{background: (placeholder ? '#fff' : '#F2F2F2'), height: 'auto',paddingBottom:(!goodsInfo.status)?'0.9rem':0}">
		<template v-if="!goodsInfo.status&&!placeholder">
			<common-header title="商品过期不存在"></common-header>
			<div class="no-data text-center" style="padding-top: 0.5rem;">
				<img src="@/assets/images/good/no-data-shop.png" alt="" style="width: 4rem;">
				<p class="fs26 co-3D text-center" style="position: relative;bottom: 0.6rem;">商品过期不存在</p>
			</div>
			<!--推荐-->
			<div ref="recommendRef">
				<Recommend></Recommend>
			</div>
		</template>
		<template v-else>
			<van-sticky :offset-top="0.05">
				<div class="goods-header s-flex ai-ct jc-bt">
					<em class="iconfont co-333" style="font-size: 21px;" @click="handleBack">&#xe607;</em>
					<div class="view-input s-flex flex-1" @click="clickToSearch()">
						<div class="iconfont" style="font-size: 16px;color: #bbb;">&#xe60a;</div>
						<div style="font-size: 14px;min-width: 4rem;">
							<span style="font-size: 14px;color: #bbb;">请输入关键词搜索</span>
						</div>
					</div>
					<em class="iconfont co-333" style="font-size: 21px;display:block;width: 21px;"></em>
				</div>
			</van-sticky>
			<div class="nav" :style="{opacity: opacity}" v-if="isShowHeader">
				<div class="tabs s-flex jc-ad ai-ct">
					<a href="javascript:" :class="{'active': active=='goods'}" @click="onScrollGoods">
						<span>商品</span>
					</a>
					<a href="javascript:" :class="{'active': active=='comment'}" @click="onScrollComment" v-if="goodsInfo.status==1">
						<span>评价</span>
					</a>
					<a href="javascript:" :class="{'active': active=='detail'}" @click="onScrollDetail" v-if="goodsInfo.status==1">
						<span>详情</span>
					</a>
					<a href="javascript:" :class="{'active': active=='recommend'}"
					   @click="onScrollRecommend">
						<span>推荐</span>
					</a>
				</div>
			</div>
			<template v-if="!placeholder">
				<!--商品-->
				<div class="goods">
					<!--轮播图-->
					<div class="swiper-box">
						<template v-if="banner.video&&banner.video.url&&goodTab == 0">
							<div class="play-btn">
								<img src="@/assets/images/good/good-video-play.png" @click="router.push({name:'goodPlay',query:{url:banner.video.url}})">
							</div>
							<van-image :src="banner.images[0]" v-if="banner&&banner.images.length">
								<template v-slot:loading>
									<img src="@/assets/images/common/no-pic.png" alt="">
								</template>
								<template v-slot:error>
									<img src="@/assets/images/common/no-pic.png" alt="">
								</template>
							</van-image>
						</template>
						<van-swipe :autoplay="3000" indicator-color="black" @change="onChangeSwiper" v-else ref="swiperRef">
							<van-swipe-item v-for="(item, index) in banner.images" :key="index" @click="lookBig(item)">
								<van-image :src="item">
									<template v-slot:loading>
										<img src="@/assets/images/common/no-pic.png" alt="">
									</template>
									<template v-slot:error>
										<img src="@/assets/images/common/no-pic.png" alt="">
									</template>
								</van-image>
							</van-swipe-item>
							<template #indicator>
								<div class="indicator-wrap" v-if="banner.images&&banner.images.length>1">
									<div class="custom-indicator" :class="{'indicator-active':swiperIndex == index}" v-for="(item, index) in banner.images" :key="`swiperIndex-${index}`"></div>
								</div>
							</template>
						</van-swipe>
						<div class="main-btn-wrap">
							<div :class="{active:goodTab == 0}" v-if="banner.video.url" @click="goodTab = 0">视频</div>
							<div :class="{active:goodTab == 1}" @click="changeToImg">图集</div>
						</div>
					</div>
					<div style="position: relative;top: -0.4rem;border-radius: 0.34rem 0.34rem 0 0;overflow: hidden;margin-bottom: -0.4rem;">
						<!--        已删除/已下架        -->
						<div class="price-on-sale-no bg-fff" style="padding: 0.35rem 0.2rem 0.15rem;" v-if="goodsInfo.status==0">暂无报价</div>
						<!--普通商品多规格-->
						<div class="bg-fff" style="padding-bottom: 0.1rem;padding-top: 0.3rem;" v-else="">
							<template v-if="goodsInfo.sku_params&&goodsInfo.sku_params.spec_values.length">
								<skuSelect :list="skuParamList" :mainImg="banner.images[0]" :httpIng="isSkuIng" @select="selectSkuFirst"></skuSelect>
							</template>
							<div style="width: 100%;background: none;padding: 0 0.2rem;">
								<div class="s-flex flex-wrap price-style jc-bt ai-fs">
									<div class="duan s-flex ai-ct">
										<p style="padding: 0;">
											<form-price :price="skuShopPrice.price ? skuShopPrice.price : goodsInfo.price" weight="bold" :sign_size="24" :INT_size="50" :DF_size="28"></form-price>
										</p>
										<template v-if="skuShopPrice.integral || goodsInfo.integral">
											<p class="co-333 fs40" style="margin: 0 0.08rem;"> + </p>
											<span class="co-red fs50 fw-b">{{ skuShopPrice.integral || goodsInfo.integral }}</span>
											<span class="co-333 co-red" style="margin-left: 0.05rem;">{{ shopConfig.integral_name || '积分' }}</span>
										</template>
										<p class="fs24 co-red" style="margin-left: 0.3rem;">{{ goodsInfo.label }}</p>
									</div>
								</div>
							</div>
						</div>
						<div class="shop-box">
							<!--商品名称-->
							<p class="shop-name">{{ goodsInfo.name }}</p>
							<!--副标题-->
							<p class="goods-desc fs24 co-red" v-if="goodsInfo.sub_name">
								{{ goodsInfo.sub_name }}
							</p>
						</div>
					</div>
				</div>
				<div style="padding: 0 0.2rem;" class="border-wrap">
					<!--已选/地址-->
					<section class="MT20 bg-fff goods-other">
						<div class="s-flex ai-ct jc-bt" @click="openSpecCard" v-if="skuParamList.length">
							<template v-if="specName.length">
								<div class="s-flex ai_fs">
									<div class="other-name">已 选</div>
									<div class="other-cont fs26">
										<span v-for="(spec,speci) in specName" class="co-333">{{ spec }}<template v-if="speci<=specName.length-2&&specName.length>1">;</template></span>
									</div>
								</div>
								<div class="s-flex ai-ct">
									<em class="iconfont co-333" style="font-size: 0.28rem;">&#xe773;</em>
								</div>
							</template>
							<template v-else>
								<div class="s-flex ai-ct">
									<div class="other-name">选 择</div>
									<div class="other-cont select fs26 s-flex flex-wrap"
									     style="width: fit-content;height: 0.58rem;overflow: hidden;">
										<span v-for="item in skuParamList[0].values">{{ item.name }}</span>
									</div>
								</div>
								<div class="s-flex ai-ct" style="width: fit-content;">
									<span class="fs24 co-666 MR10" style="white-space: nowrap;" v-if="skuParamList.length">共有{{paramNum }}种{{ skuParamList[0].name }}可选</span>
									<em class="iconfont co-333" style="font-size: 0.28rem;">&#xe773;</em>
								</div>
							</template>
						</div>
						<div class="s-flex ai_fs jc-bt" @click="openSelectAddress">
							<div class="s-flex ai_fs">
								<div class="other-name">配 送</div>
								<div class="other-cont">
									<div class="s-flex ai-ct fs26" style="width: auto;line-height: normal;">
										<img src="@/assets/images/good/location.png" alt="" style="position: relative;top: 0;">
										<span>{{ selectAddress }}</span>
									</div>
								</div>
							</div>
							<div class="s-flex ai-ct">
								<em class="iconfont co-333" style="font-size: 0.28rem;">&#xe773;</em>
							</div>
						</div>
					</section>
				</div>
				<div style="padding: 0 0.2rem;" class="border-wrap">
					<!--评价-->
					<div class="comment MT10 bg-fff" ref="commentRef" id="comment">
						<!--商品评价-->
						<div class="item-tit2 s-flex ai-ct jc-bt" @click="toEvaluate('good')">
							<div class="s-flex ai-ct">
								<div class="co-333 fs32 fw-b">评价({{evaluate.total}})</div>
							</div>
							<div class="co-999 s-flex ai-ct">
								<em class="iconfont co-333" style="font-size: 0.28rem;">&#xe773;</em>
							</div>
						</div>
						<div class="eva-class">
							<span v-for="tag in evaluate.tag_data">{{ tag.name }} <i>{{ tag.value }}</i></span>
						</div>
						<div class="eva-list-wrap" v-if="evaluate.items.length">
							<div class="eva-list" v-for="(item,index) in evaluate.items" :style="{borderBottom: 'none'}">
								<div class="users s-flex jc-bt ai-ct">
									<div class="user-left s-flex ai-ct">
										<div style="width:0.66rem;height:0.66rem;border-radius:100%;border:0.02rem solid #E5E5E5;overflow: hidden;margin-right: 0.14rem;" class="s-flex ai-ct jc-ct">
											<img class="user-img" :src="item.avatar" alt="">
										</div>
										<div>
											<span class="user-name fs28 co-333" style="margin-bottom: 0.06rem;display: inline-block;">{{item.nickname }}<i class="fs28 co-999" style="font-style: normal;" v-if="item.is_anonymous">(匿名）</i></span>
											<shop-rate :rank="item.rank"></shop-rate>
										</div>
									</div>
								</div>
								<div class="content fs28 co-333" style="line-height: 0.4rem;padding: 0.1rem 0;word-break: break-all;">
									{{ item.content }}
								</div>
								<div class="img-box s-flex flex-wrap" v-if="item.images.length">
									<van-image
										width="2.18rem"
										height="2.18rem"
										v-for="(childItem,childIndex) in item.images"
										:key="`${index}_${childIndex}`"
										:src="childItem"
										@click="lookBigImg(item, childIndex)"
									></van-image>
								</div>
							</div>
						</div>
						<p class="fs24 co-666 text-center" v-else style="padding: 5px 0 20px;">暂无评价</p>
					</div>
				</div>
				<div style="padding: 0 0.2rem;" class="border-wrap">
					<template v-if="goodsInfo.status">
						<div class="good-attr attr-title">
							<p>商品详情</p>
						</div>
						<div class="good-attr bg-fff" style="padding-bottom: 0.26rem;" v-if="goodsAttr && goodsAttr.length>0">
							<h4 class="fs32 co-333 fw-b" style="padding: 0.3rem 0 0.2rem;">产品参数</h4>
							<div style="padding-bottom: 0.1rem;">
								<p v-for="item in goodsAttr"><span>{{ item.name }}</span>{{ item.value }}</p>
							</div>
							<div class="more-attr s-flex jc-ct" v-if="goodsAttr.length>8">
								<div class="fs28 co-333" @click="openPopup('propPopup')">更多详细参数<em class="iconfont co-999" style="font-size: 0.26rem;">&#xe773;</em></div>
							</div>
						</div>
						<div class="detail MT10 bg-fff" ref="detailRef" id="detail">
							<div class="content">
								<div class="goods-attr-last vhtml" v-html="goodsInfo.content" style="padding: 0.3rem 0;"></div>
							</div>
						</div>
					</template>
					<template v-if="!goodsInfo.status">
						<div class="goods-gray MT10">商品已下架</div>
					</template>
				</div>
				<!--推荐-->
				<div ref="recommendRef">
					<Recommend ></Recommend>
				</div>
				<!--底部菜单-->
				<footer class="breathe">
					<section class="footer-menu s-flex">
						<div class="s-flex bg-fff" style="width: 3.36rem;">
							<div class="openShop flex-1 s-flex flex-dir ai-ct jc-ct breathe" @click="attention">
								<div>
									<img src="@/assets/images/good/attention.png" alt="" style="width: 0.4rem;" v-if="isAttention">
									<img src="@/assets/images/good/attention-no.png" alt="" style="width: 0.4rem;" v-else>
								</div>
								<p class="co-333 fs24">{{ isAttention ? '收藏' : '收藏' }}</p>
							</div>

							<a @click="goChat()" class="attention flex-1 s-flex flex-dir ai-ct jc-ct breathe">
								<div><img class="footer-icon2" src="@/assets/images/good/good-service.png"/></div>
								<p class="co-333 fs24">客服</p>
							</a>
							<div class="shop-car flex-1 s-flex flex-dir ai-ct jc-ct breathe" @click="toCart">
								<div style="position: relative;">
									<img class="footer-icon3" src="@/assets/images/good/good-car.png"/>
									<span v-if="!!carNum" class="car-num fs20">{{ carNum }}</span>
								</div>
								<p class="co-333 fs24">购物车</p>
							</div>
						</div>
						<div class="buying-box s-flex ai-ct jc-ct flex-1">
							<div class="breathe" v-if="goodsInfo.status == 0">
								<div class="sell-out fs32 buying fw-b">
									已下架
								</div>
							</div>
							<div class="breathe" v-else-if="goodsInfo.total == 0">
								<div class="sell-out fs32 buying fw-b">
									已售罄
								</div>
							</div>
							<div v-else class="s-flex breathe">
								<div class="add-car fs32 buying MR10" @click="setShoppingCard(2)">
									<span class="fs32 fw-b">加入购物车</span>
								</div>
								<div class="to-buy fs32 buying" @click="setShoppingCard(1)">
									<span class="fs32 fw-b">立即购买</span>
								</div>
							</div>
						</div>
					</section>
				</footer>
			</template>
			<template v-else>
				<div style="width:7.5rem;background:#fff;border:1px solid transparent;box-sizing: border-box;margin-bottom:-0.2rem">
					<img src="@/assets/images/common/no-pic.png" alt="" style="width: 7.1rem;height:7.1rem;margin: 0.2rem auto;border-radius: 4px;display: block">
					<div style="width:2.1rem;height:0.4rem;margin: 0.3rem;background:#F8F8F8;border-radius: 4px;"></div>
					<div style="width:6.1rem;height:0.4rem;margin: 0.3rem;background:#F8F8F8;border-radius: 4px;"></div>
					<div style="width:5.1rem;height:0.4rem;margin: 0.3rem;background:#F8F8F8;border-radius: 4px;"></div>
					<div style="width:2.1rem;height:0.4rem;margin: 0.3rem;background:#F8F8F8;border-radius: 4px;"></div>
					<div style="width:6.1rem;height:0.4rem;margin: 0.3rem;background:#F8F8F8;border-radius: 4px;"></div>
					<div style="width:5.1rem;height:0.4rem;margin: 0.3rem;background:#F8F8F8;border-radius: 4px;"></div>
				</div>
				<footer class="breathe">
					<section class="footer-menu flex">
						<div class="s-flex bg-fff" style="width: 3.36rem;">
							<div class="openShop flex-1 s-flex flex-dir ai-ct jc-ct breathe">
								<div>
									<img src="@/assets/images/good/attention-no.png" alt="" style="width: 0.4rem;">
								</div>
								<p class="co-333 fs24">收藏</p>
							</div>
							<a class="attention flex-1 s-flex flex-dir ai-ct jc-ct breathe">
								<div><img class="footer-icon2"
								          src="@/assets/images/good/good-service.png"/></div>
								<p class="co-333 fs24">客服</p>
							</a>
							<div class="shop-car flex-1 s-flex flex-dir ai-ct jc-ct breathe">
								<div>
									<img class="footer-icon3"
									     src="@/assets/images/good/good-car.png"/>
								</div>
								<p class="co-333 fs24">购物车</p>
							</div>
						</div>
						<div class="buying-box s-flex ai-ct flex-1 jc-ct">
							<div class="breathe s-flex">
								<div class="add-car fs32 buying MR10 buying09">
									<span class="fs32 fw-b">加入购物车</span>
								</div>
								<div class="to-buy fs32 buying buying09">
									<span class="fs32 fw-b">立即购买</span>
								</div>
							</div>
						</div>
					</section>
				</footer>
			</template>
		</template>
		<!--购物弹框-->
		<ShoppingCard
			:chooseAttrs="chooseAttr"
			:addressId="addressId"
			:goodsInfo="goodsInfo"
			:mainImg="banner.images&&banner.images[0]"
			:shoppingType="shoppingType"
			:initFlag="initFlag"
			:isSelectSpec="isSelectSpec"
			:sku_id="skuId"
			:skuShopPrice="skuShopPrice"
			:skuParamList="skuParamList"
			@closeChooseAttr="closeChooseAttrFun"
			@changeCar="changeCar"
			@selectSku="selectSku"
			@unusual="unusual"
		></ShoppingCard>
		<!--大图查看-->
		<van-image-preview v-model:show="showPreviewer" :startPosition="startIndex" :images="imgUrlBig" :showIndex="showIndex"></van-image-preview>
		<van-popup
			v-model:show="propPopup"
			round
			position="bottom"
			:close-on-click-overlay="false"
			duration="0.5"
			:style="{ 'max-height': '10.12rem','min-height': '5rem', overflow: 'hidden', 'padding-bottom': 'constant(safe-area-inset-bottom)','padding-bottom': 'env(safe-area-inset-bottom)'}">
			<div class="card-wrap" style="padding-top: 1.3rem;max-height: 10.12rem;overflow-y: auto;">
				<div class="close-btn" @click="propPopup = false">
					<i class="iconfont">&#xea13;</i>
				</div>
				<div class="goods-popup-title">
					<h3>产品参数</h3>
				</div>
				<div class="prop-cont" v-if="goodsAttr">
					<div class="s-flex ai-fs" v-for="item in goodsAttr">
						<span class="fs26 co-999">{{ item.name }}</span>
						<p class="co-333 fs26">{{ item.value }}</p>
					</div>
				</div>
			</div>
		</van-popup>
		<AddressListPopup v-model:show="selectAddressPopup" :addressId="addressId" @changeAddress="changeAddress"></AddressListPopup>
	</div>
</template>

<script setup>
import {ref, watch, onMounted, onBeforeUnmount, nextTick, getCurrentInstance, inject} from 'vue'
import {useRoute, useRouter} from 'vue-router'

import {useGoodStore} from "@/stores";
import {getGoodData, goodsCollect, updateSku} from '@/api/good'
import { getChatUrl } from '@/api/common'
import { isSuccessCode, isUnLoginCode } from "@/utils/constant.js";
import $ from 'jquery'
import ShoppingCard from '@/components/shoppingCard/ShoppingCard'
import AddressListPopup from "@/components/common/AddressListPopup.vue";
import Recommend from "@/components/recommend/Recommend.vue";
import skuSelect from './SkuSelect.vue'
import shopRate from './ShopRate.vue'
const cns = getCurrentInstance().appContext.config.globalProperties
const route = useRoute()
const router = useRouter()
const goodStore = useGoodStore()
const shopConfig = inject('shopConfig')

const swiperRef = ref(null)
const recommendRef = ref(null)
const detailRef = ref(null)
const commentRef = ref(null)
// 响应式数据
const banner = ref({})
const evaluate = ref({
	items: [],
	tag_data: []
})

const selectAddressPopup = ref(false)
const selectAddress = ref('选择收货地址')
const addressId = ref('')

const changeAddress = (item) => {
	addressId.value = item.id
	selectAddress.value = `${item.province} ${item.city} ${item.district}`
}
const goodTab = ref(1)
const swiperIndex = ref(0)
const fromPath = ref('')
const goodsNo = ref('')
const opacity = ref(0)
const active = ref('good')
const nodata = ref(false)
const goodsInfo = ref({})
const isAttention = ref(false)
const shoppingType = ref(-1)
const carNum = ref(0)
const chooseAttr = ref(false)
const goodsAttr = ref({})
const initFlag = ref(0)
const placeholder = ref(true)
const showPreviewer = ref(false)
const startIndex = ref(0)
const showIndex = ref(false)
const imgUrlBig = ref([])
const isShowHeader = ref(true)

const isSelectSpec = ref(false)
const paramNum = ref(0)
const skuParamList = ref([])
const specId = ref([])
const specName = ref([])
const skuShopPrice = ref({
	price:'',
	integral:''
})
const skuId = ref('')
const isSkuIng = ref(false)
const propPopup = ref(false)


const toEvaluate = (type)=> {
	cns.appRoute('evaluate', {'no': goodsNo.value })
}

const selectSku = ({item, skuParamListProp, specNameProp, specIdProp}) => {
	if (item) {
		updateSkuFirst(item, skuParamListProp, specNameProp, specIdProp)
	}
}

const updateSkuFirst = (item, skuParamListProp, specNameProp, specIdProp) => {
	skuParamList.value = [...skuParamListProp]
	specName.value = [...specNameProp]
	specId.value = [...specIdProp]
	skuShopPrice.value.price = item.price
	skuShopPrice.value.integral = item.integral
}

const selectSkuFirst = (item)=>{
	skuParamList.value.forEach((sku,i) => {
		if(i == 0){
			sku.values.forEach((spec, j) => {
				if (spec.id == item.id) {
					spec.selected = true
				} else {
					spec.selected = false
				}
			})
		}
	})
	specName.value[0] = item.name
	specId.value[0] = item.id
	updateSku({no: goodsInfo.value.no, unique: specId.value.join('_')}).then((res) => {
		if (isSuccessCode(res)) {
			skuShopPrice.value.price = res.data.price
			skuShopPrice.value.integral = res.data.integral
			skuId.value = res.data.id
		} else {
			cns.$toast(res.message)
			isSkuIng.value = false
		}
	})
}
const clickToSearch = () => {
	cns.appRoute('search_history', {placeholder: ''})
}

const openPopup = (type, data) => {
	propPopup.value = type === 'propPopup'
}

const lookBigImg = (item, idx) => {
	startIndex.value = idx
	imgUrlBig.value = item.images
	showPreviewer.value = true
}

const changeToImg = () => {
	goodTab.value = 1
	nextTick(() => {
		swiperRef.value.swipeTo({index: 0})
		swiperIndex.value = 0
	})
}

const onChangeSwiper = (index) => {
	swiperIndex.value = index
}

const handleBack = () => {
	router.back(-1)
}

const lookBig = (url) => {
	imgUrlBig.value = banner.value.images
	startIndex.value = imgUrlBig.value.findIndex(item => item === url)
	showIndex.value = true
	showPreviewer.value = true
}

const handleScroll = () => {
	// 获取当前的滚动距离
	let scrollTopVal = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
	if (scrollTopVal < 200) {
		opacity.value = scrollTopVal / 200
		active.value = 'goods'
	} else {
		opacity.value = 1
	}

	// 当滚动距离不小于200时，获取三个部分的顶部位置-44
	let commentTop = commentRef.value && commentRef.value.offsetTop - 44
	let detailTop = detailRef.value && detailRef.value.offsetTop - 44
	let recommendTop = recommendRef.value && recommendRef.value.offsetTop - 44
	let recommendHeight = recommendRef.value && recommendRef.value.offsetHeight

	// 计算滚动距离在哪个区间，修改active.value对应的样式名
	if (scrollTopVal < commentTop) {
		if (active.value != 'goods') active.value = 'goods'
	} else if (scrollTopVal >= commentTop && scrollTopVal < detailTop) {
		if (active.value != 'comment') active.value = 'comment'
	} else if (scrollTopVal >= detailTop && scrollTopVal < recommendTop) {
		if (active.value != 'detail') active.value = 'detail'
	} else if (scrollTopVal >= recommendTop) {
		if (active.value != 'recommend') active.value = 'recommend'
	}
}

const onScrollGoods = () => {
	window.scrollTo({top: 0, behavior: "smooth"})
}

const onScrollComment = () => {
	if (!opacity.value) return
	window.scrollTo({top: commentRef.value.offsetTop - 44, behavior: "smooth"})
}

const onScrollDetail = () => {
	if (!opacity.value) return
	window.scrollTo({top: detailRef.value.offsetTop - 44, behavior: "smooth"})
}

const onScrollRecommend = () => {
	if (!opacity.value) return
	window.scrollTo({top: recommendRef.value.offsetTop - 44, behavior: "smooth"})
}

const attention = () => {
	goodsCollect({no: goodsInfo.value.no, value: !isAttention.value}).then((res) => {
		if (isSuccessCode(res)) {
			isAttention.value = !isAttention.value
			cns.$toast(res.message)
		} else if (isUnLoginCode(res)) {
			cns.appRoute('login', {}, 'replace')
		} else {
			cns.$toast(res.message)
		}
	})
}

const closeChooseAttrFun = (data) => {
	chooseAttr.value = false
	shoppingType.value = 1
	if (isSelectSpec.value) {
		specName.value = data.specName
	}
}

const openSpecCard = () => {
	cns.$public.checkUserLogin().then((value) => {
		if(value){
			initFlag.value++
			isSelectSpec.value = true
			chooseAttr.value = true
		}else {
			cns.appRoute('login')
		}
	})
}

const setShoppingCard = (type) => {
	cns.$public.checkUserLogin().then((value) => {
		if(value){
			isSelectSpec.value = false
			shoppingType.value = type
			initFlag.value++
			chooseAttr.value = true
		}else {
			cns.appRoute('login')
		}
	})
}
const changeCar = (e) => {
	carNum.value = e
}

const unusual = () => {
	initFlag.value = 0
	goodStore.setBuyNumber(1)
	getData()
}
const toCart = () => {
	cns.appRoute('cart', {hasBack: true})
}

const goChat = (type) => {
	getChatUrl({no: goodsNo.value, source_url: window.location.href}).then(res=>{
		if (isSuccessCode(res)&&res.data.url){
			window.location.href = res.data.url
		}else {
			cns.$toast(res.message)
		}
	})
}

const detailBig = () => {
	$('.goods-attr-last').on('click', 'img', function () {
		let arr = []
		arr.push($(this).attr('src'))
		imgUrlBig.value = arr
		startIndex.value = 0
		showIndex.value = false
		showPreviewer.value = true
	})
	$('.goods-attr-sale').on('click', 'img', function () {
		let arr = []
		arr.push($(this).attr('src'))
		imgUrlBig.value = arr
		startIndex.value = 0
		showIndex.value = false
		showPreviewer.value = true
	})
}

const getData = () => {
	getGoodData(goodsNo.value, skuId.value).then((res) => {
		if (isSuccessCode(res)) {
			placeholder.value = false
			banner.value = res.data.banner
			/**商品信息**/
			goodsInfo.value = res.data.center
			evaluate.value = res.data.center.evaluate
			skuParamList.value = res.data.center.sku_params ? res.data.center.sku_params.spec_values : []
			if (skuParamList.value.length) {
				paramNum.value = 1
				skuId.value = res.data.center.sku_params.sku_item.id
				skuShopPrice.value.price = res.data.center.sku_params.sku_item.price || ''
				skuShopPrice.value.integral = res.data.center.sku_params.sku_item.integral || ''
			}
			skuParamList.value.length && skuParamList.value.forEach((d, i) => {
				d.values.forEach(s => {
					if (s.selected) {
						specName.value.push(s.name)
						specId.value.push(s.id)
					}
				})
				if (d.values.length && i == 0) {
					paramNum.value = d.values.length
				}
			})

			if (res.data.banner.video.url) {
				goodTab.value = 0
			}
			/**规格参数**/
			goodsAttr.value = res.data.center.parameters
			/**购物车数量**/
			carNum.value = res.data.bottom.cart_number

			// 是否关注
			isAttention.value = res.data.bottom.can_collect

			nextTick(() => {

				if ($(".goods-attr-last [style]")) {
					$(".goods-attr-last [style]").css('position', 'static')
					$(".goods-attr-last [style]").css('z-index', 0)
				}
				// 设置商品介绍的图片样式
				if ($("p:has(img)").length > 0) {
					$("p:has(img)").css({'font-size': '0', 'line-height': 'unset'})
				}

				// 查看大图
				detailBig()
				// 滚到顶
				window.scrollTo({top: 0})
			})
		} else {
			placeholder.value = false
			goodsInfo.value = {}
			goodsAttr.value = []
			carNum.value = 0

			nextTick(() => {
				// 滚到顶
				window.scrollTo({top: 0})
			})
		}
	})
}

const openSelectAddress = () => {
	selectAddressPopup.value = true
}

onMounted(() => {
	goodsNo.value = route.query.goods_no
	skuId.value = route.query.sku_id
	// 如果从新增收货地址来的，则打开选择收货地址
	if (fromPath.value.name == 'addressForm') {
		openSelectAddress()
	}
	// 初始化
	getData()
	// 绑定滚动事件
	window.addEventListener('scroll', handleScroll)
})
watch(
	() => route.query.goods_no,
	() => {
		window.location.reload()
	},
	{ immediate: false }
);
onBeforeUnmount(() => {
	goodStore.setBuyNumber(1)
})

router.beforeEach((to, from, next) => {
	fromPath.value = from
	next()
})
</script>

<style scoped lang="scss">
.good-detail{
	width: 7.5rem;
	margin: 0 auto;
	background: #F8F8F8;
	//overflow-x: hidden;
	.nav {
		position: fixed;
		top: 0.98rem;
		width: 7.5rem;
		height: 0.8rem;
		background: rgba(255, 255, 255, 1);
		opacity: 0;
		z-index: 1000;
		display: flex;
		justify-content: space-between;
		align-items: center;
		.tabs {
			width: 100%;
			padding: 0 0.44rem;
			height: 100%;
			a {
				height: 0.8rem;
				line-height: 0.8rem;
				display: block;
				flex: 1;
				text-align: center;
				span {
					color: #999;
					font-size: 0.30rem;
				}
				&.active {
					position: relative;
					span {
						color: #333;
						font-weight: 600;
					}
					&:after {
						content: '';
						width: 1rem;
						height: 0.04rem;
						background: #333;
						position: absolute;
						bottom: 0.025rem;
						left: 0;
						right: 0;
						margin: auto;
						border-radius: 0.04rem;
					}
				}
			}
		}
	}
	.card-wrap {
		padding: 0 0.2rem;
		width: 100%;
		height: 100%;
		box-sizing: border-box;
		.prop-cont {
			padding: 0 0.4rem;

			div {
				margin-bottom: 0.2rem;
				line-height: 0.36rem;
			}

			span {
				display: inline-block;
				width: 8em;
				flex: none;
			}
		}

		.close-btn {
			i {
				font-size: 0.28rem;
				color: #999;
				font-weight: bold;
			}

			.co-000 {
				color: #000;
			}

			position: absolute;
			right: 0.4rem;
			top: 0.44rem;
			z-index: 9999;
		}
	}
	.good-attr{
		& > div{
			p {
				line-height: 0.36rem;
				font-size: 0.28rem;
				color: #333;
				padding: 0.12rem 0;
				display: flex;
				align-items: flex-start;
			}
			span {
				line-height: 0.36rem;
				font-size: 0.28rem;
				color: #999;
				width: 1.7rem;
				text-align: left;
				display: inline-block;
			}
		}
		.more-attr > div {
			width: 2.5rem;
			height: 0.6rem;
			background: #F3F3F3;
			border-radius: 0.3rem;
			line-height: 0.6rem;
			text-align: center;
			color: #333;
			font-size: 0.28rem;
		}
		&.attr-title {
			position: relative;
			padding: 0.4rem 0 0.4rem !important;
			text-align: center;
			color: #666;
			font-size: 0.32rem;
			&:after {
				content: '';
				position: absolute;
				left: 2rem;
				top: 0;
				bottom: 0;
				margin: auto;
				width: 0.6rem;
				height: 0.02rem;
				background: linear-gradient(297deg, #666666 0%, rgba(153, 153, 153, 0.2) 100%)
			}
			&:before {
				content: '';
				position: absolute;
				right: 2rem;
				top: 0;
				bottom: 0;
				margin: auto;
				width: 0.6rem;
				height: 0.02rem;
				background: linear-gradient(-297deg, #666666 0%, rgba(153, 153, 153, 0.2) 100%)
			}
		}
	}
	.comment{
		.eva-list-wrap {
			.eva-list {
				border-bottom: 1px solid #E5E5E5;
				padding-bottom: 0.3rem;
				padding-top: 0.3rem;
				&:first-of-type{
					padding-top: 0.2rem;
				}
				:deep(.van-image) {
					border-radius: 0.2rem;
					overflow: hidden;
					margin-right: 0.06rem;
					margin-bottom: 0.06rem;
				}
				.img-box :deep(.van-image:nth-of-type(3n+3)) {
					margin-right: 0;
				}
				.user-img {
					max-width: 100%;
					max-height: 100%;
				}

			}
		}
		.eva-class {
			span {
				height: 0.5rem;
				border-radius: 0.25rem;
				line-height: 0.5rem;
				padding: 0 0.2rem;
				font-size: 0.24rem;
				background: #FDEFEF;
				color: var(--red-color);
				display: inline-block;
				margin-right: 0.2rem;
				margin-bottom: 0.1rem;

				i {
					font-style: normal;
					color: var(--red-color);
				}
			}
		}
	}
	:deep(.van-image img) {
		width: 100%;
		height: 100%;
	}
	.goods-other {
		padding: 0.1rem 0.2rem !important;
		line-height: 0.4rem;
		& > div {
			padding: 0.2rem 0;
			line-height: 0.4rem;
		}
		.other-name {
			color: #666;
			font-size: 0.26rem;
			margin-right: 0.3rem;
			width: 2.4em;
			flex: none;
		}
		.other-cont {
			color: #333;
			font-size: 0.26rem;
			width: 5.4rem;
			img {
				width: 0.34rem;
				height: 0.34rem;
				margin-right: 0.08rem;
				position: relative;
				top: -1px;
			}
			.s-flex {
				width: 50%;
				margin-top: 0.06rem;
				&:first-of-type {
					margin-top: 0;
				}
			}
			&.select span {
				padding: 0 0.1rem;
				height: 0.58rem;
				line-height: 0.58rem;
				background: #F8F8F8;
				border-radius: 0.1rem;
				font-size: 0.26rem;
				color: #666;
				display: inline-block;
				margin-right: 0.1rem;
			}
		}
	}
	.border-wrap{
		& > div, & > section{
			border-radius: 0.2rem;
			overflow: hidden;
			padding: 0 0.2rem;
		}
	}
	.goods-header {
		background: #fff;
		height: 0.98rem;
		padding: 0 0.2rem;
		.view-input {
			height: 0.6rem;
			width: 6rem;
			line-height: 0.6rem;
			padding: 0 0.2rem;
			background-color: #F4F4F4;
			border-radius: 0.3rem;
			font-size: 0.28rem;
			color: #9C9C9C;
			flex: none;
			.iconfont {
				margin-right: 0.24rem;
			}
		}
	}
	.price-on-sale-no {
		line-height: 0.5rem;
		color: #333;
		font-size: 0.40rem;
		font-weight: bold;
	}
	.goods-gray {
		line-height: 0.9rem;
		font-size: 0.28rem;
		text-align: center;
		font-weight: 600;
		color: #999;
		height: 0.9rem;
		background: #EAEAEA;
		position: fixed;
		bottom: 1.28rem;
		left: 0;
		width: 100%;
		z-index: 111;
		box-sizing: border-box;
		border-radius: 0 !important;
	}
	.goods{
		width: 100%;
		.swiper-box{
			width: 7.5rem;
			height: 7.5rem;
			background: #fff;
			position: relative;
			/*视频播放按钮*/
			.main-btn-wrap {
				position: absolute;
				display: flex;
				align-items: center;
				justify-content: center;
				left: 0;
				right: 0;
				margin: auto;
				bottom: 1.15rem;
				background: rgba(0, 0, 0, 0.3);
				height: 0.6rem;
				border-radius: 0.3rem;
				z-index: 0;
				width: fit-content;

				> div {
					border-radius: 0.3rem;
					padding: 0 0.3rem;
					height: 0.6rem;
					line-height: 0.6rem;
					color: #fff;
					font-size: 0.28rem;
				}

				> div.active {
					background: rgba(0, 0, 0, 0.6);
					font-weight: 600;
					padding: 0 0.4rem;
				}
			}
			.van-swipe {
				width: 100%;
				height: 7.5rem;
			}
			.play-btn {
				position: absolute;
				width: 1.6rem;
				height: 1.6rem;

				img {
					width: 100%;
					height: 100%;
				}

				left: 0;
				top: 0;
				bottom: 0;
				right: 0;
				margin: auto;
				z-index: 2;
			}
			.indicator-wrap {
				position: absolute;
				bottom: 0.7rem;
				width: 100%;
				display: flex;
				align-items: center;
				justify-content: center;

				.custom-indicator {
					width: 0.9rem;
					height: 0.08rem;
					background: rgba(255, 255, 255, 0.2);
					border-radius: 0.04rem;
					margin: 0 0.15rem;
					position: relative;
				}

				.custom-indicator.indicator-active:after {
					content: '';
					width: 0;
					height: 0.08rem;
					background: rgba(0, 0, 0, 0.7);
					border-radius: 0.04rem;
					position: absolute;
					left: 0;
					top: 0;
					animation: aniswipergoods 3s linear;
				}
			}
			:deep(.van-swipe-item) {
				display: flex;
				align-items: center;
				justify-content: center;
			}
			:deep(.van-image) {
				width: 100%;
				height: 100%;
			}
			:deep(.van-image__img) {
				width: 100%;
				height: 100%;
				position: absolute;
				left: 50%;
				top: 50%;
				transform: translate(-50%, -50%);
			}
		}
	}
	.shop-box {
		background: #fff;
		padding: 0 0.2rem 0.28rem;
		/*商品名称*/
		.shop-name {
			font-size: 0.32rem;
			line-height: 0.38rem;
			color: #3d3d3d;
			padding-top: 0.3rem;
			font-weight: bold;
		}
		.goods-desc {
			color: var(--red-color);
			font-size: 0.24rem;
			line-height: 0.36rem;
			padding-top: 0.1rem;
		}
	}
	.price-style{
		 p.co-red {
			 height: .4rem;
			 line-height: .4rem;
			 background: #feecec;
			 border-radius: .08rem;
			 font-size: .22rem;
			 color: var(--red-color);
			 padding: 0 .15rem;
			 display: inline-block;
			 width: fit-content;
			 opacity: 1;
			 margin-top: .1rem;
		 }
	}
	.item-tit2 {
		padding: 0.26rem 0;
	}
	.detail {
		padding: 0 0.2rem 0.2rem;
		.goods-attr-last {
			width: 100%;
			overflow: hidden;

			:deep(p) {
				font-size: 0.28rem;
				line-height: 0.5rem;
			}
		}

		.goods-attr-sale {
			:deep(p) {
				font-size: 0.28rem;
				line-height: 0.5rem;
			}
		}
		.content :deep(table){
			width: 100% !important;
		}

		.content :deep(img) {
			max-width: 7.1rem;
			height: auto;
		}

		:deep(.vhtml *) {
			width: 100% !important;
			box-sizing: border-box !important;
		}

	}
	/*底部*/
	footer {
		width: 100%;
		height: 1.24rem;
		box-sizing: content-box;
		margin-top: 0.2rem;
		.footer-menu {
			width: 100%;
			max-width: 750px;
			background-color: #ffffff;
			position: fixed;
			bottom: 0;
			left: 50%;
			transform: translateX(-50%);
			z-index: 10;
			padding: 0.24rem 0;
			.footer-icon2 {
				width: auto;
				height: 0.36rem;
				margin-bottom: 0.1rem;
			}

			.footer-icon3 {
				width: auto;
				height: 0.36rem;
				margin-bottom: 0.1rem;
			}
			.shop-car{
				position: relative;
				.car-num {
					position: absolute;
					height: 0.24rem;
					padding: 0 0.1rem;
					border: 1px solid var(--red-color);
					top: -0.1rem;
					left: 50%;
					border-radius: 0.12rem;
					color: var(--red-color);
					line-height: 0.24rem;
					z-index: 10;
					background: #fff;
				}
			}
			.buying-box{
				padding-right: 0.1rem;
				.buying {
					width: 2.1rem;
					height: 0.8rem;
					display: flex;
					justify-content: center;
					align-items: center;
					flex-direction: column;
					border-radius: 0.4rem;
				}
				.buying09 {
					opacity: 0.9;
					cursor: not-allowed;

					span {
						color: rgba(255, 255, 255, 0.3);
					}
				}
				.add-car {
					background: linear-gradient(270deg, #FACB37 0%, #FACB37 100%);
					color: #ffffff;
				}
				.to-buy {
					background: var((--red-color));
					color: #ffffff;
				}
				.sell-out {
					color: var(--color-text-desc);
					background-color: #cccccc;
					width: 3.4rem;
				}

			}
		}
	}
}

/*轮播图片样式*/
@keyframes aniswipergoods {
	0% {
		width: 0;
	}
	100% {
		width: 0.9rem;
	}
}
</style>