<template>
  <div class="the-statistic-container">
    <el-row class="search-box" :gutter="20">
      <el-col :span="6">
        <span class="label">日期</span>
        <el-date-picker
          v-model="filter.date"
          clear
          type="daterange"
          range-separator="~"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd"
          :picker-options="pickerOptions"
          @clear="search"
          @change="search">
        </el-date-picker>
      </el-col>
      <el-col :span="10">
        <span class="label">寄件公司</span>
        <el-input v-model="filter.company" clearable filterable placeholder="输入寄件公司搜索" @keydown.enter.native="search"></el-input>
      </el-col>
    </el-row>
    <el-row class="table-box">
      <el-col :span="24" class="btn-action">
        <el-button type="primary" size="medium" icon="el-icon-refresh" @click="search">刷新</el-button>
      </el-col>
      <el-table
        size="medium"
       :data="dataList"
       border
       v-loading="loading"
       element-loading-text="拼命加载中"
       element-loading-spinner="el-icon-loading"
       header-cell-class-name="table-header-custom"
       :height="tableHeight"
       ref="billingTable"
       @sort-change="handleSortChange">
       <el-table-column
          label="寄件日期"
          idth="100"
          prop="date"
          sortable="custom">
          <template slot-scope="scope">
            <span >{{ scope.row.date | dateFormat }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="name"
          label="寄件公司"
          min-width="200"
          sortable="custom"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="num"
          label="票数"
          sortable="custom">
        </el-table-column>
        <el-table-column
          prop="price"
          label="总金额"
          sortable="custom">
        </el-table-column>
        <el-table-column
          prop="cost"
          label="总成本"
          sortable="custom">
        </el-table-column>
        <el-table-column
          prop="profit"
          label="总利润"
          sortable="custom">
        </el-table-column>
      </el-table>
      <el-pagination
        layout="total, prev, pager, next, sizes, jumper"
        prev-text="上一页"
        next-text="下一页"
        :page-sizes="[15, 30, 50]"
        :total="pagination.total"
        @current-change="handlePageChange"
        @size-change="handleSizeChange"/>
    </el-row>
  </div>
</template>
<script>
import moment from 'moment'
import { PROVINCE } from '@/utils/constant.js'
import API from '@/api/index'
const TIME_FORMAT = 'YYYY-MM-DD HH:mm:ss'

export default {
  name: 'Statistic',
  filters: {
    dateFormat: (val) => {
      return val ? moment(val).format('YYYY-MM-DD') : val
    }
  },
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
      },
      sortOrder: {
        properties: 'cost',
        direction: 'desc'
      },
      pickerOptions: {
        shortcuts: [{
          text: '本月',
          onClick(picker) {
            let start = moment().startOf('month').format(TIME_FORMAT)
            let end = moment().format(TIME_FORMAT)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '上月',
          onClick(picker) {
            let start = moment().month(moment().month() - 1).startOf('month').format(TIME_FORMAT)
            let end = moment().month(moment().month() - 1).endOf('month').format(TIME_FORMAT)
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            let start = moment().subtract(3, 'month').startOf('month').format(TIME_FORMAT)
            let end = moment().format(TIME_FORMAT)
            picker.$emit('pick', [start, end])
          }
        }]
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
    // 自定义排序
    handleSortChange (event) {
      this.sortOrder.properties = event.prop
      this.sortOrder.direction = event.order === 'ascending' ? 'asc' : 'desc'
      this.search()
    },
    // 搜索
    search () {
      this.pagination.currentPage = 1
      this.fetchStatisticList()
    },
    // 获取订单列表
    async fetchStatisticList (isLoading = true) {
      this.loading = isLoading
      const params = {
        page: this.pagination.currentPage,
        size: this.pagination.pageSize,
        sortProperties: this.sortOrder.properties,
        sortDirection: this.sortOrder.direction,
        startTime: this.filter.date && this.filter.date.length > 1 ? moment(this.filter.date[0]).startOf('day').format('YYYY-MM-DD HH:mm:ss') : '',
        endTime: this.filter.date && this.filter.date.length > 1 ? moment(this.filter.date[1]).endOf('day').format('YYYY-MM-DD HH:mm:ss') : '',
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
    // 设置不同页展示条数
    handleSizeChange (event) {
      this.pagination.currentPage = 1
      this.pagination.pageSize = event
      this.fetchStatisticList()
    },
    handlePageChange (e) {
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
      .total-count {
        text-align: left;
        font-weight: 500;
        font-size: 16px;
        line-height: 48px;
      }
      .btn-action {
        display: flex;
        justify-content: flex-end;
        padding: 10px 0;
        .el-button {
          margin-left: 10px;
        }
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