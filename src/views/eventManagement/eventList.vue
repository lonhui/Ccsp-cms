<template>
<!-- 事件列表 -->
    <div class="eventList">
        <div>
            <el-button type="primary" icon="el-icon-download" @click="$exportExcel('table_v','Event List')">{{$t('button.exportExcel')}}</el-button>
             <span class="demonstration">{{$t('table.startDate')}}</span>
                <el-date-picker v-model="startTime" align="right" type="date" value-format="yyyy-MM-dd" :picker-options="pickerOptions1"></el-date-picker>
             <span class="demonstration">{{$t('table.endDate')}}</span>
                <el-date-picker v-model="endTime" align="right" type="date" value-format="yyyy-MM-dd" :picker-options="pickerOptions1"></el-date-picker>
                <el-button icon="el-icon-search" @click="inquire" circle></el-button>
        </div>
      
        <div class="biaoge">
             <el-table id="table_v" :data="tableData3"  ref="multipleTable" border style="width: 100%" v-loading="loading" >
                <el-table-column prop="intro" :label="$t('table.Eventname')" width="200"></el-table-column>
                <el-table-column prop="title" :label="$t('table.title')" width="200"></el-table-column>
                <el-table-column prop="totalCoin" :label="$t('button.integral')" width='150px'></el-table-column>
                <el-table-column prop="totalCount" :label="$t('table.Totalnumberofparticipants')" ></el-table-column>
                <el-table-column prop="totalPer" :label="$t('table.Totalnumberofparticipation')" ></el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script>
import {geteventList} from '@/api/event'

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
        tableData3: [],
        multipleSelection: [],
        form:{},
        startTime:'',
        endTime:'',
        loading:false,
        multipleSelection:[],
        visible2: false,
      }
    },
    mounted(){
        this.endTime = this.getEndTime()
        this.startTime = this.getStartTime()
        this.getEventList()
    },
    methods: {
        handleSelectionChange(val) {
                this.multipleSelection = val;
        },
        getEventList(){
            this.openFullScreen()
            let data = {
                startTime:this.startTime,
                endTime:this.endTime
            }
            geteventList(data).then(response => {
                const datas = response.data
                this.tableData3 = datas.data
                this.totalCount = datas.totalCount
                this.closeFullScreen()
            },error => {
                this.closeFullScreen()
            })
        },
        openFullScreen() {
            this.loading = true;
        },
        closeFullScreen(){
            this.loading = false
            this.loading = false;
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
        //查询
        inquire(){
            if(this.currentPage==1){
                this.getEventList()
            }else{
                this.currentPage=1
            }
        }
    }
}
</script>

<style scoped>
.eventList{
    width: 80%;
    margin: 20px auto 0;
}
.box{
    position: fixed;
    z-index: 100;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(7, 17, 27, 0.8)
}
.centont{
    width: 500px;
    margin: 100px auto;
    border-radius:10px 10px 10px 10px;
    background-color: #fff
}
.table1{
    width: 80%;
    margin: 0 auto;
    line-height: 80px;
    position: relative;
    top: 15px;
    padding-bottom: 30px;
}
.button1{
    float: right;
}
.biaoge{
    margin-top: 20px;
}
.button{
   float: right;
}
.add{
    float: right;
    margin-right: 10px;
}
.del{
    float: right;
}
</style>

