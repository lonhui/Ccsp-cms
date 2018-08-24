<template>
<!-- 邀请事件跟踪 -->
    <div class="invite">
        <div v-if="!friendShow">
            <div class="search">
                <span class="demonstration">{{$t('table.startDate')}}:</span>
                    <el-date-picker v-model="startDate" align="right" type="date" value-format="yyyy-MM-dd"></el-date-picker>
                    <span class="demonstration">{{$t('table.endDate')}}:</span>
                    <el-date-picker v-model="endDate" align="right" type="date" value-format="yyyy-MM-dd"></el-date-picker>
                    <el-button icon="el-icon-search" @click="inquire" circle></el-button>
            </div>
            <div class="biaoge">
                <el-table :data="tableData" border style="width: 65%" v-loading="loading">
                    <el-table-column type="index" :index="typeIndex" width="100px" :label="$t('table.id')"></el-table-column>
                    <el-table-column prop="uid" :label="$t('table.userID')"></el-table-column>
                    <el-table-column prop="inviteCount" :label="$t('table.Numberopeopleinvited')"></el-table-column>
                    <!-- <el-table-column prop="day" :label="$t('table.Creationdate')" ></el-table-column> -->
                    <el-table-column :label="$t('table.detail')" width="120">
                        <template slot-scope="scope">
                            <el-button type="text" size="small" @click="openFriendShow(scope.$index,scope.row)">{{$t('table.seedetails')}}</el-button>
                            <!-- @click="openDetailShow(scope.$index,scope.row)" -->
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div class="block">
                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-size="8" layout="total, prev, pager, next" :total="totalCount"></el-pagination>
            </div>
        </div>
        <div v-if="friendShow">
            <v-invitedList  @on-close="closeFriendShow" :data="invitedListParams"></v-invitedList>
        </div>
    </div>
</template>

<script>
import invitedList from './components/invitedList'

export default {
    data(){
        return{
            startDate:'',
            endDate:'',
            tableData:[],
            currentPage:1,
            totalCount:0,
            loading:false,
            friendShow:false,
            activeData:[],
            invitedListParams:{}
        }
    },
    components: {
        'v-invitedList': invitedList
    },
    mounted(){
        this.endDate = this.getEndTime()
        this.startDate = this.getStartTime()
        this.getTableData()
    },
    methods:{
        // 分页
        handleSizeChange(val) {
            // console.log(`每页 ${val} 条`);
        },
        handleCurrentChange(val) {
            // console.log(`当前页: ${val}`);
        },
        // 打开被邀请人列表
        openFriendShow(index,row){
            const item = this.tableData[index]
            const uid = item.uid
            this.invitedListParams={
                uid : item.uid,
                beginDate : this.startDate,
                endDate : this.endDate
            }
            this.friendShow = true
        },
        closeFriendShow(){
            this.friendShow = false
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
        // 获取列表数据
        getTableData(){
            this.loading = true
            const data = {
                pageNo:this.currentPage,
                pageSize:8,
                beginDate:this.startDate,
                endDate:this.endDate,
            }
            var that = this;
            that.$http.post(process.env.API_ROOT+'/cms/statistic/invite/track',data
            ).then(function(response){
                const datas = response.data;
                if(datas.data!=null){
                    this.tableData = datas.data.list
                    this.totalCount = datas.data.totalCount
                }
                this.loading = false
            },function(error){
                this.loading = false
                // console.log(error)
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
        'friendShow':function(){
            if(this.friendShow == true){
                document.body.style.overflow = "hidden"
            }else{
                document.body.style.overflow = "auto"
            }
        }
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

