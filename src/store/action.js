export default{
  ADD_SEARCH_ADDRESS (context) {
    const cache = localStorage.getItem('searchAddress')
    if (cache) {
      context.commit('CHOOSE_SEARCH_ADDRESS', cache)
    }
  },
  ADD_CART (context) {
    const cache = localStorage.getItem('buyCart')
    if (cache) {
      context.commit('ADD_CART_AGAIN', JSON.parse(cache))
    }
  }
}
