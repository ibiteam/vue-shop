<template>
	<div class="good-detail" :style="{background: (placeholder ? '#fff' : '#F2F2F2'), height: goods_info.is_delete===1?'100vh':'auto',paddingBottom:(!!!goods_info.is_delete&&!goods_info.is_on_sale)?'0.9rem':0}">
		<template v-if="goods_info.is_delete===1">
			<common-header title="商品过期不存在"></common-header>
			<div class="no-data text-center" style="padding-top: 0.5rem;">
				<img src="@/assets/images/good/no-data-shop.png" alt="" style="width: 4rem;">
				<p class="fs26 co-3D text-center" style="position: relative;bottom: 0.6rem;">商品过期不存在</p>
			</div>
			<div style="padding: 0 0.2rem;" class="border-wrap">
				<!--推荐-->
				<div class="recommend" ref="recommend" id="recommend" style="padding: 0;">
					<div class="item-tit2 s-flex ai-ct jc-bt" v-if="recommend&&recommend.length > 0">
						<div class="s-flex ai-ct">
							<span class="tit-sign" style="width: 0.08rem;height: 0.3rem;background: linear-gradient(270deg, #F64651 0%, var(--red-color) 99%);margin-right: 0.1rem;border-radius: 0.04rem;"></span>
							<div class="co-333 fs32 fw-b">{{ recommendTitle }}</div>
						</div>
					</div>
					<div class="recommend-box s-flex flex-wrap" style="padding: 0;">
						<div class="recommend-item" v-for="(item, index) in recommend" :key="index"
						     style="border-radius: 0.2rem;overflow: hidden;" @click="reToDetail(item)">
							<div class="recommend-item-img">
								<van-image :src="item.goods_thumb" class="re-img">
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
									<span class="fs22 co-fff is-ziying" v-if="item.ziying_sign" :class="{ def: item.is_ziying == 0 }">{{ item.ziying_sign }}</span>{{ item.goods_name }}
								</div>
								<div style="margin-bottom: 0.14rem;" class="s-flex ai-ct jc-bt">
									<form-price :price="item.shop_price" :unit="item.unit" unit_color="#333" weight="bold"></form-price>
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
						<div style="font-size: 14px;min-width: 4rem;" v-if="search_word_list.length">
							<swiper ref="mySwiper" :options="swiperOptions" style="height: 0.6rem;">
								<swiper-slide v-for="(item,index) in search_word_list" :key="`kb${index}`">
									<span style="font-size: 14px;color: #333;" @click="clickKeywords(item)">{{ item.keywords }}</span>
								</swiper-slide>
							</swiper>
						</div>
					</div>
					<img src="@/assets/images/good/attention.png" alt="" style="width: 0.4rem;" @click="attention" v-if="isAttention">
					<img src="@/assets/images/good/attention-no.png" alt="" style="width: 0.4rem;" @click="attention" v-else>
				</div>
			</van-sticky>
			<div class="nav" :style="{opacity: opacity}" v-if="is_show_header">
				<div class="tabs s-flex jc-ad ai-ct">
					<a href="javascript:" :class="{'active': active=='goods'}" @click="onScrollGoods">
						<span>商品</span>
					</a>
					<!--<a href="javascript:" :class="{'active': active=='comment'}"-->
					<!--   @click="onScrollComment" v-if="goods_info.is_on_sale==1">-->
					<!--	<span>评价</span>-->
					<!--</a>-->
					<a href="javascript:" :class="{'active': active=='detail'}" @click="onScrollDetail"
					   v-if="goods_info.is_on_sale==1">
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
						<template v-if="banner.video&&goodTab == 0">
							<div class="play-btn">
								<img src="@/assets/images/good/good-video-play.png" @click="router.push({name:'goodPlay',query:{url:banner.video}})">
							</div>
							<van-image :src="imgUrls[0].url" v-if="imgUrls&&imgUrls.length">
								<template v-slot:loading>
									<img src="@/assets/images/common/no-pic.png" alt="">
								</template>
								<template v-slot:error>
									<img src="@/assets/images/common/no-pic.png" alt="">
								</template>
							</van-image>
						</template>
						<van-swipe :autoplay="3000" indicator-color="black" @change="onChangeSwiper" v-else ref="swiper">
							<van-swipe-item v-for="(item, index) in imgUrls" :key="index" @click="lookBig(item.url)">
								<van-image :src="item.url">
									<template v-slot:loading>
										<img src="@/assets/images/common/no-pic.png" alt="">
									</template>
									<template v-slot:error>
										<img src="@/assets/images/common/no-pic.png" alt="">
									</template>
								</van-image>
							</van-swipe-item>
							<template #indicator>
								<div class="indicator-wrap" v-if="imgUrls&&imgUrls.length>1">
									<div class="custom-indicator" :class="{'indicator-active':swiperIndex == index}" v-for="(item, index) in imgUrls" :key="`swiperIndex-${index}`"></div>
								</div>
							</template>
						</van-swipe>
						<div class="main-btn-wrap">
							<div :class="{active:goodTab == 0}" v-if="banner.video" @click="goodTab = 0">视频</div>
							<div :class="{active:goodTab == 1}" @click="changeToImg">图集</div>
							<!--<div @click="toEvaluate('good')" v-if="banner.evaluate">评价</div>-->
						</div>
					</div>
					<div style="position: relative;top: -0.4rem;border-radius: 0.34rem 0.34rem 0 0;overflow: hidden;margin-bottom: -0.4rem;">
						<!--        已删除/已下架        -->
						<div class="price-on-sale-no bg-fff" style="padding: 0.35rem 0.2rem 0.15rem;" v-if="goods_info.is_on_sale==0||goods_info.is_delete==1">
							暂无报价
						</div>
						<!--普通商品多规格-非拼团-->
						<div class="bg-fff" style="padding-bottom: 0.1rem;padding-top: 0.3rem;" v-else-if="goods_info.act_type == 9&&goods_info.is_set_sku==1">
							<skuSelect :list="sku_param_list" :main_img="imgUrls[0].url" :http_ing="isSkuIng" @select="updateSkuFirst"></skuSelect>
							<div class="bg-pink price-ladder new" style="width: 100%;background: none;padding: 0 0.2rem;">
								<div class="s-flex flex-wrap ladder-style jc-bt ai-fs">
									<div class="duan s-flex ai-ct">
										<p style="padding: 0;">
											<form-price :price="goods_info.shop_price" weight="bold" :sign_size="24" :INT_size="50" :DF_size="28"></form-price>
										</p>
										<p class="fs24 co-red" style="margin-left: 0.3rem;">
											起订量{{ goods_info.min_number }}{{ goods_info.unit }}
										</p>
									</div>
								</div>
							</div>
						</div>
						<div class="shop-box">
							<!--优惠券新-->
							<div class="coupon_box s-flex ai-ct fs20" @click="coupon_popup=true" v-if="discount_list.is_show&&goods_info.is_on_sale">
								<div class="flex-1 elli-1 flex-wrap" style="overflow: hidden;">
									<span class="coupon elli-1" style="color: var(--red-color);" v-for="item in discount_list.short_desc_list">{{ item }}</span>
								</div>
								<span class="get_more">详情<i></i></span>
							</div>
							<!--自营/商家直营 新板块-->
							<!--<div style="padding-top: 0.2rem;" v-if="slogan">-->
							<!--	<div class="small-fun s-flex ai-ct jc-bt">-->
							<!--		<div class="s-flex ai-ct">-->
							<!--			<div class="sign">-->
							<!--				<span class="is-ziying" :class="{ def: slogan.is_self != '1' }">{{ slogan.name }}</span>-->
							<!--			</div>-->
							<!--			<p class="fs24 co-333" @click="goUrl(slogan.url)">{{ slogan.value }}<em class="iconfont" style="font-size: 0.22rem;color: #333;margin-left: 0.04rem;">&#xe773;</em></p>-->
							<!--		</div>-->
							<!--	</div>-->
							<!--</div>-->
							<!--商品名称-->
							<p class="shop-name">{{ goods_info.goods_name }}</p>
							<!--副标题-->
							<p class="goods-desc fs24 co-red" v-if="goods_info.goods_subtitle">
								{{ goods_info.goods_subtitle }}</p>
						</div>
					</div>
				</div>
				<template v-if="goods_info.is_on_sale&&goods_info.is_delete==0">
					<template v-for="(floor,floorIndex) in floors">
						<div style="padding: 0 0.2rem;" class="border-wrap" :key="floor.mId" v-if="floor.mId == 'base'">
							<!--已选/地址/物流/服务/活动/我要供货-->
							<section class="MT10 bg-fff goods-other">
								<div class="s-flex ai-ct jc-bt" @click="openSpecCard" v-if="goods_info.is_set_sku == 1">
									<template
										v-if="(goods_info.is_set_sku == 1&&spec_name.length)||(!goods_info.is_set_sku&&(repositorys_record.name||payTypes_record.name))">
										<div class="s-flex ai_fs">
											<div class="other-name">已 选</div>
											<div class="other-cont fs26">
												<template v-if="goods_info.is_set_sku == 1">
													<span v-for="(spec,speci) in spec_name" class="co-333">{{ spec }}<template
														v-if="speci<=spec_name.length-2&&spec_name.length>1">;</template></span>
												</template>
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
												<template v-if="goods_info.is_set_sku == 1">
													<span
														v-for="item in sku_param_list[0].values">{{ item.name }}</span>
												</template>
											</div>
										</div>
										<div class="s-flex ai-ct" style="width: fit-content;">
											<span class="fs24 co-666 MR10" style="white-space: nowrap;"
											      v-if="goods_info.is_set_sku == 1">共有{{
													paramNum
												}}种{{ sku_param_list[0].name }}可选</span>
											<em class="iconfont co-333" style="font-size: 0.28rem;">&#xe773;</em>
										</div>
									</template>
								</div>
								<div class="s-flex ai_fs jc-bt" @click="changeAddress">
									<div class="s-flex ai_fs">
										<div class="other-name">配 送</div>
										<div class="other-cont">
											<div class="s-flex ai-ct fs26" style="width: auto;">
												<img src="https://cdn.toodudu.com/uploads/2023/10/23/location (2).png"
												     alt="" style="position: relative;top: 0;">{{ limitAddress }}
											</div>
										</div>
									</div>
									<div class="s-flex ai-ct">
										<em class="iconfont co-333" style="font-size: 0.28rem;">&#xe773;</em>
									</div>
								</div>
								<div class="s-flex ai_fs jc-bt" v-if="ship">
									<div class="s-flex ai_fs">
										<div class="other-name">物 流</div>
										<div class="other-cont s-flex ai-ct fs26">
											<h5 class="fs26 co-333">{{ ship.price }}<span
												class="fs26 co-999">（最终以结算时为准）</span></h5>
										</div>
									</div>
									<div class="s-flex ai-ct">
									</div>
								</div>
								<div class="s-flex ai_fs jc-bt" @click="openPopup('servicePopup',floor.data.service)"
								     v-if="floor.data.service">
									<div class="s-flex ai_fs">
										<div class="other-name">服 务</div>
										<div class="other-cont s-flex flex-wrap">
											<div class="s-flex ai-ct fs26 elli-1"
											     v-for="item in floor.data.service.items"><img
												src="https://cdn.toodudu.com/uploads/2023/10/23/service.png"
												alt="">{{ item.title }}
											</div>
										</div>
									</div>
									<div class="s-flex ai-ct">
										<em class="iconfont co-333" style="font-size: 0.28rem;">&#xe773;</em>
									</div>
								</div>
							</section>
						</div>
						<div style="padding: 0 0.2rem;" class="border-wrap" :key="floor.mId"
						     v-if="floor.mId == 'evaluate'">
							<!--评价-->
							<div class="comment MT10 bg-fff" ref="comment" id="comment">
								<!--商品评价-->
								<div class="item-tit2 s-flex ai-ct jc-bt" @click="toEvaluate('good')"
								     v-if="floor.data.goods_comment">
									<div class="s-flex ai-ct">
										<div class="co-333 fs32 fw-b">{{ floor.data.goods_comment.title }}</div>
									</div>
									<div class="co_9A9A9A s-flex ai-ct">
										<em class="iconfont co-333" style="font-size: 0.28rem;">&#xe773;</em>
									</div>
								</div>
								<div class="eva-class"
								     v-if="floor.data.goods_comment&&floor.data.goods_comment.semantics_tag_list.length">
									<span v-for="tag in floor.data.goods_comment.semantics_tag_list">{{ tag.name }} <i>{{
											tag.count
										}}</i></span>
								</div>
								<div class="eva-list-wrap"
								     v-if="floor.data.goods_comment&&floor.data.goods_comment.comment_list&&floor.data.goods_comment.comment_list.length">
									<div class="eva-list" v-for="(item,index) in floor.data.goods_comment.comment_list"
									     :style="{borderBottom: floor.data.store_comment||index<floor.data.goods_comment.comment_list.length-1?'1px solid #e5e5e5':'none'}">
										<div class="users s-flex jc-bt ai-ct">
											<div class="user-left s-flex ai-ct">
												<div
													style="width:0.66rem;height:0.66rem;border-radius:100%;border:0.02rem solid #E5E5E5;overflow: hidden;margin-right: 0.14rem;"
													class="s-flex ai-ct jc-ct">
													<img class="user-img" :src="item.portrait" alt="">
												</div>
												<div>
													<span class="user-name fs28 co_3D"
													      style="margin-bottom: 0.06rem;display: inline-block;">{{
															item.nickname
														}}<i class="fs28 co-999" style="font-style: normal;"
														     v-if="item.is_anonymous=='1'">(匿名）</i></span>
													<shop-rate :rank="item.rank"></shop-rate>
												</div>
											</div>
										</div>
										<div class="content fs28 co-333"
										     style="line-height: 0.4rem;padding: 0.1rem 0;word-break: break-all;">
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
								<!--店铺评价-->
								<div class="item-tit2 s-flex ai-ct jc-bt" @click="toEvaluate('shop')"
								     v-if="floor.data.store_comment">
									<div class="s-flex ai-ct">
										<div class="co-333 fs32 fw-b">{{ floor.data.store_comment.title }}</div>
									</div>
									<div class="co_9A9A9A s-flex ai-ct">
										<em class="iconfont co-333" style="font-size: 0.28rem;">&#xe773;</em>
									</div>
								</div>
								<div class="eva-class" style="padding-bottom: 0.2rem;"
								     v-if="floor.data.store_comment&&floor.data.store_comment.semantics_tag_list.length">
									<span v-for="tag in floor.data.store_comment.semantics_tag_list">{{ tag.name }} <i>{{
											tag.count
										}}</i></span>
								</div>
							</div>
						</div>
						<div style="padding: 0 0.2rem;" class="border-wrap" :key="floor.mId" v-if="floor.mId == 'shop'">
							<!--店铺-->
							<section class="MT10 shop_msg bg-fff">
								<div class="s-flex jc-bt ai-ct store-head">
									<div class="s-flex ai-ct" style="width: 5rem;flex: none;">
										<div class="logo-box s-flex ai-ct jc-ct">
											<img class="shop_logo"
											     :src="floor.data.shop_logo ? floor.data.shop_logo : 'https://cdn.toodudu.com/uploads/2021/02/20/shop_default.png'">
										</div>
										<div style="width: 3.7rem;flex: none;">
											<p class="flex-1 elli-1 shop_name fs32 co-333 fw-b">
												{{ floor.data.shop_name }}</p>
											<div class="star-level s-flex ai-ct"
											     v-if="floor.data.shop_type||floor.data.rank">
												<span class="is-ziying" :class="{def:floor.data.is_self != '1'}"
												      v-if="floor.data.shop_type">{{ floor.data.shop_type }}</span>
												<shop-rate :rank="floor.data.rank" v-if="floor.data.rank"></shop-rate>
											</div>
											<div class="store-num s-flex ai-ct"
											     v-if="floor.data.open_time||floor.data.concern">
												<span v-if="floor.data.open_time">{{ floor.data.open_time }}</span><i
												v-if="floor.data.open_time&&floor.data.concern"
												style="font-style: normal;">|</i>
												<span v-if="floor.data.concern">{{ floor.data.concern }}</span>
											</div>
										</div>
									</div>
									<div>
										<div @click="toShop" class="enter-store-btn">进店</div>
									</div>
								</div>
								<template v-for="item in floor.data.items">
									<div class="store-prop" v-if="item.mId == 'category'||item.mId == 'place'">
										<div class="s-flex ai_fs">
                                            <span class="s-flex ai-ct" style="white-space: nowrap;">
                                                <img src="https://cdn.toodudu.com/uploads/2023/10/23/class.png" alt=""
                                                     v-if="item.mId == 'category'"><img
	                                            src="https://cdn.toodudu.com/uploads/2023/10/23/location-g.png" alt=""
	                                            v-if="item.mId == 'place'">{{ item.name }}
                                            </span>
											<p class="fs26 co-333">{{ item.desc }}</p>
										</div>
									</div>
								</template>
								<!--推荐-->
								<div class="recommend store-recomend"
								     v-if="floor.data.show_recommend_list == '1'&&shopRecommend.length"
								     style="padding-top: 0.2rem;">
									<div class="re-tit s-flex ai-ct jc-bt">
										<span class="fs28 co-333 fw-b">店铺推荐</span>
										<span class="fs28 co-999" @click="toShop">查看全部<em class="iconfont co-999"
										                                                      style="font-size: 0.26rem;margin-left: 0.1rem;">&#xe773;</em></span>
									</div>
									<template v-if="shopRecommend.length<=6">
										<div class="recommend-box s-flex flex-wrap">
											<div class="recommend-item" v-for="(item, index) in shopRecommend"
											     :key="index" @click="reToDetail(item)" v-if="index<6">
												<div class="recommend-item-img">
													<van-image :src="item.goods_thumb" class="re-img">
														<template v-slot:loading>
															<img
																src="@/assets/images/common/no-pic.png"
																alt="" class="re-img">
														</template>
														<template v-slot:error>
															<img
																src="@/assets/images/common/no-pic.png"
																alt="" class="re-img">
														</template>
													</van-image>
												</div>
												<div class="MT10">
													<div class="item-name fs24 co_343434 elli-2">{{ item.goods_name }}
													</div>
													<div>
														<form-price :price="item.shop_price" :sign_size="30"
														            :DF_size="30" :INT_size="30" unit_color="#333"
														            weight="bold"></form-price>
													</div>
												</div>
											</div>
										</div>
									</template>
									<template v-else>
										<van-swipe class="home_gg1" :autoplay="3000" indicator-color="var()--red-color"
										           style="padding-bottom: 0.1rem;">
											<van-swipe-item :key="`tj1${index}`"
											                v-for="(recommend,index) in shopRecommendNew">
												<div class="recommend-box s-flex flex-wrap">
													<div class="recommend-item" v-for="(item, index) in recommend"
													     :key="index" @click="reToDetail(item)" v-if="index<6">
														<div class="recommend-item-img">
															<van-image :src="item.goods_thumb" class="re-img">
																<template v-slot:loading>
																	<img
																		src="@/assets/images/common/no-pic.png"
																		alt="" class="re-img">
																</template>
																<template v-slot:error>
																	<img
																		src="@/assets/images/common/no-pic.png"
																		alt="" class="re-img">
																</template>
															</van-image>
														</div>
														<div class="MT10">
															<div class="item-name fs24 co_343434 elli-2">
																{{ item.goods_name }}
															</div>
															<div>
																<form-price :price="item.shop_price" :sign_size="30"
																            :DF_size="30" :INT_size="30"
																            unit_color="#333"
																            weight="bold"></form-price>
															</div>
														</div>
													</div>
												</div>
											</van-swipe-item>
										</van-swipe>
									</template>
								</div>
							</section>
						</div>
					</template>
				</template>
				<div style="padding: 0 0.2rem;" class="border-wrap">
					<template v-if="goods_info.is_on_sale&&goods_info.is_delete==0">
						<div class="good-attr attr-title">
							<p>商品详情</p>
						</div>
						<div class="good-attr bg-fff" style="padding-bottom: 0.26rem;">
							<h4 class="fs32 co-333 fw-b" style="padding: 0.3rem 0 0.2rem;">产品参数</h4>
							<div style="padding-bottom: 0.1rem;" v-if="goods_attr && goods_attr.standard.length>0">
								<p v-for="item in goods_attr.standard">
									<span>{{ item.attr_name }}</span>{{ item.attr_value }}</p>
							</div>
							<div class="more-attr s-flex jc-ct" v-if="goods_attr.custom&&goods_attr.custom.length">
								<div class="fs28 co-333" @click="openPopup('propPopup')">更多详细参数<em
									class="iconfont co-999" style="font-size: 0.26rem;">&#xe773;</em></div>
							</div>
						</div>
						<div class="store-coupon bg-fff MT10" style="padding-bottom: 0.26rem;"
						     v-if="store_coupons.length">
							<h4 class="fs32 co-333 fw-b" style="padding: 0.3rem 0 0.2rem;">店铺优惠券</h4>
							<div class="coupon-wrap">
								<div class="coupon-item s-flex ai-ct jc-bt" v-for="item in store_coupons"
								     :class="{active:item.max_limit}">
									<div style="height: 100%;">
										<p>{{ item.name }}</p>
										<div>
											<form-price :price="item.money" :sign_size="24" :INT_size="44" :DF_size="24"
											            color="#E12A61"></form-price>
										</div>
										<h6>{{ item.desc }}</h6>
									</div>
									<!--  去店铺  -->
									<div style="width: 1em;" v-if="item.max_limit" @click="toShop">
										{{ item.max_limit_text }}
									</div>
									<!--  领取  -->
									<div style="width: 1em;" v-else @click="getCoupon(item)">{{ item.btn.name }}</div>
								</div>
							</div>
						</div>
						<div class="detail MT10 bg-fff" ref="detail" id="detail">
							<div class="content">
								<div class="goodsAttr_last vhtml" v-html="goods_info.goods_desc"
								     style="padding: 0.3rem 0;"></div>
							</div>
						</div>
						<div class="detail MT10 bg-fff" style="padding: 0.2rem;">
							<div class="content">
								<!--售后服务-->
								<div class="MT10 bg-fff customer_service">
									<p class="co-333 fs32 MB20" style="font-weight: bold">售后保障</p>
									<div v-if="goods_info.customer_service == ''" class="fs24">暂无数据</div>
									<div class='fs24 vhtml goodsAttr_sale' v-else
									     v-html="goods_info.customer_service"></div>
								</div>
							</div>
						</div>
						<div class="detail MT10 bg-fff" v-if="price_desc&&price_desc.is_show == '1'"
						     style="padding-bottom: 0.3rem;">
							<div class="item-tit2 s-flex ai-ct jc-bt">
								<div class="s-flex ai-ct">
									<div class="co-333 fs32 fw-b">{{ price_desc.title }}</div>
								</div>
							</div>
							<!--价格说明-->
							<div class="bg-fff customer_service price-text fs22" style="line-height: 0.4rem;"
							     v-html="price_desc.content.replace(/\n|\r\n/g,'<br>')"></div>
						</div>
					</template>
					<template v-if="!goods_info.is_on_sale">
						<div class="goods-gray MT10">商品已下架</div>
					</template>
					<template v-else-if="!goods_info.is_alone_sale">
						<div class="goods-alone MT10">抱歉，该商品不支持单独购买</div>
					</template>
					<!--推荐-->
					<div class="recommend" ref="recommend" id="recommend" style="padding: 0;">
						<div class="item-tit2 s-flex ai-ct jc-bt" v-if="recommend&&recommend.length > 0">
							<div class="s-flex ai-ct">
								<span class="tit-sign"
								      style="width: 0.08rem;height: 0.3rem;background: linear-gradient(270deg, #F64651 0%, var(--red-color) 99%);margin-right: 0.1rem;border-radius: 0.04rem;"></span>
								<div class="co-333 fs32 fw-b">{{ recommendTitle }}</div>
							</div>
						</div>
						<div class="recommend-box s-flex flex-wrap" style="padding: 0;">
							<div class="recommend-item" v-for="(item, index) in recommend" :key="index"
							     style="border-radius: 0.2rem;overflow: hidden;" @click="reToDetail(item)">
								<div class="recommend-item-img">
									<van-image :src="item.goods_thumb" class="re-img">
										<template v-slot:loading>
											<img src="@/assets/images/common/no-pic.png" alt=""
											     class="re-img">
										</template>
										<template v-slot:error>
											<img src="@/assets/images/common/no-pic.png" alt=""
											     class="re-img">
										</template>
									</van-image>
								</div>
								<div class="MT10" style="padding: 0 0.15rem;">
									<div class="item-name fs26 co-333 elli-2"><span class="fs22 co-fff is-ziying"
									                                                v-if="item.ziying_sign"
									                                                :class="{ def: item.is_ziying == 0 }">{{ item.ziying_sign }}</span>{{ item.goods_name }}
									</div>
									<div style="margin-bottom: 0.14rem;" class="s-flex ai-ct jc-bt">
										<form-price :price="item.shop_price" :unit="item.unit" unit_color="#333"
										            weight="bold"></form-price>
										<span v-if="item.goods_type" class="goods_type"
										      :class="{'qihuo':item.goods_type == '期货'}">{{ item.goods_type }}</span>
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
							<div class="openShop flex-1 s-flex flex-dir ai-ct jc-ct breathe" @click="toShop">
								<div><img class="footer-icon1"
								          src="https://cdn.toodudu.com/uploads/2023/10/23/shop.png"/></div>
								<p class="co-333 fs24">进店</p>
							</div>
							<a @click="showChatAction('shop')"
							   class="attention flex-1 s-flex flex-dir ai-ct jc-ct breathe">
								<div><img class="footer-icon2"
								          src="https://cdn.toodudu.com/uploads/2023/10/23/good-service.png"/></div>
								<p class="co-333 fs24">客服</p>
							</a>
							<div class="shop_car flex-1 s-flex flex-dir ai-ct jc-ct breathe" @click="toCart">
								<div style="position: relative;">
									<img class="footer-icon3"
									     src="https://cdn.toodudu.com/uploads/2023/10/23/good-car.png"/>
									<span v-if="!!carNum" class="carNum fs20">{{ carNum }}</span>
								</div>
								<p class="co-333 fs24">购物车</p>
							</div>
						</div>
						<div class="buying-box s-flex ai-ct jc-ct flex-1">
							<div class="breathe" v-if="goods_info.is_on_sale == 0">
								<div class="is_on_sale-btn fs32 buying fw-b"
								     @click="appRoute('search',{},{defkeywords:category.cat_name,keywords:category.cat_name,cat_id:category.cat_id})">
									去看看相似商品
								</div>
							</div>
							<div class="breathe" v-else-if="goods_info.goods_number == 0">
								<div class="sell_out fs32 buying fw-b">
									已售罄
								</div>
							</div>
							<div v-else class="s-flex breathe">
								<div class="add_car fs32 buying MR10 add_car" :class="{'buying09':is_limit}"
								     @click="setShoppingCard(2)">
									<span class="fs32 fw-b">加入购物车</span>
								</div>
								<div class="to_buy fs32 buying" @click="setShoppingCard(1)"
								     :class="{'buying09':is_limit}">
									<span class="fs32 fw-b">立即购买</span>
								</div>
							</div>
						</div>
					</section>
				</footer>
				<van-action-sheet
					v-model:show="show_chat_action"
					:actions="chat_actions"
					cancel-text="取消"
					close-on-click-action
					@select="clickOnlineCustomerServer"
				></van-action-sheet>
			</template>
			<template v-else>
				<div
					style="width:7.5rem;background:#fff;border:1px solid transparent;box-sizing: border-box;margin-bottom:-0.2rem">
					<img src="../../assets/images/app_nopic.png" alt=""
					     style="width: 7.1rem;height:7.1rem;margin: 0.2rem auto;border-radius: 4px;display: block">
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
								          src="https://cdn.toodudu.com/uploads/2023/10/23/shop.png"/></div>
								<p class="co-333 fs24">进店</p>
							</div>
							<a class="attention flex-1 s-flex flex-dir ai-ct jc-ct breathe">
								<div><img class="footer-icon2"
								          src="https://cdn.toodudu.com/uploads/2023/10/23/good-service.png"/></div>
								<p class="co-333 fs24">客服</p>
							</a>
							<div class="shop_car flex-1 s-flex flex-dir ai-ct jc-ct breathe">
								<div>
									<img class="footer-icon3"
									     src="https://cdn.toodudu.com/uploads/2023/10/23/good-car.png"/>
								</div>
								<p class="co-333 fs24">购物车</p>
							</div>
						</div>
						<div class="buying-box s-flex ai-ct flex-1 jc-ct">
							<div class="breathe s-flex">
								<div class="add_car fs32 buying MR10 add_car buying09">
									<span class="fs32 fw-b">加入购物车</span>
								</div>
								<div class="to_buy fs32 buying buying09">
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
			:choose_attrs="choose_attr"
			:address_id="pageInfo.address_id"
			:shop_info="shop_info"
			:goods_info="goods_info"
			:shopping_type="shopping_type"
			:init_flag="init_flag"
			:is_select_spec="is_select_spec"
			:sku_id="sku_id"
			:sku_shop_price="sku_shop_price"
			:group_last_price="group_last_price"
			:sku_param_list="sku_param_list"
			@closeChooseAttr="closeChooseAttrFun"
			@changeCar="changeCar"
			@selectSku="selectSku"
			@unusual="unusual"
		></shoppingCard>
		<!--大图查看-->
		<van-image-preview v-model="showPreviewer" :startPosition="startIndex" :images="imgUrlBig"
		                   :showIndex="showIndex"></van-image-preview>
		<van-popup
			v-model="servicePopup"
			round
			position="bottom"
			:close-on-click-overlay="false"
			duration="0.5"
			:style="{ 'max-height': '10.12rem','min-height': '5rem', overflow: 'hidden', background: 'linear-gradient(180deg, #FEE5A2 0%, #FEF1C8 100%)',overflow: 'visible', 'padding-bottom': 'constant(safe-area-inset-bottom)','padding-bottom': 'env(safe-area-inset-bottom)'}">
			<div class="card-wrap" style="padding-bottom: 0.2rem;">
				<div class="close-btn" @click="servicePopup = false">
					<i class="iconfont co-000">&#xea13;</i>
				</div>
				<div class="service-title">
					<h3>{{ serviceData.title }}</h3>
					<p>{{ serviceData.subhead }}</p>
				</div>
				<div class="service-cont" v-if="serviceData.items&&serviceData.items.length">
					<div v-for="item in serviceData.items">
						<img :src="item.icon" alt="">
						<h4>{{ item.title }}</h4>
						<p>{{ item.content }}</p>
					</div>
				</div>
			</div>
		</van-popup>
		<van-popup
			v-model="activityPopup"
			round
			position="bottom"
			:close-on-click-overlay="false"
			duration="0.5"
			:style="{ 'max-height': '10.12rem','min-height': '5rem', overflow: 'hidden','padding-bottom': 'constant(safe-area-inset-bottom)','padding-bottom': 'env(safe-area-inset-bottom)'}">
			<div class="card-wrap" style="padding-top: 1.3rem;max-height: 10.12rem;overflow-y: auto;">
				<div class="close-btn" @click="activityPopup = false">
					<i class="iconfont">&#xea13;</i>
				</div>
				<div class="goods-popup-title">
					<h3>活动</h3>
				</div>
				<div class="activity-cont">
					<div class="activity-item" v-for="item in activityData">
						<div class="s-flex ai-ct jc-bt">
							<div class="activity-info">
								<div><span class="other-sign"
								           :class="{pre:item.type=='jicai_demand',try:item.type=='sample',give:item.type=='gift'}">{{ item.name }}</span>
								</div>
								<p class="fs24 co-333" v-html="item.desc"></p>
							</div>
							<div>
								<span class="activity-btn" v-if="item.type=='jicai_demand'"
								      @click="appRoute('jicaiAdd', {}, {goods_id:goods_info.goods_id,price:goods_info.shop_price,unit:goods_info.unit,goods_name:goods_info.goods_name})">填写需求</span>
								<em class="iconfont co-333" style="font-size: 0.28rem;" v-if="item.type=='gift'"
								    @click="reToDetail(item.items)">&#xe773;</em>
							</div>
						</div>
						<div class="s-flex give-good ai-ct" v-if="item.type=='gift'&&item.items.goods_id"
						     @click="reToDetail(item.items)">
							<img :src="item.items.thumb" alt="">
							<p class="elli-2">{{ item.items.name }}</p>
						</div>
					</div>
				</div>
			</div>
		</van-popup>
		<van-popup
			v-model="propPopup"
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
				<div class="prop-cont" v-if="goods_attr">
					<div class="s-flex ai_fs" v-for="item in goods_attr.standard"><span
						class="fs28 co-999">{{ item.attr_name }}</span>
						<p class="co-333 fs28">{{ item.attr_value }}</p></div>
					<div class="s-flex ai_fs" v-for="item in goods_attr.custom"><span
						class="fs28 co-999">{{ item.attr_name }}</span>
						<p class="co-333 fs28">{{ item.attr_value }}</p></div>
				</div>
			</div>
		</van-popup>
		<!--领取优惠券-->
		<div class="coupon" v-if="coupon_popup">
			<van-popup
				v-model:show="coupon_popup"
				round
				position="bottom"
				:close-on-click-overlay="false"
				:style="{ 'max-height': '10.12rem','min-height': '5rem', overflow: 'hidden', 'padding-bottom': 'constant(safe-area-inset-bottom)','padding-bottom': 'env(safe-area-inset-bottom)'}">
				<div style="padding-top: 1.3rem;max-height: 10.12rem;overflow-y: auto;">
					<div class="close-btn" @click="coupon_popup = false">
						<i class="iconfont">&#xea13;</i>
					</div>
					<div class="goods-popup-title">
						<h3>优惠</h3>
					</div>
					<div style="max-height:8.8rem;overflow-y:auto;">
						<template v-if="discount_list_in.length">
							<p class="co-333 fs30 ML20" style="line-height: 1;margin-bottom: 0.3rem;">促销</p>
							<section class="MB20 s-flex fs24 discount ai_fs" v-for="item in discount_list_in">
								<span class="act-name">{{ item.title }}</span>
								<span class="co-333 fs20" style="line-height: 0.32rem;">{{ item.desc }}</span>
							</section>
						</template>
						<p class="co-333 fs30 ML20 s-flex ai-ct" style="line-height: 1;margin-bottom: 0.3rem;font-size: 0.3rem;" v-if="coupon_list&&coupon_list.length"><img src="@/assets/images/good/new-coupon-title.png" alt="" style="width: 0.33rem;margin-right: 0.1rem;">可领取优惠券</p>
						<div class="list_box" style="padding: 0 0.4rem 0.3rem;">
							<div class="coupon_list" :class="[item.show_limit? 'coupon-mit' : '']" v-for="(item,index) in coupon_list">
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
											<p class="fs20 co-999" v-if="item.end_time&&item.start_time">
												{{ item.start_time }} - {{ item.end_time }}</p>
											<p class="fs20 co-666 s-flex ai-ct" v-if="item.limit_info&&item.limit_info.length" @click="changeShowInfo(index)">
												详细信息
												<em class="iconfont" v-if="!item.show_limit">&#xe67a;</em>
												<em class="iconfont" v-else>&#xe61e;</em>
											</p>
										</div>
										<div>
											<span class="coupon-btn" v-if="!item.max_limit" @click="getCoupon(item)">点击领取</span>
											<span class="coupon-btn can-use" v-else @click="goUrl(item.btn.url)">去使用</span>
										</div>
									</div>
								</div>
								<div class="fs20 co-999" style="padding: 0.2rem 0.24rem;line-height: 0.26rem;" v-if="item.show_limit&&item.limit_info&&item.limit_info.length">
									<p v-for="info in item.limit_info" class="fs20 co-999 elli-1">{{ info }}</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</van-popup>
		</div>
		<!--收货地址 -->
		<div class="coupon" v-if="address_popup">
			<van-popup
				v-model="address_popup"
				round
				position="bottom"
				:close-on-click-overlay="false"
			>
				<div class="close-btn" @click="address_popup = false">
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
										     src="https://cdn.toodudu.com/uploads/2023/12/12/address-select-g.png"
										     alt="" v-if="pageInfo.address_id == item.address_id">
									</div>
								</div>
								<div class="s-flex ai-ct jc-bt">
									<div class="s-flex ai-ct">
										<template v-if="item.used">
											<img style="width: 0.3rem;height: 0.3rem;margin-right: 0.15rem;"
											     src="https://cdn.toodudu.com/uploads/2023/12/12/select.png" alt=""
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
							<img src="../../assets/images/address/nodata.png" alt="">
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
			<van-popup v-model="show_remove" :close-on-click-overlay="false">
				<div class="choose-add-address choose-remove-address">
					<div class="view-h1">确定要删除地址吗？</div>
					<div class="s-flex ai-ct">
						<div class="choose-item s-flex ai-ct jc-ct"
						     @click="show_remove = false, remove_address_id = null">取消
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
import {ref, reactive, computed, onMounted, onBeforeUnmount, nextTick, getCurrentInstance } from 'vue'
import {useRoute, useRouter} from 'vue-router'
import {useGoodStore} from "@/stores";
import $ from 'jquery'
import shoppingCard from '@/components/shoppingCard/shoppingCard'
import skuSelect from './SkuSelect.vue'
import shopRate from './ShopRate.vue'
const cns = getCurrentInstance().appContext.config.globalProperties
const route = useRoute()
const router = useRouter()
const goodStore = useGoodStore()

// 响应式数据
const category = ref({})
const search_word_list = ref([])
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
			clickKeywords(search_word_list.value[realIndex])
		}
	}
})
const server_is_show = ref(0)
const banner = ref({})
const discount_list = ref({})
const discount_list_in = ref([])
const store_coupons = ref([])
const price_desc = ref({})
const slogan = ref({})
const floors = ref([])
const show_remove = ref(false)
const remove_address_id = ref(null)
const goodTab = ref(1)
const swiperIndex = ref(0)
const parent_id = ref(0)
const fromPath = ref('')
const goods_id = ref(7419)
const opacity = ref(0)
const active = ref('good')
const nodata = ref(false)
const goods_info = ref({})
const shop_info = ref({})
const imgUrl = ref([])
const imgUrls = ref([])
const isAttention = ref(false)
const coupon_list = ref([])
const address_popup = ref(false)
const coupon_popup = ref(false)
const shopping_type = ref(-1)
const carNum = ref(0)
const choose_attr = ref(false)
const goods_attr = ref({})
const recommend = ref([])
const recommendTitle = ref('')
const bottomlineRecommend = ref(false)
const pageRecommend = ref(1)
const group_last_price = ref(0)
const no_group_last_price = ref(0)
const init_flag = ref(0)
const placeholder = ref(true)
const is_day = ref(true)
const loadRecommend = ref(true)
const showPreviewer = ref(false)
const startIndex = ref(0)
const showIndex = ref(false)
const imgUrlBig = ref([])
const is_show_header = ref(true)
const addressList = ref([])
const pageInfo = ref({})
const is_limit = ref(false)
const limitAddress = ref('')
const ship = ref(null)
const is_select_spec = ref(false)
const paramNum = ref(0)
const sku_param_list = ref([])
const spec_id = ref([])
const spec_name = ref([])
const spec_name_no = ref([])
const sku_id = ref('')
const sku_shop_price = ref('')
const isSkuIng = ref(false)
const chat_type = ref('shop')
const show_chat_action = ref(false)
const chat_actions = ref([])
const servicePopup = ref(false)
const serviceData = ref({})
const activityPopup = ref(false)
const activityData = ref([])
const propPopup = ref(false)
const shopRecommend = ref([])
const shopRecommendNew = ref([])

// 方法
const changeShowInfo = (index) => {
	let data = coupon_list.value[index]
	data.show_limit = !data.show_limit
	coupon_list.value[index] = data
}

const selectSku = (data) => {
	if (data.param) {
		sku_param_list.value = data.param
	}
	if (data.sku) {
		goods_info.value.shop_price = data.sku.shop_price
		goods_info.value.group_price = data.sku.group_price
		sku_id.value = data.sku ? data.sku.id : ''
	}
}

const updateSkuFirst = (item) => {
	isSkuIng.value = true
	var info = {
		goods_id: goods_info.value.goods_id,
		spec_id: item.id
	}
	cns.$http.doPost("v4/goods/updateSkuParamById", info).then((res) => {
		if (res.code == 200) {
			sku_id.value = res.data.sku ? res.data.sku.id : ''
			if (res.data.param) {
				sku_param_list.value = res.data.param
			}
			if (sku_param_list.value.length) {
				paramNum.value = 1
			}
			sku_param_list.value.length && sku_param_list.value.forEach((d, i) => {
				spec_name_no.value.push(d.name)
				if (d.values.length && i == 0) {
					paramNum.value = d.values.length
				}
			})
			spec_name.value = []
			sku_param_list.value.length && sku_param_list.value.forEach((d) => {
				d.values.forEach(s => {
					if (s.selected) {
						spec_name.value.push(s.name)
						spec_id.value.push(s.id)
					}
				})
			})
			sku_shop_price.value = res.data.sku ? res.data.sku.shop_price : ''
			if (res.data.sku) {
				goods_info.value.shop_price = res.data.sku.shop_price
			}
			isSkuIng.value = false
		} else {
			cns.$toast(res.message)
			isSkuIng.value = false
		}
	})
}

const clickKeywords = (item) => {
	cns.appRoute('search_history', {}, {placeholder: item.keywords, url: item.url})
}

const clickDeleteAddress = (item, index) => {
	show_remove.value = true
	remove_address_id.value = item.address_id
}

const clickAddOrRemoveAddressSure = () => {
	cns.$http.postNotLoading('v3/address/delete', {address_id: remove_address_id.value}).then(res => {
		if (res.code == 200) {
			const index = addressList.value.findIndex(item => item.address_id == remove_address_id.value)
			addressList.value.splice(index, 1)
			show_remove.value = false
			cns.$toast('删除成功')
			if (pageInfo.value.address_id == remove_address_id.value) {
				pageInfo.value.address_id = ''
			}
			remove_address_id.value = null
		} else {
			cns.$toast(res.message)
		}
	})
}

const openPopup = (type, data) => {
	if (type == 'activityPopup') {
		activityData.value = data
	} else if (type == 'servicePopup') {
		serviceData.value = data
	}
	servicePopup.value = type === 'servicePopup'
	activityPopup.value = type === 'activityPopup'
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
		$refs.swiper.swipeTo({index: 0})
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
	address_popup.value = false
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
		address_popup.value = true
		if (res.code == 200) {
			if (res.data.length > 0) {
				addressList.value = res.data
				nodata.value = false
			} else {
				addressList.value = []
				nodata.value = true
			}
			is_loading.value = true
		} else if (res.code == 403) {
			cns.appRoute('login', {}, {}, 'replace')
		} else {
			cns.$toast(res.message)
		}
	})
}

const lookBig = (url) => {
	imgUrlBig.value = imgUrl.value
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
	let commentTop = $refs.comment && $refs.comment.offsetTop - 44
	let detailTop = $refs.detail && $refs.detail.offsetTop - 44
	let recommendTop = $refs.recommend && $refs.recommend.offsetTop - 44
	let recommendHeight = $refs.recommend && $refs.recommend.offsetHeight

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

	if (loadRecommend.value && scrollTopVal > recommendTop - window.innerHeight - 100 + recommendHeight && !bottomlineRecommend.value) {
		loadRecommend.value = false
		getZhiRecommend()
	}
}

const onScrollGoods = () => {
	window.scrollTo({top: 0, behavior: "smooth"})
}

const onScrollComment = () => {
	if (!opacity.value) return
	cns.appRoute('evaluate', {}, {'goods_id': goods_info.value.goods_id})
}

const onScrollDetail = () => {
	if (!opacity.value) return
	window.scrollTo({top: $refs.detail.offsetTop - 44, behavior: "smooth"})
}

const onScrollRecommend = () => {
	if (!opacity.value) return
	if (!recommend.value.length) {
		onScrollDetail()
		active.value = 'detail'
		return
	}
	window.scrollTo({top: $refs.recommend.offsetTop - 44, behavior: "smooth"})
}

const getImage = (data) => {
	if (data.length <= 0) {
		imgUrls.value = []
		return false
	}

	let arr = []
	data.forEach((item, index) => {
		let img = new Image()
		img.src = item
		let obj = {}
		obj.url = item
		imgUrls.value[index] = obj
		img.onload = () => {
			imgUrls.value[index].wt = img.width
			imgUrls.value[index].ht = img.height

			let ratioT = 1
			let ratio = img.width / img.height
			let temp
			ratio <= 1 ? temp = 'h' : (ratio >= ratioT ? temp = 'w' : temp = 'h')
			imgUrls.value[index].sign100 = temp
		}
		arr.push(img)
	})
}

const commonCountdown = (classname, node) => {
	let list = document.getElementsByTagName(node)
	for (let i = 0; i < list.length; i++) {
		comCountdownck(list[i], classname)
	}
}

const comCountdownck = (ele, classname) => {
	if (ele.getAttribute("class")) {
		if (ele.getAttribute("class").indexOf(classname) != -1) {
			let _this = $(ele)
			let a = parseInt(_this.attr("value"))
			let si = setInterval(function () {
				let d = parseInt(new Date().getTime() / 1000)
				let day = parseInt((a - d) / 3600 / 24)
				let hour = parseInt((a - d) % (3600 * 24) / 3600)
				let minute = parseInt(((a - d) % 3600) / 60)
				let second = parseInt(((a - d) % 3600) % 60)
				if (!day) {
					is_day.value = false
				}
				_this.find(".day").html(charLeftAll(day))
				_this.find(".shi").html(charLeftAll(hour))
				_this.find(".fen").html(charLeftAll(minute))
				_this.find(".miao").html(charLeftAll(second))

				if (_this.find(".day").html() == "00" && _this.find(".shi").html() == "00" && _this.find(".fen").html() == "00" && _this.find(".miao").html() == "00") {
					clearInterval(si)
					location.reload()
				}
			}, 1000)
		}
	}
}

const charLeftAll = (n) => {
	if (n < 10) {
		return "0" + n
	} else {
		return n
	}
}

const attention = () => {
	cns.$http.doPost("v3/collect/goods/attentionOrCancelGood", {"goods_id": goods_info.value.goods_id})
		.then((res) => {
			if (res.code == 200) {
				isAttention.value = res.data.isAttention > 0
				if (isAttention.value) {
					cns.$toast('添加成功')
				} else {
					cns.$toast('取消关注成功')
				}
			} else if (res.code == 403) {
				cns.appRoute('login')
			} else {
				cns.$toast(res.message)
			}
		})
}
const deepClone = (origin, targets) => {
	var target = targets || {},
		toStr = Object.prototype.toString,
		arrStr = '[object Array]'
	for (var prop in origin) {
		if (origin.hasOwnProperty(prop)) {
			if (origin[prop] !== null && typeof (origin[prop]) == 'object') {
				target[prop] = toStr.call(origin[prop]) == arrStr ? [] : {}
				deepClone(origin[prop], target[prop])
			} else if (origin[prop] === null) {
				target[prop] = ''
			} else {
				target[prop] = origin[prop]
			}
		}
	}
	return target
}

const closeChooseAttrFun = (data) => {
	choose_attr.value = false
	shopping_type.value = 1
	if (is_select_spec.value) {
		spec_name.value = data.spec_name
	}
}

const openSpecCard = () => {
	if (is_limit.value) {
		return
	}
	cns.$http.doGet('v3/user/checkLogin')
		.then(res => {
			if (res.code == 200 && res.data.is_login) {
				init_flag.value++
				is_select_spec.value = true
				choose_attr.value = true
			} else {
				cns.appRoute('login')
			}
		})
}

const setShoppingCard = (type, id) => {
	if (is_limit.value) {
		return
	}
	cns.$http.doGet('v3/user/checkLogin')
		.then(res => {
			if (res.code == 200 && res.data.is_login) {
				is_select_spec.value = false
				shopping_type.value = type
				init_flag.value++
				choose_attr.value = true
			} else {
				cns.appRoute('login')
			}
		})
}
const changeCar = (e) => {
	carNum.value = e
}

const unusual = () => {
	init_flag.value = 0
	loadRecommend.value = true
	goodStore.setBuyNumber(-1)
	getData()
}
const toShop = () => {
	cns.appRoute('store_index', {}, {seller_id: shop_info.value.seller_id})
}

const reToDetail = (data) => {
	cns.appRoute('good', {}, {goods_id: data.goods_id})
}
const toCart = () => {
	cns.appRoute('cart', {}, {hasBack: true})
}

const getCoupon = (item) => {
	cns.$http.doPost('v3/usercoupon/add', {seller_id: shop_info.value.seller_id, id: item.coupon_id})
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

const getZhiRecommend = () => {
	cns.$http.doGet('v4/goods/hotSale', {goods_id: goods_id.value, page: pageRecommend.value}).then(res => {
		if (res.code == 200) {
			if (pageRecommend.value == 1) {
				recommend.value = res.data.data
				recommendTitle.value = res.data.title
			} else {
				recommend.value.push(...res.data.data)
			}
			if (res.data.on_last_page) {
				bottomlineRecommend.value = true
			} else {
				bottomlineRecommend.value = false
			}
			nextTick(() => {
				loadRecommend.value = true
			})
			pageRecommend.value++
		} else {
			bottomlineRecommend.value = true
			cns.$toast(res.message)
		}
	})
}

const showChatAction = (type) => {
	if (type == 'shop') {
		chat_actions.value = [
			{name: shop_info.value.kf_tel}
		]
	}
	chat_type.value = type
	show_chat_action.value = true
}

const clickOnlineCustomerServer = (action, index) => {
	cns.$dialog.alert({
		title: '热线电话',
		message: shop_info.value.kf_tel,
	}).then(() => {
	})
}

const detailBig = () => {
	$('.goodsAttr_last').on('click', 'img', function () {
		let arr = []
		arr.push($(this).attr('src'))
		imgUrlBig.value = arr
		startIndex.value = 0
		showIndex.value = false
		showPreviewer.value = true
	})
	$('.goodsAttr_sale').on('click', 'img', function () {
		let arr = []
		arr.push($(this).attr('src'))
		imgUrlBig.value = arr
		startIndex.value = 0
		showIndex.value = false
		showPreviewer.value = true
	})
}

const getData = () => {
	const info = {
		'goods_id': goods_id.value,
		'parent_id': parent_id.value,
		'sku_id': sku_id.value
	}
	cns.$http.doGet('v4/goods', info)
		.then((res) => {
			if (res.code == 200) {
				placeholder.value = false
				search_word_list.value = res.data.header.search_word_list
				if (search_word_list.value.length && search_word_list.value.length == 1) {
					swiperOptions.loop = false
					swiperOptions.autoplay = false
				}
				banner.value = res.data.banner
				server_is_show.value = res.data.server_is_show
				discount_list.value = res.data.discount_list
				store_coupons.value = res.data.store_coupons
				price_desc.value = res.data.price_desc
				slogan.value = res.data.slogan
				category.value = res.data.category
				floors.value = res.data.floors
				sku_param_list.value = res.data.sku_param_list.param ? res.data.sku_param_list.param : []
				if (sku_param_list.value.length) {
					paramNum.value = 1
				}
				sku_param_list.value.length && sku_param_list.value.forEach((d, i) => {
					d.values.forEach(s => {
						if (s.selected) {
							spec_name.value.push(s.name)
							spec_id.value.push(s.id)
						}
					})
				})
				sku_shop_price.value = res.data.sku_param_list.sku ? res.data.sku_param_list.sku.shop_price : ''
				/**商品信息**/
				goods_info.value = res.data.goods
				if (res.data.banner.video) {
					goodTab.value = 0
				}
				/**非拼团最终价**/
				no_group_last_price.value = res.data.goods.shop_price
				// ******待后端补到外层
				/**店铺信息**/
				shop_info.value = res.data.store
				/**优惠券**/
				coupon_list.value = res.data.discount_list.popup_data.coupon_list
				coupon_list.value.length && coupon_list.value.forEach((d, i) => {
					d.show_limit = false
				})
				discount_list_in.value = res.data.discount_list.popup_data.discount_list
				/**规格参数**/
				goods_attr.value = res.data.goods_attr
				/**购物车数量**/
				carNum.value = res.data.cart_number
				// 轮播图图片按比例展示
				let newImg = res.data.banner.goods_gallery, arr = []
				for (let i = 0; i < newImg.length; i++) {
					if (newImg[i].img_url) {
						arr.push(newImg[i].img_url)
					} else {
						arr.push(newImg[i].thumb_url)
					}
				}
				imgUrl.value = arr
				getImage(arr)

				// 是否关注
				isAttention.value = res.data.header.collect_goods

				nextTick(() => {
					// 活动倒计时
					if (goods_info.value.act_type == 1 || goods_info.value.act_type == 2 || goods_info.value.act_type == 6 || goods_info.value.is_group) {
						commonCountdown("time", "p")
					}

					if ($(".goodsAttr_last [style]")) {
						$(".goodsAttr_last [style]").css('position', 'static')
						$(".goodsAttr_last [style]").css('z-index', 0)
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
				if (goods_info.value.is_on_sale == 0 || goods_info.value.is_delete == 1) {
					loadRecommend.value = false
					getZhiRecommend()
				}
			}else {
				placeholder.value = false
				imgUrls.value = []
				goods_info.value = {}
				no_group_last_price.value = {}
				shop_info.value = {}
				coupon_list.value = {}
				goods_attr.value = {}
				carNum.value = 0
				recommend.value = {}

				nextTick(() => {
					// 滚到顶
					window.scrollTo({top: 0})
				})
			}
		})
	cns.$http.getNotLoading('v4/goods/shopRecommend', {'goods_id': goods_id.value}).then(res => {
		if (res.code == 200) {
			shopRecommend.value = res.data
			if (shopRecommend.value.length > 6 && shopRecommend.value.length <= 12) {
				shopRecommendNew.value = [shopRecommend.value.slice(0, 6), shopRecommend.value.slice(6)]
			} else if (shopRecommend.value.length > 12) {
				shopRecommendNew.value = [shopRecommend.value.slice(0, 6), shopRecommend.value.slice(6, 12), shopRecommend.value.slice(12)]
			}
		}
	})
}

onMounted(() => {
	document.querySelector('body').setAttribute('style', 'background-color: #f8f8f8')
	parent_id.value = route.query.parent_id
	goods_id.value = route.query.goods_id
	sku_id.value = route.query.sku_id
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

/*------改版新增-------*/
.activity-cont {
	padding: 0 0.2rem;
	max-height: 8rem;
	overflow-y: auto;
}

.activity-cont .activity-item {
	background: #F8F8F8;
	border-radius: 0.2rem;
	margin-bottom: 0.2rem;
	padding: 0.2rem;
	width: 6.7rem;
	box-sizing: border-box;
}

.prop-cont {
	padding: 0 0.4rem;

	div {
		margin-bottom: 0.25rem;
		line-height: 0.42rem;
	}

	span {
		display: inline-block;
		width: 6em;
		flex: none;
	}
}

.activity-cont .activity-item .other-sign {
	display: inline-block;
	white-space: nowrap;
	padding: 0 0.2rem;
	height: 0.6rem;
	line-height: 0.6rem;
	border-radius: 0.1rem;
	margin-bottom: 0.1rem;
}

.activity-cont .activity-item .other-sign.pre {
	color: #00B578;
	border: 1px solid #00B578;
}

.activity-cont .activity-item .other-sign.try {
	color: #FF8F1F;
	border: 1px solid #FF8F1F;
}

.activity-cont .activity-item .other-sign.give {
	color: var(--red-color);
	border: 1px solid var(--red-color);
}

.activity-cont .activity-item .activity-info p {
	max-width: 4.4rem;
	line-height: 0.36rem;
}

.activity-cont .activity-item .activity-btn {
	display: inline-block;
	width: 1.5rem;
	height: 0.6rem;
	line-height: 0.6rem;
	text-align: center;
	color: #fff;
	background: linear-gradient(270deg, #F64651 0%, var(--red-color) 99%);
	border-radius: 0.3rem;
	font-size: 0.26rem;
	font-weight: 600;
	cursor: pointer;
	padding: 0;
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

.activity-cont .activity-item .give-good {
	padding: 0.1rem;
	background: #fff;
	border-radius: 0.1rem;
	margin-top: 0.08rem;

	img {
		width: 0.8rem;
		height: 0.8rem;
		box-shadow: 0 0 0.06rem 0 rgba(0, 0, 0, 0.2);
		border-radius: 0.1rem;
		margin-right: 0.2rem;
		flex: none;
	}

	p {
		line-height: 0.36rem;
		height: 0.72rem;
		font-size: 0.24rem;
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

.user-img {
	max-width: 100%;
	max-height: 100%;
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
			color: #FF6A6A;
		}
	}
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

.goods-other .other-cont.fee span {
	padding: 0 0.2rem;
	margin-right: 0.2rem;
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

.goods-other .other-cont .other-sign {
	display: inline-block;
	white-space: nowrap;
	padding: 0 0.08rem;
	height: 0.3rem;
	line-height: 0.3rem;
	border-radius: 0.06rem;
	margin-right: 0.1rem;
}

.goods-other .other-cont .other-sign.pre {
	color: #00B578;
	border: 1px solid #00B578;
}

.goods-other .other-cont .other-sign.try {
	color: #FF8F1F;
	border: 1px solid #FF8F1F;
}

.goods-other .other-cont .other-sign.give {
	color: var(--red-color);
	border: 1px solid var(--red-color);
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
	width: 5.1rem;
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

.lh25 {
	line-height: 0.25rem;
}

.MB140 {
	margin-right: 1.4rem;
}

:deep(.van-rate) {
	height: 100%;
	width: 100%;
	display: flex;
	align-items: center;
	justify-content: space-between;
}

:deep(.van-rate__item:not(:last-child)) {
	padding-right: 0 !important;
}

:deep(.van-rate__icon) {
	font-size: 0.20rem;
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

.time-box > p:first-child {
	padding: 0 0 0.05rem;
}

.time-box > p {
	width: 2.7rem;
	text-align: center !important;
}

.day {
	margin-right: 0.04rem;
}

.tian {
	margin-right: 0.04rem;
}

.day, .shi, .fen, .miao {
	padding: 0.04rem 0.02rem;
	background: rgba(255, 255, 255, 0.3);
	border-radius: 0.06rem;
	color: #fff;
	margin: 0 0.04rem;
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

.price-ladder-img {
	width: 1rem;
}

.price-ladder .duan p {
	padding: 0.06rem 0;
}

.price-ladder .ladder-style .co-red {
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

.member {
	padding: 0.12rem 0.5rem;
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

.small-btn {
	width: 0.34rem;
	height: 0.33rem;
}

.small-btn-xin {
	width: 0.32rem;
	height: 0.28rem;
	margin-bottom: 0.15rem;
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

.get_more {
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

/*拼团*/
.item-tit {
	padding: 0.27rem 0.3rem;
}

.LH24 {
	line-height: 0.24rem;
}

.group-btn {
	font-size: 0.24rem;
	height: 0.5rem;
	line-height: 0.5rem;
	width: 1.3rem;
	padding: 0;
}

.group-btn-default {
	color: var(--red-color) !important;
	background: #fff !important;
	border: 1px solid var(--red-color) !important;
}

.group-rule {
	width: 5.86rem;
	height: 1.24rem;
	margin: 0.1rem 0 0.3rem 0.42rem;
}

.group-img {
	width: 0.8rem;
	height: 0.8rem;
	border-radius: 50%;
	background: #F8F8F8;
	box-sizing: border-box;
}

.red-border {
	border: 0.02rem solid var(--red-color);
}

.ML_30 {
	margin-left: -0.3rem;
}

.group-portrait {
	width: 2.2rem;
}

/*评价*/
.comment {
	padding: 0 0.3rem;
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

.shop_msg {
	padding: 0.2rem 0.2rem !important;
}

.store-head {
	background: #FAFAFA;
	border-radius: 0.2rem;
	padding: 0.3rem 0.2rem;
}

.shop_logo {
	width: 1.1rem;
	height: 1.1rem;
	border-radius: 50%;
}

.shop_detail > div {
	width: 50%;
	text-align: center;
}

.shop_detail > div:first-child {
	border-right: 0.02rem solid #e5e5e5;
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

.goodsAttr {
	width: 100%;
	min-height: 0.6rem;
	line-height: 0.4rem;
	text-align: center;
}

.goodsAttr > span:first-child {
	width: 2.3rem;
	border-right: 0.02rem solid #e5e5e5;
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 0.2rem 0;
}

.goodsAttr > span:last-child {
	padding: 0.2rem 0;
}


.goodsAttr_last {
	width: 100%;
	overflow: hidden;

	:deep(p) {
		font-size: 0.28rem;
		line-height: 0.5rem;
	}
}

.goodsAttr_sale {
	:deep(p) {
		font-size: 0.28rem;
		line-height: 0.5rem;
	}
}

//限制编译器详情最大宽度，防止超出750
.content :deep(table){
	width: 100% !important;
}

.content :deep(img) {
	max-width: 7.1rem;
	height: auto;
}

.customer_service span {
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
	max-width: 100% !important;
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

.shop_car .carNum {
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

.shop_car {
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

.add_car {
	background: linear-gradient(270deg, #FACB37 0%, #FACB37 100%);
	color: #ffffff;
}

.sell_out {
	color: var(--color-text-desc);
	background-color: #cccccc;
	width: 3.4rem;
}

.is_on_sale-btn {
	background: linear-gradient(-270deg, #F64651 0%, var(--red-color) 99%);
	width: 2.9rem;
	color: #fff !important;
}

.to_buy {
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