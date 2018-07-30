<template>
    <div id="overview">
        <div class="search">
          <span class="demonstration">{{$t('table.startDate')}}</span>
          <el-date-picker v-model="startTime" align="right" type="date" value-format="yyyy-MM-dd"  :picker-options="pickerOptions1"></el-date-picker>
          <span class="demonstration">{{$t('table.endDate')}}</span>
          <el-date-picker v-model="endTime" align="right" type="date" value-format="yyyy-MM-dd"  :picker-options="pickerOptions1"></el-date-picker>
          <el-button icon="el-icon-search" @click="inquire" circle></el-button>
        </div>
        <div class="tab1">
          <el-table :data="tableData" border v-loading="loading">
             <el-table-column prop="allUser" :label="$t('route.totalusers')"></el-table-column>
            <el-table-column prop="coin" :label="$t('table.Generatepoints')"></el-table-column>
            <el-table-column prop="coinPersonCount" :label="$t('table.Totapointearned')"></el-table-column>
            <el-table-column prop="money" :label="$t('table.Genergoldcoins')"></el-table-column>
            <el-table-column prop="moneyPersonCount" :label="$t('table.Getcoins')" width="120"></el-table-column>
            <el-table-column prop="invitePersonCount" :label="$t('table.Totalnumber')" width="110"></el-table-column>
            <el-table-column prop="newRegCount" :label="$t('table.Newregisteredusers')" width="110"></el-table-column>
            <el-table-column prop="costMoney" :label="$t('table.Totaloldcoinsconsumed')"  width="100"></el-table-column>
            <el-table-column prop="allMoney" :label="$t('table.Totamainingoins')" width="110"></el-table-column>
            <el-table-column prop="day" :label="$t('table.date')" width="100"></el-table-column>
          </el-table>
        </div> 
        <div class="block">
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-size="8" layout="total, prev, pager, next" :total="totalCount"></el-pagination>
        </div>
        <!-- <div class="line">
          <v-line :className='className' :autoResize='autoResize' :chartData='chartData'></v-line>
        </div> -->
    </div>
       
</template>

<script>
import { generateTitle } from '@/utils/i18n'
import Line from './LineChart'

export default {
  data() {
    return {
      pickerOptions1: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
        shortcuts: [{
          text:this.$t('message.today'),
          onClick(picker) {
            picker.$emit('pick', new Date());
          }
        }, {
          text: this.$t('message.yesterday'),
          onClick(picker) {
            const date = new Date();
            date.setTime(date.getTime() - 3600 * 1000 * 24);
            picker.$emit('pick', date);
          }
        }, {
          text: this.$t('message.aweekago'),
          onClick(picker) {
            const date = new Date();
            date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', date);
          }
        }]
      },
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
  components: {
    'v-line':Line
  },
  mounted() {
    this.startTime = this.getStartTime()
    this.endTime = this.getEndTime()
    this.getlist()
  },
  methods: {
    // 获取表格数据
    getlist() {
      this.loading = true
      var that = this
      that.$http({
        method: 'GET',
        url: 'http://ccsp.caping.co.id/cms/statistic/all'+'?startTime='+this.startTime+'&endTime='+this.endTime+'&pageSize='+8+'&pageNum='+this.currentPage
      }).then(function(response) {
        console.log(response)
        const datas = response.data
        this.tableData = datas.data.data 
        this.totalCount = datas.data.total
        this.loading = false
      }, function(error) {
        this.loading = false
        console.log(error)
      })
    },
    // 查询
    inquire(){
        if(this.currentPage==1){
            this.getlist()
        }else{
            this.currentPage=1
        }
    },
    // 分页
    handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
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
  }
}
</script>

<style scoped>
.tab1{
  margin-top: 20px;
}
</style>
