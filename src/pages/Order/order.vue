<template>
    <div>
        <Header goBack='' :headTitle="headTitle"></Header>
        <FootGuide></FootGuide>
    </div>
</template>
<script>
import Header from '../../components/Header/Header'
import FootGuide from '../../components/FootGuide/FootGuide'
export default {
  name: 'search',
  data () {
    return {
      headTitle: '订单列表'
    }
  },
  components: {
    Header,
    FootGuide
  }
}
</script>
<style scoped>

</style>
