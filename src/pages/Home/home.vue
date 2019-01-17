<template>
  <div>
    <Header signinUp='true'>
      <span slot='logo' @click="reload" class="header-left">ele.me</span>
    </Header>
    <div class="city_tip">
      <span>当前定位城市：</span>
      <span>定位不准时，请在城市列表中选择</span>
    </div>
    <router-link tag="div" :to="'/city/'+this.CurrentCity.id" class="guess_city">
      <span>{{this.CurrentCity.name}}</span>
      <span>
        <i class="el-icon-arrow-right"></i>
      </span>
    </router-link>
    <div class="list" ref="wrapper">
      <div class="content">
        <section class="city">
          <p>热门城市</p>
          <ul>
            <router-link tag="li" :to="'/city/'+item.id" v-for="(item,index) in city_hot" :key="index">{{item.name}}</router-link>
          </ul>
        </section>
        <section class="city">
          <div v-for="(item,key,index) in SortCityList" :key="index" :ref="key">
            <p>{{key}}
              <span v-if="index===0"> (按字母排序)</span>
            </p>
            <ul>
              <router-link tag="li" :to="'/city/'+it.id" v-for="it in item" :key="it.id">{{it.name}}</router-link>
            </ul>
          </div>
        </section>
      </div>
    </div>
    <!--字母排序 -->
    <ul class="code">
      <li v-for="(item,index) in SortCityKeyList" :key="index" @click="handleLetterClick" @touchstart="handleLetterStart" @touchmove="handleLetterMove" @touchend="handleLetterEnd">{{item}}</li>
    </ul>
  </div>
</template>

<script>
import Header from '../../components/Header/Header'
import axios from 'axios'
import BScroll from 'better-scroll'

export default {
  name: 'Home',
  components: {
    Header
  },
  data () {
    return {
      CurrentCity: '',
      city_hot: [],
      city_list: {},
      letter: '',
      touchStatus: ''
    }
  },
  computed: {
    SortCityList () {
      let obj = {}
      const ascA = parseInt('A'.charCodeAt())
      const ascZ = parseInt('Z'.charCodeAt())
      for (let i = ascA; i <= ascZ; i++) {
        let key = String.fromCharCode(i)
        let _this = this.city_list[key]
        if (_this) {
          obj[key] = _this
        }
      }
      return obj
    },
    SortCityKeyList () {
      let KeyArray = []
      const ascA = parseInt('A'.charCodeAt())
      const ascZ = parseInt('Z'.charCodeAt())
      for (let i = ascA; i <= ascZ; i++) {
        let key = String.fromCharCode(i)
        let _this = this.city_list[key]
        if (_this) {
          KeyArray.push(key)
        }
      }
      return KeyArray
    }
  },
  mounted () {
    this.GetCurrentCity()
    this.GetHotCity()
    this.GetCityList()
    this.scroll = new BScroll(this.$refs.wrapper, { click: true })
  },
  watch: {
    letter () {
      if (this.letter) {
        let element = this.$refs[this.letter][0]
        this.scroll.scrollToElement(element, 300)
      }
    }
  },
  methods: {
    reload () {
      window.location.reload()
    },
    // 获取当前城市
    GetCurrentCity () {
      axios
        .get('http://elm.cangdu.org/v1/cities?type=guess')
        .then(this.GetCurrentCitySucc)
    },
    GetCurrentCitySucc (res) {
      if (res.data) {
        this.CurrentCity = res.data
      }
    },
    // 获取热门城市
    GetHotCity () {
      axios
        .get('http://elm.cangdu.org/v1/cities?type=hot')
        .then(this.GetHotCitySucc)
    },
    GetHotCitySucc (res) {
      if (res.data) {
        this.city_hot = res.data
      }
    },
    // 获取城市列表
    GetCityList () {
      axios
        .get('http://elm.cangdu.org/v1/cities?type=group')
        .then(this.GetCityListSucc)
    },
    GetCityListSucc (res) {
      if (res.data) {
        this.city_list = res.data
      }
    },
    handleLetterClick (e) {
      this.letter = e.target.innerText
      // console.log(e.target.innerText)
    },
    handleLetterStart () {
      this.touchStatus = true
    },
    handleLetterMove (e) {
      if (this.touchStatus) {
        let touch = e.touches[0]
        let ele = document.elementFromPoint(touch.pageX, touch.pageY)
        if (ele && ele.tagName === 'LI' && ele.offsetParent.className === 'code') {
          this.letter = ele.innerText
        }
      }
    },
    handleLetterEnd (e) {
      this.touchStatus = false
    }
  }
}
</script>
<style scoped>
.city_tip {
    padding: 0 0.5rem;
    padding-top: 3.5rem;
    height: 2.5rem;
    line-height: 2.5rem;
}
.city_tip > span:nth-child(1) {
    float: left;
}
.city_tip > span:nth-child(2) {
    float: right;
    font-size: 0.5rem;
    font-weight: bold;
    color: #9f9f9f;
}
.guess_city {
    border-top: 1px solid #e4e4e4;
    border-bottom: 2px solid #e4e4e4;
    padding: 0 0.5rem;
    height: 3rem;
    line-height: 3rem;
}
.guess_city > span:nth-child(1) {
    float: left;
    color: #3190e8;
}
.guess_city > span:nth-child(2) {
    float: right;
    font-size: 1rem;
    font-weight: bold;
    color: #9f9f9f;
}
.city {
    margin-top: 0.5rem;
}
.city p {
    border-top: 1px solid #e4e4e4;
    border-bottom: 1px solid #e4e4e4;
    padding: 0.5rem;
}
.city ul {
    overflow: hidden;
}
.city ul li {
    width: 24.5%;
    float: left;
    border-bottom: 1px solid #e4e4e4;
    border-left: 1px solid #e4e4e4;
    text-align: center;
    color: #3190e8;
    height: 2.75rem;
    box-sizing: border-box;
    line-height: 2.75rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.list {
    width: 100%;
    position: absolute;
    top: 9.5rem;
    left: 0;
    right: 0;
    bottom: 0;
    overflow: hidden;
}
.city > div > p > span {
    font-size: 0.8rem;
    color: #999;
}
.code {
    position: absolute;
    top: 9.5rem;
    right: 0;
    bottom: 0;
    display: flex;
    flex-direction: column;
    width: 1.2rem;
    justify-content: center;
    z-index: 1;
    font-size: 1rem;
}
.code > li {
    color: #3190e8;
    height:1.1rem;
    line-height: 1.1rem;
    width:100%;
    text-align: center;
}
</style>
