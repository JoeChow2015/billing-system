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
          value-format="yyyy-MM-dd"
          @clear="fetchOrderList"
          @change="fetchOrderList">
        </el-date-picker>
      </el-col>
      <el-col>
        <span class="label">省份</span>
        <el-select
          v-model="filter.dest"
          clearable
          filterable
          placeholder="请选择"
          @change="fetchOrderList">
          <el-option
            v-for="item in PROVINCE"
            :key="item"
            :label="item"
            :value="item">
          </el-option>
        </el-select>
      </el-col>
      <el-col>
        <span class="label">寄件公司</span>
        <el-input v-model="filter.company" clearable filterable placeholder="输入寄件公司搜索" @clear="fetchOrderList" @keydown.enter.native="fetchOrderList"></el-input>
      </el-col>
      <el-col>
        <span class="label">支付方式</span>
        <el-select
          v-model="filter.payType"
          clearable
          placeholder="请选择"
          @clear="fetchOrderList"
          @change="fetchOrderList">
          <el-option
            v-for="(item, index) in PAY_TYPE"
            :key="index"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-col>
    </el-row>
    <el-row class="table-box">
      <el-col :span="24" class="btn-action">
        <el-button type="primary" size="mini" icon="el-icon-circle-plus-outline" @click="newBill">插入一行</el-button>
        <el-upload
          action="/api/upload"
          :on-success="uploadFileSuccess"
          :show-file-list="false">
          <el-button type="primary" size="mini" icon="el-icon-upload">导入对账单</el-button>
        </el-upload>
        <el-button type="primary" size="mini" icon="el-icon-download" @click="downloadBill">导出对账单</el-button>
        <el-button type="primary" size="mini" icon="el-icon-refresh" @click="fetchOrderList">刷新</el-button>
      </el-col>
      <el-table
       :data="dataList"
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
            <el-input v-if="scope.row.isEdit" size="mini" v-model="scope.row.mailDate"></el-input>
            <span v-else>{{ scope.row.mailDate }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="运单号"
          width="110">
          <template slot-scope="scope">
            <el-input v-if="scope.row.isEdit"  size="mini" v-model="scope.row.orderNum"></el-input>
            <span v-else>{{ scope.row.orderNum }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="寄件公司">
          <template slot-scope="scope">
            <el-input v-if="scope.row.isEdit"  size="mini" v-model="scope.row.customerName" @change="getDetailByCC(null, scope.row)"></el-input>
            <span v-else>{{ scope.row.customerName }}</span>
          </template>
        </el-table-column>
        <el-table-column
         label="省份"
         width="100"
         show-overflow-tooltip>
         <template slot-scope="scope">
           <el-select
            v-if="scope.row.isEdit"
            size="mini" 
            v-model="scope.row.dest"
            clearable
            :disabled="!scope.row.customerName"
            filterable
            placeholder="选择"
            @change="getDetailByCC(null, scope.row)">
            <el-option
              v-for="item in PROVINCE"
              :key="item"
              :label="item"
              :value="item">
            </el-option>
            </el-select>
            <span v-else>{{ scope.row.dest }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="目的网点"
          width="70">
          <template slot-scope="scope">
            <el-input v-if="scope.row.isEdit"  size="mini" v-model="scope.row.outlets"></el-input>
            <span v-else>{{ scope.row.outlets }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="收件客户"
          width="80">
          <template slot-scope="scope">
            <el-input v-if="scope.row.isEdit"  size="mini" v-model="scope.row.recipient"></el-input>
            <span v-else>{{ scope.row.recipient }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="计费方式"
          width="70">
          <template slot-scope="scope">
            <el-select
              size="mini"
              :disabled="!scope.row.isEdit"
              v-model="scope.row.priceType"
              @change="getDetailByCC(null, scope.row)"
              placeholder="选择">
              <el-option label="重量" value="重量"></el-option>
              <el-option label="体积" value="体积"></el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column
          label="重量/体积"
          width="70">
          <template slot-scope="scope">
            <el-input v-if="scope.row.isEdit"  size="mini" v-model="scope.row.quantity"></el-input>
            <span v-else>{{ scope.row.quantity }}</span>
          </template>
        </el-table-column>   
        <el-table-column
          label="件数"
          width="55">
          <template slot-scope="scope">
            <el-input v-if="scope.row.isEdit"  size="mini" v-model="scope.row.goodsNum"></el-input>
            <span v-else>{{ scope.row.goodsNum }}</span>
          </template>
        </el-table-column>    
        <el-table-column
          label="保价费"
          width="60">
          <template slot-scope="scope">
            <el-input v-if="scope.row.isEdit"  size="mini" v-model="scope.row.insuredFee"></el-input>
            <span v-else>{{ scope.row.insuredFee }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="单价"
          width="60">
          <template slot-scope="scope">
            <el-input v-if="scope.row.isEdit"  size="mini" v-model="scope.row.unitPrice"></el-input>
            <span v-else>{{ scope.row.unitPrice }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="起步价"
          width="60">
          <template slot-scope="scope">
            <el-input v-if="scope.row.isEdit"  size="mini" v-model="scope.row.basePrice"></el-input>
            <span v-else>{{ scope.row.basePrice }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="附加费"
          width="60">
          <template slot-scope="scope">
            <el-input v-if="scope.row.isEdit"  size="mini" v-model="scope.row.extra"></el-input>
            <span v-else>{{ scope.row.extra }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="支付方式"
          width="65">
          <template slot-scope="scope">
            <el-select
              size="mini"
              :disabled="!scope.row.isEdit"
              v-model="scope.row.payType">
              <el-option
                v-for="(item, index) in PAY_TYPE"
                :key="index"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column
          label="总金额"
          width="80">
          <template slot-scope="scope">
            <el-input v-if="scope.row.isEdit"  size="mini" v-model="scope.row.totalPrice"></el-input>
            <span v-else>{{ scope.row.totalPrice }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="成本"
          width="70">
          <template slot-scope="scope">
            <el-input v-if="scope.row.isEdit"  size="mini" v-model="scope.row.cost"></el-input>
            <span v-else>{{ scope.row.cost }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="利润"
          width="80">
          <template slot-scope="scope">
            <el-input v-if="scope.row.isEdit"  size="mini" v-model="scope.row.profit"></el-input>
            <span v-else>{{ scope.row.profit }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="备注"
          show-overflow-tooltip>
          <template slot-scope="scope">
            <el-input v-if="scope.row.isEdit"  size="mini" v-model="scope.row.description"></el-input>
            <span v-else>{{ scope.row.description }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          fixed="right"
          width="130">
          <template slot-scope="scope">
            <i class="el-icon-s-check" @click="checkOrder(scope.row)"></i>
            <el-divider direction="vertical"></el-divider>
            <template v-if="scope.row.isEdit">
              <i class="el-icon-check" @click="saveLine(scope.row)"></i>
              <el-divider direction="vertical"></el-divider>
              <i class="el-icon-close" @click="cancelEdit(scope.row)"></i>
              <el-divider direction="vertical"></el-divider>
            </template>
            <template v-else>
              <i class="el-icon-edit" @click="editOrder(scope.row)"></i>
              <el-divider direction="vertical"></el-divider>
            </template>
            <i class="el-icon-delete" @click="deleteOrder(scope.row, scope.$index)"></i>
          </template>
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
import { PAY_TYPE, PROVINCE } from '@/utils/constant.js'
import API from '@/api/index'

export default {
  name: 'Billing',
  data () {
    return {
      PROVINCE,
      PAY_TYPE,
      filter: {
        date: [],
        company: '',
        dest: '',
        payType: ''
      },
      tableHeight: 100,
      loading: false,
      dataList: [],
      currentOrder: {},
      pagination: {
        currentPage: 1,
        pageSize: 15,
        total: null
      }
    }
  },
  created () {
    this.fetchOrderList()
  },
  mounted () {
    this.getTableHeight()
  },
  methods: {
    postParams () {
      return {
        page: this.pagination.currentPage,
        size: this.pagination.pageSize,
        sortProperties: 'id',
        sortDirection: 'desc',
        startTime: this.filter.date && this.filter.date.length > 1 ? moment(this.filter.date[0]).startOf('day').format('YYYY-MM-DD HH:mm:ss') : '',
        endTime: this.filter.date && this.filter.date.length > 1 ? moment(this.filter.date[1]).endOf('day').format('YYYY-MM-DD HH:mm:ss') : '',
        company: this.filter.company,
        dest: this.filter.dest,
        payType: this.filter.payType
      }
    },
    // 获取订单列表
    async fetchOrderList (isLoading = true) {
      this.loading = isLoading
      const params = this.postParams()
      let result = await API.getOrderList(params)
      if (result && result.code === 1) {
        this.dataList = (result.data.data || []).map(item => ({
          ...item,
          mailDate: moment(item.mailDate).format('YYYY-MM-DD'),
          isEdit: false
        }))
        this.pagination.total = result.data.total
      }
      this.loading = false
    },
    // 插入一行账单
    newBill () {
      this.dataList.unshift({
        mailDate: moment().format('YYYY-MM-DD'),
        orderNum: '',
        customerName: '',
        outlets: '',
        dest: '',
        recipient: '',
        goodsNum: '',
        quantity: '',
        insuredFee: '',
        unitPrice: '',
        basePrice: '',
        priceType: '重量',
        extra: '',
        payType: '现金',
        totalPrice: '',
        cost: '',
        profit: '',
        description: '',
        isEdit: true
      })
    },
    // 根据寄件公司和省份获取客户数据
    async getDetailByCC (event, row) {
      const { customerName, dest } = row
      if (!customerName || !dest) {
        return
      }
      let result = await API.getDetailByCC({
        name: customerName,
        dest: dest
      })
      if (result && result.code === 1) {
        const { basePrice, hprice, vprice } = result.data || {}
        row.basePrice = basePrice
        row.unitPrice = row.priceType == '重量' ? hprice : vprice
        this.computePrice(row) // 重新校对金额
      }
    },
    // 保存
    async saveLine (row, isCheck = false) {
      delete row.isEdit
      let result = await API.saveOrder(row)
      if (result && result.code === 1) {
        this.$message({
          message: isCheck ? '订单核对成功' : (row.id ? '编辑订单成功！' : '新增订单成功！'),
          type: 'success'
        })
        row.isEdit = false
        this.fetchOrderList(false)
      }
    },
    // 核对账单
    // 总金额=单价*重量/体积+保价费+附加费
    // 如果小于起步价则总金额为起步价
    // 利润等于总金额-成本 没有成本的情况下利润等于总成本
    // 计算金额
    computePrice (row) {
      let { unitPrice, quantity, insuredFee, extra, basePrice, cost } = row
      row.totalPrice = Math.max(unitPrice * quantity + Number.parseFloat(insuredFee || 0) + Number.parseFloat(extra || 0), basePrice)
      row.profit = row.totalPrice - cost
    },
    checkOrder (row){
      this.computePrice(row)
      this.saveLine(row, true)
    },
    // 编辑
    editOrder (row) {
      this.currentOrder = {...row}
      row.isEdit = true
    },
    // 取消
    cancelEdit (row) {
      let index = this.dataList.findIndex(item => item.id == row.id)
      this.dataList[index] = this.currentOrder
      row.isEdit = false
    },
    // 删除
    deleteOrder (row, index) {
      if (!row.id) {
        this.dataList.splice(index, 1)
        return
      }
      this.$confirm('确定要删除该订单?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        let result = await API.deleteOrderById (row.id)
        if (result && result.code === 1) {
          this.$message({
            message: '删除订单成功！',
            type: 'success'
          })
          row.isEdit = false
          this.fetchOrderList(false)
        }
      })
    },
    // 导入对账单回调
    uploadFileSuccess () {
      this.$message({
        message: '账单导入成功！',
        type: 'success'
      })
      this.fetchOrderList()
    },
    // 导出对账单
    async downloadBill () {
      let params = this.postParams()
      let result = await API.downloadBill(params)
      let blob = new Blob([result]);
      if (window.navigator.msSaveOrOpenBlob) {
        navigator.msSaveBlob(blob, `对账单_${new Date().getTime()}.xlsx`);
      } else {
        let link = document.createElement("a");
        let evt = document.createEvent("HTMLEvents");
        evt.initEvent("click", false, false);
        link.href = URL.createObjectURL(blob); 
        link.download = `对账单_${new Date().getTime()}.xlsx`;
        link.style.display = "none";
        document.body.appendChild(link);
        link.click();
        window.URL.revokeObjectURL(link.href);
      }
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
      this.fetchOrderList()
    },
    handlePageChange (e) {
      this.pagination.currentPage = e
      this.fetchOrderList()
    }
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
        display: flex;
      }
      .el-date-editor {
        width: 250px;
      }
      .label {
        margin-right: 10px;
        line-height: 40px;
        white-space: nowrap;
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
        .el-input.is-disabled .el-input__inner {
          background-color: #fff;
          color: #333;
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