<template>
  <div>
    <div class="search">
      <span class="demonstration">{{$t('table.startDate')}}</span>
      <el-date-picker v-model="startTime" align="right" type="date" value-format="yyyy-MM-dd" placeholder="选择日期" :picker-options="pickerOptions1"></el-date-picker>
      <span class="demonstration">{{$t('table.endDate')}}</span>
      <el-date-picker v-model="endTime" align="right" type="date" value-format="yyyy-MM-dd" placeholder="选择日期" :picker-options="pickerOptions1"></el-date-picker>
      <el-button icon="el-icon-search" @click="getRankingDatas"></el-button>
      <el-button type="primary" 
            icon="el-icon-download" 
            @click="$exportExcel('table_v',$t('button.monthlyrankings'))">
              {{$t('button.exportExcel')}}
        </el-button>
    </div>
    <div class="table1">
      <el-table id="table_v" :data="rankingDatas" border style="width: 500px" v-loading="loading">
        <el-table-column align="center" type="index"  :label="$t('table.rank')" width="100px"></el-table-column>
        <el-table-column align="center" prop="uid" :label="$t('table.username')" width="200px"></el-table-column>
        <el-table-column align="center" prop="money" :label="$t('table.totalnumberofgoldcoins')" v-if="value2==1"></el-table-column>
        <el-table-column align="center" prop="coin" :label="$t('table.Totalnumberofpoints')" v-if="value2==2"></el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import {getMonthRank} from '@/api/dashboard'

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
      let params={
        startTime:this.startTime,
        endTime:this.endTime
      }
      getMonthRank(params).then(response=>{
        const datas = response;
        this.totalCount = datas.data.totalCount
        this.rankingDatasCoin = []
        this.rankingDatasMonry = []
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
      },(error)=>{
        this.loading = false
      })
    },
    // 查询
    inquire() {
      this.getRankingDatas()
    }
  },
  watch:{
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

