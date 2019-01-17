<template>
  <div id="app">
    <transition name="router-fade" mode="out-in">
      <keep-alive v-if="$route.meta.keepAlive">
        <router-view/>
      </keep-alive>
    </transition>
    <transition name="router-fade" mode="out-in">
      <router-view v-if="!$route.meta.keepAlive" />
    </transition>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
#app {
    font-family: "Avenir", Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
}
a,
article,
aside,
b,
body,
button,
dd,
div,
dl,
dt,
figcaption,
figure,
footer,
h1,
h2,
h3,
h4,
h5,
h6,
header,
i,
input,
li,
nav,
p,
section,
select,
span,
textarea,
ul {
    padding: 0;
    margin: 0;
    list-style: none;
    font-style: normal;
    text-decoration: none;
    border: none;
    color: #333;
    font-weight: 400;
    font-family: Microsoft Yahei;
    -webkit-tap-highlight-color: transparent;
    -webkit-font-smoothing: antialiased;
}
body {
    padding: 0;
    margin: 0;
}
.router-fade-enter-active,
.router-fade-leave-active {
    transition: opacity 0.3s;
}
.router-fade-enter,
.router-fade-leave-active {
    opacity: 0;
}
</style>
