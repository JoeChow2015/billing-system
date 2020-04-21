<template>
  <div id="app">
    <Index />
  </div>
</template>

<script>
import Index from './views/Index.vue'

export default {
  components: {
    Index
  }
}
</script>
<style lang="less">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 100%;
  width: 100%;
}
</style>
