<template>
  <div class="the-customer-container">
    <el-row class="search-box" :gutter="20">
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
      <el-col :span="6">
        <span class="label">省份</span>
        <el-select
          v-model="filter.provice"
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
    </el-row>
    <el-row class="table-box">
      <el-col class="btn-action">
        <el-button type="primary" size="mini" icon="el-icon-plus" @click="openDialog(true)">新增寄件公司</el-button>
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
          prop="company"
          label="寄件公司"
          min-width="200">
        </el-table-column>
        <el-table-column
         prop="province"
         label="省份">
        </el-table-column>
        <el-table-column
          prop="weightPrice"
          label="重量单价">
        </el-table-column>
        <el-table-column
          prop="volumnPrice"
          label="体积单价">
        </el-table-column>
        <el-table-column
          prop="priceInit"
          label="起步价">
        </el-table-column>
        <el-table-column
          label="操作"
          fixed="right"
          width="100">
          <template slot-scope="">
            <el-button type="text" @click="openDialog(false)">编辑</el-button>
            <el-divider direction="vertical"></el-divider>
            <el-button type="text">删除</el-button>
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
    <el-dialog class="custom-dialog" :title="title" :visible.sync="dialogVisible" width="500px" destroy-on-close>
      <el-form ref="customFormn" :model="form" :rules="rules" label-position="right" label-width="80px">
        <el-form-item label="寄件公司" prop="company">
          <el-input v-model="form.company" placeholder="请填写寄件公司"></el-input>
        </el-form-item>
        <el-form-item label="省份" prop="province">
          <el-select v-model="form.province" placeholder="请选择省份">
            <el-option
              v-for="item in PROVINCE"
              :key="item"
              :label="item"
              :value="item">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="重量单价" prop="weightPrice">
          <el-input v-model.number="form.weightPrice" placeholder="请填写重量单价"></el-input>
        </el-form-item>
        <el-form-item label="体积单价" prop="volumnPrice">
          <el-input v-model.number="form.volumnPrice" placeholder="请填写体积单价"></el-input>
        </el-form-item>
        <el-form-item label="起步价" prop="priceInit">
          <el-input v-model.number="form.priceInit" placeholder="请填写起步价"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="save(true)">保存</el-button>
        <el-button type="primary" @click="save(false)">保存并新增</el-button>
      </div>
    </el-dialog>
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
        company: '',
        province: ''
      },
      tableHeight: 100,
      loading: false,
      dataList: [{
        company: 'qtt',
        province: '浙江',
        weightPrice: 30,
        volumnPrice: 200,
        priceInit: 120
      },{
        company: '趣头条',
        province: '上海',
        weightPrice: 30,
        volumnPrice: 200,
        priceInit: 120
      }],
      pagination: {
        currentPage: 1,
        pageSize: 15,
        total: null
      },
      title: '',
      dialogVisible: false,
      form: {
        company: '',
        province: '',
        weightPrice: '',
        volumnPrice: '',
        priceInit: ''
      },
       rules: {
          company: [
            { required: true, message: '寄件公司不能为空', trigger: 'change' },
          ],
          province: [
            { required: true, message: '省份不能为空', trigger: 'change' }
          ],
          weightPrice: [
            { required: true, message: '重量单价不能为空', trigger: 'change' },
            { type: 'number', message: '请输入数字', trigger: 'change' },
          ],
          volumnPrice: [
            { required: true, message: '体积单价不能为空', trigger: 'change' },
            { type: 'number', message: '请输入数字', trigger: 'blur' },
          ],
          priceInit: [
            { required: true, message: '起步价不能为空', trigger: 'change' },
            { type: 'number', message: '请输入数字', trigger: 'blur' },
          ]
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
    openDialog (isNew = false) {
      this.title = isNew ? '新增寄件公司' : '编辑寄件公司'
      this.dialogVisible = true
    },
    save (onlySave = true) {
      this.$refs.customFormn.validate((valid) => {
        if (valid) {
          this.dialogVisible = !onlySave
          this.$refs.customFormn.resetFields()
        } else {
          
          return false;
        }
      })
    }
  }
}
</script>

<style lang="less">
  .the-customer-container {
    .search-box {
      padding: 10px 0;
      margin-right: 0 !important;
      border-bottom: 1px dashed #c4c4c4;
      display: flex;
      justify-content: flex-start;
      .label {
        margin-right: 10px;
        line-height: 28px;
      }
    }
    .table-box {
      .btn-action {
        text-align: left;
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
    .custom-dialog {
      .el-dialog__header {
        text-align: left;
      }
      .el-form-item__content {
        text-align: left;
        .el-input {
          width: 350px;
        }
      }
    }
  }
</style>