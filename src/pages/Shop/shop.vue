<template>
  <div class="contain">
    <Header goBack='goBack'></Header>
    <nav>
      <img :src="'//elm.cangdu.org/img/'+shopData.image_path">
      <section>
        <div>
          <section class="nav_left">
            <img :src="'//elm.cangdu.org/img/'+shopData.image_path">
          </section>
          <section class="nav_right">
            <p>{{shopData.name}}</p>
            <p>商家配送／{{shopData.order_lead_time}}分钟送达／配送费¥{{shopData.float_delivery_fee}}</p>
            <p>公告：{{shopData.promotion_info}}</p>
          </section>
          <svg width="14" height="14" xmlns="http://www.w3.org/2000/svg" version="1.1" class="description_arrow">
            <path d="M0 0 L8 7 L0 14" stroke="#fff" stroke-width="1" fill="none" />
          </svg>
        </div>
        <section v-if="shopData.activities&&shopData.activities.length">
          <span class="tip">
            <span>减</span>{{shopData.activities[0].description}}（APP专享）</span>
        </section>
      </section>
    </nav>
    <section>
      <el-tabs v-model="activeName" :stretch="stretch">
        <el-tab-pane label="商品" name="first">
          <!-- 商品页 -->
          <section class="shop">
            <div class="shop_left" ref="wrapper">
              <ul>
                <li :class="{actived:index==shopLeftClicked}" v-for="(item,index) in goods" :key="index" @click="IsClicked(index)">
                  {{item.name}}
                  <div v-if="shopLeftCount[item.id]">
                    <el-badge :value="shopLeftCount[item.id]" class="item"></el-badge>
                  </div>
                </li>
              </ul>
            </div>
            <div class="shop_right" ref="foodWrapper">
              <ul>
                <li v-for="(item,index) in goods" :key="index" :ref="index">
                  <header>
                    <span>{{item.name}}</span>
                    <span>{{item.description}}</span>
                  </header>
                  <section class="foods_sec" v-for="(it,itindex) in item.foods" :key="itindex">
                    <div class="foods">
                      <div class="foods_img">
                        <img :src="'//elm.cangdu.org/img/'+it.image_path">
                      </div>
                      <div class="foods_info">
                        <h4>
                          <strong>{{it.name}}</strong>
                        </h4>
                        <h4>{{it.description}}</h4>
                        <h4>月售{{it.month_sales}}&nbsp;&nbsp;好评率{{it.satisfy_rate}}%</h4>
                      </div>
                    </div>
                    <footer>
                      <section>
                        <span>{{it.specfoods[0].price}}</span>
                        <span v-if="it.specifications.length">起</span>
                      </section>
                      <section>
                        <buyCar :food='it' :shopId='shopId' v-on:CallBack="ShowChooseList"></buyCar>
                      </section>
                    </footer>
                  </section>
                </li>
              </ul>
            </div>
          </section>
          <div class="shopcar">
            <section>
              <div class="buy_cart_container" :class="{cart_icon_activity:shopcartcounter}" @click="openChooseList()">
                <i class="el-icon-goods"></i>
                <el-badge :value="shopcartcounter" class="item">
                </el-badge>
              </div>
              <div class="money">
                <h3>￥{{totalPrice}}</h3>
                <h4>配送费¥{{shopData.float_delivery_fee}}</h4>
              </div>
            </section>
            <section class="sec" :class="{shopcarActived:!(totalPrice<shopData.float_minimum_order_amount)}">
              <span v-if="needPrice>0">还差{{needPrice}}元起送</span>
              <span v-if="!(needPrice>0)" @click="toCommitOrder()">去结算</span>
            </section>
            <el-collapse-transition>
              <div v-show="isOpenChooseList" class="shopChooseList">
                <header>
                  <span>购物车</span>
                  <div @click="clearShopCart()">
                    <i class="el-icon-delete"></i>清空</div>
                </header>
                <div class="shopChooseListContent">
                  <ul>
                    <li v-for="(item,index) in choosedFoods" :key="index">
                      <div>
                        <span>
                          <b>{{item.name}}</b>
                          <h6>{{item.specs}}</h6>
                        </span>
                        <span class="shopChooseListRight">
                          <span class="shopChooseListPrice">￥{{item.price}}</span>
                          <el-button type="primary" icon="el-icon-minus" circle size="mini" @click="removeCart(item.shopid,item.categoryId,item.itemId,item.Id,item.name,item.price,item.specs,item.packing_fee,item.sku_id,item.stock)"></el-button>
                          <span>{{item.num}}</span>
                          <el-button type="primary" icon="el-icon-plus" circle size="mini" @click="addCart(item.shopid,item.categoryId,item.itemId,item.Id,item.name,item.price,item.specs,item.packing_fee,item.sku_id,item.stock)"></el-button>
                        </span>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </el-collapse-transition>
          </div>
        </el-tab-pane>
        <el-tab-pane label="评价" name="second">
          <!-- 评价页 -->
          <pull-to :bottom-load-method="refresh">
            <section>
              <header class="assessHead">
                <section>
                  <p>{{Scores.overall_score}}</p>
                  <p>综合评价</p>
                  <p>高于周边商家{{Scores.compare_rating}}%</p>
                </section>
                <section>
                  <p>服务态度
                    <el-rate v-model="Scores.service_score" disabled show-score text-color="#ff9900" score-template="{value}">
                    </el-rate>
                  </p>
                  <p>菜品评价
                    <el-rate v-model="Scores.food_score" disabled show-score text-color="#ff9900" score-template="{value}">
                    </el-rate>
                  </p>
                  <p>送达时间
                    <span>{{ratingScores.deliver_time}}分钟</span>
                  </p>
                </section>
              </header>
              <section class="tag">
                <ul>
                  <li :class="{tagActived:index==tagActivedIndex}" v-for="(item,index) in tags" :key="index" @click="selectTags(index,item.name)">
                    {{item.name}}({{item.count}})
                  </li>
                </ul>
              </section>
              <section class="rate">
                <ul>
                  <li v-for="(item,index) in ratingData" :key="index">
                    <img :src="getImgPath(item.avatar)">
                    <section>
                      <div>
                        <section>
                          <span>{{item.username}}</span>
                          <p>
                            <el-rate v-model="item.rating_star" disabled>
                            </el-rate>{{item.time_spent_desc}}</p>
                        </section>
                        <span>
                          {{item.rated_at}}
                        </span>
                      </div>
                      <section class="ratingImg">
                        <ul>
                          <li v-for="(iitem,tindex) in item.item_ratings" :key="tindex"><img :src="getImgPath(iitem.image_hash)" v-if="iitem.image_hash"></li>
                        </ul>
                      </section>
                      <section class="ratingTags">
                        <ul>
                          <li class="ellipsis" v-for="(iitem,tindex) in item.item_ratings" :key="tindex">{{iitem.food_name}}</li>
                        </ul>
                      </section>
                    </section>
                  </li>
                </ul>
              </section>
            </section>
          </pull-to>
        </el-tab-pane>
      </el-tabs>
    </section>
    <!-- 规格模态框 -->
    <el-dialog :title="food.name" :visible.sync="isShowChooseList" width="80%" top="30vh" center>
      <div>
        <h3>规格</h3>
        <section class="Dialog_seco">
          <div class="MulBtn" :class="{btn_actived:index==btn_choose}" v-for="(item,index) in food.specfoods" :key="index" @click="btnChoose(index)">{{item.specs_name}}</div>
        </section>
        <section class="Dialog_sect">
          <div class="Dialog_price">￥{{price}}</div>
          <div class="Dialog_btn" @click="addSpecs(food.category_id, food.item_id, food.specfoods[btn_choose].food_id, food.specfoods[btn_choose].name, food.specfoods[btn_choose].price, food.specifications[0].values[btn_choose], food.specfoods[btn_choose].packing_fee, food.specfoods[btn_choose].sku_id, food.specfoods[btn_choose].stock)">加入购物车</div>
        </section>
      </div>
    </el-dialog>
    <!-- 遮罩层 -->
    <div v-show="isOpenChooseList" @click="isOpenChooseList=false" style="position:absolute;top:0;bottom:0;left:0;right:0;z-index:11;background:rgba(0,0,0,.3)"></div>
  </div>
</template>
<script>
import Header from '../../components/Header/Header'
import buyCar from '../../components/BuyCar/BuyCar'
import Axios from 'axios'
import BScroll from 'better-scroll'
import { Loading } from 'element-ui'
import { mapState, mapMutations } from 'vuex'
import PullTo from 'vue-pull-to'
export default {
  name: 'Shop',
  components: {
    Header,
    buyCar,
    PullTo
  },
  data () {
    return {
      shopData: '',
      shopId: '',
      activeName: 'first',
      stretch: true,
      goods: '',
      shopLeftClicked: 0,
      letter: '',
      isOpenChooseList: false, // 购物清单显示
      isShowChooseList: false, // 规格显示
      food: {},
      price: 0.0,
      btn_choose: 0,
      ratingScores: '',
      tags: '',
      tagActivedIndex: 0,
      ratingData: [],
      currentPage: 0,
      tagName: ''
    }
  },
  mounted () {
    this.tagName = '全部'
    this.getData()
    this.getGoodsData()
    this.ratingScoresData()
    this.tagsData()
    this.GetratingsData(this.tagName, 10, this.currentPage)
    this.shopId = this.$route.query.id
    this.scroll = new BScroll(this.$refs.wrapper, {
      probeType: 3,
      click: true
    })
    this.foodList = new BScroll(this.$refs.foodWrapper, {
      probeType: 3,
      click: true
    })
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
    shopcartcounter: function () {
      let num = 0
      let shopCart = this.cartList[this.shopId]
      if (shopCart) {
        for (let key in shopCart) {
          for (let tKey in shopCart[key]) {
            for (let foodKey in shopCart[key][tKey]) {
              if (
                shopCart[key][tKey][foodKey] &&
                                shopCart[key][tKey][foodKey].num
              ) {
                num += shopCart[key][tKey][foodKey].num
              }
            }
          }
        }
      }
      return num
    },
    totalPrice: function () {
      let num = 0.0
      let shopCart = this.cartList[this.shopId]
      if (shopCart) {
        for (let key in shopCart) {
          for (let tKey in shopCart[key]) {
            Object.values(shopCart[key][tKey]).forEach(
              (item, index) => {
                if (item && item.num) {
                  num += item.num * item.price
                }
              }
            )
          }
        }
      }
      return num
    },
    shopLeftCount: function () {
      let counter = {}
      let shopCart = this.cartList[this.shopId]
      if (shopCart) {
        for (let key in shopCart) {
          let num = 0
          for (let tKey in shopCart[key]) {
            Object.values(shopCart[key][tKey]).forEach(
              (item, index) => {
                if (item && item.num) {
                  num += item.num
                }
              }
            )
          }
          counter[key] = num
        }
      }
      return counter
    },
    needPrice: function () {
      return this.shopData.float_minimum_order_amount - this.totalPrice
    },
    choosedFoods: function () {
      let choosed = []
      let shopCart = this.cartList[this.shopId]
      if (shopCart) {
        for (let key in shopCart) {
          for (let tKey in shopCart[key]) {
            for (let foodKey in shopCart[key][tKey]) {
              if (
                shopCart[key][tKey][foodKey] &&
                                shopCart[key][tKey][foodKey].num &&
                                shopCart[key][tKey][foodKey].num > 0
              ) {
                let food = shopCart[key][tKey][foodKey]
                let obj = {}
                obj.shopid = this.shopId
                obj.categoryId = key
                obj.itemId = tKey
                obj.Id = food.id
                obj.name = food.name
                obj.num = food.num
                obj.packing_fee = food.packing_fee
                obj.price = food.price
                obj.sku_id = food.sku_id
                obj.specs = food.specs
                obj.stock = food.stock
                choosed.push(obj)
              }
            }
          }
        }
      }
      return choosed
    },
    Scores: function () {
      let rating = {}
      if (
        this.ratingScores &&
                this.ratingScores.service_score &&
                this.ratingScores.overall_score
      ) {
        rating.service_score = parseFloat(
          parseFloat(this.ratingScores.service_score).toFixed(1)
        )
        rating.overall_score = parseFloat(
          parseFloat(this.ratingScores.overall_score).toFixed(1)
        )
        rating.food_score = parseFloat(
          parseFloat(this.ratingScores.food_score).toFixed(1)
        )
        rating.compare_rating = parseFloat(
          (
            parseFloat(this.ratingScores.compare_rating) * 100
          ).toFixed(1)
        )
      }
      return rating
    }
  },
  methods: {
    refresh (loaded) {
      this.currentPage++
      this.GetratingsData(this.tagName, 10, this.currentPage)
      loaded('done')
    },
    getData () {
      Axios.get(
        'http://elm.cangdu.org/shopping/restaurant/' +
                    this.$route.query.id,
        {
          params: {
            latitude: this.$route.query.geohash.split(',')[0],
            longitude: this.$route.query.geohash.split(',')[1],
            extras: [
              'activities',
              'album',
              'license',
              'identification',
              'statistics'
            ]
          }
        }
      ).then(res => {
        if (res.data) {
          this.shopData = res.data
        }
      })
    },
    getGoodsData () {
      let options = {
        text: '飞速加载中'
      }
      let loadingInstance = Loading.service(options)
      Axios.get('http://elm.cangdu.org/shopping/v2/menu', {
        params: {
          restaurant_id: this.$route.query.id
        }
      }).then(res => {
        if (res.data) {
          loadingInstance.close()
          this.goods = res.data
        }
      })
    },
    ratingScoresData () {
      Axios.get(
        'http://elm.cangdu.org/ugc/v2/restaurants/' +
                    this.$route.query.id +
                    '/ratings/scores'
      ).then(res => {
        if (res.data) {
          this.ratingScores = res.data
        }
      })
    },
    tagsData () {
      Axios.get(
        'http://elm.cangdu.org/ugc/v2/restaurants/' +
                    this.$route.query.id +
                    '/ratings/tags'
      ).then(res => {
        if (res.data) {
          this.tags = res.data
        }
      })
    },
    GetratingsData (name, pages, current) {
      Axios.get(
        'http://elm.cangdu.org/ugc/v2/restaurants/' +
                    this.$route.query.id +
                    '/ratings',
        {
          params: {
            has_content: true,
            offset: current,
            limit: pages,
            tag_name: name
          }
        }
      ).then(res => {
        if (res.data) {
          res.data.forEach((item, index) => {
            this.ratingData.push(item)
          })
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
    IsClicked (index) {
      this.shopLeftClicked = index
      this.letter = index
    },
    openChooseList () {
      if (!(this.shopcartcounter > 0)) {
        return
      }
      if (this.isOpenChooseList) {
        this.isOpenChooseList = false
      } else {
        this.isOpenChooseList = true
      }
    },
    ShowChooseList (item) {
      this.food = item
      this.btn_choose = 0
      this.isShowChooseList = true
      this.price = item.specfoods[this.btn_choose].price
    },
    btnChoose (index) {
      this.btn_choose = index
      this.price = this.food.specfoods[this.btn_choose].price
    },
    // 多规格商品加入购物车
    addSpecs (
      categoryId,
      itemId,
      foodId,
      name,
      price,
      specs,
      packingFee,
      skuId,
      stock
    ) {
      this.$store.commit('ADD_CART', {
        shopid: this.shopId,
        categoryId: categoryId,
        itemId: itemId,
        foodId: foodId,
        name: name,
        price: price,
        specs: specs,
        packingFee: packingFee,
        skuId: skuId,
        stock: stock
      })
      this.isShowChooseList = false
    },
    // 加入购物车
    addCart (
      shopId,
      categoryId,
      itemId,
      foodId,
      name,
      price,
      specs,
      packingFee,
      skuId,
      stock
    ) {
      this.$store.commit('ADD_CART', {
        shopid: shopId,
        categoryId: categoryId,
        itemId: itemId,
        foodId: foodId,
        name: name,
        price: price,
        specs: '',
        packingFee: packingFee,
        skuId: skuId,
        stock: stock
      })
    },
    // 移除购物车
    removeCart (
      shopId,
      categoryId,
      itemId,
      foodId,
      name,
      price,
      specs,
      packingFee,
      skuId,
      stock
    ) {
      this.$store.commit('REDUCE_CART', {
        shopid: shopId,
        categoryId: categoryId,
        itemId: itemId,
        foodId: foodId,
        name: name,
        price: price,
        specs: '',
        packingFee: packingFee,
        skuId: skuId,
        stock: stock
      })
      if (!(this.shopcartcounter > 0)) {
        this.isOpenChooseList = false
      }
    },
    clearShopCart () {
      this.$store.commit('CLAER_CART', this.shopId)
      this.isOpenChooseList = false
    },
    selectTags (index, name) {
      this.tagActivedIndex = index
      this.tagName = name
      this.currentPage = 0
      this.ratingData = []
      this.GetratingsData(this.tagName, 10, this.currentPage)
    },
    toCommitOrder () {
      this.$router.push({
        name: 'ConfirmOrder',
        query: {
          geohash: this.$route.query.geohash,
          shopId: this.shopId
        }
      })
    },
    ...mapMutations(['ADD_CART', 'REDUCE_CART', 'CLAER_CART'])
  },
  watch: {
    letter () {
      if (this.lette !== null && this.lette !== '') {
        let element = this.$refs[this.letter][0]
        this.foodList.scrollToElement(element, 500)
      }
    }
  }
}
</script>
<style scoped>
.ratingTags ul,
.ratingImg ul {
    display: flex;
    flex-wrap: wrap;
}
.ratingTags ul li {
    width: 3rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: #999;
    font-size: 0.8rem;
    border: 0.25rem solid #ebebeb;
}
.ratingImg ul li img {
    width: 4rem;
    height: 4rem;
    margin-right: 1rem;
}
.rate {
    padding: 0.5rem;
}
.rate > ul > li {
    display: flex;
    padding: 0.5rem 0;
}
.rate > ul > li > img {
    width: 3rem;
    height: 3rem;
    border: 0.25rem;
    border-radius: 50%;
    margin-right: 0.8rem;
}
.rate ul li > section {
    flex: 1;
}
.rate ul li > section > div:nth-child(1) {
    display: flex;
    justify-content: space-between;
}
.rate ul li > section > div:nth-child(1) p,
span {
    font-size: 0.8rem;
    color: #999;
}
.tag ul {
    display: flex;
    flex-wrap: wrap;
    padding: 0.5rem;
}
.tag ul li {
    font-size: 0.9rem;
    color: #6d7885;
    padding: 0.3rem;
    background-color: #ebf5ff;
    border-radius: 0.2rem;
    border: 1px;
    margin: 0 0.4rem 0.2rem 0;
}
.tag ul .tagActived {
    background-color: #3190e8;
    color: #fff;
}
.assessHead {
    display: flex;
    padding: 1rem 0;
}
.assessHead section:nth-child(1) {
    text-align: center;
    width: 50%;
}
.assessHead section:nth-child(1) p:nth-child(1) {
    font-size: 1.5rem;
    color: #f60;
}
.assessHead section:nth-child(1) p:nth-child(2) {
    font-size: 1rem;
    color: #666;
}
.assessHead section:nth-child(1) p:nth-child(3) {
    font-size: 0.5rem;
    color: #999;
}
.assessHead section:nth-child(2) {
    flex: 1;
}
.assessHead section:nth-child(2) p {
    line-height: 1.5rem;
}
.assessHead section:nth-child(2) p:nth-child(3) span {
    font-size: 0.8rem;
    color: #999;
}
b {
    font-weight: bold;
}
.shopChooseListPrice {
    color: #f60;
    margin-right: 2rem;
}
.shopChooseListContent li > div {
    display: flex;
    justify-content: space-between;
    padding: 0.5rem 0;
    font-size: 1rem;
}
.shopChooseListContent {
    padding: 0 1rem;
    max-height: 50vh;
    overflow: auto;
}
.shopChooseList {
    position: absolute;
    left: 0;
    bottom: 3.5rem;
    background: white;
    width: 100%;
    z-index: 20;
}
.shopChooseList header {
    display: flex;
    justify-content: space-between;
    padding: 1rem;
    background: #eceff1;
}
.Dialog_seco,
.Dialog_sect {
    display: flex;
}
.Dialog_seco {
    flex-wrap: wrap;
}
.Dialog_sect {
    padding: 1rem 0;
    justify-content: space-between;
}
.Dialog_price {
    font-size: 1.2rem;
    line-height: 2rem;
    color: #ff6000;
}
.Dialog_btn {
    padding: 0 1rem;
    line-height: 2rem;
    height: 2rem;
    background: #3199e8;
    color: white;
    border-radius: 0.4rem;
}
.MulBtn {
    padding: 0.5rem 1rem;
    background: #fff;
    border: 1px solid #dcdfe6;
    color: #606266;
    text-align: center;
    border-radius: 0.25rem;
    margin-right: 1rem;
    margin: 1rem 1rem 0 0;
}
.btn_actived {
    border-color: #409eff;
}
.money {
    width: 8rem;
    margin: 0.1rem 0 0 7rem;
    height: 3.4rem;
}
.money h3,
.money h4 {
    color: white;
    font-weight: bold;
    line-height: 1.7rem;
}
.buy_cart_container i {
    font-size: 4rem;
    transform: scale(0.6);
    color: white;
}
.buy_cart_container .el-badge {
    position: absolute;
    top: -5px;
    right: -5px;
}
.buy_cart_container {
    width: 4rem;
    height: 4rem;
    position: absolute;
    left: 1.5rem;
    bottom: 0.3rem;
    border: 0.18rem solid #444;
    border-radius: 50%;
    background-color: #535356;
    z-index: 99;
}
.cart_icon_activity {
    background-color: #3190e8;
}
.shopcar section:nth-child(1) {
    flex: 1;
    background: #3d3d3f;
}
.shopcar .sec {
    width: 8rem;
    background: #535356;
    text-align: center;
}
.shopcar section:nth-child(2) span {
    margin: 0 auto;
    font-size:1rem;
    line-height: 3.5rem;
    color: white;
    font-weight: bold;
}
.shopcar > .shopcarActived {
    background: #4cd964;
}
.foods_sec footer {
    display: flex;
    justify-content: space-between;
    padding-left: 4.5rem;
    align-items: center;
}
.foods_sec footer section:nth-child(1) span:nth-child(1) {
    font-size: 1rem;
    padding-right: 0.2rem;
    font-weight: bold;
    color: #f60;
}
.foods_sec footer section:nth-child(1) span:nth-child(2) {
    font-size: 0.5rem;
}
.foods_img img {
    width: 4rem;
    height: 4rem;
}
.foods_info {
    flex: 1;
    padding-left: 0.5rem;
    line-height: 1.4rem;
}
.foods_info > h4:nth-child(2) {
    font-size: 0.5rem;
    color: #999;
}
.foods_info > h4:nth-child(3) {
    font-size: 0.5rem;
}
.foods {
    display: flex;
}
.foods_sec {
    padding: 1rem 0;
    background: white;
}
.shop_right header {
    line-height: 2rem;
}
.shop_right header span:nth-child(1) {
    font-size: 1rem;
    font-weight: bold;
}
.shop_right header span:nth-child(2) {
    font-size: 0.5rem;
    padding-left: 0.5rem;
    color: #999;
}
</style>
<style scoped>
.contain {
    display: flex;
    flex-direction: column;
    height: 100vh;
    overflow: hidden;
}
.contain > section {
    display: flex;
    flex: 1;
}
.contain > section > div {
    display: flex;
    flex-direction: column;
    flex: 1;
    width: 100%;
}
nav {
    position: relative;
    padding-top: 2.9rem;
    overflow: hidden;
    z-index: 10;
}
nav > section {
    position: relative;
    background: rgba(119, 103, 137, 0.43);
    z-index: 10;
    display: flex;
    flex-direction: column;
    padding: 0.8rem;
}
nav > section > div {
    display: flex;
}
nav > img {
    width: 100%;
    z-index: 9;
    position: absolute;
    top: 0;
    left: 0;
    filter: blur(10px);
}
.nav_left img {
    width: 6rem;
    height: 6rem;
    border-radius: 0.8rem;
}
.nav_right {
    flex-grow: 1;
    margin-left: 1rem;
}
.nav_right > p {
    width: 13rem;
    color: white;
    line-height: 2rem;
    margin-right: 2rem;
}
.nav_right > p:nth-child(1) {
    font-size: 1.2rem;
    font-weight: bold;
}
.nav_right > p:nth-child(2) {
    font-size: 0.8rem;
}
.nav_right > p:nth-child(3) {
    font-size: 0.8rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.description_arrow {
    position: absolute;
    top: 50%;
    right: 0.3rem;
    transform: translateY(-50%);
    z-index: 10;
}
.shop {
    display: flex;
    flex: 1;
}
.shop_left {
    width: 6rem;
    background: #f6f6f6;
    overflow: hidden;
}
.shop_left ul li {
    padding: 0.5rem 0;
    height: 2rem;
    line-height: 2rem;
    text-indent: 1rem;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    position: relative;
}
.shop_left ul li div {
    position: absolute;
    top: 0;
    right: 0;
    text-indent: 0;
}
.shop_right {
    flex: 1;
    background: yellow;
    overflow: hidden;
    padding: 0.5rem;
    background: #f6f6f6;
}
#pane-first {
    width: 100%;
    display: flex;
    flex: 1;
    flex-direction: column;
}
#pane-second {
    width: 100%;
    display: flex;
    flex: 1;
    flex-direction: column;
}
.shopcar {
    display: flex;
    height: 3.5rem;
    z-index: 99;
}
.tip {
    font-size: 0.5rem;
    color: white;
}
.tip > span {
    display: inline-block;
    background: red;
    color: white;
    margin-right: 0.3rem;
}
.actived {
    border-left: 0.2rem solid #3190e8;
    background-color: #fff;
}
</style>
<style>
.el-tabs__header {
    margin-bottom: 2px;
}
.el-tabs__content {
    display: flex;
    flex: 1;
}
.foods_sec footer section:nth-child(2) div button,
.shopChooseListRight button {
    transform: scale(0.8);
}
.foods_sec footer section:nth-child(2) div button i,
.foods_sec footer section:nth-child(2) button span,
.shopChooseListRight button i,
.shopChooseListRight button span {
    color: white;
}
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
.el-rate__icon {
    font-size: 0.5rem;
    margin-right: 0;
}
.el-rate {
    display: inline-block;
}
</style>
