<template>
    <div id="overview">
        <div class="search">
          <el-date-picker
            v-model="value"
            value-format="yyyy-MM-dd"
            type="daterange"
            align="right"
            @change="search(value)"
            unlink-panels
            range-separator="-"
            :start-placeholder="this.$t('table.startDate')"
            :end-placeholder="this.$t('table.endDate')"
            :picker-options="pickerOptions">
        </el-date-picker>
        <el-button type="primary" 
            icon="el-icon-download" 
            @click="$exportExcel('table_v',$t('route.overview'))">
              {{$t('button.exportExcel')}}
        </el-button>
        </div>
        <div class="tab1">
          <el-table id="table_v" :data="tableData" border v-loading="loading">
            <el-table-column align="center" prop="allUser" :label="$t('route.totalusers')"></el-table-column>
            <el-table-column align="center" prop="coin" :label="$t('table.Generatepoints')"></el-table-column>
            <el-table-column align="center" prop="coinPersonCount" :label="$t('table.Totapointearned')"></el-table-column>
            <el-table-column align="center" prop="money" :label="$t('table.Genergoldcoins')"></el-table-column>
            <el-table-column align="center" prop="moneyPersonCount" :label="$t('table.Getcoins')" width="120"></el-table-column>
            <el-table-column align="center" prop="invitePersonCount" :label="$t('table.Totalnumber')" width="110"></el-table-column>
            <el-table-column align="center" prop="newRegCount" :label="$t('table.Newregisteredusers')" width="110"></el-table-column>
            <el-table-column align="center" prop="costMoney" :label="$t('table.Totaloldcoinsconsumed')"  width="100"></el-table-column>
            <el-table-column align="center" prop="allMoney" :label="$t('table.Totamainingoins')" width="120"></el-table-column>
            <el-table-column align="center" prop="day" :label="$t('table.date')" width="100"></el-table-column>
          </el-table>
        </div> 
        <div class="block">
          <el-pagination 
            :current-page.sync="currentPage" 
            :page-size="8" 
            layout="total, prev, pager, next" 
            :total="totalCount">
          </el-pagination>
        </div>
    </div>
</template>

<script>
import { generateTitle } from '@/utils/i18n'
import {getOverView} from '@/api/dashboard'

export default {
  data() {
    return {
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      value:['',''],
      // 加载参数
      loading:false,
      //表格数据
      tableData: [],
      // 时间参数
      endTime: '',
      startTime: '',
      // 分页参数
      currentPage:1,
      totalCount:0,
      // 折线图参数
      className:'bbbb',
      autoResize:true,
      chartData:{
          newData:[],
          oldData:[0,0,0,0,0,0,0,0],
          categories:[],
          name:this.$t('table.totalattendance'),
          days:'',
      },
    }
  },
  mounted() {
    this.startTime = this.getStartTime()
    this.endTime = this.getEndTime()
    this.value = [this.startTime,this.endTime]
    this.getlist()
  },
  methods: {
    search(value){
      this.endTime = value[1]
      this.startTime = value[0]
      if(this.currentPage === 1){
          this.getlist()
      }else{
          this.currentPage = 1
      }
    },
    // 获取表格数据
    getlist() {
      this.loading = true
      let params = {
        startTime:this.startTime,
        endTime:this.endTime,
        pageSize:8,
        pageNum:this.currentPage,
      }
      // 请求
      getOverView(params).then(response => {
        const datas = response.data
        this.tableData = datas.data
        this.totalCount = datas.total
        this.loading = false
      },(error) => {
        this.loading = false
      })
    },
    // 活动时间
    getEndTime() {
      const myday = new Date()
      const year = myday.getFullYear()
      const month = (myday.getMonth()+1)<10 ? '0'+(myday.getMonth()+1) : (myday.getMonth()+1)
      const day = myday.getDate()<10 ? '0'+myday.getDate() : myday.getDate()
      return year + "-" + month + "-" + day
    },
    getStartTime() {
      const d = new Date()
      const weekdate = new Date(d-7*24*3600*1000) 
      const year = weekdate.getFullYear()
      const month = (weekdate.getMonth()+1)<10 ? '0'+(weekdate.getMonth()+1) : (weekdate.getMonth()+1)
      const day = weekdate.getDate()<10 ? '0'+weekdate.getDate() : weekdate.getDate()
      return year + "-" + month + "-" + day
    },
  },
  watch: {
    'currentPage': function () {
      this.getlist()
    }
  }
}
</script>

<style scoped>
.tab1{
  margin-top: 20px;
}
</style>
