<template>
  <div>
    <span v-if="!food.specifications.length">
      <el-button v-if="counter>0" type="primary" icon="el-icon-minus" circle size="mini" @click="removeCart(food)"></el-button>
      <span v-if="counter>0">{{counter}}</span>
      <el-button v-if="!food.specifications.length" type="primary" icon="el-icon-plus" circle size="mini" @click="addCart(food)"></el-button>
    </span>
    <span v-if="food.specifications.length">
      <el-button v-if="counter>0" type="primary" icon="el-icon-minus" circle size="mini" @click="ShowTip()"></el-button>
      <span v-if="counter>0">{{counter}}</span>
      <el-button v-if="food.specifications.length" type="primary" @click="sendMsg(food)">选规格</el-button>
    </span>
  </div>
</template>
<script>
import { mapState, mapMutations } from 'vuex'
export default {
  name: 'BuyCar',
  data () {
    return {
    }
  },
  props: ['food', 'shopId'],
  computed: {
    ...mapState(['cartList']),
    shopCart: function () {
      return this.cartList[this.shopId]
    },
    counter: function () {
      let categoryId = this.food.category_id
      let itemId = this.food.item_id
      if (
        this.shopCart &&
                this.shopCart[categoryId] &&
                this.shopCart[categoryId][itemId]
      ) {
        let num = 0
        // 返回数组
        Object.values(this.shopCart[categoryId][itemId]).forEach(
          (item, index) => {
            if (item && item.num) {
              num += item.num
            }
          }
        )
        return num
      } else {
        return 0
      }
    }
  },
  mounted () {},
  methods: {
    // 加入购物车
    addCart (food) {
      this.$store.commit('ADD_CART', {
        shopid: this.shopId,
        categoryId: food.category_id,
        itemId: food.item_id,
        foodId: food.specfoods[0].food_id,
        name: food.specfoods[0].name,
        price: food.specfoods[0].price,
        specs: '',
        packingFee: food.specfoods[0].packing_fee,
        skuId: food.specfoods[0].sku_id,
        stock: food.specfoods[0].stock
      })
    },
    // 移除购物车
    removeCart (food) {
      if (this.counter > 0) {
        this.$store.commit('REDUCE_CART', {
          shopid: this.shopId,
          categoryId: food.category_id,
          itemId: food.item_id,
          foodId: food.specfoods[0].food_id,
          name: food.specfoods[0].name,
          price: food.specfoods[0].price,
          specs: '',
          packingFee: food.specfoods[0].packing_fee,
          skuId: food.specfoods[0].sku_id,
          stock: food.specfoods[0].stock
        })
      }
    },
    sendMsg (food) {
      this.$emit('CallBack', food)
    },
    ShowTip () {
      this.$message.closeAll()
      this.$message({
        message: '多规格商品只能在购物车删除哦',
        duration: 1000
      })
    },
    ...mapMutations(['ADD_CART', 'REDUCE_CART'])
  },
  watch: {}
}
</script>
