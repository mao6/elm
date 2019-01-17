
export default {
  // 选择搜索的地址
  CHOOSE_SEARCH_ADDRESS (state, place) {
    state.searchAddress = place
  },
  // 赋值给购物车
  ADD_CART_AGAIN (state, cartList) {
    state.cartList = cartList
  },
  // 加入购物车
  ADD_CART (state, {
    shopid,
    categoryId,
    itemId,
    foodId,
    name,
    price,
    specs,
    packingFee,
    skuId,
    stock
  }) {
    let cart = state.cartList
    let shop = cart[shopid] = (cart[shopid] || {})
    let category = shop[categoryId] = (shop[categoryId] || {})
    let item = category[itemId] = (category[itemId] || {})
    if (item[foodId] && item[foodId]['num']) {
      item[foodId]['num']++
    } else {
      item[foodId] = {
        'num': 1,
        'id': foodId,
        'name': name,
        'price': price,
        'specs': specs,
        'packing_fee': packingFee,
        'sku_id': skuId,
        'stock': stock
      }
    }
    state.cartList = {...cart}
    // 存入localStorage
    localStorage.setItem(
      'buyCart',
      JSON.stringify(state.cartList)
    )
  },
  // 移出购物车
  REDUCE_CART (state, {
    shopid,
    categoryId,
    itemId,
    foodId,
    name,
    price,
    specs
  }) {
    let cart = state.cartList
    let shop = (cart[shopid] || {})
    let category = (shop[categoryId] || {})
    let item = (category[itemId] || {})
    if (item && item[foodId] && item[foodId]['num']) {
      if (item[foodId]['num'] > 0) {
        item[foodId]['num']--
      } else {
        // 商品数量为0，则清空当前商品的信息
        item[foodId] = null
      }
      state.cartList = {...cart}
      // 存入localStorage
      localStorage.setItem(
        'buyCart',
        JSON.stringify(state.cartList)
      )
    }
  },
  // 清空购物车
  CLAER_CART (state, shopid) {
    let cart = state.cartList
    cart[shopid] = null
    state.cartList = {...cart}
    // 存入localStorage
    localStorage.setItem(
      'buyCart',
      JSON.stringify(state.cartList)
    )
  }
}
