<template>
    <div class="head-top">
        <slot name="logo"></slot>
        <slot name="search"></slot>
        <section class="head_goback" v-if="goBack" @click="$router.go(-1)">
            <i class="el-icon-arrow-left"></i>
        </section>
        <router-link tag="span" to="/" class="header-right" v-if='signinUp'>注册</router-link>
        <section class="title_head ellipsis" v-if="headTitle">
            <router-link tag="span" to='/' class="title_text">{{headTitle}}</router-link>
        </section>
        <slot name="changeCity" class="change_city"></slot>
    </div>
</template>

<script>
export default {
  name: 'Header',
  data () {
    return {}
  },
  props: {
    signinUp: String,
    headTitle: String,
    goBack: String
  }
}
</script>
<style scoped>
.head-top {
    width: 100%;
    position: fixed;
    top: 0;
    left: 0;
    height: 2.95rem;
    z-index: 100;
    background: #3190e8;
    font-size: 1rem;
    overflow: hidden
}
.header-left,
.head_goback {
    position: absolute;
    top: 50%;
    left: 0.8rem;
    transform: translateY(-50%);
    color: white;
}
.header-right,
.change_city {
    position: absolute;
    top: 50%;
    right: 0.8rem;
    transform: translateY(-50%);
    color: white;
}
.head_goback {
    color: white;
}
.title_head {
    position: absolute;
    top: 50%;
    left:50%;
    transform: translate(-50%,-50%);
    width: 50%;
    color:white;
    text-align:center
}
.title_text{
    color:white;
    font-size:1.2rem
}
.el-icon-arrow-left{
    color:white;
    font-size:1.2rem
}

.ellipsis{
    white-space:nowrap;
    text-overflow:ellipsis;
    overflow:hidden;
}
.link_search{
    left: 1.4rem;
    width: 1.2rem;
    height: 1.2rem;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
}
</style>
