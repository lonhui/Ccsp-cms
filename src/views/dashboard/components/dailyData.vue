<template>
  <div id="dailyData">
    <div class="search">
      <span class="demonstration">{{$t('table.startDate')}}</span>
        <el-date-picker v-model="startTime" align="right" type="date" value-format="yyyy-MM-dd"  :picker-options="pickerOptions1"></el-date-picker>
      <span class="demonstration">{{$t('table.endDate')}}</span>
        <el-date-picker v-model="endTime" align="right" type="date" value-format="yyyy-MM-dd"  :picker-options="pickerOptions1"></el-date-picker>
        <el-button icon="el-icon-search" @click="inquire" circle></el-button>
    </div>
    <div class="tab1">
      <el-table :data="tableDatas" border style="width: 100%" v-loading="loading">
        <el-table-column prop="newUser" :label="$t('route.newusers')" width="130px"></el-table-column>
        <el-table-column prop="refreshUser" :label="$t('route.activeuser')" width="130px"></el-table-column>
        <el-table-column prop="coinUser" :label="$t('table.Pointsactiveusers')" width="130"></el-table-column>
        <el-table-column prop="coin" :label="$t('table.Generatecredits')" width="130px"></el-table-column>
        <el-table-column prop="money" :label="$t('table.Generategoldcoins')" ></el-table-column>
        <el-table-column prop="useMoney" :label="$t('table.Totaloldcoinsconsumed')"></el-table-column>
        <el-table-column prop="RemainingGoldCoins" :label="$t('table.Remaininggoldcoins')"></el-table-column>
        <el-table-column prop="createTime" :label="$t('table.date')" width="160px"></el-table-column>
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
      //分页参数
      currentPage1: 1,
      totalCount: 0,
      // 时间参数
      endTime: '',
      startTime: '',
      // 表格数据
      tableDatas: [],
      // 加载参数
      loading:false
    }
  },
  mounted() {
    this.endTime = this.getEndTime()
    this.startTime = this.getStartTime()
    this.getTableDatas();
  },

  methods: {
    // 分页
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
    },
    // 获取表格数据
    getTableDatas() {
      this.loading = true
      var that = this;
      that.$http({
        method:'GET',
        url:'http://ccsp.caping.co.id/cms/statistic/daily'+'?startTime='+this.startTime+'&endTime='+this.endTime+'&pageSize='+10+'&pageNum='+this.currentPage1,
      }).then(function(response){
        console.log(response);
        const datas = response.data
        for(let i = 0;i < datas.data.data.length;i++){
          const a = {
            newUser: datas.data.data[i].newUser,
            refreshUser: datas.data.data[i].refreshUser,
            coinUser: datas.data.data[i].coinUser,
            coin: datas.data.data[i].coin,
            money: datas.data.data[i].money,
            useMoney: datas.data.data[i].useMoney,
            RemainingGoldCoins: datas.data.data[i].money -  datas.data.data[i].useMoney,
            createTime: datas.data.data[i].createTime
          }
           datas.data.data[i] = a
        }
        this.tableDatas = datas.data.data;
        this.totalCount = datas.data.totalCount
        this.loading = false
      },function(error){
        this.loading = false
        console.log(error);
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
        this.getTableDatas()
      }else{
        this.currentPage1 = 1
      } 
    },
  },
  watch: {
    'currentPage1': function () {
       this.getTableDatas()
    },
  }
}

</script>

<style scoped>

.search .aaa{
    width: 250px;
    float: right;
}
.tab1{
     margin-top: 20px;
}
.block{
    margin-top: 20px;
}
</style>

