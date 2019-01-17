import Vue from 'vue'
import vuex from 'vuex'
import actions from './action.js'
import mutations from './mutations.js'

Vue.use(vuex)

const state = {
  searchAddress: null, // 搜索并选择的地址
  cartList: {}, // 购物车
  remarkText: '',
  inputText: ''
}

export default new vuex.Store({
  state,
  actions,
  mutations
})
