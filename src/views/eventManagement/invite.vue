<template>
<!-- 邀请事件 -->
    <div class="invite">
        <div class="search">
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
                @click="$exportExcel('table_v',$t('route.invitationevent'))">
                    {{$t('button.exportExcel')}}
            </el-button>
            <!-- 需要修改 -->
            <!-- <div class="type">
                <span class="demonstration">邀请类型</span>
                <el-select v-model="value" placeholder="请选择">
                    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
                 </el-select>
            </div> -->
            <!-- 、、、、 -->
        </div>
        <div class="biaoge">
             <el-table id="table_v" :data="tableData" border style="width: 90%" v-loading="loading">
                <el-table-column type="index" :index="typeIndex" width="100px" :label="$t('table.id')"></el-table-column>
                <el-table-column prop="day" :label="$t('table.date')" width="135"></el-table-column>
                <el-table-column prop="inviteCount" :label="$t('table.Numbereoplenvited')" width="160"></el-table-column>
                <el-table-column prop="beInviteCount" :label="$t('table.Numberofnvitedpeople')" width="160"></el-table-column>
                <el-table-column prop="giveCoin" :label="$t('table.Successinvitedpoints')"></el-table-column>
                <el-table-column prop="activeCoin" :label="$t('table.Activecompliancescores')"></el-table-column>
                <el-table-column prop="activeCount" :label="$t('table.Activetimes')" width="150"></el-table-column>
            </el-table>
        </div>
         <div class="block">
            <el-pagination :current-page.sync="currentPage" :page-size="8" layout="total, prev, pager, next" :total="totalCount"></el-pagination>
        </div>
    </div>
</template>

<script>
import {inviteEventList} from '@/api/event'

export default {
    data(){
        return{
            timeInterval:['',''],
            pickerOptions: {
                disabledDate(time) {
                    return time.getTime() > Date.now();
                }
            },
            startDate:'',
            endDate:'',
            tableData:[],
            currentPage:1,
            totalCount:0,
            loading:false,
            // 邀请类型选项
            options: [{
                value: '选项1',
                label: 'aaaa'
            }, {
                value: '选项2',
                label: 'bbbb'
            },{
                value: '选项5',
                label: 'cccc'
            }],
            value: ''
        }
    },
     mounted(){
        this.endDate = this.getEndTime()
        this.startDate = this.getStartTime()
        this.timeInterval = [this.startDate,this.endDate]
        this.getTableData()
    },
    methods:{
        search(timeInterval){
            this.endDate = timeInterval[1]
            this.startDate = timeInterval[0]
            if(this.currentPage==1){
                this.getTableData()
            }else{
                this.currentPage=1
            }
        },
        getEndTime() {
            let myday = new Date()
            let year = myday.getFullYear()
            let month = (myday.getMonth()+1)<10 ? '0'+(myday.getMonth()+1) : (myday.getMonth()+1)
            let day = myday.getDate()<10 ? '0'+myday.getDate() : myday.getDate()
            return year + "-" + month + "-" + day
        },
        getStartTime() {
            let d = new Date()
            let weekdate = new Date(d-7*24*3600*1000) 
            let year = weekdate.getFullYear()
            let month = (weekdate.getMonth()+1)<10 ? '0'+(weekdate.getMonth()+1) : (weekdate.getMonth()+1)
            let day = weekdate.getDate()<10 ? '0'+weekdate.getDate() : weekdate.getDate()
            return year + "-" + month + "-" + day
        },
        getTableData(){
            this.loading = true
            let data = {
                pageNo:this.currentPage,
                pageSize:8,
                beginDate:this.startDate,
                endDate:this.endDate,
            }
            inviteEventList(data).then(response => {
                if(response.data){
                    this.tableData = response.data.list
                    this.totalCount = response.data.totalCount
                }
                this.loading = false
            },error => {
                this.loading = false
            })
        },
        //序号
        typeIndex(index) {
            return index + (this.currentPage - 1) * 8 + 1
        }
    },
    watch: {
        'currentPage': function () {
        this.getTableData()
        },
    }
}
</script>

<style scoped>
.invite{
    width: 85%;
    margin: 30px auto;
}
.chaxun .form-control,.chaxun div{
    width: 200px;
    margin-right: 10px;
    
}
.chaxun{
    height:20px; 
    float: right;  
}

.biaoge{
    margin-top:20px;
}
.btn-group{
    margin-top: 20px;
}
.type{
    float: right;
}
</style>

