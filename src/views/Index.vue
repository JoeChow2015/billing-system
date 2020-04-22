<template>
  <div class="the-home-container">
    <div class="header-box">
      <h1><span @click.prevent="goHome"><i class="el-icon-s-home"></i> 账单管理系统</span></h1>
      <span class="time">{{ currentTime }}</span>
    </div>
    <el-row class="body-box">
      <el-col :xs="6" :sm="4" :lg="3">
        <el-menu
          :default-active="menuActive"
          class="el-menu-vertical"
          background-color="#6C7B8B"
          text-color="#fff"
          active-text-color="#fff"
          collapse-transition
          router>
          <el-menu-item index="billing">
            <i class="el-icon-wallet"></i>
            <span slot="title">对账单</span>
          </el-menu-item>
          <el-menu-item index="customer">
            <i class="el-icon-tickets"></i>
            <span slot="title">客户列表</span>
          </el-menu-item>
          <el-menu-item index="statistic">
            <i class="el-icon-coin"></i>
            <span slot="title">客户统计</span>
          </el-menu-item>
        </el-menu>
      </el-col>
      <el-col :xs="18" :sm="20" :lg="21" class="content">
        <router-view></router-view>
      </el-col>
    </el-row>
    <div class="footer-box">
      &copy;2020 版权所有 2+1软件工作室（上海）提供技术支持
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
// import HelloWorld from '@/components/HelloWorld.vue'
import moment from 'moment'
export default {
  name: 'Home',
  components: {
    // HelloWorld
  },
  data () {
    return {
      currentTime: '',
      timerId: '',
      menuActive: ''
    }
  },
  watch: {
    '$route.name': {
      handler () {
        this.menuActive = this.$route.name ? this.$route.name.toLowerCase() : ''
      }
    }
  },
  destroyed () {
    clearTimeout(this.timerId)
  },
  mounted () {
    this.getTime()
  },
  methods: {
    // 计时
    getTime () {
      this.currentTime = moment().format('YYYY-MM-DD HH:mm:ss')
      this.timerId = setTimeout(() => {
        this.getTime()
      }, 1000)
    },
    // 回到首页
    goHome () {
      this.$router.push({ name: 'Billing'})
    }
  }
}
</script>

<style lang="less">
  @bd-color: #909399;
  @bg-color: #033967;
  @text-color: #f7f7f7;
  .the-home-container {
    height: 100%;
    width: 100%;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    .header-box {
      background: linear-gradient(#409eff, #033967);
      height: 60px;
      line-height: 60px;
      color: @text-color;
      user-select: none;
      text-align: left;
      padding: 0 20px 0 10px;
      font-family: Arial, Helvetica, sans-serif;
      border-bottom: 2px solid@bd-color;
      position: relative;
      h1 span {
        cursor: pointer;
      }
      .time {
        position: absolute;
        top: 0;
        right: 20px;
      }
    }
    .body-box {
      .el-menu-vertical {
        height: 100%;
        text-align: left;
        border-right: 2px solid @bd-color;
        .el-menu-item {
          min-width: unset;
          i {
            color: #fff;
          }
        }
        .el-menu-item.is-active {
          background-color: @bg-color !important;
        }
      }
      .content {
        padding: 10px;
      }
    }
    .footer-box {
      background: linear-gradient(#409eff, #033967);
      height: 30px;
      line-height: 30px;
      text-align: center;
      color: @text-color;
      user-select: none;
    }
  }
</style>
