<template>
    <div class="shop-rate s-flex ai-ct">
        <span v-for="i in 5" @click="clickStar(i)">
            <img :src="selectValue>=i?'https://cdn.toodudu.com/uploads/2023/11/17/star.png':'https://cdn.toodudu.com/uploads/2023/11/17/star-no.png'" alt="">
        </span>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
    rank: {
        type: Number,
        default: 5
    },
    is_edit: {
        type: Boolean,
        default: false
    }
})

const emit = defineEmits(['input'])

const selectValue = ref(0)

watch(() => props.rank, (newVal) => {
    selectValue.value = newVal
})

const clickStar = (i) => {
    if (!props.is_edit) return
    selectValue.value = i
    emit('input', i)
}

// Initialize value
selectValue.value = props.rank
</script>

<style scoped lang="scss">
    .shop-rate{
        span{
            display: inline-block;
            width: 0.17rem;
            height: 0.17rem;
            font-size: 0;
            margin: 0 0.05rem;
            img{
                width: 100%;
                height: 100%;
            }
        }
    }
</style>
