<template>
    <div>
        <common-header title="商品介绍视频"></common-header>
        <div class="video">
            <div class="video-main jdvideo-div" id="videoMain">
                <video :src="url" preload="auto" id="videoUrl" type="video/mp4" controls="controls" autoplay="autoplay">
                    暂时不支持播放该视频
                </video>
                <div class="video-loading" style="display: none;">
                    <i></i>
                </div>
                <div class="play-btn" style="display: none;"></div>
            </div>
        </div>
    </div>
</template>

<script setup>
    import { ref, onMounted } from 'vue'
    import { useRoute } from 'vue-router'

    const route = useRoute()
    const url = ref('')

    onMounted(() => {
        url.value = route.query.url
    })
</script>

<style scoped>
    .video {
        position: fixed;
        top: 46px;
        left: 0;
        right: 0;
        bottom: 0;
        margin: 0 auto;
        background-color: #000;
        width: 7.5rem;
    }
    .jdvideo-div {
        overflow: hidden;
        position: relative !important;
        background: #000;
        width: 100%;
        height: 100%;
    }
    .video-main {
        font-size: 0;
        font-family: none;
        white-space: nowrap;
        overflow: hidden;
        position: relative;
    }
    .jdvideo-div video {
        width: 100%;
        max-height: 12rem;
        background: #000;
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
    }
    .jdvideo-div .video-loading {
        text-align: center;
        position: absolute;
        top: 50%;
        left: 50%;
    }
</style>
