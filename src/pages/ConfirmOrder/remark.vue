<template>
    <div>
        <Header goBack='goBack' :headTitle="headTitle"></Header>
        <section class="content">
            <p class="btn_title">快速备注</p>
            <section class="btn_group">
                <el-radio-group v-for="(items,indexs) in remark" :key="indexs" v-model="choosed[indexs]" size="medium">
                    <el-radio-button v-for="(item,index) in items" :key="index" :label="item"></el-radio-button>
                </el-radio-group>
            </section>
            <p class="btn_title">其他备注</p>
            <section>
                <el-input type="textarea" :rows="5" placeholder="请输入内容(可不填)" v-model="textarea">
                </el-input>
            </section>
            <div class="btn_div" @click="to()">确定</div>
        </section>
    </div>
</template>

<script>
import Header from '../../components/Header/Header'
import Axios from 'axios'
export default {
  name: 'remake',
  data () {
    return {
      headTitle: '订单备注',
      remark: [],
      textarea: '',
      choosed: {},
      geohash: '',
      shopId: '',
      payment: ''
    }
  },
  components: {
    Header
  },
  created () {
    this.geohash = this.$route.params.geohash
    this.shopId = this.$route.params.shopId
    this.payment = this.$route.params.payment
    this.remarkData()
  },
  computed: {
    txt: function () {
      let data = ''
      Object.values(this.choosed).forEach(item => {
        if (item) {
          data += item + ','
        }
      })
      if (this.textarea) {
        data += this.textarea
      }
      return data
    }
  },
  methods: {
    remarkData () {
      Axios.get('http://elm.cangdu.org/v1/carts/64785/remarks').then(
        res => {
          if (res.data) {
            this.remark = res.data.remarks
            if (this.remark.length > 0) {
              this.remark.forEach((item, index) => {
                this.$set(this.choosed, index, '')
              })
            }
          }
        }
      )
    },
    to () {
      this.$router.push({
        name: 'ConfirmOrder',
        params: {
          remark: this.txt,
          payment: this.payment
        },
        query: {
          'geohash': this.geohash,
          'shopId': this.shopId
        }
      })
    }
  }
}
</script>

<style scoped>
.content {
    margin-top: 2.9rem;
    padding: 0 1rem;
}
.btn_title {
    padding: 1rem 0;
}
.btn_group > div {
    margin-right: 0.5rem;
    margin-bottom: 0.5rem;
}
.btn_div {
    margin-top: 1rem;
    width: 100%;
    background: #4cd964;
    color: white;
    border-radius: 5px;
    text-align: center;
    line-height: 2.5rem;
}
</style>
