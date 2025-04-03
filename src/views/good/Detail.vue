<template>
	<div class="good-detail" :style="{background: (placeholder ? '#fff' : '#F2F2F2'), height: 'auto',paddingBottom:(!goodsInfo.status)?'0.9rem':0}">
		<template v-if="!goodsInfo.status&&!placeholder">
			<common-header title="商品过期不存在"></common-header>
			<div class="no-data text-center" style="padding-top: 0.5rem;">
				<img src="@/assets/images/good/no-data-shop.png" alt="" style="width: 4rem;">
				<p class="fs26 co-3D text-center" style="position: relative;bottom: 0.6rem;">商品过期不存在</p>
			</div>
			<div style="padding: 0 0.2rem;" class="border-wrap">
				<!--推荐-->
				<div class="recommend" ref="recommendRef" id="recommend" style="padding: 0;">
					<div class="item-tit2 s-flex ai-ct jc-bt" v-if="recommend&&recommend.length > 0">
						<div class="s-flex ai-ct">
							<span class="tit-sign" style="width: 0.08rem;height: 0.3rem;background: linear-gradient(270deg, #F64651 0%, var(--red-color) 99%);margin-right: 0.1rem;border-radius: 0.04rem;"></span>
							<div class="co-333 fs32 fw-b">为您推荐</div>
						</div>
					</div>
					<div class="recommend-box s-flex flex-wrap" style="padding: 0;">
						<div class="recommend-item" v-for="(item, index) in recommend" :key="index"
						     style="border-radius: 0.2rem;overflow: hidden;" @click="reToDetail(item)">
							<div class="recommend-item-img">
								<van-image :src="item.thumb" class="re-img">
									<template v-slot:loading>
										<img src="@/assets/images/common/no-pic.png" alt="" class="re-img">
									</template>
									<template v-slot:error>
										<img src="@/assets/images/common/no-pic.png" alt=""
										     class="re-img">
									</template>
								</van-image>
							</div>
							<div class="MT10" style="padding: 0 0.15rem;">
								<div class="item-name fs26 co-333 elli-2">
									{{ item.goods_name }}
								</div>
								<div style="margin-bottom: 0.14rem;" class="s-flex ai-ct jc-bt">
									<form-price :price="item.price" :unit="item.unit" unit_color="#333" weight="bold"></form-price>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</template>
		<template v-else>
			<van-sticky :offset-top="0.05">
				<div class="goods-header s-flex ai-ct jc-bt">
					<em class="iconfont co-333" style="font-size: 21px;" @click="handleBack">&#xe605;</em>
					<div class="view-input s-flex flex-1">
						<div class="iconfont" style="font-size: 16px;color: #bbb;">&#xe7c3;</div>
						<div style="font-size: 14px;min-width: 4rem;" v-if="searchWordList.length">
							<swiper ref="mySwiper" :options="swiperOptions" style="height: 0.6rem;">
								<swiper-slide v-for="(item,index) in searchWordList" :key="`kb${index}`">
									<span style="font-size: 14px;color: #333;" @click="clickKeywords(item)">{{ item.keywords }}</span>
								</swiper-slide>
							</swiper>
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
						<!--普通商品多规格-非拼团-->
						<div class="bg-fff" style="padding-bottom: 0.1rem;padding-top: 0.3rem;" v-else="">
							<template v-if="goodsInfo.sku_params&&goodsInfo.sku_params.spec_values.length">
								<skuSelect :list="skuParamList" :mainImg="banner.images[0]" :httpIng="isSkuIng" @select="selectSkuFirst"></skuSelect>
							</template>
							<div class="bg-pink price-ladder new" style="width: 100%;background: none;padding: 0 0.2rem;">
								<div class="s-flex flex-wrap ladder-style jc-bt ai-fs">
									<div class="duan s-flex ai-ct">
										<p style="padding: 0;">
											<form-price :price="skuShopPrice.price ? skuShopPrice.price : goodsInfo.price" weight="bold" :sign_size="24" :INT_size="50" :DF_size="28"></form-price>
										</p>
										<template v-if="skuShopPrice.integral || goodsInfo.integral">
											<p class="co-333 fs40" style="margin: 0 0.08rem;"> + </p>
											<span class="co-red fs50 fw-b">{{ skuShopPrice.integral || goodsInfo.integral }}</span>
											<span class="co-333 co-red" style="margin-left: 0.05rem;">{{ goodsInfo.integral_name || '积分' }}</span>
										</template>
										<p class="fs24 co-red" style="margin-left: 0.3rem;">{{ goodsInfo.label }}</p>
									</div>
								</div>
							</div>
						</div>
						<div class="shop-box">
							<!--优惠券新-->
							<div class="coupon_box s-flex ai-ct fs20" @click="couponPopup=true" v-if="couponList.length&&goodsInfo.status">
								<div class="flex-1 elli-1 flex-wrap" style="overflow: hidden;">
									<span class="coupon elli-1" style="color: var(--red-color);">优惠券</span>
								</div>
								<span class="get-more">详情<i></i></span>
							</div>
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
					<!--已选/地址/物流/服务-->
					<section class="MT10 bg-fff goods-other">
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
						<div class="s-flex ai_fs jc-bt" @click="changeAddress">
							<div class="s-flex ai_fs">
								<div class="other-name">配 送</div>
								<div class="other-cont">
									<div class="s-flex ai-ct fs26" style="width: auto;line-height: normal;">
										<img src="@/assets/images/good/location.png" alt="" style="position: relative;top: 0;">
										<span>{{ limitAddress }} 地址</span>
									</div>
								</div>
							</div>
							<div class="s-flex ai-ct">
								<em class="iconfont co-333" style="font-size: 0.28rem;">&#xe773;</em>
							</div>
						</div>
					</section>
				</div>
				<div style="padding: 0 0.2rem;" class="border-wrap" v-if="evaluate.items.length">
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
						<div class="eva-list-wrap">
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
					</div>
				</div>
				<div style="padding: 0 0.2rem;" class="border-wrap">
					<template v-if="goodsInfo.status">
						<div class="good-attr attr-title">
							<p>商品详情</p>
						</div>
						<div class="good-attr bg-fff" style="padding-bottom: 0.26rem;">
							<h4 class="fs32 co-333 fw-b" style="padding: 0.3rem 0 0.2rem;">产品参数</h4>
							<div style="padding-bottom: 0.1rem;" v-if="goodsAttr && goodsAttr.length>0">
								<p v-for="item in goodsAttr"><span>{{ item.name }}</span>{{ item.value }}</p>
							</div>
							<div class="more-attr s-flex jc-ct">
								<div class="fs28 co-333" @click="openPopup('propPopup')">更多详细参数<em class="iconfont co-999" style="font-size: 0.26rem;">&#xe773;</em></div>
							</div>
						</div>
						<div class="detail MT10 bg-fff" ref="detailRef" id="detail">
							<div class="content">
								<div class="goods-attr-last vhtml" v-html="goodsInfo.content" style="padding: 0.3rem 0;"></div>
							</div>
						</div>
						<div class="detail MT10 bg-fff" style="padding: 0.2rem;">
							<div class="content">
								<!--售后服务-->
								<div class="MT10 bg-fff customer-service">
									<p class="co-333 fs32 MB20" style="font-weight: bold">售后保障</p>
									<div v-if="!goodsInfo.customer_service" class="fs24">暂无数据</div>
									<div class='fs24 vhtml goods-attr-sale' v-else v-html="goodsInfo.customer_service"></div>
								</div>
							</div>
						</div>
					</template>
					<template v-if="!goodsInfo.status">
						<div class="goods-gray MT10">商品已下架</div>
					</template>
					<!--推荐-->
					<div class="recommend" ref="recommendRef" id="recommend" style="padding: 0;">
						<div class="item-tit2 s-flex ai-ct jc-bt" v-if="recommend&&recommend.length > 0">
							<div class="s-flex ai-ct">
								<span class="tit-sign"
								      style="width: 0.08rem;height: 0.3rem;background: linear-gradient(270deg, #F64651 0%, var(--red-color) 99%);margin-right: 0.1rem;border-radius: 0.04rem;"></span>
								<div class="co-333 fs32 fw-b">为您推荐</div>
							</div>
						</div>
						<div class="recommend-box s-flex flex-wrap" style="padding: 0;">
							<div class="recommend-item" v-for="(item, index) in recommend" :key="index" style="border-radius: 0.2rem;overflow: hidden;" @click="reToDetail(item)">
								<div class="recommend-item-img">
									<van-image :src="item.thumb" class="re-img">
										<template v-slot:loading>
											<img src="@/assets/images/common/no-pic.png" alt="" class="re-img">
										</template>
										<template v-slot:error>
											<img src="@/assets/images/common/no-pic.png" alt="" class="re-img">
										</template>
									</van-image>
								</div>
								<div class="MT10" style="padding: 0 0.15rem;">
									<div class="item-name fs26 co-333 elli-2">
										{{ item.goods_name }}
									</div>
									<div style="margin-bottom: 0.14rem;" class="s-flex ai-ct jc-bt">
										<form-price :price="item.price" :unit="item.unit" unit_color="#333" weight="bold"></form-price>
									</div>
								</div>
							</div>
						</div>
					</div>
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
								<p class="co-333 fs24">{{ isAttention ? '取消收藏' : '收藏' }}</p>
							</div>

							<a @click="showChatActionFunc('shop')" class="attention flex-1 s-flex flex-dir ai-ct jc-ct breathe">
								<div><img class="footer-icon2" src="@/assets/images/good/good-service.png"/></div>
								<p class="co-333 fs24">客服</p>
							</a>
							<div class="shop_car flex-1 s-flex flex-dir ai-ct jc-ct breathe" @click="toCart">
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
				<van-action-sheet
					v-model:show="showChatAction"
					:actions="chatActions"
					cancel-text="取消"
					close-on-click-action
					@select="clickOnlineCustomerServer"
				></van-action-sheet>
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
								<div><img class="footer-icon1"
								          src="@/assets/images/good/shop.png"/></div>
								<p class="co-333 fs24">进店</p>
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
		<shoppingCard
			:chooseAttrs="chooseAttr"
			:addressId="pageInfo.address_id"
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
		></shoppingCard>
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
		<!--领取优惠券-->
		<div class="coupon" v-if="couponPopup">
			<van-popup
				v-model:show="couponPopup"
				round
				position="bottom"
				:close-on-click-overlay="false"
				:style="{ 'max-height': '10.12rem','min-height': '5rem', overflow: 'hidden', 'padding-bottom': 'constant(safe-area-inset-bottom)','padding-bottom': 'env(safe-area-inset-bottom)'}">
				<div style="padding-top: 1.3rem;max-height: 10.12rem;overflow-y: auto;">
					<div class="close-btn" @click="couponPopup = false">
						<i class="iconfont">&#xea13;</i>
					</div>
					<div class="goods-popup-title">
						<h3>优惠券</h3>
					</div>
					<div style="max-height:8.8rem;overflow-y:auto;">
						<p class="co-333 fs30 ML20 s-flex ai-ct" style="line-height: 1;margin-bottom: 0.3rem;font-size: 0.3rem;" v-if="couponList&&couponList.length"><img src="@/assets/images/good/new-coupon-title.png" alt="" style="width: 0.33rem;margin-right: 0.1rem;">可领取优惠券</p>
						<div class="list_box" style="padding: 0 0.4rem 0.3rem;">
							<div class="coupon_list" :class="[item.show_limit? 'coupon-mit' : '']" v-for="(item,index) in couponList">
								<div class="s-flex ai-ct jc-bt">
									<div class="s-flex ai-ct jc-ct flex-wrap"
									     style="width: 2.1rem;padding: 0.33rem 0;flex: none;">
										<div style="width: 100%;line-height: 0.45rem;" class="s-flex jc-ct">
											<form-price :price="item.money" color="#E12A61" sign_size="20" INT_size="50" DF_size="24" class="elli-1" style="max-width: 3.5rem;"></form-price>
										</div>
										<div style="width: 100%;line-height: 0.3rem;" class="s-flex jc-ct">
											<span style="color: #E12A61;" class="fs20">{{ item.desc }}</span>
										</div>
									</div>
									<div style="padding: 0 0.2rem;width: 4.6rem;" class="s-flex ai-ct jc-bt">
										<div style="padding: 0.3rem 0 0.2rem;line-height: 0.4rem;">
											<h4 class="elli-1 fs24 fw-b" style="color: #E12A61;">{{ item.name }}</h4>
											<p class="fs20 co-999" v-if="item.end_time&&item.start_time">{{ item.start_time }} - {{ item.end_time }}</p>
											<!--<p class="fs20 co-666 s-flex ai-ct" v-if="item.limit_info&&item.limit_info.length" @click="changeShowInfo(index)">-->
											<!--	详细信息-->
											<!--	<em class="iconfont" v-if="!item.show_limit">&#xe67a;</em>-->
											<!--	<em class="iconfont" v-else>&#xe61e;</em>-->
											<!--</p>-->
										</div>
										<div>
											<span class="coupon-btn" v-if="!item.max_limit" @click="getCoupon(item)">点击领取</span>
											<span class="coupon-btn can-use" v-else @click="goUrl(item.btn.url)">去使用</span>
										</div>
									</div>
								</div>
								<!--<div class="fs20 co-999" style="padding: 0.2rem 0.24rem;line-height: 0.26rem;" v-if="item.show_limit&&item.limit_info&&item.limit_info.length">-->
								<!--	<p v-for="info in item.limit_info" class="fs20 co-999 elli-1">{{ info }}</p>-->
								<!--</div>-->
							</div>
						</div>
					</div>
				</div>
			</van-popup>
		</div>
		<!--收货地址 -->
		<div class="coupon" v-if="addressPopup">
			<van-popup
				v-model:show="addressPopup"
				round
				position="bottom"
				:close-on-click-overlay="false"
			>
				<div class="close-btn" @click="addressPopup = false">
					<i class="iconfont">&#xea13;</i>
				</div>
				<div style="padding-top: 1.08rem;max-height: 11.12rem;overflow-y: auto;background: #FAFAFA;">
					<div class="goods-popup-title address-title" style="background: #fff;z-index:9998;">
						<h3>配送至</h3>
					</div>
					<div style="padding: 0.25rem 0.4rem 0.4rem;">
						<p class="fs28 co-666 MB30" style="line-height: 1;">当前配送至</p>
						<h4 class="fs28 co-333 MB30 fw-b" style="line-height: 1;">{{ limitAddress }}</h4>
						<h4 class="fs28 co-666" style="line-height: 1;">从我的收货地址选择</h4>
					</div>
					<div class="list_box address-list" style="padding: 0 0.2rem;">
						<div class="list">
							<div class="list-item" v-for="(item, index) in addressList" :key="index"
							     :class="{ active: item.select }">
								<div class="s-flex ai-ct" @click="clickAddressBack(item.address_id)"
								     style="border-bottom: 1px solid #D8D8D8;padding-bottom: 0.2rem;height: 1.6rem;box-sizing:border-box;">
									<div class="s-flex flex-1 ai-ct">
										<div class="address-info flex-1">
											<p class="elli-2">
												{{ item.province }}{{ item.city }}{{ item.district }}
												{{ item.address }}</p>
											<div class="address-name s-flex">
												<label class="elli-1">{{ item.consignee }}</label>
												<span>{{ item.mobile.substr(0, 3) + '****' + item.mobile.substr(7) }}</span>
											</div>
										</div>
									</div>
									<div style="width: 0.3rem;flex: none;">
										<img style="width: 0.26rem;height: 0.19rem;"
										     src="@/assets/images/good/address-select-g.png"
										     alt="" v-if="pageInfo.address_id == item.address_id">
									</div>
								</div>
								<div class="s-flex ai-ct jc-bt">
									<div class="s-flex ai-ct">
										<template v-if="item.used">
											<img style="width: 0.3rem;height: 0.3rem;margin-right: 0.15rem;"
											     src="@/assets/images/good/select.png" alt=""
											     v-if="pageInfo.address_id == item.address_id">
											<span class="fs26 co-red">已设为默认</span>
										</template>
									</div>
									<div class="address-btn-contrl s-flex jc-fe" style="line-height: 0.78rem;">
										<span @click="clickDeleteAddress(item,index)">删除</span>
										<span
											@click="router.push({ name: 'address_add', query: { address_id: item.address_id, type: 'edit', tag: item.address_type } })">修改</span>
									</div>
								</div>

							</div>
						</div>
						<div class="nodata" v-if="nodata">
							<img src="@/assets/images/address/nodata.png" alt="">
							<p>您还没有地址，快来添加吧～</p>
						</div>
						<div class="address-btn">
							<router-link :to="{ name: 'address_add', query: { type: 'add' } }"
							             class="address-add s-flex jc-ct">新增收货地址
							</router-link>
						</div>
					</div>
				</div>
			</van-popup>
			<van-popup v-model="showRemove" :close-on-click-overlay="false">
				<div class="choose-add-address choose-remove-address">
					<div class="view-h1">确定要删除地址吗？</div>
					<div class="s-flex ai-ct">
						<div class="choose-item s-flex ai-ct jc-ct"
						     @click="showRemove = false, removeAddressId = null">取消
						</div>
						<div class="choose-item primary s-flex ai-ct jc-ct" @click="clickAddOrRemoveAddressSure"
						     data-type="add">删除
						</div>
					</div>
				</div>
			</van-popup>
		</div>
	</div>
</template>

<script setup>
import {ref, reactive, onMounted, onBeforeUnmount, nextTick, getCurrentInstance } from 'vue'
import {useRoute, useRouter} from 'vue-router'
import {useGoodStore} from "@/stores";
import { getGoodData, goodsCollect } from '@/api/good'
import $ from 'jquery'
import shoppingCard from '@/components/shoppingCard/shoppingCard'
import { Swiper, SwiperSlide } from 'swiper/vue';
import skuSelect from './SkuSelect.vue'
import shopRate from './ShopRate.vue'
const cns = getCurrentInstance().appContext.config.globalProperties
const route = useRoute()
const router = useRouter()
const goodStore = useGoodStore()

const swiperRef = ref(null)
const recommendRef = ref(null)
const detailRef = ref(null)
const commentRef = ref(null)
// 响应式数据
const searchWordList = ref([])
const swiperOptions = reactive({
	direction: 'vertical',
	slidesPerView: 1,
	loop: true,
	autoplay: {
		delay: 5000
	},
	on: {
		click: function () {
			const realIndex = this.realIndex
			clickKeywords(searchWordList.value[realIndex])
		}
	}
})
const banner = ref({})
const evaluate = ref({
	items: [],
	tag_data: []
})
const showRemove = ref(false)
const removeAddressId = ref(null)
const goodTab = ref(1)
const swiperIndex = ref(0)
const fromPath = ref('')
const goodsNo = ref(7419)
const opacity = ref(0)
const active = ref('good')
const nodata = ref(false)
const goodsInfo = ref({})
const isAttention = ref(false)
const couponList = ref([])
const addressPopup = ref(false)
const couponPopup = ref(false)
const shoppingType = ref(-1)
const carNum = ref(0)
const chooseAttr = ref(false)
const goodsAttr = ref({})
const recommend = ref([])
const recommendTitle = ref('')
const bottomlineRecommend = ref(false)
const pageRecommend = ref(1)
const initFlag = ref(0)
const placeholder = ref(true)
const loadRecommend = ref(true)
const showPreviewer = ref(false)
const startIndex = ref(0)
const showIndex = ref(false)
const imgUrlBig = ref([])
const isShowHeader = ref(true)
const addressList = ref([])
const pageInfo = ref({})
const limitAddress = ref('')
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
const chatType = ref('shop')
const showChatAction = ref(false)
const chatActions = ref([])
const propPopup = ref(false)

const toEvaluate = (type)=> {
	cns.appRoute('evaluate', {}, {'no': goodsNo, type})
}
// 方法
const changeShowInfo = (index) => {
	let data = couponList.value[index]
	data.show_limit = !data.show_limit
	couponList.value[index] = data
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
}
const clickKeywords = (item) => {
	cns.appRoute('search_history', {placeholder: item.keywords, url: item.url})
}

const clickDeleteAddress = (item, index) => {
	showRemove.value = true
	removeAddressId.value = item.address_id
}

const clickAddOrRemoveAddressSure = () => {
	cns.$http.postNotLoading('v3/address/delete', {address_id: removeAddressId.value}).then(res => {
		if (res.code == 200) {
			const index = addressList.value.findIndex(item => item.address_id == removeAddressId.value)
			addressList.value.splice(index, 1)
			showRemove.value = false
			cns.$toast('删除成功')
			if (pageInfo.value.address_id == removeAddressId.value) {
				pageInfo.value.address_id = ''
			}
			removeAddressId.value = null
		} else {
			cns.$toast(res.message)
		}
	})
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

const clickAddressBack = (address_id) => {
	if (pageInfo.value.address_id == address_id) {
		return
	}
	addressPopup.value = false
	pageInfo.value.address_id = address_id
	addressList.value.forEach((item, index) => {
		item.select = false
		if (item.address_id == address_id) {
			item.select = true
		}
	})
}

const changeAddress = () => {
	cns.$http.doPost("v3/address/list", {}).then(res => {
		addressPopup.value = true
		if (res.code == 200) {
			if (res.data.length > 0) {
				addressList.value = res.data
				nodata.value = false
			} else {
				addressList.value = []
				nodata.value = true
			}
		} else if (res.code == 403) {
			cns.appRoute('login', {}, 'replace')
		} else {
			cns.$toast(res.message)
		}
	})
}

const lookBig = (url) => {
	imgUrlBig.value = banner.value.images
	startIndex.value = imgUrlBig.value.findIndex(item => item === url)
	showIndex.value = true
	showPreviewer.value = true
}

const goUrl = (url) => {
	if (!url) {
		return
	}
	window.location.href = url
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

	//if (loadRecommend.value && scrollTopVal > recommendTop - window.innerHeight - 100 + recommendHeight && !bottomlineRecommend.value) {
	//	loadRecommend.value = false
	//	getZhiRecommend()
	//}
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
	if (!recommend.value.length) {
		onScrollDetail()
		active.value = 'detail'
		return
	}
	window.scrollTo({top: recommendRef.value.offsetTop - 44, behavior: "smooth"})
}

const attention = () => {
	goodsCollect({no: goodsInfo.value.goods_no, value: !isAttention.value}).then((res) => {
		if (res.code == 200) {
			isAttention.value = !isAttention.value
			cns.$toast(res.message)
		} else if (res.code == 403) {
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
	loadRecommend.value = true
	goodStore.setBuyNumber(-1)
	getData()
}
const reToDetail = (data) => {
	cns.appRoute('good', {goods_no: data.goods_no})
}
const toCart = () => {
	cns.appRoute('cart', {hasBack: true})
}

const getCoupon = (item) => {
	cns.$http.doPost('v3/usercoupon/add', {id: item.coupon_id})
		.then((res) => {
			if (res.code == 200) {
				cns.$toast('领取成功！')
				item.max_limit = !!res.data.status
				item.btn.url = res.data.searchUrl
			} else if (res.code == 403) {
				cns.appRoute('login')
			} else {
				cns.$toast(res.message)
			}
		})
}

//const getZhiRecommend = () => {
//	cns.$http.doGet('v4/goods/hotSale', {goods_no: goodsNo.value, page: pageRecommend.value}).then(res => {
//		if (res.code == 200) {
//			if (pageRecommend.value == 1) {
//				recommend.value = res.data.data
//				recommendTitle.value = res.data.title
//			} else {
//				recommend.value.push(...res.data.data)
//			}
//			if (res.data.on_last_page) {
//				bottomlineRecommend.value = true
//			} else {
//				bottomlineRecommend.value = false
//			}
//			nextTick(() => {
//				loadRecommend.value = true
//			})
//			pageRecommend.value++
//		} else {
//			bottomlineRecommend.value = true
//			cns.$toast(res.message)
//		}
//	})
//}

const showChatActionFunc = (type) => {
	if (type == 'shop') {
		chatActions.value = [
			{name: '010-6668888'}
		]
	}
	chatType.value = type
	showChatAction.value = true
}

const clickOnlineCustomerServer = (action, index) => {
	cns.$dialog.alert({
		title: '热线电话',
		message: '010-6668888',
	}).then(() => {
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
		if (res.code == 200) {
			placeholder.value = false
			// searchWordList.value = res.data.header.search_word_list
			//if (searchWordList.value.length && searchWordList.value.length == 1) {
			//	swiperOptions.loop = false
			//	swiperOptions.autoplay = false
			//}
			banner.value = res.data.banner

			recommend.value = res.data.center.recommend
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
			/**优惠券**/
			couponList.value = res.data.center.coupon_list || []
			couponList.value.length && couponList.value.forEach((d, i) => {
				d.show_limit = false
			})
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
			//if (goodsInfo.value.status == 0) {
			//	loadRecommend.value = false
			//	getZhiRecommend()
			//}
		}else {
			placeholder.value = false
			goodsInfo.value = {}
			couponList.value = []
			goodsAttr.value = []
			carNum.value = 0
			recommend.value = []

			nextTick(() => {
				// 滚到顶
				window.scrollTo({top: 0})
			})
		}
	})
}

onMounted(() => {
	goodsNo.value = route.query.goods_no
	skuId.value = route.query.sku_id
	// 如果从新增收货地址来的，则打开选择收货地址
	if (fromPath.value == 'address_add') {
		changeAddress()
	}
	// 初始化
	getData()
	// 绑定滚动事件
	window.addEventListener('scroll', handleScroll)
	// 小程序环境不显示头
})

onBeforeUnmount(() => {
	goodStore.setBuyNumber(-1)
})

router.beforeEach((to, from, next) => {
	fromPath.value = from
	next()
})
</script>

<style scoped lang="scss">
.have-em :deep(em) {
	color: var(--red-color);
	font-size: 0.24rem;
	font-style: normal;
}

.choose-add-address {
	width: 6.10rem;
	padding: 0.40rem 0.95rem 0.50rem 0.95rem;
	border-radius: 0.30rem;
}

.choose-add-address .view-h1 {
	margin-bottom: 0.20rem;
	text-align: center;
	font-size: 0.30rem;
}

.choose-add-address .choose-item {
	width: 4.43rem;
	height: 0.88rem;
	line-height: 0.88rem;
	margin: 0.30rem 0;
	border: 1px solid var(--color-text-desc);
	border-radius: 0.44rem;
}

.choose-add-address .choose-item.primary {
	background: linear-gradient(to right, #FF0000, #FF7979);
	border: none;
	color: #ffffff;
}

.choose-add-address .choose-item .iconfont {
	font-size: 0.50rem;
	color: #0ABC64;
}

.choose-add-address .choose-item .import-text {
	margin-left: 0.14rem;
	font-size: 0.30rem;
}

.choose-add-address .choose-item.primary .import-text {
	margin-left: 0;
}

.choose-remove-address {
	padding: 0.40rem 0.40rem 0.30rem 0.40rem;
}

.choose-remove-address .choose-item {
	height: 0.84rem;
	line-height: 0.84rem;
}

.choose-remove-address .choose-item.primary {
	height: 0.88rem;
	margin-left: 0.36rem;
}

.choose-remove-address .view-h1 {
	margin-bottom: 0.50rem;
}

.address-btn-contrl span {
	margin-left: 0.5rem;
	padding: 0 0.1rem;
	color: #999;
	font-size: 0.26rem;
}

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

.coupon-btn {
	display: inline-block;
	width: 1.3rem;
	height: 0.5rem;
	line-height: 0.5rem;
	text-align: center;
	color: #fff;
	background: linear-gradient(-270deg, #FFA494 0%, #FF3250 100%);
	border-radius: 0.25rem;
	font-size: 0.20rem;
	cursor: pointer;
	padding: 0;
	box-sizing: border-box;
}

.coupon-btn.can-use {
	background: none;
	color: #E12A61;
	border: 1px solid #E12A61;
	line-height: 0.48rem;
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

.goods-popup-title {
	text-align: center;
	position: absolute;
	left: 0;
	top: 0;
	width: 7.5rem;
	padding: 0.4rem 0;
	background: #fff;

	h3 {
		font-size: 0.32rem;
		font-weight: bold;
	}
}

.address-title {
	text-align: left;
	padding: 0.4rem 0.4rem 0.28rem;
	box-sizing: border-box;

	h3 {
		line-height: 0.4rem;
	}
}

.service-title {
	text-align: center;
	padding-top: 0.4rem;
	margin-bottom: 0.3rem;

	h3 {
		font-size: 0.42rem;
		font-weight: bold;
		color: #9E4C0A;
		font-family: HelloFont WenYiHei-Regular, HelloFont WenYiHei;
		margin-bottom: 0.1rem;
	}

	p {
		color: #9E4C0A;
		font-size: 0.24rem;
	}
}

.service-cont {
	padding: 0.3rem 0.3rem;
	border-radius: 0.3rem;
	background: #fff;
	width: 7.1rem;
	box-sizing: border-box;
}

.service-cont > div {
	padding-left: 0.4rem;
	position: relative;
	margin-bottom: 0.3rem;
}

.service-cont > div:last-of-type {
	margin-bottom: 0;
}

.service-cont > div > p {
	font-size: 0.28rem;
	color: #999;
	line-height: 0.4rem;
}

.service-cont > div > h4 {
	font-size: 0.32rem;
	color: #333;
	font-weight: 600;
	line-height: 0.36rem;
	margin-bottom: 0.2rem;
}

.service-cont > div > img {
	width: 0.3rem;
	height: 0.32rem;
	position: absolute;
	left: 0;
	top: 0.02rem;
}

.card-wrap {
	padding: 0 0.2rem;
	width: 100%;
	height: 100%;
	box-sizing: border-box;
}

.coupon-wrap .coupon-item {
	padding: 0 0.25rem 0 0.11rem;
	color: #E12A61;
	width: 2.8rem;
	height: 1.4rem;
	margin-right: 0.2rem;
	flex: none;
	background: url("@/assets/images/good/coupon-no.png") no-repeat center;
	background-size: 100% 100%;
	box-sizing: border-box;
}

.coupon-wrap .coupon-item.active {
	background: url("@/assets/images/good/coupon-have.png") no-repeat center;
	background-size: 100% 100%;
}

.coupon-wrap::-webkit-scrollbar {
	height: 0; /* 横向滚动条高度 */
}

.coupon-wrap::-webkit-scrollbar-thumb {
	background: #fff;
	border-radius: 0;
}

.coupon-wrap::-webkit-scrollbar-track {
	background: #fff;
	border-radius: 0;
}

.coupon-wrap::-webkit-scrollbar-thumb:horizontal {
	background: #fff; /* 横向滚动条thumb颜色 */
}

.container::-webkit-scrollbar-track:horizontal {
	background: #fff; /* 横向滚动条轨道颜色 */
}

.coupon-wrap {
	display: flex;
	flex-wrap: nowrap;
	overflow: auto;
}

.coupon-wrap .coupon-item:last-of-type {
	margin-right: 0;
}

.coupon-wrap .coupon-item p {
	font-size: 0.2rem;
	line-height: 0.28rem;
	margin-bottom: 0.07rem;
}

.coupon-wrap .coupon-item h6 {
	font-size: 0.2rem;
	padding-top: 0.06rem;
	display: inline-block;
	margin-bottom: 0.04rem;
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

.good-attr > div p {
	line-height: 0.36rem;
	font-size: 0.28rem;
	color: #333;
	padding: 0.12rem 0;
	display: flex;
	align-items: flex-start;
}

.good-attr > div span {
	line-height: 0.36rem;
	font-size: 0.28rem;
	color: #999;
	width: 1.7rem;
	text-align: left;
	display: inline-block;
}

.attr-title {
	position: relative;
	padding: 0.4rem 0 0.4rem !important;
	text-align: center;
	color: #666;
	font-size: 0.32rem;
}

.attr-title:after {
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

.attr-title:before {
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

.store-recomend :deep(.van-swipe__indicator) {
	height: 0.08rem;
	width: 0.08rem;
	background: #E2E2E2;
}

.store-recomend :deep(.van-swipe__indicator--active) {
	width: 0.16rem !important;
	background: linear-gradient(180deg, #FA5F5F 0%, var(--red-color) 98%);
}

.store-recomend :deep(.van-swipe__indicators) {
	bottom: 0.1rem;
}

.store-prop {
	padding-top: 0.2rem;
}

.store-prop > div {
	line-height: 0.38rem;
	margin-bottom: 0.1rem;
}

.store-prop > div:last-of-type {
	margin-bottom: 0;
}

.store-prop > div span img {
	height: 0.24rem;
	width: auto;
	margin-right: 0.1rem;
	position: relative;
	top: 0.03rem;
}

.store-prop > div span {
	width: 1.4rem;
	text-align: left;
	color: #999;
	font-size: 0.26rem;
	display: inline-block;
	flex: none;
	margin-right: 0.16rem;
}

.eva-list {
	border-bottom: 1px solid #E5E5E5;
	padding-bottom: 0.3rem;
	padding-top: 0.3rem;
}

.eva-list-wrap .eva-list:first-of-type {
	padding-top: 0.2rem;
}

.eva-list :deep(.van-image) {
	border-radius: 0.2rem;
	overflow: hidden;
	margin-right: 0.06rem;
	margin-bottom: 0.06rem;
}

:deep(.van-image img) {
	width: 100%;
	height: 100%;
}

.eva-list .img-box :deep(.van-image:nth-of-type(3n+3)) {
	margin-right: 0;
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
.user-img {
	max-width: 100%;
	max-height: 100%;
}

.goods-other {
	padding: 0.1rem 0.2rem !important;
	line-height: 0.4rem;
}

.goods-other > div {
	padding: 0.2rem 0;
	line-height: 0.4rem;
}

.goods-other .other-name {
	color: #666;
	font-size: 0.26rem;
	margin-right: 0.3rem;
	width: 2.4em;
	flex: none;
}

.goods-other .other-cont {
	color: #333;
	font-size: 0.26rem;
	width: 5.4rem;
}

.goods-other .other-cont.select span {
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

.goods-other .other-cont img {
	width: 0.34rem;
	height: 0.34rem;
	margin-right: 0.08rem;
	position: relative;
	top: -1px;
}

.goods-other .other-cont .s-flex {
	width: 50%;
	margin-top: 0.06rem;
}

.goods-other .other-cont .s-flex:first-of-type {
	margin-top: 0;
}

.border-wrap > div {
	border-radius: 0.2rem;
	overflow: hidden;
	padding: 0 0.2rem;
}

.border-wrap > section {
	border-radius: 0.2rem;
	overflow: hidden;
	padding: 0 0.2rem;
}

.goods-header {
	background: #fff;
	height: 0.98rem;
	padding: 0 0.2rem;
}

.goods-header .view-input {
	height: 0.6rem;
	width: 6rem;
	line-height: 0.6rem;
	padding: 0 0.2rem;
	background-color: #F4F4F4;
	border-radius: 0.3rem;
	font-size: 0.28rem;
	color: #9C9C9C;
	flex: none;
}

.goods-header .view-input .iconfont {
	margin-right: 0.24rem;
}

.address-list {
	padding-bottom: 1.2rem !important;

	.nodata {
		width: 5.3rem;
		margin: 1rem auto;
		text-align: center;
	}

	.nodata img {
		width: 5.3rem;
		height: 3rem;
	}

	.nodata p {
		margin-top: 0.7rem;
		font-size: 0.26rem;
		color: #666666;
	}

	.list .list-item {
		width: 100%;
		height: 2.78rem;
		background: #FFFFFF;
		border-radius: 0.2rem;
		margin-bottom: 0.2rem;
		padding: 0.3rem 0.2rem 0.1rem;
		box-sizing: border-box;

		&:last-of-type {
			border-bottom: none;
		}
	}

	.list .list-item .address-icon {
		line-height: 1rem;
		padding: 0 0.1rem;
		margin-right: 0.15rem;
		position: relative;
		text-align: center;
	}

	.list .list-item .address-icon em {
		font-size: 0.36rem;
		color: var(--red-color);
	}

	.list .list-item :deep(.van-button) {
		height: 100%;
	}

	.list .list-item :deep(.default.van-button .van-button__text) {
		color: #333333;
	}

	.list .list-item .address-info {
		max-width: 6rem;
	}

	.list .list-item .address-info p {
		line-height: 0.36rem;
		font-size: 0.30rem;
		color: #333;
		margin-bottom: 0.24rem;
		padding: 0 0.1rem;
	}

	.list .list-item .address-info .address-name {
		line-height: 0.5rem;
		align-items: center;
		padding: 0 0.1rem;
		width: 100%;
	}

	.list .list-item .address-info .address-name label {
		color: #333;
	}

	.list .list-item .address-info .address-name label,
	.list .list-item .address-info .address-name span {
		font-size: 0.28rem;
	}

	.list .list-item .address-info .address-name span {
		margin-left: 0.2rem;
		color: #999;
	}

	.list .list-item .address-edit {
		line-height: 1rem;
		padding: 0 0.3rem;
		font-size: 0.28rem;
		color: #333333;
	}

	:deep(.van-cell) {
		padding: 5px 10px 5px 0;
	}

	:deep(.van-swipe-cell) {
		z-index: -1;
	}

	.address-add {
		width: 4rem;
		height: 0.80rem;
		margin: 0 auto;
		line-height: 0.80rem;
		text-align: center;
		background: linear-gradient(to right, var(--red-color), #FA5F5F);
		border-radius: 0.6rem;
		font-size: 0.32rem;
		font-weight: bold;
		color: #ffffff;
	}

	.address-btn {
		width: 100%;
		padding-bottom: constant(safe-area-inset-bottom);
		padding-bottom: env(safe-area-inset-bottom);
		position: fixed;
		left: 50%;
		bottom: 0;
		transform: translate(-50%);
		height: 1.2rem;
		padding-top: 0.16rem;
		box-sizing: border-box;
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

.goods-alone {
	line-height: 0.9rem;
	font-size: 0.28rem;
	text-align: center;
	font-weight: 600;
	color: var(--red-color);
	height: 0.9rem;
	background: #FFF4EF;
	position: fixed;
	bottom: 1.28rem;
	left: 0;
	width: 100%;
	z-index: 111;
	box-sizing: border-box;
	border-radius: 0 !important;
}


.good-detail {
	width: 7.5rem;
	margin: 0 auto;
	background: #F8F8F8;
	overflow-x: hidden;
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

.h-img {
	height: 100%;
}

.w-img {
	width: 100%;
}

.swiper-box .play-btn {
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

.swiper-box .indicator-wrap {
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

.swiper-box :deep(.van-swipe-item) {
	display: flex;
	align-items: center;
	justify-content: center;
}

.swiper-box :deep(.van-image) {
	width: 100%;
	height: 100%;
}

.swiper-box :deep(.van-image__img) {
	width: 100%;
	height: 100%;
	position: absolute;
	left: 50%;
	top: 50%;
	transform: translate(-50%, -50%);
}

.swiper-box :deep(.van-image.h-img img) {
	height: 100%;
}

.swiper-box :deep(.van-image.w-img img) {
	width: 100%;
}

/*头*/
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
}

.tabs {
	width: 100%;
	padding: 0 0.44rem;
	height: 100%;
}

.tabs a {
	height: 0.8rem;
	line-height: 0.8rem;
	display: block;
	flex: 1;
	text-align: center;
}

.tabs a span {
	color: #999;
	font-size: 0.30rem;
}

.tabs a.active {
	position: relative;
}

.tabs a.active:after {
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

.tabs a.active span {
	color: #333;
	font-weight: 600;
}

/*轮播图*/
.goods {
	width: 100%;
}

.swiper-box {
	width: 7.5rem;
	height: 7.5rem;
	background: #fff;
	position: relative;
}

.swiper-box .van-swipe {
	width: 100%;
	height: 7.5rem;
}

.bg-pink {
	background-color: #fee8ed;
	padding: 0.12rem;
}

.bg-pink.price-ladder.new {
	background: #fff;
	border-radius: 0;
	color: #ffffff;
	padding: 0.3rem 0.2rem 0.3rem;
}

.price-ladder .duan p {
	padding: 0.06rem 0;
}

.price-ladder .ladder-style p.co-red {
	height: 0.4rem;
	line-height: 0.4rem;
	background: #FEECEC;
	border-radius: 0.08rem;
	font-size: 0.22rem;
	color: var(--red-color);
	padding: 0 0.15rem;
	display: inline-block;
	width: fit-content;
	opacity: 1;
	margin-top: 0.1rem;
}

.shop-box {
	background: #fff;
	padding: 0 0.2rem 0.28rem;
}


/*自营/商家直营*/
.small-fun {
	padding: 0 0.20rem 0 0;
	height: 0.5rem;
	background: #F0F0F0;
	border-radius: 0.08rem;
	width: fit-content;
}

.is-ziying {
	line-height: 0.5rem;
	font-size: 0.24rem;
	min-width: 0.7rem;
	height: 0.5rem;
	color: #ffffff;
	text-align: center;
	display: inline-block;
	background: linear-gradient(-90deg, #FA5F5F 0%, var(--red-color) 100%);
	border-radius: 0.08rem;
	padding: 0 0.1rem;
	margin: 0 0.2rem 0 0;
}

.is-ziying.def {
	background: linear-gradient(-270deg, #5436D5 4%, #735CFF 100%);
}

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

/*优惠券*/
.coupon_box {
	padding: 0.2rem 0 0;
	height: 0.5rem;
}

.coupon_box > div {
	height: 0.5rem;
	white-space: nowrap;
	display: flex;
	align-items: center;
}

.coupon {
	background: linear-gradient(103deg, #FBEAF4 0%, #FDEFEF 100%);
	border-radius: 0.08rem;
	padding: 0 0.11rem;
	margin-right: 0.2rem;
	font-size: 0.24rem;
	display: inline-block;
	height: 0.5rem;
	line-height: 0.5rem;
	max-width: 5.8rem;
}

.get-more {
	width: 1.04rem;
	height: 0.5rem;
	line-height: 0.5rem;
	background: linear-gradient(116deg, #FF3F37 0%, #FF614D 100%);
	border-radius: 0.25rem;
	color: #fff;
	text-align: center;
	display: flex;
	align-items: center;
	justify-content: center;

	i {
		width: 0.22rem;
		height: 0.22rem;
		display: inline-block;
		margin-left: 0.04rem;
		background: url("@/assets/images/good/goods-coupon-more.png") no-repeat 0 0 / 100% 100%;
	}
}

/*优惠券弹框*/
.coupon_title {
	height: 1.3rem;
	font-size: 0.32rem;
	color: #333;
	position: relative;
}

.coupon_fixed {
	padding: 0.1rem 0.25rem 0;
	height: 1.3rem;
	line-height: 1.3rem;
	font-size: 0.32rem;
	color: #333;
	position: fixed;
	width: 7.5rem;
	box-sizing: border-box;
	background: #fff;
	border-radius: 16px 16px 0 0;
}

.coupon_fixed img {
	position: absolute;
	right: 0.28rem;
	top: 0.43rem;
	width: 0.36rem;
	height: 0.36rem;
}

.list_box {
	padding: 0 0.11rem 0.35rem;
}

.coupon_list {
	border-radius: 0.2rem;
	border: 1px solid transparent;
	border-top: 0;
	margin-bottom: 0.2rem;
	width: 6.7rem;
}

.coupon-mit {
	border: 1px solid #F6DEE2;
	border-top: none;
}

.coupon_list > div.s-flex {
	width: 6.7rem;
	position: relative;
	height: 1.6rem;
	box-sizing: border-box;
	background: url('@/assets/images/good/coupon-bg-new1.png') no-repeat 0 0 / 100% 100%;
	display: flex;
}

.price, .xian {
	color: var(--red-color);
}

.coupon-act-col {
	color: #343434;
}

.price, .limit {
	margin-top: 0.04rem;
	margin-bottom: 0.08rem;
}

/*促销*/
.discount {
	padding: 0 0.2rem;
}

.cuxiao {
	white-space: nowrap;
}

.discount .act-name {
	padding: 0 0.1rem;
	line-height: 0.3rem;
	height: 0.3rem;
	margin-right: 0.2rem;
	display: flex;
	align-items: center;
	justify-content: center;
	border: 1px solid var(--red-color);
	border-radius: 0.06rem;
	font-size: 0.20rem;
	color: var(--red-color);
	white-space: nowrap;
}

.item-tit2 {
	padding: 0.26rem 0;
}

/*店铺*/
.logo-box {
	width: 1.1rem;
	height: 1.1rem;
	border: 1px solid #E5E5E5;
	border-radius: 50%;
	margin-right: 0.2rem;
}

.shop-msg {
	padding: 0.2rem 0.2rem !important;
}

.store-head {
	background: #FAFAFA;
	border-radius: 0.2rem;
	padding: 0.3rem 0.2rem;
}

.shop-logo {
	width: 1.1rem;
	height: 1.1rem;
	border-radius: 50%;
}

.star-level {
	height: 0.26rem;
	padding: 0.08rem 0;
}

.star-level span {
	height: 0.3rem;
	border-radius: 0.06rem;
	line-height: 0.3rem;
	padding: 0 0.1rem;
	display: inline-block;
	margin-right: 0.1rem;
	width: fit-content;
	flex: none;
}

.enter-store-btn {
	height: 0.56rem;
	border-radius: 0.3rem;
	line-height: 0.56rem;
	color: #fff;
	font-size: 0.32rem;
	text-align: center;
	background: var(--red-color);
	padding: 0 0.23rem;
	display: inline-block;
}

.store-num span {
	font-size: 0.24rem;
	color: #ADADAD;
}

.store-num i {
	margin: 0 0.15rem;
	color: #ADADAD;
}

/*商品详情*/
.detail {
	padding: 0 0.2rem 0.2rem;
}

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

// 限制编译器详情最大宽度，防止超出750
.content :deep(table){
	width: 100% !important;
}

.content :deep(img) {
	max-width: 7.1rem;
	height: auto;
}

.customer-service span {
	display: inline;
}

.price-text p {
	font-size: 0.22rem;
	line-height: 0.3rem;
	color: #3D3D3D;
}

.price-text {
	font-size: 0.22rem;
	line-height: 0.3rem;
	color: #3D3D3D;
}

//限制编译器详情最大宽度，防止超出750
:deep(.vhtml *) {
	width: 100% !important;
	box-sizing: border-box !important;
}

/*推荐*/
.re-tit {
	width: 100%;
	padding: 0.2rem 0 0.2rem;
}

.re-tit-img {
	width: 0.36rem;
	height: 0.3rem;
}

.recommend-box {
	padding: 0 0.2rem;
}

.recommend-item {
	border-radius: 0.2rem;
	overflow: hidden;
	background: #fff;
	width: 3.5rem;
	padding-bottom: 0.1rem;
	margin-bottom: 0.1rem;
}

.recommend-item .goods_type {
	width: 0.6rem;
	height: 0.3rem;
	line-height: 0.3rem;
	background: rgba(247, 17, 17, 0.04);
	border-radius: 0.04rem;
	color: var(--red-color);
	font-size: 0.2rem;
	text-align: center;
	display: inline-block;
}

.recommend-item .qihuo {
	background: rgba(255, 195, 0, 0.12);
	color: #FF8F1F;
}

.store-recomend .recommend-item {
	width: 2.1rem;
}

.store-recomend .recommend-box {
	padding: 0;
}

.recommend-item:nth-child(2n+1) {
	margin-right: 0.1rem;
}

.store-recomend .recommend-item:nth-child(2n+1) {
	margin-right: 0;
}

.store-recomend .recommend-item:nth-child(3n+1), .store-recomend .recommend-item:nth-child(3n+2) {
	margin-right: 0.2rem;
}

.store-recomend .item-name {
	width: 100%;
	line-height: 0.3rem;
	font-size: 0.28rem;
	height: 0.6rem;
	margin-bottom: 0.2rem;
}

.store-recomend .recommend-item-img {
	width: 2.1rem;
	height: 2.1rem;
}

.store-recomend .re-img {
	width: 2.1rem;
	height: 2.1rem;
}

.recommend-item-img {
	width: 3.5rem;
	height: 3.5rem;
}

.re-img {
	width: 3.5rem;
	height: 3.5rem;
	border-radius: 5px 5px 0 0;
}

.item-name {
	width: 3.15rem;
	height: 0.72rem;
	line-height: 0.36rem;
	margin-bottom: 0.1rem;
}

.item-name span {
	line-height: 0.36rem;
	height: 0.36rem;
	margin-right: 0.1rem;
	min-width: auto;
	font-size: 0.2rem;
	padding: 0 0.1rem;
}

/*底部*/
footer {
	width: 100%;
	height: 1.24rem;
	box-sizing: content-box;
}

footer {
	margin-top: 0.2rem;
}

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
}

.footer-icon1 {
	width: auto;
	height: 0.36rem;
	margin-bottom: 0.1rem;
}

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

.shop-car .car-num {
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

.shop-car {
	position: relative;
}

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

.to-long {
	width: 3.5rem;
}

.buying-box {
	padding-right: 0.1rem;
}

.add-car {
	background: linear-gradient(270deg, #FACB37 0%, #FACB37 100%);
	color: #ffffff;
}

.sell-out {
	color: var(--color-text-desc);
	background-color: #cccccc;
	width: 3.4rem;
}

.onsale-btn {
	background: linear-gradient(-270deg, #F64651 0%, var(--red-color) 99%);
	width: 2.9rem;
	color: #fff !important;
}

.to-buy {
	background: linear-gradient(270deg, #F64651 0%, var(--red-color) 99%);
	color: #ffffff;
}

.arrow {
	margin-top: 0.02rem;
}

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
</style>