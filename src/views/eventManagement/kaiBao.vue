<template>
<!-- 开宝箱事件 -->
    <div class="kaibao">
         <div class="search">
            <!-- <span class="demonstration">{{$t('table.startDate')}}:</span>
                <el-date-picker v-model="startDate" align="right" type="date" value-format="yyyy-MM-dd"  :picker-options="pickerOptions"></el-date-picker>
             <span class="demonstration">{{$t('table.endDate')}}:</span>
                <el-date-picker v-model="endDate" align="right" type="date" value-format="yyyy-MM-dd"  :picker-options="pickerOptions"></el-date-picker>
                <el-button icon="el-icon-search" @click="inquire" circle></el-button> -->
            <el-date-picker
                v-model="timeInterval"
                value-format="yyyy-MM-dd"
                type="daterange"
                align="right"
                @change="search(timeInterval)"
                unlink-panels
                range-separator="-"
                :start-placeholder="this.$t('table.startDate')"
                :end-placeholder="this.$t('table.endDate')"
                :picker-options="pickerOptions">
            </el-date-picker>
            <el-button type="primary" 
                icon="el-icon-download" 
                @click="$exportExcel('table_v',$t('route.opentreasurecasepreview'))">
                {{$t('button.exportExcel')}}
            </el-button>
            <div class="type">
                <span class="demonstration">{{$t('table.Treasureboxtype')}}</span>
                <el-select v-model="value" :placeholder="$t('button.pleasechoose')">
                    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
                 </el-select>
            </div>
        </div>
        <div class="biaoge">
             <el-table id="table_v" :data="tableData" border style="width: 100%" v-loading="loading">
                <el-table-column type="index" :index="typeIndex" width="100px" :label="$t('table.id')"></el-table-column>
                <el-table-column prop="totalMember" :label="$t('table.Totalnumberofparticipants')"></el-table-column>
                <el-table-column prop="activeCount" :label="$t('table.Particitimes')"></el-table-column>
                <el-table-column prop="totalCoin" :label="$t('table.sendthetotalpoints')" ></el-table-column>
                 <el-table-column prop="day" :label="$t('table.date')"></el-table-column>
            </el-table>
        </div>
         <div class="block">
            <el-pagination :current-page.sync="currentPage" :page-size="8" layout="total, prev, pager, next" :total="totalCount"></el-pagination>
        </div>
         <div class="line">
            <v-line :className='className' :autoResize='autoResize' :chartData='chartData'></v-line>
         </div>
    </div>
</template>

<script>
import lineChart from './components/LineChart_kaibao'
import {readeventList,readTypeList} from '@/api/event'

export default {
    data() {
        return{
             startDate:'',
             endDate:'',
             tableData:[],
             currentPage:1,
             totalCount:0,
             loading:false,
             pickerOptions: {
                disabledDate(time) {
                    return time.getTime() > Date.now();
                },
            },
            timeInterval:['',''],
            className:'bbbb',
            autoResize:true,
            chartData:{
                days:[],
                totalMember:{
                    name:this.$t('table.Totalnumberofparticipants'),
                    data:[]
                },
                activeCount:{
                    name:this.$t('table.Particitimes'),
                    data:[]
                },
                totalCoin:{
                    name:this.$t('table.sendthetotalpoints'),
                    data:[]
                },
            },
            type:2,
            // 宝箱类型选项
            options: [],
            value: 2
        }
    },
  components: {
    'v-line': lineChart
  },
  mounted(){
        this.endDate = this.getEndTime()
        this.startDate = this.getStartTime()
        this.timeInterval = [this.startDate,this.endDate]
        this.getTableData()
        this.getOptions()
    },
    methods:{
        search(timeInterval){
            this.endDate = timeInterval[1]
            this.startDate = timeInterval[0]
            if(this.currentPage === 1){
                this.getTableData()
            }else{
                this.currentPage=1
            }
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
        getTableData(){
            this.loading = true
            let data = {
                pageNo:this.currentPage,
                pageSize:8,
                beginDate:this.startDate,
                endDate:this.endDate,
                key_id:this.value
            }
            readeventList(data).then(response => {
                if(response){
                    this.tableData = response.data.list?response.data.list:[]
                    this.totalCount = response.data.totalCount?response.data.totalCount:0
                    this.getLineData()
                }
                this.loading = false
            },error => {
                this.loading = false
            })
        },
         getOptions(){
            this.options = []
            let data = {
                type:this.type
            }
            readTypeList(data).then(response => {
                for(let i = 0;i < response.data.length;i++){
                     const d = {
                        value: null,
                        label: null
                    }
                    if(this.$i18n.locale=='id'){
                        d.value = response.data[i].id
                        d.label = response.data[i].title
                    }else{
                        d.value = response.data[i].id
                        d.label = response.data[i].intro
                    }
                    this.options.push(d)
                }
            },error => {

            })
        },
         getLineData(){
            const dates = []
            const totalMember = []
            const activeCount = []
            const totalCoin = []
            for(let i = 0;i < this.tableData.length;i++){
                dates.push(this.tableData[i].day)
                totalMember.push(this.tableData[i].totalMember)
                activeCount.push(this.tableData[i].activeCount)
                totalCoin.push(this.tableData[i].totalCoin)
            }
            this.chartData.totalMember.data = totalMember
            this.chartData.activeCount.data = activeCount
            this.chartData.totalCoin.data = totalCoin
            this.chartData.days = dates.reverse()  
        },
        //序号
        typeIndex(index) {
            return index + (this.currentPage - 1) * 8 + 1
        },
    },
    watch: {
    'currentPage': function () {
      this.getTableData()
    }
  }
  
}
</script>

<style scoped>
.kaibao{
    width: 85%;
    margin: 30px auto;
}

.biaoge{
    margin-top: 20px;
}
.line{
    margin-top: 30px;
}
.type{
    float: right;
}
</style>
