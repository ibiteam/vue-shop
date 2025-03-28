<template>
    <article class="redPacket-help-container" v-cloak>
        <common-header title="红包使用说明"></common-header>
        <div class="packetState" id="app" v-cloak>
            <div class="stateBlock">
                <p class="title">Q1：红包有几种类型？</p>
                <p class="content">红包分为通用红包、限商品红包、限品类红包三种。红包不限制店铺，平台商品均可使用。</p>
                <p class="content">通用红包：平台商品均可使用红包。限商品红包：仅限部分商品使用。限品类红包：仅限部分分类下的所有商品使用。</p>
            </div>
            <div class="stateBlock">
                <p class="title">Q2：如何获得红包？</p>
                <p class="content">①促销活动赠送。参加平台不定期举办的活动并满足活动促销要求可获得红包（面额及使用条件以当次活动为准）。</p>
                <p class="content">②游戏奖励。参加平台活动游戏获得，此种方式不需要自己领取，系统自动发放至您的账户中“用户中心－我的红包”。</p>
                <p class="content">③平台补偿红包：平台针对订单、运费等部分情况产生的问题，会发放一定面额的红包给与补偿。此种方式不需要自己领取，系统自动发放至您的账户中“用户中心－我的红包”。</p>
            </div>
            <div class="stateBlock">
                <p class="title">Q3：红包的有效期？</p>
                <p class="content">“用户中心－我的红包”可以查阅红包的有效期。红包只能在有效期内使用，逾期将失效不可用。</p>
            </div>
            <div class="stateBlock">
                <p class="title">Q4：如何使用红包？</p>
                <p class="content">（1）如果您账户中有可用的红包，系统会按截止日期默认帮您选择一张符合该订单使用条件的优惠金额最大的红包；您也可以选择其它可用的红包。</p>
                <p class="content">（小提醒：每张红包都有使用的有效期，您可以尽量选择有效日期最近的红包来使用）</p>
                <p class="content">（2）如果您不想使用红包，请选择“不使用”。</p>
            </div>
            <div class="stateBlock">
                <p class="title">Q5：下单的时候使用了红包，但是后来订单取消了，红包会返还吗？</p>
                <p class="content">不会，订单无效后红包在您的账户中处于已使用状态。</p>
            </div>
            <div class="stateBlock">
                <p class="title">Q6：我的红包还未使用为什么失效了？</p>
                <p class="content">红包使用时间以获得的红包上展示的使用时间为准，过期未使用的红包做失效处理；</p>
                <p class="content">红包的使用根据用户创建订单的时间为准，已使用的红包做失效处理；</p>
                <p class="content">红包的失效日期会在“用户中心-我的红包”列表中显示，请注意查看。</p>
            </div>
            <div class="stateBlock">
                <p class="title">Q7：红包使用规则？</p>
                <p class="content">红包须在有效期内使用，每个订单只能使用一张红包；</p>
                <p class="content">每个用户只能领取一个红包，每个红包只能使用一次，不能叠加或拆分使用；</p>
                <p class="content">红包无店铺限制，满足使用条件才能使用；</p>
                <p class="content">如果红包面额高于订单支付金额，多余部分将不能被其他订单使用；</p>
                <p class="content">红包不能充值/提现、抵扣运费、不开发票、仅限本人使用；</p>
                <p class="content">平台发布的红包为现金红包，购买商品时可直接抵扣现金使用；</p>
                <p class="content">具体面额比例按每次平台活动展示为主，优惠金额非固定；</p>
                <p class="content">如有疑问请联系客服或电话热线处理。</p>
            </div>
        </div>
    </article>
</template>

<script setup>

</script>

<style scoped lang="scss">
.redPacket-help-container {
    background-color: #fff;
    height: auto;
    min-height: 100vh;
    color: #333;
    z-index: 100;

    .packetState {
        background-color: #fff;
    }

    .packetState .stateBlock {
        padding: 0.22rem 0;
        margin: 0 0.3rem;
    }

    .packetState .stateBlock:not(:last-child) {
        /*border-bottom: 0.01rem solid #E5E5E5;*/
    }

    .packetState .stateBlock .title {
        min-height: 0.48rem;
        line-height: 0.48rem;
        font-size: 0.28rem;
        color: #333;
        margin-bottom: 0.1rem;
    }

    .packetState .stateBlock .content {
        min-height: 0.4rem;
        line-height: 0.4rem;
        font-size: 0.26rem;
        color: #666;
    }
}
</style>
