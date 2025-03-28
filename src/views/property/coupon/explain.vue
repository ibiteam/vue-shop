<template>
    <article class="coupon-container" v-cloak>
        <common-header title="优惠券使用说明"></common-header>
        <div class="packetState" id="app"  v-cloak>
            <div class="stateBlock">
                <p class="title">Q1：优惠券有几种类型？</p>
                <p class="content">优惠券由店铺发放，分为通用优惠券、限购优惠券两种。</p>
                <p class="content">通用优惠券：店铺中全部商品可使用的优惠券。限购优惠券：店铺中部分商品/品类可使用优惠券。</p>
            </div>
            <div class="stateBlock">
                <p class="title">Q2：如何获得优惠券？</p>
                <p class="content">①促销活动赠送。参加平台不定期举办的活动并满足活动促销要求可获得优惠券（优惠券面额及使用条件以当次活动为准）。</p>
                <p class="content">②游戏奖励。参加平台活动游戏获得，此种方式不需要自己领取，系统自动发放至您的账户中“用户中心－优惠券”。</p>
                <p class="content">③站外活动赠送。参加线下活动发放的卡券，此种方式需提供优惠券编码进行兑换获得。</p>
            </div>
            <div class="stateBlock">
                <p class="title">Q3：优惠券的有效期？</p>
                <p class="content">“用户中心－优惠券”可以查阅优惠券的有效期。优惠券只能在有效期内使用，逾期将失效不可用。</p>
            </div>
            <div class="stateBlock">
                <p class="title">Q4：如何使用优惠券？</p>
                <p class="content">选购完商品后，进入结算流程，在“确认订单页面”，在您选购的商品列表下方有使用优惠券的选择框。</p>
                <p class="content">（1）如果您账户中有可用的优惠券，系统会按截止日期默认帮您选择一张符合该订单使用条件的优惠金额最大的优惠券；您也可以选择其它可用的优惠券。</p>
                <p class="content">（小提醒：每张优惠券都有使用的有效期，您可以尽量选择有效日期最近的优惠券来使用）</p>
                <p class="content">（2）如果您不想使用优惠券，请选择“不使用”。</p>
            </div>
            <div class="stateBlock">
                <p class="title">Q5：优惠券使用规则？</p>
                <p class="content">优惠券须在有效期内使用，每个订单只能使用一张优惠券；</p>
                <p class="content">优惠券不能抵扣运费、不开发票、仅限本人使用；</p>
                <p class="content">使用优惠券支付的订单，如发生退货，退款结算按照实际结算金额退款；</p>
                <p class="content">如果优惠券面额高于订单支付金额，多余部分将不能再次被其他订单使用；</p>
                <p class="content">具体面额比例按每次平台活动展示为主，优惠金额非固定。</p>
                <p class="content">如有疑问请联系客服或电话热线处理。</p>
            </div>
        </div>
    </article>
</template>

<script setup>

</script>

<style scoped lang="scss">
.coupon-container{
    background-color: #fff;
    height: auto;
    min-height: 100vh;
    color: #333;
    z-index: 100;
    .packetState{
        background-color:#fff;
    }
    .packetState .stateBlock{
        padding:0.22rem 0;
        margin:0 0.3rem;
    }
    .packetState .stateBlock .title{
        min-height:0.48rem;
        line-height:0.48rem;
        font-size:0.28rem;
        font-weight:500;
        color:#333;
        margin-bottom:0.1rem;
    }
    .packetState .stateBlock .content{
        min-height:0.4rem;
        line-height:0.4rem;
        font-size:0.26rem;
        color:#666;
    }
}
</style>
