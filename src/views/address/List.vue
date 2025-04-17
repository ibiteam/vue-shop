<template>
    <div class="address-list-container s-flex ai-ct flex-dir">
        <common-header v-bind="{title: '收货地址'}"></common-header>
        <van-list class="address-list-wrapper flex-1" :loading="address.loading" :finished="address.finished" finished-text="没有更多了">
            <div class="address-item" v-for="item in address.list" :key="item.address_id">
                <van-text-ellipsis :content="item.province + item.city + item.district" />
                <van-text-ellipsis :content="item.address_detail" />
                <p>
                    <span>{{ item.consignee }}&emsp;</span>
                    <span class="co-999">{{ item.phone }}&emsp;</span>
                </p>
                <van-divider style="border-color: #e5e5e6" />
                <div class="address-tools s-flex ai-ct jc-bt">
                    <div class="address-default s-flex ai-ct flex-1" :class="{ active: item.is_default }"  @click="setDefault(item)">
                        <em class="iconfont">&#xe6ea;</em>
                        <label :style="{ color: item.is_default ? 'var(--main-color)' : '#999' }">{{item.is_default ? '已设为默认' : '设为默认' }}</label>
                    </div>
                    <p @click="handleClickDelete(item)">删除</p>
                    <router-link :to="{'name': 'addressForm', params: {id: item.id}}" >修改 </router-link>
                </div>
            </div>
            <van-empty class="address-empty" v-if="address.list.length == 0" :image-size="['5.3rem', '3rem']" description="您还没有地址哦,快来添加吧～">
                <template #image>
                    <img src="@/assets/images/address/nodata.png" alt="empty" />
                </template>
                <router-link to="/address/0" class="address-add-btn">新增收货地址
                </router-link>
            </van-empty>
        </van-list>
        <van-sticky :offset-bottom="0" position="bottom" v-if="address.list.length > 0">
            <div class="address-bottom-wrapper">
                <van-button class="address-add-btn" @click="router.push({name: 'addressForm', params: {id: 0}})">
                    新增收货地址
                </van-button>
            </div>
        </van-sticky>
    </div>
</template>

<script setup>
import { ref, reactive, getCurrentInstance, onMounted } from 'vue';
import { getAddress, setAddressDefault, deleteAddress } from "@/api/address.js";
import { useRouter } from 'vue-router';

const cns = getCurrentInstance().appContext.config.globalProperties
const router = useRouter();

const address = reactive({
    loading: false,
    finished: false,
    list: [],
});

// 删除单个地址
const handleClickDelete = (item)  => {
    cns.$dialog.confirm({
        message: '确定要删除地址吗？',
        confirmButtonText: '删除',
    }).then(() => {
        deleteAddress({id: item.id}).then(res => {
            if (cns.$constant.isSuccessCode(res)) {
                const index = address.list.findIndex(addressItem => addressItem.id == item.id)
                address.list.splice(index, 1)
                cns.$toast('删除成功')
            } else {
                cns.$toast(res.message)
            }
        })
    })
}

const setDefault = (item) => {
    if (item.is_default) {
		return
	}
    setAddressDefault(item.id).then(res => {
        if (cns.$constant.isSuccessCode(res)) {
            address.list.forEach(addressItem => {
                addressItem.is_default = 0
                if (item.id == addressItem.id) {
                    addressItem.is_default = 1
                }
            })
        } else if (cns.$constant.isUnLoginCode(res)) {
            // 去登录
            cns.appRoute('login')
        }else {
            cns.$toast(res.message)
        }
    })
}

const getPageData = () => {
    getAddress().then(res => {
        if (cns.$constant.isSuccessCode(res)) {
            address.list = res.data
        } else if (cns.$constant.isUnLoginCode(res)) {
            // 去登录
            cns.appRoute('login')
        }else {
            cns.$toast(res.message)
        }
    })
}

onMounted(() => {
    getPageData()
})
</script>

<style lang='scss' scoped>
.address-list-container {
    width: 100%;
    height: 100%;
    background: #f2f2f2;
    .address-list-wrapper {
        width: 100%;
        padding: .14rem .2rem 1.7rem .2rem;
        position: relative;
        overflow-y: auto;
        .address-item{
            width: 100%;
            margin-top: .2rem;
            padding: .3rem;
            border-radius: .2rem;
            background: #fff;

            .address-type {
                min-width: .6rem;
                justify-content: center;
            }
            .address-tools {
                >p,a {
                    line-height: 0.4rem;
                    padding-left: .3rem;
                    color: #333;
                }
                .address-default em {
                    color: #DDD;
                    margin-right: 0.1rem;
                }

                .address-default.active em {
                    display: flex;
                    width: 0.28rem;
                    height: 0.28rem;
                    align-items: center;
                    justify-content: center;
                    color: var(--main-color);
                    border-radius: 999px;
                }
            }
        }
    }
    .address-add-btn {
        display: block;
        width: 4.12rem;
        height: 0.88rem;
        margin: 0 auto;
        line-height: 0.88rem;
        text-align: center;
        border-radius: 0.6rem;
        background: linear-gradient(
            to right,
            var(--main-color),
            var(--main-color-30)
        );
        box-shadow: 0 6px 20px 0 var(--main-color-30);
        font-size: 0.32rem!important;
        color: #ffffff;
    }
    .address-empty {
        .address-add-btn{
            margin: 0.9rem auto;
        }
    }
    :deep(.van-sticky){
        width: 100%;
    }
    .address-bottom-wrapper {
        width: 7.5rem;
        height: 1.5rem;
        text-align: center;
        padding: 0.3rem 0.2rem;
        box-sizing: border-box;
        box-shadow: 0 -0.2rem 0.2rem -0.22rem rgb(0 0 0 / 20%);
        background: #fff;
        .address-add-btn{
            width: 7.1rem;
            background: var(--main-color);
        }
        :deep(.van-button__text) {
            font-size: .32rem;
        }
    }
}
</style>