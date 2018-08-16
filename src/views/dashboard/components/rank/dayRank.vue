<template>
  <div>
    <div class="search">
      <span class="demonstration">{{$t('button.selectdate')}}：</span>
      <el-date-picker v-model="time" align="right" type="date" value-format="yyyy-MM-dd" :picker-options="pickerOptions1"></el-date-picker>
      <el-button icon="el-icon-search" @click="inquire" circle></el-button>
    </div>
    <div class="tab1">
      <el-table :data="rankingDatas" border style="width: 100%" v-loading="loading">
        <el-table-column type="index"  width="100px" :label="$t('table.rank')"></el-table-column>
        <el-table-column prop="uid" :label="$t('table.username')"></el-table-column>
        <el-table-column prop="coin" :label="$t('table.totalnumberofgoldcoins')" ></el-table-column>
        <el-table-column prop="money" :label="$t('table.Totalnumberofpoints')" ></el-table-column>
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
      currentPage1:1,
      // 时间参数
      time: '',
      // 按金币查询表格数据
      rankingDatasCoin: [],
      // 按积分查询表格数据
      rankingDatasMonry:[],
      // 总表格数据
      rankingDatas:[],
      // 加载参数
      loading:false
    }
  },
  mounted() {
    this.time = this.getTime()
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
    // 获取时间
    getTime() {
      const d = new Date()
      const myday = new Date(d-24*3600*1000)
      const year = myday.getFullYear()
      const month = (myday.getMonth()+1)<10 ? '0'+(myday.getMonth()+1) : (myday.getMonth()+1)
      const day = myday.getDate()<10 ? '0'+myday.getDate() : myday.getDate()
      return year + "-" + month + "-" + day
    },
    // 获取表格数据
    getRankingDatas() {
      this.loading = true
      var that = this;
      that.$http({
        method:'GET',
        url:'http://ccsp.caping.co.id/cms/statistic/rank'+'?startTime='+this.time+'&endTime='+this.time+'&pageSize='+100+'&pageNum='+this.currentPage1,
      }).then(function(response){
        const datas = response.data;
        this.totalCount = datas.data.totalCount
        this.rankingDatasCoin = []
        this.rankingDatasMonry = []
        for(let i = 0; i < datas.data.data.length; i++){
          if(datas.data.data[i].rankType === 1){
            this.rankingDatasCoin.push(datas.data.data[i])
          }else{
            this.rankingDatasMonry.push(datas.data.data[i])
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
    // 查询
    inquire() {
        this.getRankingDatas()
    },
    
  },
  watch: {
    'value2': function () {
      if(this.value2 === '1'){
        this.rankingDatas = this.rankingDatasCoin
      }else{
        this.rankingDatas = this.rankingDatasMonry
      }
    },
  }
}
</script>

<style scoped>
.tab1{
    margin-top: 20px;
}
</style>

