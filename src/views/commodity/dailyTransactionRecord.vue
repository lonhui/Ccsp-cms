<template>
    <div class="dailyRecord">
        <div class="search">
            <span class="demonstration">开始时间</span>
                <el-date-picker v-model="startTime" align="right" type="date" value-format="yyyy-MM-dd" placeholder="选择日期" :picker-options="pickerOptions1"></el-date-picker>
            <span class="demonstration">结束时间</span>
                <el-date-picker v-model="endTime" align="right" type="date" value-format="yyyy-MM-dd" placeholder="选择日期" :picker-options="pickerOptions1"></el-date-picker>
                <el-input placeholder="请输入内容" v-model="input10" style="width:200px" clearable></el-input>
                <el-button icon="el-icon-search" @click="inquire" circle></el-button>
        </div>
        <div class="tabl">
             <el-table :data="DataList" border style="width: 100%">
                  <el-table-column type="index" :index="typeIndex" width="100px" label="序号"></el-table-column>
                  <el-table-column prop="uid" label="商品名称"></el-table-column>
                  <el-table-column prop="coin" label="成交总量" ></el-table-column>
                  <el-table-column prop="money" label="总购买人数" ></el-table-column>
                  <el-table-column prop="money" label="总消耗货币数" ></el-table-column>
            </el-table>
        </div>
        <div class="block">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="currentPage1" :page-size="10" layout="total, prev, pager, next" :total="totalCount"></el-pagination>
        </div>
    </div>
</template>

<script>
export default {
    data() {
      return {
        pickerOptions1: {
          disabledDate(time) {
            return time.getTime() > Date.now();
          },
          shortcuts: [{
            text: '今天',
            onClick(picker) {
              picker.$emit('pick', new Date());
            }
          }, {
            text: '昨天',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24);
              picker.$emit('pick', date);
            }
          }, {
            text: '一周前',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', date);
            }
          }]
        },
        currentPage1: 1,
        startTime: '',
        endTime: '',
        DataList:[],
        totalCount: 0,
        input10:''
      }
    },
    mounted() {
        this.endTime = this.getEndTime()
        this.startTime = this.getStartTime()
        //this.getTableDatas();
    },
    methods: {
        // 分页
      handleSizeChange(val) {
        // console.log(`每页 ${val} 条`);
      },
      handleCurrentChange(val) {
        // console.log(`当前页: ${val}`);
      },
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
     
    getDataList() {
      var that = this;
      that.$http({
          method:'GET',
          url:process.env.API_ROOT+'/cms/statistic/rank'+'?startTime='+this.startTime+'&endTime='+this.endTime+'&pageSize='+10+'&pageNum='+this.currentPage1,
      }).then(function(response){
          const datas = response.data;
          this.totalCount = datas.data.totalCount
         
      },function(error){
          // console.log(error)
      })
    },
    inquire() {
      if(this.currentPage1===1){
        //this.getRankingDatas()
      }else{
        this.currentPage1 = 1
      }
    },
    typeIndex(index) {
      return index + (this.currentPage1 - 1) * 10 + 1
    },
    table(val) {
      this.currentPage1 = val
    }
  },
  watch: {
    'currentPage1': function () {
      //this.getRankingDatas()
    }
  }
}
</script>

<style scoped>
    .dailyRecord{
        width: 80%;
        margin: 20px auto;
    }
    .tabl{
        margin-top: 20px;
    }
</style>

