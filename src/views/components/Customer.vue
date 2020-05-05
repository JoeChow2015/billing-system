<template>
  <div class="the-customer-container">
    <el-row class="search-box" :gutter="20">
      <el-col :span="6">
        <span class="label">省份</span>
        <el-select
          v-model="filter.desc"
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
      <el-col :span="10">
        <span class="label">寄件公司</span>
        <el-input v-model="filter.name" clearable filterable placeholder="输入寄件公司搜索"></el-input>
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
          prop="id"
          label="ID"
          width="70">
        </el-table-column>
        <el-table-column
          prop="name"
          label="寄件公司"
          min-width="200">
        </el-table-column>
        <el-table-column
          prop="phone"
          label="联系方式"
          min-width="80">
        </el-table-column>
        <el-table-column
         prop="dest"
         label="省份">
        </el-table-column>
        <el-table-column
          prop="hprice"
          label="重量单价（元）">
        </el-table-column>
        <el-table-column
          prop="vprice"
          label="体积单价（元）">
        </el-table-column>
        <el-table-column
          prop="basePrice"
          label="起步价（元）">
        </el-table-column>
        <el-table-column
          label="操作"
          fixed="right"
          width="80">
          <template slot-scope="scope">
            <i class="el-icon-edit" @click="openDialog(false, scope.row)"></i>
            <el-divider direction="vertical"></el-divider>
            <i class="el-icon-delete" @click="deleteUser(scope.row)"></i>
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
    <el-dialog class="custom-dialog" :title="title" :visible.sync="dialogVisible" width="550px" destroy-on-close>
      <el-form ref="customForm" :model="form" :rules="rules" label-position="right" label-width="130px">
        <el-form-item label="寄件公司" prop="name">
          <el-input v-model="form.name" clearable placeholder="请填写寄件公司"></el-input>
        </el-form-item>
        <el-form-item label="联系方式" prop="phone">
          <el-input v-model="form.phone" clearable placeholder="请填写联系方式"></el-input>
        </el-form-item>
        <el-form-item label="省份" prop="dest">
          <el-select v-model="form.dest" clearable placeholder="请选择省份">
            <el-option
              v-for="item in PROVINCE"
              :key="item"
              :label="item"
              :value="item">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="重量单价（元）" prop="hprice">
          <el-input v-model="form.hprice" clearable placeholder="请填写重量单价"></el-input>
        </el-form-item>
        <el-form-item label="体积单价（元）" prop="vprice">
          <el-input v-model="form.vprice" clearable placeholder="请填写体积单价"></el-input>
        </el-form-item>
        <el-form-item label="起步价（元）" prop="basePrice">
          <el-input v-model="form.basePrice" clearable placeholder="请填写起步价"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="dialogVisible = false">取 消</el-button>
        <el-button size="mini" type="primary" @click="save(true)">保存</el-button>
        <!-- <el-button size="mini" type="primary" @click="save(false)">保存并新增</el-button> -->
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { PROVINCE } from '@/utils/constant.js'
import API from '@/api/index'

export default {
  name: 'Customer',
  data () {
    return {
      PROVINCE,
      filter: {
        name: '',
        dest: ''
      },
      tableHeight: 100,
      loading: false,
      dataList: [],
      pagination: {
        currentPage: 1,
        pageSize: 15,
        total: null
      },
      title: '',
      dialogVisible: false,
      form: {
        id: null,
        name: '',
        phone: '',
        dest: '',
        hprice: '',
        vprice: '',
        basePrice: ''
      },
       rules: {
          name: [
            { required: true, message: '寄件公司不能为空', trigger: 'change' }
          ],
          dest: [
            { required: true, message: '省份不能为空', trigger: 'change' }
          ],
          hprice: [
            { required: true, message: '重量单价不能为空', trigger: 'change' }
          ],
          vprice: [
            { required: true, message: '体积单价不能为空', trigger: 'change' }
          ],
          basePrice: [
            { required: true, message: '起步价不能为空', trigger: 'change' }
          ]
       }
    }
  },
  computed: {
    dataListFilter () {
      if (this.filter.name && this.filter.desc) {
        return this.dataList.filter(item => item.name.includes(this.filter.name) && item.dest.includes(this.filter.desc))
      } else {
        return this.dataList.filter(item => this.filter.name
          ? item.name.includes(this.filter.name)
          : (this.filter.desc ? item.dest.includes(this.filter.desc) : true ))
      }
    },
    tableListComputed () {
      const { currentPage, pageSize } = this.pagination
      return this.dataListFilter.slice((currentPage - 1) * pageSize, currentPage * pageSize)
    },
  },
  created () {
    this.fetchUserList()
  },
  mounted () {
    this.getTableHeight()
  },
  methods: {
    // 获取客户列表
    async fetchUserList () {
      const params = {}
      let result = await API.getUserList(params)
      if (result && result.code === 1) {
        this.dataList = result.data || []
        this.pagination.total = this.dataList.length
      } else {
        this.$message.error('获取客户列表异常')
      }
    },
    getTableHeight () {
      setTimeout(() => {
        this.tableHeight = window.innerHeight - this.$refs.billingTable.$el.offsetTop - 212
      }, 100)
    },
    pageIndexChange (e) {
      this.pagination.currentPage = e
    },
    openDialog (isNew = true, row) {
      this.dialogVisible = true
      if (isNew) {
        this.title = '新增寄件公司'
        this.form.id = null
      } else {
        this.title = '编辑寄件公司'
        this.form = row
      }
    },
    // 保存客户列表
    save (onlySave = true) {
      this.$refs.customForm.validate(async (valid) => {
        if (valid) {
          let result = await API.saveUser(this.form)
          if (result && result.code === 1) {
            this.$message({
              message: this.form.id ? '编辑客户成功！' : '新增客户成功！',
              type: 'success'
            })
            this.fetchUserList()
            this.$refs.customForm.resetFields()
            this.dialogVisible = !onlySave
          } else {
            this.$message.error(result.message)
          }
        } else {
          return false;
        }
      })
    },
    // 删除
    deleteUser (row) {
      this.$confirm(`确定要删除：${row.name} ?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        let result = await API.deleteUserById (row.id)
        if (result && result.code === 1) {
          this.$message({
            message: '删除客户成功！',
            type: 'success'
          })
          this.fetchUserList()
        } else {
          this.$message.error(result.message)
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
        line-height: 40px;
        white-space: nowrap;
      }
      .el-col-10 {
        display: flex;
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
      .el-dialog__body {
        padding: 5px 20px;
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