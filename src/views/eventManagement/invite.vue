<template>
    <div class="invite">
        <div class="search">
            <span class="demonstration">{{$t('table.startDate')}}:</span>
                <el-date-picker v-model="startDate" align="right" type="date" value-format="yyyy-MM-dd"></el-date-picker>
                <span class="demonstration">{{$t('table.endDate')}}:</span>
                <el-date-picker v-model="endDate" align="right" type="date" value-format="yyyy-MM-dd"></el-date-picker>
                <el-button icon="el-icon-search" @click="inquire" circle></el-button>
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
             <el-table :data="tableData" border style="width: 90%" v-loading="loading">
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
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-size="8" layout="total, prev, pager, next" :total="totalCount"></el-pagination>
        </div>
    </div>
</template>

<script>
export default {
    data(){
        return{
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
        this.getTableData()
    },
    methods:{
        // 分页
        handleSizeChange(val) {
            console.log(`每页 ${val} 条`);
        },
        handleCurrentChange(val) {
            console.log(`当前页: ${val}`);
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
            }
            var that = this;
            that.$http.post('http://ccsp.caping.co.id/cms/statistic/invite',data
            ).then(function(response){
                console.log(response);
                const datas = response.data;
                if(datas.data!=null){
                    this.tableData = datas.data.list
                    this.totalCount = datas.data.totalCount
                }
                this.loading = false
            },function(error){
                this.loading = false
                console.log(error)
            })
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

