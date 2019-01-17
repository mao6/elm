<template>
  <div>
    <Header signinUp='true' :headTitle='address'>
      <router-link :to="'/'" class="link_search" slot="search">
        <svg width="100%" height="100%">
          <circle cx="8" cy="8" r="7" stroke="rgb(255,255,255)" stroke-width="1" fill="none" />
          <line x1="14" y1="14" x2="20" y2="20" style="stroke:rgb(255,255,255);stroke-width:2" />
        </svg>
      </router-link>
    </Header>
    <nav>
      <swiper :options="swiperOption">
        <swiper-slide v-for="(page,index) of pages" :key="index">
          <div class="icon" v-for="item of page" :key="item.id">
            <router-link :to="{path:'/Food',query:{'geohash':geohash,'name':item.title,'restaurant_category_id':getCategoryId(item.link)}}">
              <div class="icon-img">
                <img class="icon-img-content" :src="'https://fuss10.elemecdn.com'+item.image_url" alt="">
              </div>
              <p class="icon-desc">{{item.title}}</p>
            </router-link>
          </div>
        </swiper-slide>
        <div class="swiper-pagination" slot="pagination"></div>
      </swiper>
    </nav>
    <section class="list">
      <div class="shop_list_container">
        <div class="shop_header">
          <span class="shop_header_title">附近商家</span>
        </div>
        <ShopList v-if="hasGetData" :geohash="geohash"></ShopList>
      </div>
    </section>
    <FootGuide></FootGuide>
  </div>
</template>
<script>
import Header from '../../components/Header/Header'
import FootGuide from '../../components/FootGuide/FootGuide'
import ShopList from '../../components/ShopList/ShopList'
import axios from 'axios'
import 'swiper/dist/css/swiper.css'
import { swiper, swiperSlide } from 'vue-awesome-swiper'
export default {
  name: 'msite',
  components: {
    Header,
    swiper,
    swiperSlide,
    FootGuide,
    ShopList
  },
  data () {
    return {
      address: '',
      geohash: '',
      swiperOption: {
        pagination: '.swiper-pagination',
        loop: false
      },
      pages: [],
      hasGetData: ''
    }
  },
  mounted () {
    this.geohash = this.$route.query.geohash
    axios
      .get(
        'http://elm.cangdu.org/v2/index_entry?group_type=1&flags[]=F',
        {
          params: { geohash: this.geohash }
        }
      )
      .then(res => {
        if (res) {
          // =res.data.length
          const list = res.data
          list.forEach((item, index) => {
            const page = Math.floor(index / 8)
            if (!this.pages[page]) {
              this.pages[page] = []
            }
            this.pages[page].push(item)
          })
        }
      })
    // this.geohash = this.$route.params.geohash
    axios
      .get('http://elm.cangdu.org/v2/pois/' + this.$route.query.geohash)
      .then(res => {
        if (res) {
          this.address = res.data.name
        }
      })
    this.hasGetData = true
  },
  methods: {
    // 解码url地址，求去restaurant_category_id值
    getCategoryId (url) {
      let urlData = decodeURIComponent(
        url.split('=')[1].replace('&target_name', '')
      )
      if (/restaurant_category_id/gi.test(urlData)) {
        return JSON.parse(urlData).restaurant_category_id.id
      } else {
        return ''
      }
    }
  }
}
</script>
<style scoped>
nav {
    margin-top: 3rem;
    margin-bottom: 1rem;
}
.icon {
    position: relative;
    overflow: hidden;
    float: left;
    width: 25%;
    height: 0;
    padding-bottom: 25%;
}
.icon-img {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 2rem;
    box-sizing: border-box;
    padding: 0.1rem;
}
.icon-img-content {
    display: block;
    margin: 0 auto;
    height: 100%;
}
.icon-desc {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 1rem;
    height: 1rem;
    font-size: 0.8rem;
    font-weight: bold;
    text-align: center;
    color: #666;
}
.shop_list_container .shop_header {
    margin-left: 0.6rem;
    vertical-align: middle;
}
.shop_header_title {
    color: #666;
}
.list {
    padding-bottom: 3rem;
}
</style>
