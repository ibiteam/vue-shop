<template>
    <div class="integral-detail">
        <common-header :title="title"></common-header>

        <!--剩余积分-->
        <div class="integral-exchange s-flex">
            <p>{{ total }}<span>积分</span></p>
<!--            <a class="exchange-btn">立即兑换</a>-->
        </div>
        <!--tab部分-->
        <van-sticky offset-top="46px">
            <van-tabs
                v-model="tabIndex"
                class="integral-tabs"
                line-width="2em"
                @click="handleChangeTabs"
            >
                <van-tab title="全部"></van-tab>
                <van-tab title="获取"></van-tab>
                <van-tab title="兑换"></van-tab>
            </van-tabs>
        </van-sticky>
        <!--积分列表-->
        <div
            class="integral-list"
            v-if="integralList && integralList.length > 0"
            id="integral_list"
            ref="integral_list"
        >
            <van-list
                v-model="loading"
                :finished="finished"
                :finished-text="integralMeta.total < 10 ? '' : '没有更多了'"
                offset="1"
                @load="loadMore"
            >
                <div class="list-item s-flex" v-for="(item, index) in integralList" :key="index" :class="{ add: item.integral_type != 2 }">
                    <div class="list-info">
                        <p>{{ item.created_at }}</p>
                        <h1>{{ item.desc }}</h1>
                    </div>
                    <div class="list-num">
                        {{ item.type == 1 ? "+" : "-" }}{{ item.number }}
                    </div>
                </div>
            </van-list>
        </div>
        <!--暂无数据-->
        <div v-if="noData" class="no-Data">
            <img src="@/assets/images/nodata.png" alt="" class="no-Img">
            <span>暂无数据</span>
        </div>
    </div>
</template>

<script setup>
import {ref, reactive, onMounted, nextTick, getCurrentInstance} from 'vue'
import {getIntegralListAxios} from "@/api/property.js";
const cns = getCurrentInstance().appContext.config.globalProperties
const info = ref({
    page: 1,
    flag: 0,
})
const title = ref('积分明细')
const tabIndex = ref(0)
const loading = ref(false)
const finished =ref(false)
const integralList = ref([])
const noData = ref(true)
const total = ref('')
const integralMeta = ref({})

onMounted(() => {
    getPageData()
})

const getPageData = () => {
    getIntegralListAxios(info.value).then((res) => {
        if (cns.$constant.isSuccessCode(res)) {
            nextTick(function () {
                total.value = res.data.all_integral
                if (res.data.list.length > 0) {
                    integralList.value = res.data.list
                    noData.value = false;
                } else {
                    integralList.value = [];
                    noData.value = true;
                }
                integralMeta.value = res.data.meta
                info.page = 2;
            });
        } else if (cns.$constant.isUnLoginCode(res)) {
            cns.appRoute('login', {}, 'replace')
        } else {
            cns.$toast(res.message);
        }
    });
}

const handleChangeTabs = () => {
    noData.value = false;
    finished.value = false
    info.flag = tabIndex.value;
    info.page = 1;
    integralList.value = []
    getPageData()
}

const loadMore = () =>{
    if (integralList.value.length < integralMeta.value.total) {
        getIntegralListAxios(info.value).then((res) => {
            loading.value = false;
            if (cns.$constant.isSuccessCode(res)) {
                if (res.data.list.length > 0) {
                    integralList.value = integralList.value.concat(res.data.list);
                } else {
                    finished.value = true;
                }
              integralMeta.value = res.data.meta
                info.page++;
            } else if (cns.$constant.isUnLoginCode(res)) {
                cns.appRoute('login', {}, 'replace')
            } else {
                loading.value = false;
                finished.value = false;
            }
        });
    } else {
        loading.value = false;
        finished.value = true;
    }
}
</script>

<style scoped lang="scss">
.integral-detail .integral-prompt {
    line-height: 0.6rem;
    padding: 0 0.48rem;
    background-color: #ffffff;
}
.integral-detail .integral-prompt img {
    width: 0.42rem;
    height: 0.42rem;
    margin: 0.09rem 0.15rem 0.09rem 0;
}
.integral-detail .integral-prompt p {
    font-size: 0.24rem;
}
.integral-detail .integral-exchange {
    width: 7.1rem;
    height: 1.71rem;
    line-height: 1.71rem;
    padding: 0 0.3rem;
    margin: 0.2rem auto 0.4rem auto;
    background: url("@/assets/images/property/integral/exchange_back.png") center
    no-repeat;
    background-size: 100% 100%;
    justify-content: space-between;
    box-sizing: border-box;
}
.integral-detail .integral-exchange p {
    font-size: 0.52rem;
    font-weight: bold;
    color: #ffffff;
}
.integral-detail .integral-exchange p span {
    font-size: 0.26rem;
    font-weight: normal;
    margin-left: 0.1rem;
}
.integral-detail .integral-exchange .exchange-btn {
    width: 1.6rem;
    height: 0.66rem;
    line-height: 0.66rem;
    text-align: center;
    margin: 0.54rem 0;
    border: 1px solid #ffffff;
    border-radius: 0.6rem;
    font-size: 0.24rem;
    color: #ffffff;
}
:deep(.van-tabs__nav) {
    background: #f2f2f2;
}
:deep(.integral-detail .integral-tabs .van-tabs__wrap::after) {
    display: none;
}
:deep(.integral-detail .integral-tabs .van-tabs__line) {
    background: var(--main-color);
}
:deep(.van-tab__text) {
    font-weight: bold;
}

/*列表样式*/
.integral-list {
    padding: 0 0.2rem 0.5rem;
}
.integral-list .list-item {
    padding: 0.2rem 0.28rem;
    margin-top: 0.2rem;
    background-color: #ffffff;
    border-radius: 0.2rem;
    justify-content: space-between;
}
.integral-list .list-item p {
    line-height: 0.56rem;
}
.integral-list .list-item h1 {
    line-height: 0.48rem;
}
.integral-list .list-item h1 span {
    margin-left: 0.1rem;
}
.integral-list .list-item h1 span i {
    vertical-align: text-bottom;
    font-size: 0.28rem;
}
.integral-list .list-item p,
.integral-list .list-item h1 span {
    font-size: 0.24rem;
    color: #666666;
}
.integral-list .list-item h1 {
    font-size: 0.28rem;
}
.integral-list .list-item .list-num {
    max-width: 1.4rem;
    line-height: 1.04rem;
    font-size: 0.36rem;
    font-weight: bold;
    letter-spacing: 0.05em;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
}
.integral-list .list-item.add .list-num {
    color: #f71111;
}

/*无数据*/
.no-Data{
    width: 100%;
    height: 80vh;
    text-align: center;
    font-size: 0.28rem;
    padding: 1rem auto!important;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    flex-direction: column;
}
.no-Img{
    width: 6.1rem;
    height: 2.73rem;
    margin-top: 3.17rem;
    margin-bottom: .75rem;
}
</style>
