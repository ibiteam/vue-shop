import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useGoodStore = defineStore('shop-good', () => {
    const buyNumber = ref(0)
    function setBuyNumber(value){
        buyNumber.value = value
    }

    return { setBuyNumber, buyNumber }
})
