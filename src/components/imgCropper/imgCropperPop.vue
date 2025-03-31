<template>
    <div>
        <van-popup class="img-cropper-pop" v-model:show="show" :close-on-click-overlay="false" :style="{ height: '100vh' }" :lock-scroll="false">
            <div class="pop-wrap">
                <div class="cropper-box"></div>
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

<script setup>
import $ from 'jquery'
import {ref, reactive, onMounted, nextTick, getCurrentInstance, watch, defineEmits} from 'vue'
const cns = getCurrentInstance().appContext.config.globalProperties
const show = ref(false)
const reset = ref(false)
const option = ref({
  fixedBox: true,
  canMoveBox: false,
  autoCropWidth: document.body.clientWidth - 45,
  autoCropHeight: document.body.clientWidth - 45,
  maxImgSize: document.body.clientWidth - 45,
  mode: 'cover'
})

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  file: null,
  type: String,
})

watch(() => props.visible, (newVal) => {
  show.value = newVal
})

watch(() => props.file, (newVal) => {
  if (newVal) {
    nextTick(() => {
      // this.$refs.cropper.loadFile(newVal)
    })
  }
})
const emit = defineEmits(['getFile','close','getbase64Data'])
const getFile = (file) => {
  emit('getFile', file)
  emit('close')
}
const getbase64Data = (file) => {
  emit('getbase64Data', file)
  emit('close')
}
const imgSave = () => {
  const child = $('.cropper-box .upbtn .btndiv').children()
  if (child && child[2]) {
    child[2].click()
  }
}
const imgRotate = () => {
  // this.$refs.cropper.rotating();
}
const imgReset = () =>{
  if (!props.file) return
  reset.value = true
  setTimeout(() => {
    reset.value = false
    nextTick(() => {
      // this.$refs.cropper.loadFile(props.file)
    })
  }, 100)
}
const imgCancel = () =>{
  // this.$refs.cropper.canceltailor()
  closePop()
}
const closePop = () =>{
  emit('close')
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
