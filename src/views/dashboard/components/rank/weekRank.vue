<template>
  <div>
    <div class="search">
      <span class="demonstration">{{$t('table.startDate')}}</span>
      <el-date-picker v-model="startTime" align="right" type="date" disabled value-format="yyyy-MM-dd" :picker-options="pickerOptions1"></el-date-picker>
      <span class="demonstration">{{$t('table.endDate')}}</span>
      <el-date-picker v-model="endTime" align="right" type="date" value-format="yyyy-MM-dd"  :picker-options="pickerOptions1"></el-date-picker>
      <el-button icon="el-icon-search" @click="inquire" circle></el-button>
    </div>
    <div class="tab1">
      <el-table :data="rankingDatas" border style="width: 500px" v-loading="loading">
        <el-table-column type="index"  width="100px" :label="$t('table.rank')"></el-table-column>
        <el-table-column prop="uid" :label="$t('table.userID')" width="200px"></el-table-column>
        <el-table-column prop="money" :label="$t('button.totalgoldcoins')" v-if="value2==1" width="200px"></el-table-column>
        <el-table-column prop="coin" :label="$t('table.Totalnumberofpoints')" v-if="value2==2" width="200px"></el-table-column>
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
      //时间参数  
      endTime: '',
      startTime: '',
      // 表格数据
      rankingDatasCoin:[],
      rankingDatasMonry:[],
      rankingDatas: [],
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
    // 获取表格数据
    getRankingDatas() {
      this.loading = true
      var that = this;
      that.$http({
        method:'GET',
        url:process.env.API_ROOT+'/cms/statistic/rank/week'+'?startTime='+this.startTime+'&endTime='+this.endTime+'&pageSize='+10+'&pageNum='+this.currentPage1,
      }).then(function(response){
        
        const datas = response.data
        this.totalCount = 100
        for(let i = 0; i < datas.data.length; i++){
          if(datas.data[i].rankType === 2){
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
    // 获取时间
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
   
    // 查询
    inquire() {
      if(this.currentPage1 === 1){
          this.getRankingDatas()
      }else{
        this.currentPage1 = 1
      }
    },
  },
  watch: {
    'currentPage1': function () {
      this.getRankingDatas()
    },
    'value2': function () {
      if(this.value2 === '1'){
        this.rankingDatas = this.rankingDatasCoin
      }else{
        this.rankingDatas = this.rankingDatasMonry
      }
    },
    'endTime':function(){
      const str = this.endTime.replace(/-/g,'/')
      const date = new Date(str)
      const aweekgo = new Date(date-7*24*3600*1000) 
      const year = aweekgo.getFullYear()
      const month = (aweekgo.getMonth()+1)<10 ? '0'+(aweekgo.getMonth()+1) : (aweekgo.getMonth()+1)
      const day = aweekgo.getDate()<10 ? '0'+aweekgo.getDate() : aweekgo.getDate()
      this.startTime = year + "-" + month + "-" + day
    }
  }
}
</script>

<style scoped>
  .tab1{
    padding-top:20px;
  }
</style>
