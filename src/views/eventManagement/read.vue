<template>
<!-- 阅读事件于览 -->
    <div class="read">
        <div>
             <span class="demonstration">{{$t('table.startDate')}}</span>
                <el-date-picker v-model="startTime" align="right" type="date" value-format="yyyy-MM-dd" placeholder="选择日期" :picker-options="pickerOptions1"></el-date-picker>
             <span class="demonstration">{{$t('table.endDate')}}</span>
                <el-date-picker v-model="endTime" align="right" type="date" value-format="yyyy-MM-dd" placeholder="选择日期" :picker-options="pickerOptions1"></el-date-picker>
                <el-button icon="el-icon-search" @click="inquire" circle></el-button>
            <!-- 需要修改 -->
            <div class="type">
                <span class="demonstration">{{$t('table.Readingtype')}}</span>
                <el-select v-model="value" :placeholder="$t('button.pleasechoose')">
                    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
                 </el-select>
            </div>
            <!-- 、、、、 -->
        </div>
        <!-- <div class="anniu">
            <div class="btn-group" role="group" aria-label="Basic example">
                <el-radio-group v-model="tabPosition" style="margin-bottom: 30px;">
                    <el-radio-button label=1>{{$t('table.Newsreading')}}</el-radio-button>
                    <el-radio-button label=2>{{$t('table.Videoreading')}}</el-radio-button>
                </el-radio-group>
            </div>
        </div> -->
        <div class="biaoge">
            <el-table :data="tableData" border style="width: 100%" v-loading="loading">
                 <el-table-column type="index" :index="typeIndex" width="100px" :label="$t('table.id')"></el-table-column>
                <el-table-column prop="totalMember" :label="$t('table.Totalnumberofparticipants')"></el-table-column>
                <el-table-column prop="activeCount" :label="$t('table.Totalnumberofparticipation')"></el-table-column>
                <el-table-column prop="validActiveCount" :label="$t('table.Particitimes')" ></el-table-column>
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
import lineChart from './components/LineChart_read'
import {readeventList,readTypeList} from '@/api/event'

export default {
    data(){
        return{
            tabPosition: 1,
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
            // 表格数据
            tableData:[],
            //时间参数
            startTime:'',
            endTime:'',
            // 分页参数
            currentPage:1,
            totalCount:0,
            // 折线图参数
            loading:false,
            className:'bbbb',
            autoResize:true,
            chartData:{
                days:[],
                totalMember:{
                    name:this.$t('table.Totalnumberofparticipants'),
                    data:[]
                },
                activeCount:{
                    name:this.$t('table.Totalnumberofparticipation'),
                    data:[]
                },
                validActiveCount:{
                    name:this.$t('table.Particitimes'),
                    data:[]
                },
                totalCoin:{
                    name:this.$t('table.sendthetotalpoints'),
                    data:[]
                }
            },
            // 阅读类型选项
            options: [],
            value: 3,
            type:3
        }
    },
  components: {
    'v-line': lineChart
  },
   mounted(){
        this.endTime = this.getEndTime()
        this.startTime = this.getStartTime()
        this.getTableData()
        this.getOptions()
    },
     methods:{
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
                endDate:this.endTime,
                key_id:this.value
            }
            readeventList(data).then(response => {
                if(response.data){
                    this.tableData = response.data.list
                    this.totalCount = response.data.totalCount
                    this.getLineDate()
                }else{
                    this.tableData = []
                    this.getLineDate()
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
                    if(this.$i18n.locale === 'id'){
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
        getLineDate(){
            const dates = []
            const totalMembers = []
            const activeCount = []
            const validActiveCount = []
            const totalCoin = []
            for(let i = 0;i<this.tableData.length;i++){
                dates.push(this.tableData[i].day)
                totalMembers.push(this.tableData[i].totalMember)
                activeCount.push(this.tableData[i].activeCount)
                validActiveCount.push(this.tableData[i].validActiveCount)
                totalCoin.push(this.tableData[i].totalCoin)
            }
            this.chartData.totalMember.data = totalMembers
            this.chartData.activeCount.data = activeCount
            this.chartData.validActiveCount.data = validActiveCount
            this.chartData.totalCoin.data = totalCoin
            this.chartData.days = dates.reverse()
        },
        //序号
        typeIndex(index) {
            return index + (this.currentPage - 1) * 8 + 1
        },
        //查询
        inquire(){
            if(this.currentPage === 1){
                this.getTableData()
            }else{
                this.currentPage=1
            }
        }
    },
    watch: {
    'currentPage': function () {
      this.getTableData()
    },
    'tabPosition':function () {
        this.getTableData()
    },
    'value':function(){
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
    float: right;
   margin-top: 25px;
   margin-left: 20px;
 
}
.btn-group{
    margin-top:20px; 
}
.biaoge{
    margin-top: 20px;
    font-size: 20px;
}
.biaoge table td,.biaoge table th{
    width: 150px;
    text-align: center;
    line-height: 40px;
}
.line{
    height: 400px;
}
.schart{
        width: 600px;
        display: inline-block;
}
.content-title{
    clear: both;
    font-weight: 400;
    line-height: 50px;
    margin: 10px 0;
    font-size: 22px;
    color: #1f2f3d;
}
.type{
    float: right;
}
</style>
