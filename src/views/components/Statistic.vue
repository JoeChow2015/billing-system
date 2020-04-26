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
      <el-col :span="6">
        <span class="label">寄件公司</span>
        <el-select
          v-model="filter.company"
          clearable
          filterable
          placeholder="请选择">
          <el-option label="全部" value="0"></el-option>
          <el-option
            v-for="item in 10"
            :key="item"
            :label="item"
            :value="item">
          </el-option>
        </el-select>
      </el-col>
    </el-row>
    <el-row class="table-box">
      <el-table
       :data="tableListComputed"
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
import { PROVINCE } from '@/utils/constant.js'
export default {
  name: 'Billing',
  data () {
    return {
      PROVINCE,
      filter: {
        date: '',
        company: ''
      },
      tableHeight: 100,
      loading: false,
      dataList: [{
        company: 'qtt',
        count: 300,
        toalPrice: 30,
        totalCost: 200,
        totalProfit: 120
      },{
        company: '趣头条',
        count: 400,
        toalPrice: 30,
        totalCost: 200,
        totalProfit: 120
      }],
      pagination: {
        currentPage: 1,
        pageSize: 15,
        total: null
      }
    }
  },
  computed: {
    tableListComputed () {
      const { currentPage, pageSize } = this.pagination
      return this.dataList.slice((currentPage - 1) * pageSize, currentPage * pageSize)
    },
  },
  mounted () {
    this.getTableHeight()
    this.pagination.total = this.dataList.length
  },
  methods: {
    getTableHeight () {
      setTimeout(() => {
        this.tableHeight = window.innerHeight - this.$refs.billingTable.$el.offsetTop - 212
      }, 100)
    },
    pageIndexChange (e) {
      this.pagination.currentPage = e
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
        line-height: 28px;
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