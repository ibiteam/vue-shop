<template>
    <div>
        <van-popup class="img-cropper-pop" v-model:show="show" :close-on-click-overlay="false" :style="{ height: '100vh' }" :lock-scroll="false">
            <div class="pop-wrap">
                <div class="cropper-box">
                    <h5-cropper v-if="!reset" id="h5_cropper" ref="cropper" :option="option" @getbase64="getbase64Data" @getFile="getFile"></h5-cropper>
                </div>
                <div class="cropper-tools">
                    <div class="tools s-flex ai-ct jc-bt">
                        <img style="height: .4rem;" src="https://cdn.toodudu.com/uploads/2024/03/07/向右@2x.png" alt="" @click="imgRotate">
                        <span class="fs30 co-fff" @click="imgReset">还原</span>
                    </div>
                    <div class="tools s-flex ai-ct jc-bt">
                        <img style="height: .3rem;" src="https://cdn.toodudu.com/uploads/2024/03/06/容器@2x.png" alt="" @click="imgCancel">
                        <img style="height: .3rem;" src="https://cdn.toodudu.com/uploads/2024/03/06/容器@2x(1).png" alt="" @click="imgSave">
                    </div>
                </div>
            </div>
        </van-popup>
    </div>
</template>

<script>
import H5Cropper from "vue-cropper-h5";
import $ from 'jquery'
export default {
    name: 'imgCropperPop',
    components: {
        H5Cropper
    },
    props: {
        visible: {
            type: Boolean,
            default: false,
        },
        file: null,
        type: String,
    },
    data() {
        return {
            show: false,
            reset: false,
            option: {
                // mode: '100% auto',
                fixedBox: true,
                canMoveBox: false,
                autoCropWidth: document.body.clientWidth - 45,
                autoCropHeight: document.body.clientWidth - 45,
                maxImgSize: document.body.clientWidth - 45,
                mode: 'cover'
            }
        }
    },
    watch: {
        visible: {
            immediate: true,
            handler: function(newVal) {
                this.show = newVal
                if (this.show) {

                }
            }
        },
        file: {
            immediate: true,
            handler: function(newVal) {
                if (newVal) {
                    this.$nextTick(() => {
                        this.$refs.cropper.loadFile(newVal)
                    })
                }
            }
        },
    },
    mounted() {
    },
    methods: {
        getFile(file) {
            this.$emit('getFile', file)
            this.$emit('close')
        },
        getbase64Data(file) {
            this.$emit('getbase64Data', file)
            this.$emit('close')
        },
        imgSave() {
            const child = $('.cropper-box .upbtn .btndiv').children()
            if (child && child[2]) {
                child[2].click()
            }
        },
        imgRotate() {
            this.$refs.cropper.rotating();
        },
        imgReset() {
            if (!this.file) return
            this.reset = true
            setTimeout(() => {
                this.reset = false
                this.$nextTick(() => {
                    this.$refs.cropper.loadFile(this.file)
                })
            }, 100)
        },
        imgCancel() {
            this.$refs.cropper.canceltailor()
            this.closePop()
        },
        closePop() {
            this.$emit('close')
        }
    },
}

</script>
<style lang='scss' scoped>
.img-cropper-pop {background: #999;}
.pop-wrap {
    width: 7.5rem; height: 100%; box-sizing: border-box; overflow: hidden;background-color: #000;
    :deep(.cropper-box) {width: 100%; height: calc(100% - 2.4rem); padding: .45rem .45rem 0; box-sizing: border-box; overflow: hidden; position: relative; z-index: 1;
        .upbtn, .upbtn .bg {height: 100%; overflow: hidden;}
        .upbtn .wrapper {height: calc(100% - 2.4rem); padding: .45rem .45rem 0; box-sizing: border-box; overflow: hidden;}
    }
    .cropper-tools {width: 100%; height: 2.4rem; position: relative; z-index: 2; background-color: #000;}
    .tools:nth-child(1) {padding: 0.3rem .5rem .35rem; border-bottom: 1px solid #373737;}
    .tools:nth-child(2) {padding: 0.5rem .5rem .6rem;}
}
</style>
