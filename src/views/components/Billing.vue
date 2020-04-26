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
      <el-col>
        <span class="label">省份</span>
        <el-select
          v-model="filter.address"
          clearable
          filterable
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
          label="寄件日期"
          width="90">
          <template slot-scope="scope">
            <el-input v-if="scope.row.isEdit" size="mini" v-model="scope.row.date"></el-input>
            <span v-else>{{ scope.row.date }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="运单号"
          width="80">
          <template slot-scope="scope">
            <el-input v-if="scope.row.isEdit"  size="mini" v-model="scope.row.ID"></el-input>
            <span v-else>{{ scope.row.ID }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="寄件公司">
          <template slot-scope="scope">
            <el-input v-if="scope.row.isEdit"  size="mini" v-model="scope.row.company"></el-input>
            <span v-else>{{ scope.row.company }}</span>
          </template>
        </el-table-column>
        <el-table-column
         label="省份"
         width="60">
         <template slot-scope="scope">
            <el-input v-if="scope.row.isEdit"  size="mini" v-model="scope.row.province"></el-input>
            <span v-else>{{ scope.row.province }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="目的网点"
          width="60">
          <template slot-scope="scope">
            <el-input v-if="scope.row.isEdit"  size="mini" v-model="scope.row.address"></el-input>
            <span v-else>{{ scope.row.address }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="收件客户"
          width="70">
          <template slot-scope="scope">
            <el-input v-if="scope.row.isEdit"  size="mini" v-model="scope.row.customer"></el-input>
            <span v-else>{{ scope.row.customer }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="件数"
          width="50">
          <template slot-scope="scope">
            <el-input v-if="scope.row.isEdit"  size="mini" v-model="scope.row.count"></el-input>
            <span v-else>{{ scope.row.count }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="重量/体积"
          width="70">
          <template slot-scope="scope">
            <el-input v-if="scope.row.isEdit"  size="mini" v-model="scope.row.weight"></el-input>
            <span v-else>{{ scope.row.weight }}</span>
          </template>
        </el-table-column>       
        <el-table-column
          label="保价费"
          width="50">
          <template slot-scope="scope">
            <el-input v-if="scope.row.isEdit"  size="mini" v-model="scope.row.protectedPrice"></el-input>
            <span v-else>{{ scope.row.protectedPrice }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="单价"
          width="50">
          <template slot-scope="scope">
            <el-input v-if="scope.row.isEdit"  size="mini" v-model="scope.row.price"></el-input>
            <span v-else>{{ scope.row.price }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="计费方式"
          width="60">
          <template slot-scope="scope">
            <el-input v-if="scope.row.isEdit"  size="mini" v-model="scope.row.priceType"></el-input>
            <span v-else>{{ scope.row.priceType }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="附加费"
          width="50">
          <template slot-scope="scope">
            <el-input v-if="scope.row.isEdit"  size="mini" v-model="scope.row.extra"></el-input>
            <span v-else>{{ scope.row.extra }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="支付方式"
          width="60">
          <template slot-scope="scope">
            <el-input v-if="scope.row.isEdit"  size="mini" v-model="scope.row.payType"></el-input>
            <span v-else>{{ scope.row.payType }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="总金额"
          width="65">
          <template slot-scope="scope">
            <el-input v-if="scope.row.isEdit"  size="mini" v-model="scope.row.total"></el-input>
            <span v-else>{{ scope.row.total }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="成本"
          width="55">
          <template slot-scope="scope">
            <el-input v-if="scope.row.isEdit"  size="mini" v-model="scope.row.cost"></el-input>
            <span v-else>{{ scope.row.cost }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="利润"
          width="55">
          <template slot-scope="scope">
            <el-input v-if="scope.row.isEdit"  size="mini" v-model="scope.row.profit"></el-input>
            <span v-else>{{ scope.row.profit }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="备注"
          show-overflow-tooltip>
          <template slot-scope="scope">
            <el-input v-if="scope.row.isEdit"  size="mini" v-model="scope.row.comment"></el-input>
            <span v-else>{{ scope.row.comment }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          fixed="right"
          width="100">
          <template slot-scope="scope">
            <template v-if="scope.row.isEdit">
              <i class="el-icon-check" @click="scope.row.isEdit = false"></i>
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
      dataList: [{
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
      },{
        date: '2020-04-24',
        ID: 122,
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