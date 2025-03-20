import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useConfigStore = defineStore('shop-config', () => {
    const shopConfig = ref({})
    function setShopConfig(config){
        shopConfig.value = config
    }

    return { setShopConfig, shopConfig }
})
