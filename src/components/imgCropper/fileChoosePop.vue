<template>
    <div>
        <van-popup v-model:show="show" position="bottom" round :close-on-click-overlay="false">
            <div class="pop-wrap">
                <div class="s-flex ai-ct jc-bt" style="padding: .4rem 1rem;">
                    <div class="item s-flex ai-ct flex-dir" @click="selectType('camera')">
                        <img src="https://cdn.toodudu.com/uploads/2024/03/06/拍照@2x.png" alt="" />
                        <p>拍照</p>
                    </div>
                    <div class="item s-flex ai-ct flex-dir" @click="selectType('photo')">
                        <img src="https://cdn.toodudu.com/uploads/2024/03/06/相册@2x.png" alt="" />
                        <p>相册</p>
                    </div>
                    <div class="item s-flex ai-ct flex-dir" @click="saveImg">
                        <img src="https://cdn.toodudu.com/uploads/2024/03/06/保存图片@2x.png" alt="" />
                        <p>保存图片</p>
                    </div>
                </div>
                <input type="file" ref="file_input" id="file_input" accept="image/*" style="display: none;" @change="fileChange">
                <div class="cancel-btn" @click="closePop">取消</div>
            </div>
        </van-popup>
    </div>
</template>

<script>
import $ from 'jquery'
export default {
    name: 'fileChoosePop',
    props: {
        visible: {
            type: Boolean,
            default: false,
        },
        choose_data: {
            type: Object,
            default: {
                img: ''
            }
        }
    },
    data() {
        return {
            show: false,
            capture: ''
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
    },
    mounted() {

    },
    methods: {
        fileChange(e) {
            if (!e.target.files || !e.target.files[0]) return
            // if (!this.beforeAvatarUpload(e.target.files[0])) return
            this.$emit('save', e.target.files[0])
            this.$refs.file_input.value = ''
        },
        selectType(type) {
            this.capture = type
            if (type == 'camera') {
                $("#file_input").attr("capture", "camera");
            } else {
                $("#file_input").removeAttr("capture");
            }
            this.$refs.file_input.click()
        },
        saveImg() {
            if (!this.choose_data.img) {
                this.$toast('请先上传图片')
                return false
            }
            let name = this.choose_data.img.split('/')
            if (!name || name.length == 0) return
            this.downloadImage(this.choose_data.img, name[name.length-1])
        },
        downloadImage(imgsrc, name) {
            let image = new Image()
            // 解决跨域 Canvas 污染问题
            image.setAttribute('crossOrigin', 'anonymous')
            image.onload = function () {
                let canvas = document.createElement('canvas')
                canvas.width = image.width
                canvas.height = image.height
                let context = canvas.getContext('2d')
                context.drawImage(image, 0, 0, image.width, image.height)
                let url = canvas.toDataURL('image/png') // 得到图片的base64编码数据
                let a = document.createElement('a') // 生成一个a元素
                let event = new MouseEvent('click') // 创建一个单击事件
                a.download = name || 'photo' // 设置图片名称
                a.href = url // 将生成的URL设置为a.href属性
                a.dispatchEvent(event) // 触发a的单击事件
            }
            image.src = imgsrc
        },
        closePop() {
            this.$emit('close')
        }
    },
}

</script>
<style lang='scss' scoped>
.pop-wrap {
    width: 7.5rem; box-sizing: border-box; overflow: hidden; background: #F6F6F6;
    .item img { width: .94rem; height: .94rem; margin-bottom: .2rem;}
    .item p {font-size: .28rem; color: #999;}
    .cancel-btn { width: 7.1rem; height: .8rem; margin: .3rem auto .3rem; background: #fff; border-radius: .4rem; text-align: center; line-height: .8rem; font-weight: bolder; font-size: .32rem; color: #333;}
}
</style>
