<template>
    <div class="myEvaluate-publish-container">
        <common-header title="发表评价"></common-header>
        <div class="main">
            <div class="item" v-for="(item, index) in result.items" :key="index">
                <div class="item-goods">
                    <div class="goods">
                        <div class="goods-img">
                            <img :src="item.goods_image" alt="" />
                        </div>
                        <div class="goods-info">
                            <p class="goods-title">
                                {{ item.goods_name }}
                            </p>
                        </div>
                    </div>
                </div>
                <div class="item-textarea">
                    <textarea v-model="item.comment" maxlength="500" placeholder="请发表您的评价..."></textarea>
                </div>
                <div class="item-upload">
                    <div class="upload-img" v-for="(image, imageIdx) in item.images" :key="imageIdx" :style="{'margin-right': (imageIdx + 1) % 3 == 0 ? '0' : '0.2rem',}" @click="imgView(item.images, imageIdx)">
                        <img :src="image" />
                        <img class="upload-img-delete" src="@/assets/images/order/comment_close.png"
                             @click.stop="deleteImage(index, imageIdx)" />
                    </div>
                    <van-uploader :before-read="beforeRead" :after-read="afterRead(index)" v-if="item.images.length < 5">
                        <div class="upload-btn">
                            <img src="@/assets/images/order/comment_camera.png" alt="" />
                            <p>{{item.images.length == 0 ? "添加图片" : item.images.length + "/5" }}</p>
                        </div>
                    </van-uploader>
                </div>
            </div>
            <!-- 评价满意度 -->
            <div class="item">
                <div class="rate">
                    <span class="title">综合评分</span>
                    <van-rate v-model="commentInfo.rank" color="#F71111" void-icon="star" void-color="#eee" @change="onChange"/>
                    <span>{{ formatRank(commentInfo.rank) }}</span>
                </div>
                <div class="rate" v-if="is_show_other">
                    <span class="title">产品服务</span>
                    <van-rate v-model="commentInfo.goods_rank" color="#F71111" void-icon="star" void-color="#eee" />
                    <span>{{ formatRank(commentInfo.goods_rank) }}</span>
                </div>
                <div class="rate" v-if="is_show_other">
                    <span class="title">价格合理度</span>
                    <van-rate v-model="commentInfo.price_rank" color="#F71111" void-icon="star" void-color="#eee" />
                    <span>{{ formatRank(commentInfo.price_rank) }}</span>
                </div>
                <div class="rate" v-if="is_show_other">
                    <span class="title">商家服务</span>
                    <van-rate v-model="commentInfo.bus_rank" color="#F71111" void-icon="star" void-color="#eee" />
                    <span>{{ formatRank(commentInfo.bus_rank) }}</span>
                </div>
                <div class="rate" v-if="is_show_other">
                    <span class="title">交货速度</span>
                    <van-rate v-model="commentInfo.delivery_rank" color="#F71111" void-icon="star" void-color="#eee" />
                    <span>{{ formatRank(commentInfo.delivery_rank) }}</span>
                </div>
                <div class="rate" v-if="is_show_other">
                    <span class="title">售后服务</span>
                    <van-rate v-model="commentInfo.service_rank" color="#F71111" void-icon="star" void-color="#eee" />
                    <span>{{ formatRank(commentInfo.service_rank) }}</span>
                </div>
            </div>
        </div>
        <div class="publish-group" v-if="result.items">
            <div class="check">
                <div>
                    <van-checkbox v-model="is_anonymous" checked-color="#F71111"></van-checkbox>
                    <span>匿名</span>
                </div>
                <span>您写的评价会以匿名的形式展现</span>
            </div>
            <div class="publish-btn" @click="save">发表</div>
        </div>
    </div>
</template>

<script setup>
import {ref, reactive, onMounted, nextTick, getCurrentInstance, watch, computed} from 'vue'
import { showImagePreview } from 'vant';
import { useRoute,useRouter } from 'vue-router'
import {initEvaluate,storeEvaluate} from "@/api/order.js";
import {uploadFileAxios} from "@/api/common.js";
const cns = getCurrentInstance().appContext.config.globalProperties
const route = useRoute()
const router = useRouter();

const loading = ref(false)
const is_show_other = ref(false)
const result = ref({})
const saveFlag = ref(false)
const is_anonymous = ref(true)
const commentInfo = ref({
    order_sn:'',
    items:[],
    is_anonymous:1,
    rank:0,
    goods_rank:0,
    price_rank:0,
    bus_rank:0,
    delivery_rank:0,
    service_rank:0,
})

onMounted( () => {
    commentInfo.value.order_sn = route.query.order_sn
    getPageData()
})

const getPageData = () => {
    let info = {
        order_sn: route.query.order_sn,
    };
    initEvaluate(info).then((res) => {
        if (cns.$constant.isSuccessCode(res)) {
            res.data.items.map((item) => {
                item.comment = ''
                item.images = []
            });
            result.value = { ...res.data };
            if (route.query.rank){
                commentInfo.value.rank = route.query.rank
                is_show_other.value = true
            }
            loading.value = true;
        } else if (cns.$constant.isUnLoginCode(res)) {
            cns.appRoute('login')
        }else {
            cns.$toast(res.message)
        }
    });
}
const onChange = () => {
    is_show_other.value = true
}

const formatRank = (rank) => {
    let rank_title = ''
    if (rank == 1){
        rank_title = '非常不满意'
    }else if (rank == 2){
        rank_title = '不满意'
    }else if (rank == 3){
        rank_title = '一般'
    }else if (rank == 4){
        rank_title = '满意'
    }else if (rank == 5){
        rank_title = '非常满意'
    }
    return rank_title
}

const save = () =>{
    if (saveFlag.value) return;
    let flag = false;
    let items = [];
    result.value.items.forEach(ite => {
        items.push({
            id:ite.id,
            comment:ite.comment,
            images:ite.images
        })
        if (ite.comment == ''){
            flag = true;
            cns.$toast("请填写您对该商品的评价内容~");
            return false;
        }
        if (ite.comment.length<10) {
            flag = true;
            cns.$toast("最少输入10个字哦~");
            return false;
        }
        if (ite.comment.length>500) {
            flag = true;
            cns.$toast("最多输入500个字哦~");
            return false;
        }
    })
    if (flag) return;
    if (commentInfo.value.rank == 0) {
        flag = true;
        cns.$toast("您还没给商品评分哦~");
        return false;
    }
    if (commentInfo.value.goods_rank == 0) {
        flag = true;
        cns.$toast("您还没给商品评分哦~");
        return false;
    }
    if (commentInfo.value.price_rank == 0) {
        flag = true;
        cns.$toast("您还没给商品评分哦~");
        return false;
    }
    if (commentInfo.value.bus_rank == 0) {
        flag = true;
        cns.$toast("您还没给商品评分哦~");
        return false;
    }
    if (commentInfo.value.delivery_rank == 0) {
        flag = true;
        cns.$toast("您还没给商品评分哦~");
        return false;
    }
    if (commentInfo.value.service_rank == 0) {
        flag = true;
        cns.$toast("您还没给商品评分哦~");
        return false;
    }
    if (flag) return;
    commentInfo.value.items = items
    commentInfo.value.is_anonymous = is_anonymous.value?1:0
    saveFlag.value = true;
    storeEvaluate(commentInfo.value).then((res) => {
        saveFlag.value = false
        if (cns.$constant.isSuccessCode(res)) {
            cns.$toast(res.message)
            router.back(-1)
        } else if (cns.$constant.isUnLoginCode(res)) {
            cns.appRoute('login')
        }else {
            cns.$toast(res.message)
        }
    });
}

const deleteImage = (index, imageIdx) =>{
    result.value.items[index].images.splice(imageIdx, 1);
}

const beforeRead = (file) => {
    if (
            file.type !== "image/jpeg" &&
            file.type !== "image/png" &&
            file.type !== "image/png"
    ) {
        cns.$toast("请上传 jpg/jpeg/png 格式图片");
        return false;
    }
    var isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
        this.$toast("文件大小不得超过5M");
    }
    return isLt5M;
}

const afterRead = (index) =>{
    return (file) => {
        console.log(file)
        let info = {
            file: file.file,
        };
        uploadFileAxios(info).then((res) => {
            if (cns.$constant.isSuccessCode(res)) {
                result.value.items[index].images.push(res.data.url);
            } else if (cns.$constant.isUnLoginCode(res)) {
                cns.appRoute('login')
            }else {
                cns.$toast(res.message)
            }
        });
    };
}

const imgView = (images, index) =>{
    showImagePreview({
        images,
        startPosition: index,
    });
}
</script>

<style scoped lang='scss'>
.myEvaluate-publish-container {
    background-color: #f2f2f2;
    height: auto;
    min-height: 100vh;
    padding: 0.2rem 0;
    box-sizing: border-box;

    .main {
        padding: 0 0.2rem;
    }

    .item {
        margin-bottom: 0.2rem;
        padding: 0.3rem 0.2rem 0.4rem;
        box-sizing: border-box;
        background: #fff;
        border-radius: 0.2rem;
        font-size: 0.24rem;
        color: #333;
        .rate {
            margin-top: 0.2rem;
            display: flex;
            align-items: center;
            .title{
                display: inline-block;
                width: 1.9rem;
                color: #333333;
                font-size: 0.28rem;
            }
            span {
                color: #999;
                padding-left: 0.2rem;
            }

            :deep(.van-icon.van-icon-star.van-rate__icon.van-rate__icon--full) {
                font-size: 0.32rem;
            }

            :deep(.van-icon.van-icon-star.van-rate__icon) {
                font-size: 0.32rem;
            }

        }

        .goods {
            height: 1.8rem;
            display: flex;

            .goods-img {
                width: 1.6rem;
                height: 1.6rem;
                border-radius: 0.1rem;
                background: #ffffff;
                box-shadow: 0 0 0.21rem 0 rgba(233, 233, 233, 0.55);

                img {
                    width: 100%;
                    height: 100%;
                    border-radius: 0.1rem;
                }
            }

            .goods-info {
                flex: 1;
                margin-left: 0.2rem;
                display: flex;
                flex-direction: column;

                .goods-title {
                    font-size: 0.26rem;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    display: -webkit-box;
                    -webkit-line-clamp: 5;
                    -webkit-box-orient: vertical;
                }

                .rate {
                    margin-top: 0.2rem;
                    display: flex;
                    align-items: center;
                    .title{
                        display: inline-block;
                        width: 1.9rem;
                    }
                    span {
                        color: #999;
                        padding-left: 0.2rem;
                    }

                    :deep(.van-icon.van-icon-star.van-rate__icon.van-rate__icon--full) {
                        font-size: 0.32rem;
                    }

                    :deep(.van-icon.van-icon-star.van-rate__icon) {
                        font-size: 0.32rem;
                    }

                }
            }
        }

        .item-textarea {
            margin: 0.2rem auto 0.3rem;

            textarea {
                width: 100%;
                min-height: 0.8rem;
                resize: none;
            }
        }

        .item-upload {
            display: flex;
            flex-wrap: wrap;

            .upload-btn {
                width: 2.1rem;
                height: 2.1rem;
                background: #ffffff;
                box-shadow: 0 0 0.21rem 0 rgba(233, 233, 233, 0.55);
                border-radius: 0.1rem;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;

                img {
                    width: 0.6rem;
                    height: 0.5rem;
                    margin-bottom: 0.3rem;
                }

                p {
                    text-align: center;
                }
            }

            .upload-img {
                margin-bottom: 0.2rem;
                position: relative;

                img:first-child {
                    width: 2.1rem;
                    height: 2.1rem;
                    border-radius: 0.1rem;
                    z-index: 100;
                }

                .upload-img-delete {
                    width: 0.32rem;
                    height: 0.32rem;
                    position: absolute;
                    top: -0.12rem;
                    right: -0.12rem;
                    z-index: 200;
                }
            }
        }
    }

    .publish-group {
        padding: 0.2rem;
        box-sizing: border-box;

        .check {
            font-size: 0.24rem;
            color: #999;
            display: flex;
            align-items: center;
            justify-content: space-between;

            >div {
                display: flex;
                align-items: center;

                span {
                    padding-left: 0.2rem;
                }
            }

            :deep(.van-checkbox) {
                height: 100%;
            }
        }

        .publish-btn {
            width: 100%;
            height: 0.68rem;
            line-height: 0.68rem;
            text-align: center;
            margin: 0.35rem auto;
            background: var(--main-color);
            border-radius: 0.34rem;
            color: #fff;
        }
    }
}
:deep(.van-checkbox__icon--checked .van-icon){
    border-color: var(--main-color) !important;
    background-color: var(--main-color) !important;
}
</style>
