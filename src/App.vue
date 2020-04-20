<template>
  <div id="app">
    <index/>
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
}
</style>
