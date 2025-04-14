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
                    <textarea v-model="result.items[index].content" maxlength="500" placeholder="请发表您的评价..."></textarea>
                </div>
                <div class="item-upload">
                    <div class="upload-img" v-for="(image, imageIdx) in item.imagesGroup" :key="imageIdx" :style="{
							'margin-right': (imageIdx + 1) % 3 == 0 ? '0' : '0.2rem',
						}" @click="imgView(item.imagesGroup, imageIdx)">
                        <img :src="image" />
                        <img class="upload-img-delete" src="@/assets/images/order/comment_close.png"
                             @click.stop="deleteImage(index, imageIdx)" />
                    </div>
                    <van-uploader :before-read="beforeRead" :after-read="afterRead(index)"
                                  v-if="item.imagesGroup.length < 6">
                        <div class="upload-btn">
                            <img src="@/assets/images/order/comment_camera.png" alt="" />
                            <p>
                                {{
                                    item.imagesGroup.length == 0
                                            ? "添加图片"
                                            : item.imagesGroup.length + "/6"
                                }}
                            </p>
                        </div>
                    </van-uploader>
                </div>
            </div>
            <!-- 评价满意度 -->
            <div class="item">
                <div class="rate">
                    <span class="title">综合评分</span>
                    <van-rate v-model="commentInfo.rank" color="#F71111" void-icon="star" void-color="#eee" @change="onChange"/>
                    <span>{{ commentInfo.rank==1?'非常不满意':commentInfo.rank==2?'不满意':commentInfo.rank==3?'一般':commentInfo.rank==4?'满意':commentInfo.rank==5?'非常满意':''}}</span>
                </div>
                <div class="rate" v-if="is_show_other">
                    <span class="title">产品服务</span>
                    <van-rate v-model="commentInfo.productRank" color="#F71111" void-icon="star" void-color="#eee" />
                    <span>{{ commentInfo.productRank==1?'非常不满意':commentInfo.productRank==2?'不满意':commentInfo.productRank==3?'一般':commentInfo.productRank==4?'满意':commentInfo.productRank==5?'非常满意':''}}</span>
                </div>
                <div class="rate" v-if="is_show_other">
                    <span class="title">价格合理度</span>
                    <van-rate v-model="commentInfo.priceRank" color="#F71111" void-icon="star" void-color="#eee" />
                    <span>{{ commentInfo.priceRank==1?'非常不满意':commentInfo.priceRank==2?'不满意':commentInfo.priceRank==3?'一般':commentInfo.priceRank==4?'满意':commentInfo.priceRank==5?'非常满意':''}}</span>
                </div>
                <div class="rate" v-if="is_show_other">
                    <span class="title">商家服务</span>
                    <van-rate v-model="commentInfo.busRank" color="#F71111" void-icon="star" void-color="#eee" />
                    <span>{{ commentInfo.busRank==1?'非常不满意':commentInfo.busRank==2?'不满意':commentInfo.busRank==3?'一般':commentInfo.busRank==4?'满意':commentInfo.busRank==5?'非常满意':''}}</span>
                </div>
                <div class="rate" v-if="is_show_other">
                    <span class="title">交货速度</span>
                    <van-rate v-model="commentInfo.deliveryRank" color="#F71111" void-icon="star" void-color="#eee" />
                    <span>{{ commentInfo.deliveryRank==1?'非常不满意':commentInfo.deliveryRank==2?'不满意':commentInfo.deliveryRank==3?'一般':commentInfo.deliveryRank==4?'满意':commentInfo.deliveryRank==5?'非常满意':''}}</span>
                </div>
                <div class="rate" v-if="is_show_other">
                    <span class="title">售后服务</span>
                    <van-rate v-model="commentInfo.salesRank" color="#F71111" void-icon="star" void-color="#eee" />
                    <span>{{ commentInfo.salesRank==1?'非常不满意':commentInfo.salesRank==2?'不满意':commentInfo.salesRank==3?'一般':commentInfo.salesRank==4?'满意':commentInfo.salesRank==5?'非常满意':''}}</span>
                </div>
            </div>
        </div>
        <div class="publish-group" v-if="result.items">
            <div class="check">
                <div>
                    <van-checkbox v-model="commentInfo.is_anonymous" checked-color="#F71111"></van-checkbox>
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
import { useRoute } from 'vue-router'
import {initEvaluate,storeEvaluate} from "@/api/order.js";
import {uploadFileAxios} from "@/api/account.js";
const cns = getCurrentInstance().appContext.config.globalProperties
const route = useRoute()

const loading = ref(false)
const is_show_other = ref(false)
const result = ref({})
const saveFlag = ref(false)
const commentInfo = ref({
    no:'',
    items:[],
    is_anonymous:true,
    rank:0,
    goods_rank:0,
    price_rank:0,
    bus_rank:0,
    delivery_rank:0,
    service_rank:0,
})

onMounted( () => {
    commentInfo.value.no = route.query.no
    getPageData()
})

const getPageData = () => {
    let info = {
        no: route.query.no,
    };
    initEvaluate(info).then((res) => {
        if (cns.$constant.isSuccessCode(res)) {
            res.data.items.map((item) => {
                item.rank = 0;
                item.productRank = 0;
                item.priceRank = 0;
                item.busRank = 0;
                item.deliveryRank = 0;
                item.salesRank = 0;
                item.content = "";
                item.imagesGroup = [];
            });
            result.value = { ...res.data };
            if (route.query.rank){
                result.value.items[0].rank = route.query.rank
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

const save = () =>{
    if (saveFlag.value) return;
    let flag = false;
    let items = [];
    for (let k in result.items.value) {
        let obj = {
            rank: result.items.value[k].rank,
            productRank: result.items.value[k].productRank,
            priceRank: result.items.value[k].priceRank,
            busRank: result.items.value[k].busRank,
            deliveryRank: result.items.value[k].deliveryRank,
            salesRank: result.items.value[k].salesRank,
            content: result.items.value[k].content,
            images: result.items.value[k].imagesGroup,
            goods_id: result.items.value[k].goods_id,
        };
        items.push(obj);
        if (result.items.value[k].content == '') {
            flag = true;
            cns.$toast("请填写您对该商品的评价内容~");
            return false;
        }
        if (result.items.value[k].content.length<10) {
            flag = true;
            cns.$toast("最少输入10个字哦~");
            return false;
        }
        if (result.items.value[k].content.length>500) {
            flag = true;
            cns.$toast("最多输入500个字哦~");
            return false;
        }
        if (result.items.value[k].rank == 0 && k==0) {
            flag = true;
            cns.$toast("您还没给商品评分哦~");
            return false;
        }
        if (result.items.value[k].productRank == 0 && k==0) {
            flag = true;
            cns.$toast("您还没给商品评分哦~");
            return false;
        }
        if (result.items.value[k].priceRank == 0 && k==0) {
            flag = true;
            cns.$toast("您还没给商品评分哦~");
            return false;
        }
        if (result.items.value[k].busRank == 0 && k==0) {
            flag = true;
            cns.$toast("您还没给商品评分哦~");
            return false;
        }
        if (result.items.value[k].deliveryRank == 0 && k==0) {
            flag = true;
            cns.$toast("您还没给商品评分哦~");
            return false;
        }
        if (result.items.value[k].salesRank == 0 && k==0) {
            flag = true;
            cns.$toast("您还没给商品评分哦~");
            return false;
        }


    }
    if (flag) return;
    saveFlag.value = true;
    // let info = {
    //     no: route.query.no,
    //     items,
    //     is_anonymous: is_anonymous.value,
    // };
    // storeEvaluate(commentInfo.value).then((res) => {
    //     if (res.code == 200) {
    //         Dialog.confirm({
    //             message: "发表评价成功！",
    //             confirmButtonText: "查看评价",
    //             cancelButtonText: "继续评价",
    //         })
    //                 .then(() => {
    //                     this.appRoute("myEvaluate", {}, { active: 1 }, 'replace');
    //                 })
    //                 .catch(() => {
    //                     this.appRoute("myEvaluate", {}, { active: 0 }, 'replace');
    //                 });
    //     } else {
    //         this.saveFlag = false;
    //         cns.$toast(res.message);
    //     }
    // });
}

const deleteImage = (index, imageIdx) =>{
    result.value.items[index].imagesGroup.splice(imageIdx, 1);
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
    return true;
}

const afterRead = (index) =>{
    return (file) => {
        let info = {
            file: file.content,
            auth: 0
        };
        uploadFileAxios(info).then((res) => {
            if (cns.$constant.isSuccessCode(res)) {
                result.value.items[index].imagesGroup.push(res.data.url);
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
