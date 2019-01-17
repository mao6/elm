<template>
  <div>
    <ul class="list">
      <li v-for="item in shoplist" :key="item.id" @click="next(geohash,item.id)">
        <section><img :src="'//elm.cangdu.org/img/'+item.image_path"></section>
        <section class="rigth">
          <header>
            <h4>
              <span class="pinpai">品牌</span>{{item.name}}</h4>
            <ul>
              <li v-for="support in item.supports" :key="support.id">{{support.icon_name}}</li>
            </ul>
          </header>
          <h5>
            <el-rate size="12px" v-model="item.rating" disabled show-score text-color="#ff9900" score-template="{value}"></el-rate>
            <span>月售{{item.recent_order_num}}单</span>
            <p v-if="item.delivery_mode">
              <span>蜂鸟专送</span>
              <span>准时达</span>
            </p>
          </h5>
          <footer>
            <p>{{item.float_minimum_order_amount}}元起送/配送费约{{item.float_delivery_fee}}元</p>
            <p>{{item.distance}}/
              <span>{{item.order_lead_time}}</span>
            </p>
          </footer>
        </section>
      </li>
    </ul>
  </div>
</template>
<script>
import Axios from 'axios'
import { Loading } from 'element-ui'
export default {
  name: 'ShopList',
  data () {
    return {
      shoplist: ''
    }
  },
  props: {
    geohash: String,
    restaurantCategoryId: String,
    orderBy: String,
    deliveryMode: Array,
    supportIds: Array
  },
  mounted () {
    this.GetData()
  },
  methods: {
    GetData () {
      let options = {
        text: '飞速加载中'
      }
      let loadingInstance = Loading.service(options)
      Axios.get('http://elm.cangdu.org/shopping/restaurants',
        {params: {
          latitude: this.$route.query.geohash.split(',')[0],
          longitude: this.$route.query.geohash.split(',')[1],
          offset: 0,
          limit: 20,
          'extras[]': 'activities',
          keyword: '',
          restaurant_category_id: '',
          'restaurant_category_ids[]': this.restaurantCategoryId,
          order_by: this.orderBy,
          'delivery_mode': this.deliveryMode,
          'support_ids': this.supportIds
        }}).then(res => {
        if (res.data) {
          loadingInstance.close()
          this.shoplist = res.data
        }
      })
    },
    next (geohash, id) {
      this.$router.push({
        name: 'Shop',
        query: {
          'geohash': geohash,
          'id': id
        }
      }
      )
    }
  },
  watch: {
    restaurantCategoryId: function () {
      this.GetData()
    },
    orderBy: function () {
      this.GetData()
    },
    deliveryMode: function () {
      this.GetData()
    },
    supportIds: function () {
      this.GetData()
    }
  }
}
</script>
<style scoped>
.list > li {
    display: flex;
    border-bottom: 0.025rem solid #f1f1f1;
    padding: 0.7rem 0.4rem;
}
img {
    width: 4rem;
    height: 4rem;
    display: block;
    margin-right: 0.4rem;
}
.rigth {
    width: 100%;
}
.pinpai {
    display: inline-block;
    font-size: 0.8rem;
    line-height: 1rem;
    color: #333;
    background-color: #ffd930;
    padding: 0 0.1rem;
    border-radius: 0.2rem;
    margin-right: 0.2rem;
    font-weight: bold;
}
h4 {
    width: 12rem;
    font-weight: bold;
    height: 1.2rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
header {
    display: flex;
    justify-content: space-between;
    align-items: cente;
}
header ul {
    display: flex;
    height: 1.2rem;
    text-align: right;
}
header ul > li {
    font-size: 1rem;
    color: #999;
    border: 0.025rem solid #f1f1f1;
    padding: 0 0.04rem;
    border-radius: 0.08rem;
    margin-left: 0.05re;
    transform: scale(0.75);
}
h5 {
    display: flex;
    justify-content: space-between;
    padding-top: 0.5rem;
}
h5 > span {
    color: #999;
    font-size: 0.6rem;
    height: 1rem;
    margin-left: 0.5rem;
}
h5 > p > span:nth-child(1) {
    font-size: 0.6rem;
    background: #3190e8;
    color: white;
    border: 1px solid #3190e8;
}
h5 > p > span:nth-child(2) {
    font-size: 0.6rem;
    color: #3190e8;
    background: white;
    border: 1px solid #3190e8;
}
footer {
    display: flex;
    font-size: 0.5rem;
    justify-content: space-between;
}
footer p {
    color: #999;
}
footer p:nth-child(2) span {
    color: #3190e8;
}
</style>
<style>
.el-rate__item > .el-rate__icon {
    font-size: 0.5rem;
    margin-right:0;
}
</style>
