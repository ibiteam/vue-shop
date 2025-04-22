<template>
  <div class="agreementWrap">
    <common-header :title="page_title"></common-header>
    <div class="agreement-content" v-html="content"></div>
  </div>
</template>

<script setup>
import {ref, reactive, onMounted, nextTick, getCurrentInstance, watch, computed} from 'vue'
import { useRoute } from 'vue-router'
import {artilceDetailAxios} from "@/api/article.js";
const cns = getCurrentInstance().appContext.config.globalProperties
const route = useRoute()
const page_title = ref('')
const content = ref(null)

onMounted(()=>{
  getPageData()
})

const getPageData = () => {
  let info = {
    article_id: route.query.article_id
  }
  artilceDetailAxios(info).then(res => {
    if (cns.$constant.isSuccessCode(res)) {
      page_title.value = res.data.title
      content.value = res.data.content
    } else {
      cns.$toast(res.message);
    }
  })
}
</script>

<style scoped>
.agreementWrap{
  background: #fff;
  height: 100%;
  overflow: auto;
}
.agreement-content { line-height: 2; padding: 0.2rem 0.2rem 0 0.2rem; background-color: #ffffff; color: #000; font-size: 14px; overflow-x: hidden; }
.agreement-content p { line-height: 2; font-size: 14px;}
:deep(.agreement-content b) { font-weight: 900;}
:deep(.agreement-content b u){ font-weight: 900;}
:deep(.agreement-content table) {
  width: 100% !important;
  display: block !important;
  overflow: auto !important;
}
:deep(.agreement-content table span){
  word-break: keep-all;
}
:deep(.agreement-content td){
  word-break: keep-all;
}
</style>
