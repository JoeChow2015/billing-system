<template>
  <div class="the-billing-container">
    <el-row class="search-box" :gutter="20">
      <el-col>
        <span class="label">日期</span>
        <el-date-picker
          v-model="filter.date"
          size="mini"
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
          size="mini"
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
          size="mini"
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
          size="mini"
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
        <el-button type="primary" size="mini" icon="el-icon-plus">新增客户</el-button>
        <el-button type="primary" size="mini" icon="el-icon-upload">导入对账单</el-button>
        <el-button type="primary" size="mini" icon="el-icon-download">导出账单</el-button>
      </el-col>
      <el-table
       :data="dataList"
       size="mini"
       border
       v-loading="isLoading"
       element-loading-text="拼命加载中"
       element-loading-spinner="el-icon-loading"
       header-cell-class-name="table-header-custom">
       <el-table-column
         prop=""
         label="寄件日期">
       </el-table-column>
       <el-table-column
          prop=""
          label="运单号">
       </el-table-column>
       <el-table-column
         prop=""
         label="寄件公司"/>
       <!-- <el-table-column
         label="示例">
         <template slot-scope="scope">
           <div class="editable-cell">
             <div class="editable-cell-text-wrapper">
               <template v-if="!editCache.sampleData[scope.$index].edit">
                  {{ scope.row.sampleData }}
                  <a v-if="hasEdit" @click.prevent="startEdit('sampleData', scope.$index)"><i class="el-icon-edit"></i></a>
               </template>
               <template v-if="editCache.sampleData[scope.$index].edit">
                  <el-input
                    size="small"
                    v-model="editCache.sampleData[scope.$index].data"
                    @keyup.enter.native="finishEdit('sampleData', scope.$index)">
                  </el-input>
                  <a @click.prevent="finishEdit('sampleData', scope.$index)"><i class="el-icon-check"></i></a>
               </template>
             </div>
           </div>
         </template>
       </el-table-column> -->
        <el-table-column
         prop=""
         label="目的网点"
         width="70"/>
        <el-table-column
         prop=""
         label="省份"
         width="50"/>
        <el-table-column
         prop=""
         label="收件客户"
         width="70"/>
        <el-table-column
         prop=""
         label="件数"
         width="50"/>
        <el-table-column
         prop=""
         label="重量/体积"/>
        <el-table-column
         prop=""
         label="保价费"
         width="60"/>
        <el-table-column
         prop=""
         label="单价"
         width="60"/>
        <el-table-column
          prop=""
          label="计费方式"
          width="70"/>
        <el-table-column
          prop=""
          label="附加费"
          width="60"/>
        <el-table-column
          prop=""
          label="支付方式"
          width="70"/>
        <el-table-column
          prop=""
          label="总金额"
          width="70"/>
        <el-table-column
          prop=""
          label="成本"
          width="60"/>
        <el-table-column
          prop=""
          label="利润"
          width="60"/>
        <el-table-column
          prop=""
          label="备注"
          show-overflow-tooltip/>
        <el-table-column
          prop=""
          label="操作"
          fixed="right"/>
       <!-- <el-table-column
         prop="comment"
         label="备注" >
          <template slot-scope="scope">
            <div class="editable-cell">
              <div class="editable-cell-text-wrapper">
                <template v-if="!editCache.comment[scope.$index].edit">
                  {{ scope.row.comment }}
                 <a v-if="hasEdit" @click.prevent="startEdit('comment', scope.$index)"><i class="el-icon-edit"></i></a>
                </template>
                <template v-if="editCache.comment[scope.$index].edit">
                  <el-input
                    size="small"
                    v-model="editCache.comment[scope.$index].data"
                    @keyup.enter.native="finishEdit('comment', scope.$index)">
                  </el-input>
                  <a @click.prevent="finishEdit('comment', scope.$index)"><i class="el-icon-check"></i></a>
                </template>
              </div>
            </div>
          </template>
        </el-table-column> -->
     </el-table>
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
      dataList: []
    }
  },
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
        width: 230px;
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
    }
  }
</style>