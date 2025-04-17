<template>
    <van-popup v-model:show="popShow" position="bottom" round :style="{'height': '70%'}" @click-overlay="handleClose">
        <div class="address-select-box">
            <p class="fs36 fw-b">请选择所在地区</p>
            <van-divider></van-divider>
            <div class="tab-wrapper s-flex ai-ct">
                <div class="item elli-1" :class="{'active': form.tab == 0}" @click="handleClickTab(0)">{{ form.label[0] || '请选择' }}</div>
                <div class="item elli-1" :class="{'active': form.tab == 1}" v-if="form.value[0]" @click="handleClickTab(1)">{{form.label[1] || '请选择'}}</div>
                <div class="item elli-1" :class="{'active': form.tab == 2}" v-if="form.value[1]" @click="handleClickTab(2)">{{ form.label[2] || '请选择' }}</div>
            </div>
        </div>
        <div class="address-list-wrapper" ref="addressListWrapperRef">
            <template v-for="(value, key) in form.group" :key="value.value" v-if="form.tab == 0">
                <ul class="address-item">
                    <p class="index">{{ key }}</p>
                    <li class="content s-flex ai-ct jc-bt" v-for="(item, index) in value" :id="`addressItemRef${item.value}`" :key="item.value" @click="handleClickAddressItem({item})">
                        <p class="flex-1">
                            <van-text-ellipsis class="label" :class="{'active': item.value == form.value[form.tab]}" :content="item.label" />
                        </p>
                        <van-icon name="success" v-if="item.value == form.value[form.tab]" color="var(--main-color)" />
                    </li>
                </ul>
            </template>
            <template v-for="(value, key) in form.city" :key="value.value" v-if="form.tab == 1">
                <ul class="address-item">
                    <p class="index">{{ key }}</p>
                    <li class="content s-flex ai-ct jc-bt" v-for="(item, index) in value" :id="`addressItemRef${item.value}`" :key="item.value" @click="handleClickAddressItem({item})">
                        <p class="flex-1">
                            <van-text-ellipsis class="label" :class="{'active': item.value == form.value[form.tab]}" :content="item.label" />
                        </p>
                        <van-icon name="success" v-if="item.value == form.value[form.tab]" color="var(--main-color)" />
                    </li>
                </ul>
            </template>
            <template v-for="(value, key) in form.area" :key="value.value" v-if="form.tab == 2">
                <ul class="address-item">
                    <p class="index">{{ key }}</p>
                    <li class="content s-flex ai-ct jc-bt" v-for="(item, index) in value" :id="`addressItemRef${item.value}`" :key="item.value" @click="handleClickAddressItem({item})">
                        <p class="flex-1">
                            <van-text-ellipsis class="label" :class="{'active': item.value == form.value[form.tab]}" :content="item.label" />
                        </p>
                        <van-icon name="success" v-if="item.value == form.value[form.tab]" color="var(--main-color)" />
                    </li>
                </ul>
            </template>
        </div>
    </van-popup>
</template>

<script setup>
import { ref, reactive, getCurrentInstance, watch, nextTick, onMounted } from 'vue';
import {addressGroup, addressAll} from './Address.js'
import { getRegionGroup, getRegion } from '@/api/address.js'

const cns = getCurrentInstance().appContext.config.globalProperties
const props = defineProps({
    show: {
        type: Boolean,
        default: false
    },
    value: {
        type: Array,
        default: () => []
    }
})
const emit = defineEmits(['close', 'select'])
/**关闭相关 */
const popShow = ref(false)
const handleClose = () => {
    emit('close')
}
/**选择切换 */
const form = reactive({
    tab: 0, // tab切换
    value: [],
    label: [],
    all: [], // 全部下拉
    group: [],
    city: [], // 城市下拉
    area: [], // 区域下拉
})
const addressListWrapperRef = ref(null)

// 顶部省市区切换
const handleClickTab = (index) => {
    if (index == form.tab) return
    form.tab = index
    nextTick(() => {
        switch(index) {
            case 0:
                document.querySelector('#addressItemRef' + form.value[0]).scrollIntoView({
                    behavior: 'smooth'
                })
                break;
            case 1:
                document.querySelector('#addressItemRef' + form.value[1]).scrollIntoView({
                    behavior: 'smooth'
                })
                break;
            case 2:
                document.querySelector('#addressItemRef' + form.value[2]).scrollIntoView({
                    behavior: 'smooth'
                })
                break;
        }
    })
}
// 选择项点击
const handleClickAddressItem = (params) => {
    const {item} = params
    switch(form.tab) {
        case 0:
            form.value = [item.value]
            form.label = [item.label]
            form.tab = 1
            form.city = item.children
            form.area = []
            break;
        case 1:
            form.value = [form.value[0], item.value]
            form.label = [form.label[0], item.label]
            form.tab = 2
            form.area = item.children
            break;
        case 2:
            form.value = [form.value[0], form.value[1], item.value]
            form.label = [form.label[0], form.label[1], item.label]
            emit('select', {value: form.value, label: form.label})
            break;
    }
    console.log(form.value)
    addressListWrapperRef.value.scrollTo({
        top: 0,
        behavior: 'smooth'
    })
}

const formReset = () => {
    form.tab = 0
    form.value = []
    form.label = []
    form.city = []
    form.area = []
}
// 初始化传参回显
const formInit = () => {
    if (!form.value[0]) return
    const i = form.all.findIndex(item => item.value == form.value[0])
    if (i == -1) return
    form.label = [form.all[i].label]
    form.city = groupByPinyinFirst(form.all[i].children)
    if (!form.value[1]) return
    let c = form.all[i].children.findIndex(item => item.value == form.value[1])
    if (c == -1) return
    form.area = groupByPinyinFirst(form.all[i].children[c].children)
}

// 根据allData 生成group数据
const groupByPinyinFirst = (data) => {
    const result = {};

    function traverse(items) {
        for (const item of items) {
            const { pinyin_first } = item;
            if (form.value[1] && item.value == form.value[1]) {
                form.label[1] = item.label
            }
            if (form.value[2] && item.value == form.value[2]) {
                form.label[2] = item.label
            }
            if (!result[pinyin_first]) {
                result[pinyin_first] = [];
            }
            result[pinyin_first].push(item);

            // if (item.children && item.children.length > 0) {
            //     traverse(item.children);
            // }
        }
    }

    traverse(data);
    return result;
}

watch(()=> props, (val) => {
    if (val) {
        popShow.value = val.show
        formReset()
        if (val.value) {
            let value = new Array(val.value).filter(item => item && item !== '')
            if (!value.length) return
            form.value = value[0]
            nextTick(() => {
                document.querySelector('#addressItemRef' + form.value[0]) && document.querySelector('#addressItemRef' + form.value[0]).scrollIntoView({
                    behavior: 'smooth'
                })
                formInit()
            })
        }
    }
}, {immediate: true, deep: true})

onMounted(() => {
    getRegionGroup().then(res =>{
        if (cns.$constant.isSuccessCode(res)) {
            form.group = res.data
        } else if (cns.$constant.isUnLoginCode(res)) {
            // 去登录
            cns.appRoute('login')
        }else {
            cns.$toast(res.message)
        }
    })
    getRegion().then(res =>{
        if (cns.$constant.isSuccessCode(res)) {
            form.all = res.data
        } else if (cns.$constant.isUnLoginCode(res)) {
            // 去登录
            cns.appRoute('login')
        }else {
            cns.$toast(res.message)
        }
    })
})


</script>

<style lang='scss' scoped>
.address-select-box {
    width: 100%;
    height: 2rem;
    padding: .2rem;
    .tab-wrapper {
        .item{
            max-width: 33%;
            margin-right: .3rem;
            font-size: .32rem;
            font-weight: bold;
            position: relative;
            padding: 0 0 .1rem;
            &.active {
                color: var(--main-color);
                &::after {
                    content: '';
                    display: block;
                    width: .36rem;
                    height: .06rem;
                    background: var(--main-color);
                    border-radius: .04rem;
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    margin: 0 auto;
                }
            }
        }
    }
}
.address-list-wrapper{
    width: 100%;
    height: calc(100% - 2rem);
    padding: 0 0 .2rem .2rem;
    overflow: hidden auto;
    li,p{
        padding: .15rem 0;
    }
    .index {
        font-weight: bold;
        font-size: .3rem;
    }
    .content {
        padding-right: .2rem;
    }
    .label {
        font-size: .28rem;
        &.active {
            color: var(--main-color);
            font-weight: bold;
        }
    }
}
</style>