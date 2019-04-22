<template>
  <div>
    <div class="search">
        <span class="demonstration">{{$t('button.selectdate')}}：</span>
        <el-date-picker v-model="time" align="right" type="date" value-format="yyyy-MM-dd" :picker-options="pickerOptions1"></el-date-picker>
        <el-button icon="el-icon-search" @click="inquire" circle></el-button>
        <el-button type="primary" 
            icon="el-icon-download" 
            @click="$exportExcel('table_v',$t('button.dailyranking'))">
                {{$t('button.exportExcel')}}
        </el-button>
    </div>
    <div class="tab1">
      <el-table id="table_v" :data="rankingDatas" border style="width: 500px" v-loading="loading">
        <el-table-column align="center" type="index"  width="100px" :label="$t('table.rank')"></el-table-column>
        <el-table-column align="center" prop="uid" :label="$t('table.username')" width="200px"></el-table-column>
        <el-table-column align="center" prop="money" :label="$t('table.totalnumberofgoldcoins')" v-if="value2==1"></el-table-column>
        <el-table-column align="center" prop="coin" :label="$t('table.Totalnumberofpoints')" v-if="value2==2"></el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import {getDayRank} from '@/api/dashboard'

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
      // 按积分查询表格数据
      rankingDatasCoin: [],
      // 按金币查询表格数据
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
      let params={
        startTime:this.time,
        endTime:this.time,
        pageSize:100,
        pageNum:this.currentPage1
      }
      getDayRank(params).then(response=>{
      const datas = response;
        this.totalCount = datas.data.totalCount
        this.rankingDatasCoin = []
        this.rankingDatasMonry = []
        for(let i = 0; i < datas.data.data.length; i++){
          if(datas.data.data[i].rankType === 2){
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
      },(error)=>{
        this.loading = false
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

