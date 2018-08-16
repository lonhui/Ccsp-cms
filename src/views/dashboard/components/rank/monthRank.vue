<template>
  <div>
    <div class="search">
      <span class="demonstration">{{$t('table.startDate')}}</span>
      <el-date-picker v-model="startTime" align="right" type="date" value-format="yyyy-MM-dd" placeholder="选择日期" :picker-options="pickerOptions1"></el-date-picker>
      <span class="demonstration">{{$t('table.endDate')}}</span>
      <el-date-picker v-model="endTime" align="right" type="date" value-format="yyyy-MM-dd" placeholder="选择日期" :picker-options="pickerOptions1"></el-date-picker>
      <el-button icon="el-icon-search" @click="getRankingDatas"></el-button>
    </div>
    <div class="table1">
      <el-table :data="rankingDatas" border style="width: 100%" v-loading="loading">
        <el-table-column  type="index"  :label="$t('table.rank')" width="100px"></el-table-column>
        <el-table-column prop="uid" :label="$t('table.username')"></el-table-column>
        <el-table-column prop="coin" :label="$t('table.totalnumberofgoldcoins')"></el-table-column>
        <el-table-column prop="money" :label="$t('table.Totalnumberofpoints')"></el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
export default {
  props:['value2'],
  data() {
    return {
      pickerOptions1: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
        shortcuts: [{
          text: this.$t('message.today'),
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
      // 时间参数
      endTime: '',
      startTime: '',
      // 表格参数
      rankingDatas: [],
      rankingDatasCoin:[],
      rankingDatasMonry:[],
      // 加载参数
      loading:false
    }
  },
  mounted() {
    this.endTime = this.getEndTime()
    this.startTime = this.getStartTime()
    this.getRankingDatas()
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
      const weekdate = new Date(d-30*24*3600*1000) 
      const year = weekdate.getFullYear()
      const month = (weekdate.getMonth()+1)<10 ? '0'+(weekdate.getMonth()+1) : (weekdate.getMonth()+1)
      const day = weekdate.getDate()<10 ? '0'+weekdate.getDate() : weekdate.getDate()
      return year + "-" + month + "-" + day
    },
    getRankingDatas() {
      this.loading = true
      var that = this;
      that.$http({
        method:'GET',
        url:'http://ccsp.caping.co.id/cms/statistic/rank/month'+'?startTime='+this.startTime+'&endTime='+this.endTime+'&pageSize='+10+'&pageNum='+this.currentPage1,
      }).then(function(response){
        const datas = response.data;
        this.totalCount = datas.data.totalCount
        this.rankingDatasCoin = []
        this.rankingDatasMonry = []
        for(let i = 0; i < datas.data.length; i++){
          if(datas.data[i].rankType === 1){
            this.rankingDatasCoin.push(datas.data[i])
          }else{
            this.rankingDatasMonry.push(datas.data[i])
          }
        }
        if(this.value2 === '1'){
            this.rankingDatas = this.rankingDatasCoin
        }else{
            this.rankingDatas = this.rankingDatasMonry
        }
        this.loading = false
      },function(error){
          this.loading = false
          // console.log(error)
      })
    },
    // 分页
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`);
    },
    // 查询
    inquire() {
      this.getRankingDatas()
    }
  },
  watch:{
    'currentPage1':function(){
      this.getRankingDatas()
    },
    'value2':function(){
      if(this.value2 === '1'){
        this.rankingDatas = this.rankingDatasCoin
      }else{
        this.rankingDatas = this.rankingDatasMonry
      }
    }
  }
}
</script>

<style scoped>
div .table1{
   margin-top: 20px;
}
</style>

