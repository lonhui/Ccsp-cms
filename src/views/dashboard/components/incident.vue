<template>
<!-- 事件  -->
  <div id="incident">
    <div class="search">
      <!-- <span class="demonstration">{{$t('table.startDate')}}:</span>
      <el-date-picker v-model="startTime" align="right" type="date" value-format="yyyy-MM-dd" :picker-options="pickerOptions1"></el-date-picker>
      <span class="demonstration">{{$t('table.endDate')}}:</span>
      <el-date-picker v-model="endTime" align="right" type="date" value-format="yyyy-MM-dd" :picker-options="pickerOptions1"></el-date-picker>
      <el-button icon="el-icon-search" @click="inquire" circle></el-button> -->
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
            @click="$exportExcel('table_v',$t('route.event'))">
              {{$t('button.exportExcel')}}
        </el-button>
    </div>
    <div class="tab1">
      <el-table id="table_v" :data="eventDatas" border style="width: 100%"  v-loading="loading">
        <el-table-column align="center" prop="name" :label="$t('table.Eventname')" ></el-table-column>
        <el-table-column align="center" prop="ename" :label="$t('table.title')" width="200"></el-table-column>
        <el-table-column align="center" prop="totalCoin" :label="$t('button.integral')"></el-table-column>
        <el-table-column align="center" prop="totalCount" :label="$t('table.Totalnumberofparticipation')" width="220"></el-table-column>
      </el-table>
    </div> 
  </div>
</template>

<script>
import {getEventList} from '@/api/dashboard'

export default {
  data() {
    return {
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      // 时间参数
      endTime: '',
      startTime: '',
      // 表格数据
      eventDatas: [],
      // 加载参数
      loading: false,
      value:['','']
    }
  },
  mounted() {
    this.endTime = this.getEndTime()
    this.startTime = this.getStartTime()
    this.value = [this.startTime,this.endTime]
    this.getEventDatas()
  },
  methods: {
        search(value){
            this.endTime = this.value[1]
            this.startTime = this.value[0]
            this.getEventDatas()
        },
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
      let params = {
        startTime:this.startTime,
        endTime:this.endTime
      }
      getEventList(params).then(response=>{
         const datas = response
        for(let i = 0;i<datas.data.length;i++){
          if(datas.data[i].ename!=''){
            this.eventDatas.push(datas.data[i])
          }
        }
        this.closeFullScreen()
      },(error)=>{
        this.loading = false
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
    }
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

