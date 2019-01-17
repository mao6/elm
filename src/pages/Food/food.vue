<template>
    <div>
        <Header goBack='goBack' :head-title="TitleName"></Header>
        <div class="btn_choose">
            <div :class="{isChoose:chooseTxt=='categray'}" @click="chooseType('categray')">{{categoryName}}
                <svg width="10" height="10" xmlns="http://www.w3.org/2000/svg" version="1.1" class="sort_icon">
                    <polygon points="0,3 10,3 5,8" />
                </svg>
            </div>
            <div :class="{isChoose:chooseTxt=='sort'}" @click="chooseType('sort')">排序
                <svg width="10" height="10" xmlns="http://www.w3.org/2000/svg" version="1.1" class="sort_icon">
                    <polygon points="0,3 10,3 5,8" />
                </svg>
            </div>
            <div :class="{isChoose:chooseTxt=='choose'}" @click="chooseType('choose')">筛选
                <svg width="10" height="10" xmlns="http://www.w3.org/2000/svg" version="1.1" class="sort_icon">
                    <polygon points="0,3 10,3 5,8" />
                </svg>
            </div>
        </div>

        <div v-show="chooseTxt" class="dialogDiv">
            <el-collapse-transition>
                <div v-if="chooseTxt=='categray'" class="categray">
                    <section class="categrayLeft">
                        <ul>
                            <li v-for="(item,index) in categoryList" :key="item.id" :class="{active:category_id == item.id}" @click="selectCategoryName(item.id, index)">
                                <section><img v-if="index" :src="getImgPath(item.image_url)">
                                    <span>{{item.name}}</span>
                                </section>
                                <section>
                                    <span>{{item.count}}</span>
                                    <svg v-if="index" width="8" height="8" xmlns="http://www.w3.org/2000/svg" version="1.1" class="category_arrow">
                                        <path d="M0 0 L6 4 L0 8" stroke="#bbb" stroke-width="1" fill="none" />
                                    </svg>
                                </section>
                            </li>
                        </ul>
                    </section>
                    <section class="categrayRight">
                        <ul>
                            <li v-for="(item,index) in categoryListRight" :key="index" v-if="index" @click="searchByCategory(item.id,item.name)">
                                <section>
                                    <span>{{item.name}}</span>
                                </section>
                                <section>
                                    <span>{{item.count}}</span>
                                </section>
                            </li>
                        </ul>
                    </section>
                </div>
                <div v-if="chooseTxt=='sort'" class="sort" @touchmove.prevent>
                    <section>
                        <ul>
                            <li :class="{selected:sortName==0}" @click="sortBy(0)">智能排序</li>
                            <li :class="{selected:sortName==5}" @click="sortBy(5)">距离最近</li>
                            <li :class="{selected:sortName==6}" @click="sortBy(6)">销量最高</li>
                            <li :class="{selected:sortName==1}" @click="sortBy(1)">起送价最低</li>
                            <li :class="{selected:sortName==2}" @click="sortBy(2)">配送速度最快</li>
                            <li :class="{selected:sortName==3}" @click="sortBy(3)">评分最高</li>
                        </ul>
                    </section>
                </div>
                <div v-if="chooseTxt=='choose'" class="choose" @touchmove.prevent>
                    <section>
                        <p>配送方式</p>
                        <div class="delivery">
                            <div class="MulBtn" :class="{btn_actived:delivery_mode_array.indexOf(1)!==-1}" plain @click="selectDeliveryMode(1)">蜂鸟专送</div>
                        </div>
                    </section>
                    <section>
                        <p>商家属性(可以多选)</p>
                        <ul class="shangjia">
                            <li>
                                <div class="MulBtn" :class="{btn_actived:support_ids_array.indexOf(8)!==-1}" @click="selectSupportIds(8)">品牌商家</div>
                            </li>
                            <li>
                                <div class="MulBtn" :class="{btn_actived:support_ids_array.indexOf(7)!==-1}" @click="selectSupportIds(7)">外卖保</div>
                            </li>
                            <li>
                                <div class="MulBtn" :class="{btn_actived:support_ids_array.indexOf(9)!==-1}" @click="selectSupportIds(9)">准时达</div>
                            </li>
                            <li>
                                <div class="MulBtn" :class="{btn_actived:support_ids_array.indexOf(5)!==-1}" @click="selectSupportIds(5)">新店</div>
                            </li>
                            <li>
                                <div class="MulBtn" :class="{btn_actived:support_ids_array.indexOf(3)!==-1}" @click="selectSupportIds(3)">在线支付</div>
                            </li>
                            <li>
                                <div class="MulBtn" :class="{btn_actived:support_ids_array.indexOf(4)!==-1}" @click="selectSupportIds(4)">开发票</div>
                            </li>
                        </ul>
                    </section>
                    <div class="foot">
                        <div>
                            <div @click="clearAll()">清空</div>
                        </div>
                        <div>
                            <div @click="search()">确定</div>
                        </div>
                    </div>
                </div>
            </el-collapse-transition>
        </div>

        <section class="shoplist">
            <ShopList v-if="hasGetData" :geohash="geohash" :restaurantCategoryId="restaurant_category_id" :orderBy="sortName" :deliveryMode="delivery_mode" :supportIds="support_ids"></ShopList>
        </section>
    </div>
</template>
<script>
import Header from '../../components/Header/Header'
import ShopList from '../../components/ShopList/ShopList'
import Axios from 'axios'
export default {
  name: 'Food',
  data () {
    return {
      hasGetData: true,
      chooseTxt: '',
      categoryList: [],
      category_id: '',
      restaurant_category_id: '',
      categoryListRight: [],
      common: '',
      categoryName: '',
      sortName: '',
      chooseName: '',
      TitleName: '',
      support_ids_array: [],
      delivery_mode_array: [],
      support_ids: [],
      delivery_mode: []
    }
  },
  components: {
    Header,
    ShopList
  },
  computed: {
    geohash () {
      return this.$route.query.geohash
    }
  },
  mounted () {
    const _this = this
    _this.TitleName = _this.$route.query.name
    _this.restaurant_category_id = _this.$route.query.restaurant_category_id.toString()
    _this.categoryName = _this.$route.query.name
    _this.common = _this.categoryName
    _this.support_ids = []
    _this.delivery_mode = []
    Axios.get('http://elm.cangdu.org/shopping/v2/restaurant/category', {
      params: {
        latitude: this.$route.query.geohash.split(',')[0],
        longitude: this.$route.query.geohash.split(',')[1]
      }
    }).then(res => {
      if (res.data) {
        this.categoryList = res.data
      }
    })
  },
  methods: {
    chooseType (text) {
      if (this.chooseTxt === text) {
        this.chooseTxt = ''
        this.categoryName = this.common
      } else {
        this.chooseTxt = text
        if (text === 'categray') {
          this.categoryName = '分类'
        }
        this.selectCategoryName(this.restaurant_category_id)
      }
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
    selectCategoryName (id, index) {
      if (index !== 0) {
        this.category_id = id
        this.categoryList.forEach(item => {
          if (item.id && id && item.id.toString() === id.toString()) {
            this.categoryListRight = item.sub_categories
          }
        })
      } else {
        this.chooseTxt = ''
      }
    },
    searchByCategory (id, name) {
      this.chooseTxt = ''
      this.categoryName = name
      this.TitleName = name
      this.common = name
      this.restaurant_category_id = id.toString()
    },
    sortBy (id) {
      this.sortName = id.toString()
      this.chooseTxt = ''
    },
    selectSupportIds (id) {
      if (this.support_ids_array.indexOf(id) !== -1) {
        this.support_ids_array.forEach((item, index) => {
          if (item === id) {
            this.support_ids_array.splice(index, 1)
          }
        })
      } else {
        this.support_ids_array.push(id)
      }
      // console.log(this.support_ids)
    },
    selectDeliveryMode (id) {
      if (this.delivery_mode_array.indexOf(id) !== -1) {
        this.delivery_mode_array.forEach((item, index) => {
          if (item === id) {
            this.delivery_mode_array.splice(index, 1)
          }
        })
      } else {
        this.delivery_mode_array.push(id)
      }
      // console.log(this.delivery_mode)
    },
    clearAll () {
      this.delivery_mode_array = []
      this.support_ids_array = []
    },
    search () {
      this.delivery_mode = JSON.parse(JSON.stringify(this.delivery_mode_array))
      this.support_ids = JSON.parse(JSON.stringify(this.support_ids_array))
      this.chooseTxt = ''
    }
  },
  watch: {}
}
</script>
<style scoped>
.sort_icon {
    vertical-align: middle;
    transition: all 0.3s;
    fill: #666;
}
.isChoose {
    color: #3190e8;
}
.isChoose .sort_icon {
    transform: rotate(180deg);
}
.shoplist {
    margin-top: 5rem;
    padding: 0.1rem 0;
}
.btn_choose {
    position: fixed;
    top: 3rem;
    left: 0;
    width: 100%;
    display: flex;
    font-size: 0.95rem;
    height: 2rem;
    line-height: 2rem;
    z-index: 10;
}
.btn_choose > div {
    width: 33.3%;
    text-align: center;
    background: white;
    border-bottom: 0.025rem solid #e6e6e6;
}
.dialogDiv {
    z-index: 100;
    background: rgba(0, 0, 0, 0.3);
    position: fixed;
    top: 5rem;
    bottom: 0;
    left: 0;
    width: 100%;
    overflow: hidden;
}
.dialogDiv > div {
    background: white;
    width: 100%;
}
.categray {
    display: flex;
}
.categray > section {
    width: 50%;
}
.categray > section ul {
    background: #f1f1f1;
}
.categray > section:nth-child(2) ul {
    background: white;
}
.categray section li {
    display: flex;
    justify-content: space-between;
    padding: 0 0.5rem;
}
.categray section li section {
    font-size: 0.9rem;
}
.categray section li section img {
    width: 1.2rem;
    height: 1.2rem;
    vertical-align: middle;
    margin-right: 0.2rem;
}
.categray section li section span {
    line-height: 2.5rem;
}
.categray section li section:nth-child(2) span {
    background-color: #ccc;
    font-size: 0.4rem;
    color: #fff;
    padding: 0 0.2rem;
    border: 0.025rem solid #ccc;
    border-radius: 0.8rem;
    vertical-align: middle;
    margin-right: 0.25rem;
}
.active {
    background: white;
}
.categrayLeft,
.categrayRight {
    height: 22.5rem;
    overflow-y: auto;
}
.categrayRight ul li {
    border-bottom: 0.025rem solid #e4e4e4;
}
.categrayRight ul li section:nth-child(2) span {
    background-color: initial;
    font-size: 0.4rem;
    color: initial;
    padding: 0 0.2rem;
    border: none;
    border-radius: initial;
    vertical-align: middle;
    margin-right: 0.25rem;
}
.sort section ul li {
    font-size: 0.9rem;
    height: 2.5rem;
    line-height: 2.5rem;
    text-align: center;
    border-bottom: 0.025rem solid #ccc;
}
.selected {
    color: #3190e8;
}
.choose section {
    font-size: 0.9rem;
    line-height: 2.5rem;
    padding:0 1rem;
}
.delivery{
    width: 33.3%
}
.shangjia {
    display: flex;
    flex-wrap: wrap;
}
.shangjia li {
    width: 33.3%;
    margin-bottom: 0.5rem;
}
.foot {
    display: flex;
}
.foot > div {
    border-top: 0.025rem solid #ccc;
    width: 50%;
    padding: 0.5rem 1rem;
}
.foot > div > div {
    width: 100%;
    text-align: center;
    color:white;
    line-height:2.5rem;
    border-radius: .25rem;
}
.foot > div:nth-child(1) > div {
    background: #409effff;
    border: 1px solid #409eff;
}
.foot > div:nth-child(2) > div {
    background: #67c23a;
    border: 1px solid #67c23a;
}
.foot > div span {
    color: white;
}
.MulBtn {
    width: 6rem;
    background: #fff;
    border: 1px solid #dcdfe6;
    color: #606266;
    text-align: center;
    border-radius: .25rem;
    margin:0 auto;
}
.btn_actived {
    border-color: #409eff;
}
</style>
