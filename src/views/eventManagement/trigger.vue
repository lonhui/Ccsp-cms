
<template>
    <!-- 分享内容、触发型事件 -->
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
             <!-- 需要修改 -->
            <!-- <div class="type">
                <span class="demonstration">事件类型</span>
                <el-select v-model="value" placeholder="请选择">
                    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
                 </el-select>
            </div> -->
            <!-- 、、、、 -->
        </div>
        <div class="biaoge">
             <el-table :data="tableData" border style="width: 100%" v-loading="loading">
                <el-table-column type="index" :index="typeIndex" width="100px" :label="$t('table.id')"></el-table-column>
                <el-table-column prop="totalMember" :label="$t('table.Totalnumberofparticipants')"></el-table-column>
                <el-table-column prop="activeCount" :label="$t('table.Totalnumberofparticipation')"></el-table-column>
                <el-table-column prop="validActiveCount" :label="$t('table.Totaleffectiveevents')" width="210"></el-table-column>
                <el-table-column prop="totalCoin" :label="$t('table.Sendthetotalnumberofpoints')"></el-table-column>
                <el-table-column prop="day" :label="$t('table.date')"></el-table-column>
            </el-table>
        </div>
         <div class="block">
            <el-pagination :current-page.sync="currentPage" :page-size="8" layout="total, prev, pager, next" :total="totalCount"></el-pagination>
        </div>
    </div>
</template>

<script>
import {readeventList} from '@/api/event'

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
            // 事件类型选项
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
            if(this.currentPage === 1){
                this.getTableData()
            }else{
                this.currentPage = 1
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
               const data = {
                    pageNo:this.currentPage,
                    pageSize:8,
                    beginDate:this.startDate,
                    endDate:this.endDate,
                    key_id:10
            }
            readeventList(data).then(response => {
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