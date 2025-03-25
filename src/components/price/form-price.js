import { computed, h } from 'vue'

const FormPrice = {
    install: function(app) {
        app.component('form-price', {
            setup(props) {
                const integer = computed(() => {
                    if (props.price) {
                        let temp = props.price
                        let reg = /¥/
                        let reg2 = /￥/
                        if (reg.test(props.price)) {
                            temp = props.price.split('¥')[1]
                        } else if (reg2.test(props.price)) {
                            temp = props.price.split('￥')[1]
                        }
                        return temp.toString().split('.')[0]
                    } else {
                        return 0
                    }
                })

                const decimal = computed(() => {
                    if (props.price) {
                        let temp = props.price
                        let reg = /¥/
                        let reg2 = /￥/
                        if (reg.test(props.price)) {
                            temp = props.price.split('¥')[1]
                        } else if (reg2.test(props.price)) {
                            temp = props.price.split('￥')[1]
                        }
                        return temp.toString().split('.')[1] ? '.' + (temp.toString().split('.')[1]) : ''
                    } else {
                        return 0
                    }
                })

                return {
                    integer,
                    decimal
                }
            },
            props: {
                price: {  // 价格
                    required: true
                },
                unit: { // 单位
                    required: false
                },
                sign_size: { // ￥符号字体大小
                    required: false,
                    default: '22'
                },
                INT_size: { // 整数字体大小
                    required: false,
                    default: '30'
                },
                DF_size: { // 小数字体大小
                    required: false,
                    default: '22'
                },
                unit_size: { // 单位字体大小
                    required: false,
                    default: '22'
                },
                color: { // 颜色
                    required: false,
                    default: '#F71111'
                },
                unit_color: { // 单位颜色
                    required: false,
                    default: '#F71111'
                },
                need_DF: { // 是否需要小数位
                    required: false,
                    default: true
                },
                need_bar: { // 金额和单位之间是否有'/',默认是有的
                    required: false,
                    default: true
                },
                weight: { // 是否加粗
                    required: false,
                    default: 400
                }
            },
            render() {
                return h('span', {
                    class: 'price_format',
                    style: { color: this.color }
                }, [
                    h('span', {
                        style: {
                            fontSize: this.sign_size / 100 + 'rem',
                            fontWeight: this.weight
                        }
                    }, '¥'),
                    h('span', {
                        style: {
                            fontSize: this.INT_size / 100 + 'rem',
                            fontWeight: this.weight
                        }
                    }, this.integer),
                    h('span', {
                        style: {
                            fontSize: this.DF_size / 100 + 'rem',
                            display: this.need_DF ? 'inline' : 'none',
                            fontWeight: this.weight
                        }
                    }, this.decimal),
                    h('span', {
                        style: {
                            fontSize: this.unit_size / 100 + 'rem',
                            color: this.unit_color
                        }
                    }, this.unit ? (this.need_bar ? '/' : '') + this.unit : '')
                ])
            }
        })
    }
}

export default FormPrice
