<template>
  <div class="the-billing-container">
    <el-row class="search-box" :gutter="20">
      <el-col>
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
      <el-col>
        <span class="label">寄件公司</span>
        <el-select
          v-model="filter.company"
          clearable
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
      <el-col>
        <span class="label">省份</span>
        <el-select
          v-model="filter.address"
          clearable
          placeholder="请选择">
          <el-option label="全部" value="0"></el-option>
          <el-option
            v-for="item in PROVINCE"
            :key="item"
            :label="item"
            :value="item">
          </el-option>
        </el-select>
      </el-col>
      <el-col>
        <span class="label">支付方式</span>
        <el-select
          v-model="filter.payType"
          clearable
          placeholder="请选择">
          <el-option label="全部" value="0"></el-option>
          <el-option
            v-for="item in PAY_TYPE"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-col>
    </el-row>
    <el-row class="table-box">
      <el-col class="btn-action">
        <el-button type="text" @click="newLine">插入一行</el-button>
        <el-button type="primary" size="mini" icon="el-icon-plus">新增客户</el-button>
        <el-button type="primary" size="mini" icon="el-icon-upload">导入对账单</el-button>
        <el-button type="primary" size="mini" icon="el-icon-download">导出账单</el-button>
      </el-col>
      <el-table
       :data="tableListComputed"
       size="mini"
       border
       v-loading="loading"
       element-loading-text="拼命加载中"
       element-loading-spinner="el-icon-loading"
       header-cell-class-name="table-header-custom"
       :height="tableHeight"
       ref="billingTable">
       <el-table-column
         prop="date"
         label="寄件日期"
         width="85">
       </el-table-column>
       <el-table-column
          prop="ID"
          label="运单号"
          width="80">
       </el-table-column>
       <el-table-column
         prop="company"
         label="寄件公司"/>
        <el-table-column
         prop="address"
         label="目的网点"
         width="60"/>
        <el-table-column
         prop="province"
         label="省份"
         width="60"/>
        <el-table-column
         prop="customer"
         label="收件客户"
         width="70"/>
        <el-table-column
         prop="count"
         label="件数"
         width="50"/>
        <el-table-column
         prop="weight"
         label="重量/体积"
         width="70"/>
        <el-table-column
         prop="protectedPrice"
         label="保价费"
         width="50"/>
        <el-table-column
         prop="price"
         label="单价"
         width="50"/>
        <el-table-column
          prop="priceType"
          label="计费方式"
          width="60"/>
        <el-table-column
          prop="extra"
          label="附加费"
          width="50"/>
        <el-table-column
          prop="payType"
          label="支付方式"
          width="60"/>
        <el-table-column
          prop="total"
          label="总金额"
          width="65"/>
        <el-table-column
          prop="cost"
          label="成本"
          width="55"/>
        <el-table-column
          prop="profit"
          label="利润"
          width="55"/>
        <el-table-column
          prop="comment"
          label="备注"
          show-overflow-tooltip/>
        <el-table-column
          label="操作"
          fixed="right"
          width="100">
          <template slot-scope="scope">
            <template v-if="scope.row.isEdit">
              <i class="el-icon-check"></i>
              <el-divider direction="vertical"></el-divider>
              <i class="el-icon-close" @click="scope.row.isEdit = false"></i>
              <el-divider direction="vertical"></el-divider>
            </template>
            <template v-else>
              <i class="el-icon-edit" @click="scope.row.isEdit = true"></i>
              <el-divider direction="vertical"></el-divider>
            </template>
            <i class="el-icon-delete"></i>
          </template>
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
import { PAY_TYPE, PROVINCE } from '@/utils/constant.js'
export default {
  name: 'Billing',
  data () {
    return {
      PROVINCE,
      PAY_TYPE,
      filter: {
        date: [],
        company: '',
        address: '',
        payType: ''
      },
      tableHeight: 100,
      loading: false,
      dataList: new Array(60).fill({
        date: '2020-04-23',
        ID: 123456,
        company: 'qtt',
        address: '浦东',
        province: '内蒙古',
        customer: '周星星',
        count: 10,
        weight: 30,
        protectedPrice: 8,
        price: 30,
        priceType: '重量',
        extra: '',
        payType: '现金',
        total: 200,
        cost: 120,
        profit: 70,
        comment: '测试',
        isEdit: false
      }),
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
    },
    newLine () {
      this.dataList.unshift({
        date: '',
        ID: '',
        company: '',
        address: '',
        province: '',
        customer: '',
        count: '',
        weight: '',
        protectedPrice: '',
        price: '',
        priceType: '',
        extra: '',
        payType: '',
        total: '',
        cost: '',
        profit: '',
        comment: '',
        isEdit: true
      })
    },
  }
}
</script>

<style lang="less">
  .the-billing-container {
    .search-box {
      padding: 10px 0;
      margin-right: 0 !important;
      border-bottom: 1px dashed #c4c4c4;
      display: flex;
      justify-content: flex-start;
      flex-wrap: wrap;
      .el-col {
        flex: 1;
      }
      .el-date-editor {
        width: 250px;
      }
      .label {
        margin-right: 10px;
        line-height: 28px;
      }
    }
    .table-box {
      .btn-action {
        text-align: right;
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