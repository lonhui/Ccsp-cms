<template>
<!-- 事件列表 -->
    <div class="eventList">
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
                @click="$exportExcel('table_v',$t('route.event'))">
                    {{$t('button.exportExcel')}}
            </el-button>
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
        pickerOptions: {
          disabledDate(time) {
            return time.getTime() > Date.now();
          }
        },
        timeInterval:['',''],
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
        this.timeInterval=[this.startTime,this.endTime]
        this.getEventList()
    },
    methods: {
        search(timeInterval){
            this.endTime = timeInterval[1]
            this.startTime = timeInterval[0]
            this.getEventList()
        },
        handleSelectionChange(val) {
                this.multipleSelection = val;
        },
        getEventList(){
            this.loading = true
            let data = {
                startTime:this.startTime,
                endTime:this.endTime
            }
            geteventList(data).then(response => {
                const datas = response.data
                this.tableData3 = datas.data
                this.loading = false
            },error => {
                this.loading = false
            })
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

