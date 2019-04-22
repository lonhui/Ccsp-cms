<template>
    <div class="read">
         <div>
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
                @click="$exportExcel('table_v',$t('route.signin'))">
                    {{$t('button.exportExcel')}}
            </el-button>
             <!-- 需要修改 -->
            <!-- <div class="type">
                <span class="demonstration">签到类型</span>
                <el-select v-model="value" placeholder="请选择">
                    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
                 </el-select>
            </div> -->
            <!-- 、、、、 -->
        </div>
        
        <div class="biaoge">
            <el-table id="table_v" :data="tableData" border style="width: 100%" v-loading="loading">
                <el-table-column type="index" :index="typeIndex" width="100px" :label="$t('table.id')"></el-table-column>
                <el-table-column prop="totalMember" :label="$t('table.totalattendance')"></el-table-column>
                <el-table-column prop="totalCoin" :label="$t('table.sendthetotalpoints')"></el-table-column>
                <el-table-column prop="date" :label="$t('table.date')"></el-table-column>
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
import lineChart from './components/LineChart_share'
import {shareEventList} from '@/api/event'

export default {
    data(){
        return{
            timeInterval:['',''],
             pickerOptions: {
                disabledDate(time) {
                    return time.getTime() > Date.now();
                }
            },
            tableData:[],
            startTime:'',
            endTime:'',
            loading:false,
            currentPage:1,
            totalCount:0,
            className:'bbbb',
            autoResize:true,
            // chartData:{
            //     newData:[],
            //     oldData:[0,0,0,0,0,0,0,0,0,0],
            //     categories:[],
            //     name:this.$t('table.totalattendance'),
            //     days:''
            // },
            chartData:{
                days:[],
                totalMember:{
                    name:this.$t('table.totalattendance'),
                    data:[]
                },
                totalCoin:{
                    name:this.$t('table.sendthetotalpoints'),
                    data:[]
                }

            },
            // 邀请类型选项
            options: [{
                value: '选项1',
                label: '黄金糕'
            }, {
                value: '选项2',
                label: '双皮奶'
            },{
                value: '选项5',
                label: '北京烤鸭'
            }],
            value: ''

        }
    },
    components: {
        'v-line': lineChart
    },
     mounted(){
        this.endTime = this.getEndTime()
        this.startTime = this.getStartTime()
        this.timeInterval = [this.startTime,this.endTime]
        this.getTableData()
    },
    methods:{
        search(timeInterval){
            this.endTime = timeInterval[1]
            this.startTime = timeInterval[0]
            if(this.currentPage===1){
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
                beginDate:this.startTime,
                endDate:this.endTime
            }
            shareEventList(data).then(response => {
                if(response.data){
                    this.tableData = response.data.list
                    this.totalCount = response.data.totalCount
                    this.getLineData()
                }else{
                    this.tableData = []
                    this.totalCount = 0
                }
                this.loading = false
            },error => {
                this.loading = false
            })
        },
        //获取折线图数据
        getLineData(){
            // const dates = []
            // const totalMember = []
            // for(let i = 0;i < this.tableData.length;i++){
            //     dates.push(this.tableData[i].date)
            //     totalMember.push(this.tableData[i].totalMember)
            // }
            // this.chartData.newData = totalMember
            // this.chartData.categories = dates.reverse()
            const dates = []
            const totalMember = []
            const totalCoin = []
            for(let i = 0;i < this.tableData.length;i++){
                dates.push(this.tableData[i].date)
                totalMember.push(this.tableData[i].totalMember)
                totalCoin.push(this.tableData[i].totalCoin)
            }
            this.chartData.days = dates.reverse()
            this.chartData.totalMember.data = totalMember
            this.chartData.totalCoin.data = totalCoin
        },
        //序号
        typeIndex(index) {
            return index + (this.currentPage - 1) * 8 + 1
        },
        //查询
        inquire(){
            if(this.currentPage==1){
                this.getTableData()
            }else{
                this.currentPage=1
            }
        }
    },
    watch: {
    'currentPage': function () {
      this.getTableData()
    }
  }
}
</script>

<style scoped>
.read{
    width: 85%;
    margin: 30px auto;
}
.chaxun .form-control,.chaxun div{
    width: 200px;
    margin-right: 10px;
    
}
.chaxun{
    height:120px; 
    float: right;  
}
.button{
    width: 50px;
    float: right;
   margin-top: 25px;
   margin-left: 20px;
 
}
.anniu button{
    width: 150px;
    height: 50px;
    font-size: 20px;
    font-weight: 600;
    margin-top:100px;
    background-color: #fff;
    border: #000 1px solid;
}
.biaoge{
    margin-top: 30px;
    font-size: 20px;
}
.biaoge table td,.biaoge table th{
    width: 200px;
    text-align: center;
    line-height: 40px;
}
.line{
    width: 1000px;
    margin-top: 30px;
}
.type{
    float: right;
}
</style>