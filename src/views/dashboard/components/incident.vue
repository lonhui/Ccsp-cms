<template>
  <div id="incident">
    <div class="search">
      <span class="demonstration">{{$t('table.startDate')}}:</span>
      <el-date-picker v-model="startTime" align="right" type="date" value-format="yyyy-MM-dd" :picker-options="pickerOptions1"></el-date-picker>
      <span class="demonstration">{{$t('table.endDate')}}:</span>
      <el-date-picker v-model="endTime" align="right" type="date" value-format="yyyy-MM-dd" :picker-options="pickerOptions1"></el-date-picker>
      <el-button icon="el-icon-search" @click="inquire" circle></el-button>
    </div>
    <div class="tab1">
      <el-table :data="eventDatas" border style="width: 100%"  v-loading="loading">
        
        <el-table-column prop="intro" :label="$t('table.Eventname')" ></el-table-column>
        <el-table-column prop="title" :label="$t('table.title')" width="200"></el-table-column>
        <el-table-column prop="totalCoin" :label="$t('button.integral')"></el-table-column>
        <el-table-column prop="totalCount" :label="$t('table.Totalnumberofparticipation')" width="220"></el-table-column>
        <el-table-column prop="totalPer" :label="$t('table.Totalnumberofparticipants')"  width="220"></el-table-column>
      </el-table>
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
      // 分页参数
      totalCount: 0,
      currentPage1: 1,
      // 时间参数
      endTime: '',
      startTime: '',
      // 表格数据
      eventDatas: [],
      // 加载参数
      loading: false,
    }
  },
  mounted() {
    this.endTime = this.getEndTime()
    this.startTime = this.getStartTime()
    this.getEventDatas()
  },
  methods: {
    // 加载
    openFullScreen() {
        this.loading = true;
      },
    closeFullScreen(){
      this.loading = false;
    },
    // 获取表格数据
    getEventDatas() {
      this.openFullScreen()
      this.eventDatas = [] 
      var that = this;
      that.$http({
        method:'GET',
        url:process.env.API_ROOT+'/cms/statistic/event'+'?startTime='+this.startTime+'&endTime='+this.endTime,
      }).then(function(response){
        const datas = response.data;
        this.eventDatas = datas.data.data
        this.closeFullScreen()  
      },function(error){
        this.loading = false
        // console.log(error)
      })
    },
    
    gettimes(datas){
      const aaa = new Array()
      const times = new Array()
      for(let i = 0; i < datas.data.data.length; i++){
        aaa.push(datas.data.data[i].timestamp)
      }
      for(let i = 0;i < aaa.length; i++){
        if(i === 0 || i%9 === 0){
          times.push(aaa[i])
        }
      }
      return times
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
        this.getEventDatas()
    },
  },
  watch: {
   

  }
  
}
</script>

<style scoped>
#incident{
  width: 95%;
}
.tab1{
    margin-top:20px; 
}
</style>

