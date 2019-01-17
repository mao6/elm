<template>
    <div>
        <Header goBack='goBack' :headTitle="headTitle" signinUp='true'></Header>
        <section class="content">
            <section class="address" @click="chooseAddress()">
                <span>
                    <i class="el-icon-location-outline"></i>请添加一个收货地址</span>
                <span>
                    <i class="el-icon-arrow-right"></i>
                </span>
            </section>
            <section class="atTime">
                <div>送达时间</div>
                <div>
                    <p>尽快送达&nbsp;|&nbsp;预计{{checkoutData?checkoutData.delivery_reach_time:''}}</p>
                    <span v-if="checkoutData?checkoutData.cart.is_deliver_by_fengniao:''">蜂鸟专送</span>
                </div>
            </section>
            <section class="payment">
                <span>支付方式</span>
                <span @click="isProp=!isProp">{{payment?payment:'请选择'}}
                    <i class="el-icon-arrow-right"></i>
                </span>
            </section>
            <section class="redPacket">
                <span>红包</span>
                <span>暂时只在APP中支持</span>
            </section>
            <section class="shopList">
                <section class="shopinfo">
                    <img :src="checkoutData?('//elm.cangdu.org/img/'+checkoutData.cart.restaurant_info.image_path):''">
                    <span>{{checkoutData?checkoutData.cart.restaurant_info.name:''}}</span>
                </section>
                <section class="foodList">
                    <ul>
                        <li v-if="item.quantity>0" v-for="(item,index) in (checkoutData?checkoutData.cart.groups[0]:[])" :key="index">
                            <span>{{item.name}}</span>
                            <span>
                                <span>X{{item.quantity}}</span>￥{{item.price}}
                            </span>
                        </li>
                    </ul>
                    <ul>
                        <li v-for="(item,index) in (checkoutData?checkoutData.cart.extra:[])" :key="index">
                            <span>{{item.name}}</span>
                            <span>￥{{item.price}}</span>
                        </li>
                    </ul>
                    <section class="food_item_style">
                        <span>配送费</span>
                        <span>￥{{checkoutData?(checkoutData.cart.deliver_amount || 0):''}}</span>
                    </section>
                    <section class="food_item_style total_price" style="height:auto">
                        <span>订单 ¥{{checkoutData?checkoutData.cart.total:''}}</span>
                        <span>
                            <p>待支付</p>
                            <p>¥{{checkoutData?checkoutData.cart.total:''}}</p>
                        </span>
                    </section>
                    <section class="food_item_style">
                        <span>订单备注</span>
                        <span class="ellipsis gray" @click="to()">{{remarkText? remarkText: '口味、偏好等'}}
                            <i class="el-icon-arrow-right"></i>
                        </span>
                    </section>
                    <section class="food_item_style">
                        <span>发票抬头</span>
                        <span class="gray">{{checkoutData?checkoutData.invoice.status_text:''}}
                        </span>
                    </section>
                </section>
            </section>
        </section>
        <section class="confrim_order">
            <span>待支付 ￥{{checkoutData?checkoutData.cart.total:''}}</span>
            <span @click="commitOrder()">确认下单</span>
        </section>
        <!--遮罩层-->
        <div v-show="isProp" @click="isProp=false" style="position:absolute;top:0;bottom:0;left:0;right:0;z-index:11;background:rgba(0,0,0,.3)"></div>
        <!--底部弹出层-->
        <el-collapse-transition>
            <div v-if="isProp" class="prop">
                <header>支付方式</header>
                <ul>
                    <li v-for="(item,index) in checkoutData.payments" :key="index" :class="{disabled:!item.is_online_payment}">
                        <span>{{item.name}}
                        <span v-if="!item.is_online_payment">{{item.description}}</span>
                        </span>
                        <span>
                        <el-button :type="payment==item.name?'success':'info'" icon="el-icon-check" circle size="mini" @click="choosePayType(item.name,item.is_online_payment)"></el-button>
                        </span>
                    </li>
                </ul>
            </div>
        </el-collapse-transition>
    </div>
</template>
<script>
import Header from '../../components/Header/Header'
import Axios from 'axios'
import { mapState } from 'vuex'
export default {
  name: '',
  data () {
    return {
      headTitle: '确认订单',
      geohash: '',
      shopId: '',
      checkoutData: null,
      isProp: false, // 底部弹出开关
      payment: null
    }
  },
  components: {
    Header
  },
  computed: {
    ...mapState({
      cartList: function (state) {
        if (Object.values(state.cartList).length === 0) {
          this.$store.dispatch('ADD_CART')
        }
        return Object.values(state.cartList).length > 0
          ? state.cartList
          : {}
      }
    }),
    // 备注页返回的信息进行处理
    remarkText: function () {
      let str = ''
      if (this.$route.params.remark) {
        str += this.$route.params.remark
      }
      return str
    },
    shopCart: function () {
      return this.cartList[this.shopId]
    }
  },
  mounted () {
    this.geohash = this.$route.query.geohash
    this.shopId = this.$route.query.shopId
    if (this.$route.params.payment) {
      this.payment = this.$route.params.payment
    }
    this.GetOrderData()
  },
  methods: {
    GetOrderData () {
      let array = []
      Object.values(this.shopCart).forEach(categoryitem => {
        Object.values(categoryitem).forEach(itemValue => {
          Object.values(itemValue).forEach(item => {
            array.push({
              attrs: [],
              extra: {},
              id: item.id,
              name: item.name,
              packing_fee: item.packing_fee,
              price: item.price,
              quantity: item.num,
              sku_id: item.sku_id,
              specs: [item.specs],
              stock: item.stock
            })
          })
        })
      })
      Axios.post('http://elm.cangdu.org/v1/carts/checkout', {
        come_from: 'web',
        geohash: this.geohash,
        entities: [array],
        restaurant_id: this.shopId
      }).then(res => {
        if (res.data) {
          this.checkoutData = res.data
        }
      })
    },
    getImgPath (path) {
      let suffix
      if (!path) {
        return '//elm.cangdu.org/img/default.jpg'
      }
      if (path.indexOf('jpeg') !== -1) {
        suffix = '.jpeg'
      } else {
        suffix = '.png'
      }
      let url =
                '/' +
                path.substr(0, 1) +
                '/' +
                path.substr(1, 2) +
                '/' +
                path.substr(3) +
                suffix
      return 'https://fuss10.elemecdn.com' + url
    },
    choosePayType (name, isOnline) {
      if (isOnline === true) {
        this.payment = name
        this.isProp = false
      }
    },
    to () {
      this.$router.push({
        name: 'Remark',
        params: {
          'geohash': this.geohash,
          'shopId': this.shopId,
          'payment': this.payment
        }
      })
    },
    commitOrder () {
      this.$message.closeAll()
      if (this.payment && this.remarkText) {
        this.$message({
          message: '请先登录',
          duration: 1000
        })
      } else {
        if (!this.payment) {
          this.$message({
            message: '请选择支付方式',
            duration: 1000
          })
          return
        }
        if (!this.remarkText) {
          this.$message({
            message: '请选择您的偏好',
            duration: 1000
          })
        }
      }
    },
    chooseAddress () {
      this.$message.closeAll()
      this.$message({
        message: '点击也没用,反正没开发',
        duration: 1000
      })
    }
  }
}
</script>
<style scoped>
.content {
    margin-top: 2.95rem;
    padding-bottom: 4rem;
}
.address {
    height: 3rem;
    line-height: 3rem;
    padding: 0 1rem;
    border-bottom: 1px dotted #999;
    display: flex;
    justify-content: space-between;
}
.atTime {
    display: flex;
    justify-content: space-between;
    padding: 0.5rem;
    border-left: 0.2rem solid #3190e8;
    margin: 0.5rem 0;
}
.atTime > div:nth-child(1) {
    flex: 1;
    display: flex;
    align-items: center;
    font-size: 1.2rem;
    font-weight: bold;
}
.atTime > div:nth-child(2) {
    text-align: right;
}
.atTime > div:nth-child(2) p:nth-child(1) {
    line-height: 2.5rem;
    color: #3190e8;
    height: 2.5rem;
}
.atTime > div:nth-child(2) span {
    font-size: 0.8rem;
    background: #3190e8;
    color: white;
    padding: 0.2rem;
    border-radius: 0.2rem;
}
.payment,
.redPacket {
    height: 3rem;
    line-height: 3rem;
    padding: 0 1rem;
    display: flex;
    justify-content: space-between;
}
.redPacket span,
.payment span:nth-child(2) {
    color: #999;
}
.confrim_order {
    width: 100%;
    display: flex;
    position: fixed;
    height: 3.5rem;
    line-height: 3.5rem;
    justify-content: space-between;
    left: 0;
    bottom: 0;
}
.confrim_order span:nth-child(1) {
    background: #3c3c3c;
    color: white;
    padding-left: 1rem;
    flex: 1;
    font-weight: bold;
    font-size: 1rem;
}
.confrim_order span:nth-child(2) {
    background: #56d176;
    color: white;
    padding: 0 1rem;
    font-weight: bold;
    font-size: 1rem;
}
.shopinfo,
.foodList ul li,
.food_item_style {
    display: flex;
    justify-content: space-between;
    padding: 0 1rem;
    height: 2.5rem;
    line-height: 2.5rem;
    color: #666;
}
.shopinfo {
    justify-content: initial;
    align-items: center;
}
.shopinfo img {
    width: 2.5rem;
    height: 2.5rem;
    padding-right: 1rem;
}
.shopinfo span {
    font-size: 1.2rem;
}
.foodList ul li > span:nth-child(2) > span {
    padding-right: 2.5rem;
    color: #f60;
}
.total_price span:nth-child(2) p {
    text-align: right;
    color: #f60;
}
.ellipsis {
    width: 15rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    text-align: right;
}
.gray {
    color: #999;
}
.prop {
    position: absolute;
    left: 0;
    bottom: 0;
    right: 0;
    z-index: 20;
    background: white;
    padding:0 1rem;
}
.prop header,.prop li{
    line-height: 2.5rem;
    height:2.5rem;
}
.prop header{
    text-align: center;
}
.prop ul{
    padding-bottom: 1rem;
}
.prop li{
    display: flex;
    justify-content:space-between;
}
.disabled span{
    color:#999;
}
</style>

<style>
.el-message {
    top: 40%!important;
    background-color: black!important;
    min-width:90%!important;
    border-radius: 5px!important;
}
.el-message--info .el-message__content {
    color: white!important;
}
.el-message .el-icon-info {
    color: white!important;
}
</style>
