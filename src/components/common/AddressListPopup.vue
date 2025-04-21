<template>
	<!--收货地址 -->
	<div class="coupon">
		<van-popup
			:show="show"
			round
			position="bottom"
			:close-on-click-overlay="false"
		>
			<div class="close-btn" @click="closePopup">
				<i class="iconfont">&#xea13;</i>
			</div>
			<div style="padding-top: 1.08rem;max-height: 11.12rem;overflow-y: auto;background: #fafafa;">
				<div class="goods-popup-title address-title" style="background: #fff;z-index:9998;">
					<h3>配送至</h3>
				</div>
				<div style="padding: 0.25rem 0.4rem 0.4rem;">
					<p class="fs28 co-666 MB30" style="line-height: 1;">当前配送至</p>
					<h4 class="fs28 co-333 MB30 fw-b" style="line-height: 1;">{{ limitAddress }}</h4>
					<h4 class="fs28 co-666" style="line-height: 1;">从我的收货地址选择</h4>
				</div>
				<div class="list_box address-list" style="padding: 0 0.2rem;">
					<div class="list" v-if="listLoading" style="padding-bottom: 0.4rem;">
						<div class="list-item" v-for="index in 2" :key="index" style="margin-bottom: 0.2rem;padding: 0.2rem;border-radius: 0.2rem;">
							<div style="margin-bottom: 0.2rem;height: 1.5rem;box-sizing:border-box;">
								<div class="s-flex ai-ct bg-f2" style="height: 0.44rem;width: 80%;margin-bottom: 0.1rem;border-radius: 0.06rem;"></div>
								<div class="s-flex ai-ct bg-f2" style="height: 0.44rem;width: 50%;margin-bottom: 0.1rem;border-radius: 0.06rem;"></div>
								<div class="s-flex ai-ct bg-f2" style="height: 0.44rem;width: 50%;border-radius: 0.06rem;"></div>
							</div>
							<div style="width: 100%;border: 1px solid #f2f2f2;"></div>
							<div class="s-flex ai-ct jc-bt" style="padding-top: 0.15rem;">
								<div class="s-flex ai-ct bg-f2" style="height: 0.44rem;width: 20%;border-radius: 0.06rem;"></div>
								<div class="s-flex ai-ct bg-f2" style="height: 0.44rem;width: 20%;border-radius: 0.06rem;"></div>
							</div>
						</div>
					</div>
					<template v-else>
						<div class="list">
							<div class="list-item" v-for="(item, index) in addressList" :key="index" :class="{ active: item.select }">
								<div class="s-flex ai-ct" @click="clickAddressBack(item.id, item)" style="border-bottom: 1px solid #D8D8D8;padding-bottom: 0.2rem;height: 1.6rem;box-sizing:border-box;">
									<div class="s-flex flex-1 ai-ct">
										<div class="address-info flex-1">
											<p class="elli-2">{{ item.province }}{{ item.city }}{{ item.district }} {{ item.address_detail }}</p>
											<div class="address-name s-flex">
												<label class="elli-1">{{ item.consignee }}</label>
												<span>{{ item.phone.substr(0, 3) + '****' + item.phone.substr(7) }}</span>
											</div>
										</div>
									</div>
									<div style="width: 0.3rem;flex: none;">
										<img style="width: 0.26rem;height: 0.19rem;" src="@/assets/images/good/address-select-g.png" alt="" v-if="addressId == item.id">
									</div>
								</div>
								<div class="s-flex ai-ct jc-bt">
									<div class="address-default s-flex ai-ct" :class="{ active: item.is_default }" @click.stop="clickDefaultSet(item)">
										<em class="iconfont">&#xe6ea;</em>
										<label :style="{ color: item.is_default ? 'var(--red-color)' : '#797979' }">{{item.is_default ? '已设为默认' : '设为默认' }}</label>
									</div>
									<div class="address-btn-contrl s-flex jc-fe" style="line-height: 0.78rem;">
										<span @click="clickDeleteAddress(item,index)">删除</span>
										<span @click="router.push({ name: 'addressForm', params: { id: item.id } , query:{back: 1} })">修改</span>
									</div>
								</div>
							</div>
						</div>
						<div class="nodata" v-if="nodata">
							<img src="@/assets/images/address/nodata.png" alt="">
							<p>您还没有地址，快来添加吧～</p>
						</div>
						<div class="address-btn">
							<router-link :to="{ name: 'addressForm', params: { id: 0 }, query:{back: 1} }" class="address-add s-flex jc-ct">新增收货地址</router-link>
						</div>
					</template>
				</div>
			</div>
		</van-popup>
		<van-popup v-model:show="showRemove" :close-on-click-overlay="false" round>
			<div class="choose-add-address choose-remove-address">
				<div class="view-h1">确定要删除地址吗？</div>
				<div class="s-flex ai-ct">
					<div class="choose-item s-flex ai-ct jc-ct" @click="showRemove = false, removeAddressId = null">取消</div>
					<div class="choose-item primary s-flex ai-ct jc-ct" @click="clickAddOrRemoveAddressSure">删除</div>
				</div>
			</div>
		</van-popup>
	</div>
</template>

<script setup>
import {ref, watch, nextTick, getCurrentInstance } from 'vue'
import { useRouter } from "vue-router";
import { getAddress, deleteAddress, setAddressDefault } from "@/api/address.js";
import { isSuccessCode, isUnLoginCode } from "@/utils/constant.js";

const router = useRouter();
const cns = getCurrentInstance().appContext.config.globalProperties

const props = defineProps({
	show: {
		type: Boolean,
		default: false
	},
	addressId: {
		type: Number,
		default: 0
	}
});

// 定义 emits
const emits = defineEmits(['update:show', 'changeAddress']);

const closePopup = () => {
	emits('update:show', false)
}

watch(() => props.show, (newVal) => {
	if (newVal) {
		getAddressData()
	}
})
const limitAddress = ref('请选择地址')
const nodata = ref(false)
const listLoading = ref(false)
const showRemove = ref(false)
const removeAddressId = ref(null)

const addressList = ref([])

const clickDefaultSet = (address) => {
	if (address.is_default) {
		return
	}
	setAddressDefault(address.id).then(res => {
		if (isSuccessCode(res)) {
			addressList.value.forEach((item, index) => {
				item.is_default = 0
				if (item.id == address.id) {
					item.is_default = 1
				}
			})
		} else {
			cns.$toast(res.message)
		}
	})
}
const clickDeleteAddress = (item, index) => {
	showRemove.value = true
	removeAddressId.value = item.id
}

const clickAddOrRemoveAddressSure = () => {
	deleteAddress({id: removeAddressId.value}).then(res => {
		if (isSuccessCode(res)) {
			const index = addressList.value.findIndex(item => item.id == removeAddressId.value)
			addressList.value.splice(index, 1)
			showRemove.value = false
			cns.$toast('删除成功')
			if (props.addressId == removeAddressId.value) {
				limitAddress.value = '请选择地址'
			}
			removeAddressId.value = null
		} else {
			cns.$toast(res.message)
		}
	})
}

const clickAddressBack = (id, item) => {
	if (props.addressId == id) {
		return
	}
	addressList.value.forEach((item, index) => {
		item.select = false
		if (item.id == id) {
			item.select = true
			limitAddress.value = `${item.province} ${item.city} ${item.district}`
			closePopup()
			emits('changeAddress', item)
		}
	})
}

const getAddressData = () => {
	listLoading.value = true
	getAddress().then(res => {
		listLoading.value = false
		if (isSuccessCode(res)) {
			if (res.data.length > 0) {
				addressList.value = res.data
				if(props.addressId){
					addressList.value.map(item => {
						item.select = false
						if (item.id == props.addressId) {
							item.select = true
							limitAddress.value = `${item.province} ${item.city} ${item.district}`
						}
					})
				}
				nodata.value = false
			} else {
				addressList.value = []
				nodata.value = true
			}
		} else if (isUnLoginCode(res)) {
			cns.appRoute('login', {}, 'replace')
		} else {
			cns.$toast(res.message)
		}
	})
}
</script>

<style scoped lang="scss">
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
		box-shadow: 0 0.02rem 0.2rem 0 rgba(0, 0, 0, 0.1);
		border-radius: 0.2rem;
		margin-bottom: 0.2rem;
		padding: 0.3rem 0.2rem 0.1rem;
		box-sizing: border-box;

		&:last-of-type {
			border-bottom: none;
		}
		.address-default em {
			color: #DDDDDD;
			margin-right: 0.1rem;
		}

		.address-default.active em {
			display: flex;
			width: 0.28rem;
			height: 0.28rem;
			align-items: center;
			justify-content: center;
			background-image: var(--red-color);
			color: var(--red-color);
			border-radius: 999px;
			box-shadow: 0 6px 20px 0 rgba(248, 43, 43, 0.3);
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
	background: var(--red-color);
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
.list-box {
	padding: 0 0.11rem 0.35rem;
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
</style>