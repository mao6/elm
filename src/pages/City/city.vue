<template>
    <div>
        <Header goBack='goBack' :head-title="cityname">
            <router-link to="/" slot="changeCity" class="change_city">切换城市</router-link>
        </Header>
        <section class="city_form">
            <div>
                <form v-on:submit.prevent>
                    <el-input v-model="inputVaule" placeholder="输入学校、商务楼、地址" clearable required="required"></el-input>
                    <input type="submit" name="submit" @click='GetValueInfo' value="提交">
                </form>
            </div>
            <span v-if="historytitle">搜索历史</span>
            <div class="history">
                <ul>
                    <li v-for="item in searchList" :key="item.index" @click="toNextPage(item)">
                        <h4 class="ellipsis">{{item.name}}</h4>
                        <p class="ellipsis">{{item.address}}</p>
                    </li>
                </ul>
            </div>
            <div v-if="historytitle&&searchList.length>0" class="btn_clear" @click="clearHistory">
                清空所有
            </div>
            <p v-if="searchList.length==0&&!historytitle">很抱歉，无搜索结果</p>
        </section>
    </div>
</template>

<script>
import Header from '../../components/Header/Header'
import axios from 'axios'
import { mapState, mapMutations } from 'vuex'
export default {
  name: 'City',
  components: {
    Header
  },
  data () {
    return {
      cityname: '',
      cityid: '',
      inputVaule: '',
      searchList: [],
      historytitle: true // 默认搜索历史打开
    }
  },
  computed: {
    ...mapState({
      searchAddress: function (state) {
        if (!state.searchAddress) {
          this.$store.dispatch('ADD_SEARCH_ADDRESS')
        }
        return state.searchAddress
          ? JSON.parse(state.searchAddress)
          : []
      }
    })
  },
  mounted () {
    let _this = this
    _this.historytitle = true
    _this.searchList = this.searchAddress
    _this.cityid = _this.$route.params.cityid
    axios
      .get('http://elm.cangdu.org/v1/cities/' + _this.cityid)
      .then(function (res) {
        if (res.data) {
          _this.cityname = res.data.name
        }
      })
  },
  activated () {},
  methods: {
    GetValueInfo () {
      if (this.inputVaule.trim()) {
        axios
          .get('http://elm.cangdu.org/v1/pois?type=search', {
            params: {
              city_id: this.cityid,
              keyword: this.inputVaule
            }
          })
          .then(res => {
            if (res.data) {
              this.searchList = res.data
              this.historytitle = false
            }
          })
      }
    },
    toNextPage (items) {
      let repeat = false
      this.searchAddress.forEach(item => {
        if (item.geohash === items.geohash) {
          repeat = true
        }
      })
      if (!repeat) {
        this.searchAddress.unshift(items)
        localStorage.setItem(
          'searchAddress',
          JSON.stringify(this.searchAddress)
        )
        this.$store.commit(
          'CHOOSE_SEARCH_ADDRESS',
          localStorage.getItem('searchAddress')
        )
      }
      this.$router.push({
        name: 'Msite',
        // params: { geohash: items.geohash }
        query: { geohash: items.geohash }
      })
    },
    clearHistory () {
      this.$store.commit('CHOOSE_SEARCH_ADDRESS', '')
      localStorage.removeItem('searchAddress')
      this.searchList = []
    },
    ...mapMutations(['CHOOSE_SEARCH_ADDRESS'])
  }
}
</script>
<style scoped>
.city_form {
    width: 100%;
    position: absolute;
    top: 3.5rem;
    left: 0;
    right: 0;
    bottom: 0;
}
.city_form > div {
    border-top: 1px solid #e4e4e4;
    border-bottom: 1px solid #e4e4e4;
    padding: 1rem 1rem;
}
.city_form > div > form > input {
    margin-top: 0.8rem;
    width: 100%;
    line-height: 2.5rem;
    height: 2.5rem;
    background: #3190e8;
    border-radius: 3px;
    color: white;
    font-size: 1rem;
}

.city_form > span {
    margin-left: 1rem;
}

.city_form > .history {
    border-top: 1px solid #e4e4e4;
    border-bottom: initial;
    padding: 0;
}

.city_form > .history > ul > li {
    padding-top: 1rem;
    border-bottom: 1px solid #e4e4e4;
}
.city_form > .history > ul > li > h4 {
    margin: 0 1rem;
}
.city_form > .history > ul > li > p {
    padding-top: 0.5rem;
    padding-bottom: 0.75rem;
    color: #999;
    font-size: 0.85rem;
    margin: 0 1rem;
}
.city_form > .btn_clear {
    border-top: 0;
    text-align: center;
}
.city_form > p {
    margin-top: 0.5rem;
    text-indent: 1rem;
}
.ellipsis {
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
}
</style>
