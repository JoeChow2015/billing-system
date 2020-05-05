<template>
  <div class="the-statistic-container">
    <el-row class="search-box" :gutter="20">
      <el-col :span="6">
        <span class="label">日期</span>
        <el-date-picker
          v-model="filter.date"
          type="daterange"
          clearable
          range-separator="~"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd">
        </el-date-picker>
      </el-col>
      <el-col :span="10">
        <span class="label">寄件公司</span>
        <el-input v-model="filter.company" clearable filterable placeholder="输入寄件公司搜索"></el-input>
      </el-col>
    </el-row>
    <el-row class="table-box">
      <el-table
      size="mini"
       :data="tableList"
       v-loading="loading"
       element-loading-text="拼命加载中"
       element-loading-spinner="el-icon-loading"
       header-cell-class-name="table-header-custom"
       :height="tableHeight"
       ref="billingTable">
        <el-table-column
          prop="company"
          label="寄件公司"
          min-width="200">
        </el-table-column>
        <el-table-column
         prop="count"
         label="件数">
        </el-table-column>
        <el-table-column
          prop="toalPrice"
          label="总金额">
        </el-table-column>
        <el-table-column
          prop="totalCost"
          label="总成本">
        </el-table-column>
        <el-table-column
          prop="totalProfit"
          label="总利润">
        </el-table-column>
      </el-table>
      <el-pagination
        layout="total, prev, pager, next, sizes, jumper"
        prev-text="上一页"
        next-text="下一页"
        :page-sizes="[15, 30, 50]"
        :total="pagination.total"
        @current-change="pageIndexChange"
        @size-change="pageIndexChange"
        hide-on-single-page	 />
    </el-row>
  </div>
</template>
<script>
import moment from 'moment'
import { PROVINCE } from '@/utils/constant.js'
import API from '@/api/index'

export default {
  name: 'Statistic',
  data () {
    return {
      PROVINCE,
      filter: {
        date: '',
        company: ''
      },
      tableHeight: 100,
      loading: false,
      dataList: [],
      pagination: {
        currentPage: 1,
        pageSize: 15,
        total: null
      }
    }
  },
  created () {
    this.fetchStatisticList()
  },
  mounted () {
    this.getTableHeight()
  },
  methods: {
    // 获取订单列表
    async fetchStatisticList (isLoading = true) {
      this.loading = isLoading
      const params = {
        page: this.pagination.currentPage,
        size: this.pagination.pageSize,
        sortProperties: 'create_time',
        sortDirection: 'desc',
        startTime: this.filter.date.length > 1 ? moment(this.filter.date[0]).startOf('day').format('YYYY-MM-DD HH:mm:ss') : '',
        endTime: this.filter.date.length > 1 ? moment(this.filter.date[1]).endOf('day').format('YYYY-MM-DD HH:mm:ss') : '',
        company: this.filter.company
      }
      let result = await API.getStatisticList(params)
      if (result && result.code === 1) {
        this.dataList = result.data.data || []
        this.pagination.total = result.data.total
      }
      this.loading = false
    },
    getTableHeight () {
      setTimeout(() => {
        this.tableHeight = window.innerHeight - this.$refs.billingTable.$el.offsetTop - 212
      }, 100)
    },
    pageIndexChange (e) {
      this.pagination.currentPage = e
      this.fetchStatisticList()
    }
  }
}
</script>

<style lang="less">
  .the-statistic-container {
    .search-box {
      padding: 10px 0;
      margin-right: 0 !important;
      border-bottom: 1px dashed #c4c4c4;
      display: flex;
      justify-content: flex-start;
      .el-date-editor {
        width: 250px;
      }
      .label {
        margin-right: 10px;
        line-height: 40px;
        white-space: nowrap;
      }
      .el-col-10 {
        display: flex;
      }
    }
    .table-box {
      margin-top: 10px;
      .btn-action {
        text-align: left;
        margin-right: 10px;
        padding: 10px 0;
      }
      .table-header-custom {
        background-color: #6c7b8b;
        color: #fff;
        border-right: 1px solid #c0c0c0;
      }
      .el-table__body .cell {
        font-size: 14px;
        [class^=el-icon-] {
          cursor: pointer;
          color: #409eff;
          font-size: 16px;
        }
        .el-input__inner {
          padding: 0 2px;
        }
      }
      .el-table__header .cell, .el-table__body .cell {
        padding: 0 5px;
      }
    }
    .el-pagination {
      margin-top: 10px;
      text-align: right;
    }
  }
</style>