<template>
<!-- 用户设备列表 -->
    <div class="userEList">
        <div class="input-button">
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
            <el-input :placeholder="$t('button.enteruid')" v-model="input_uid" style="width:200px" clearable></el-input>
            <el-input :placeholder="$t('table.pleaseenterthedevicename')" v-model="input_deviceName" style="width:200px" clearable></el-input>
            <el-input :placeholder="$t('button.PleasedeviceID')" v-model="input_deviceId" style="width:200px" clearable></el-input>
            <el-button icon="el-icon-search" @click="inquire" circle></el-button>
            <el-button type="primary" 
                icon="el-icon-download" 
                @click="$exportExcel('table_v',$t('route.userequipmentlist'))">
                {{$t('button.exportExcel')}}
            </el-button>
        </div>
        <div class="tabl">
            <el-table id="table_v" :data="DataList" border style="max-width: 900px" v-loading="loading">
                <el-table-column align="center" type="index" :index="typeIndex" width="70px" :label="$t('table.rank')"></el-table-column>
                <el-table-column align="center" prop="uid" :label="$t('table.userID')" width="130px"></el-table-column>
                <el-table-column align="center" prop="create_time" :label="$t('table.useractivationtime')" width="180px"></el-table-column>
                <el-table-column align="center" prop="os" :label="$t('table.useractivationdevice')" width="200px"></el-table-column>
                <el-table-column align="center" prop="device_id" :label="$t('table.useractivationdevice')+'ID'" ></el-table-column>
            </el-table>
        </div>
        <div class="block">
            <el-pagination :current-page.sync="currentPage1" :page-size="10" layout="total, prev, pager, next" :total="totalCount"></el-pagination>
        </div>
    </div>
</template>

<script>
import {getDeviceList} from '@/api/user'

export default {
    data() {
        return {
            timeInterval:['',''],
            pickerOptions: {
                disabledDate(time) {
                    return time.getTime() > Date.now();
                }
            },
            // 表格数据
            DataList:[],
            // 分页参数
            currentPage1: 1,
            totalCount: 0,
            
            input_deviceName: '',
            activeTime: null,
            endTime:null,
            // 加载参数
            loading:false,
            input_uid:'',
            input_deviceId:'',
        }
    },
    mounted(){
        this.activeTime = this.getStartTime()
        this.endTime = this.getEndTime()
        this.timeInterval = [this.activeTime,this.endTime]
        this.getDataList()
    },
    methods: {
        search(timeInterval){
            this.activeTime = timeInterval[0]
            this.endTime = timeInterval[1]
            if(this.currentPage1===1){
                this.getDataList()
            }else{
                this.currentPage1 = 1
            }
        },
      inquire() {
          if(this.currentPage1===1){
              this.getDataList()
          }else{
              this.currentPage1 = 1
          }
      },
      typeIndex(index) {
        return index + (this.currentPage1 - 1) * 10 + 1
      },
      table(val) {
        this.currentPage1 = val
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
      getDataList() {
        this.loading = true
        let data={
            pageSize:10,
            pageNum:this.currentPage1,
            startTime:this.activeTime,
            endTime:this.endTime,
            deviceName:this.input_deviceName,
            deviceId:this.input_deviceId,
            uid:this.input_uid
        }
        getDeviceList(data).then(response=>{
            const datas = response
            this.DataList = datas.data.list
            this.totalCount = datas.data.totalCount
            this.loading = false
        },(error)=>{
            this.loading = false
        })
    }
  },
  watch: {
    'currentPage1': function () {
      this.getDataList()
    }
  }    
}
</script>

<style scoped>
.userEList{
    width: 80%;
    margin: 20px auto;
}
.input-button{
    margin-top: 20px;
}
.tabl{
    margin-top: 20px; 
}
.input-button .input_inner{
    width: 200px;
}
</style>

