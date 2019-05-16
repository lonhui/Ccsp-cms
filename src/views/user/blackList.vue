<template>
    <div id="blackList">
        <div class="list">
            <div class="search">
                <!-- id搜索框 -->
                <el-input :placeholder="$t('button.enteruid')" v-model="inputData" clearable style="width:200px"></el-input>
                <!-- 搜索按钮 -->
                <el-button icon="el-icon-search" circle @click="getTableDate"></el-button>
            </div>
            <div>
                <el-table id="table_v" :data="blackListDatas" border v-loading="loading">
                    <el-table-column align="center" prop="user_id" :label="$t('table.userID')" m-width="110"></el-table-column>
                    <el-table-column align="center" prop="remark" :label="$t('table.description')" m-width="110"></el-table-column>
                    <el-table-column align="center" prop="total_count" :label="$t('table.numberOfPointsEarned')" m-width="110"></el-table-column>
                    <el-table-column align="center" prop="create_time" :label="$t('table.blackTime')" m-width="140"></el-table-column>
                    <el-table-column align="center" :label="$t('table.actions')" m-width="110">
                        <template slot-scope="scope">
                            <el-button type="primary" @click="unblock(scope.row)" >{{$t('table.unblock')}}</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div>
                <div class="block" >
                    <el-pagination 
                      @current-change="handleCurrentChange"
                      :current-page.sync="currentPage" 
                      :page-size="10" 
                      layout="total, prev, pager, next" 
                      :total="totalCount">
                    </el-pagination>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import {getBlackList,unblock} from "@/api/user"

export default {
    data() {
        return {
            blackListDatas:[],
            currentPage:1,
            totalCount:100,
            loading:false,
            inputData:null,
        }
    },
    mounted(){
        this.getTableDate()
    },
    methods: {
        getTableDate(){
            let data = {
                pageNum:this.currentPage,
                pageSize:10
            }
            this.inputData && this.inputData !== '' ? data.uid = this.inputData : null
            getBlackList(data).then(res => {
                if(res.code === 0){
                   this.blackListDatas = res.data.list
                   this.totalCount = res.data.totalCount
                }
            })
        },
        unblock(row){
            unblock({uid:row.user_id}).then(res => {
                if(res.code === 0){
                    this.$message({
                        message: this.$t('message.unblocksuss'),
                        type: 'success'
                    });
                    this.getTableDate()
                }else{
                    this.$message.error(res.message);
                }
            })
        },
        handleCurrentChange(val) {
            this.getTableDate()
        },
    }
}
</script>

<style scoped>
#blackList{
    width: 90%;
    margin-top: 20px;
    margin-left: 40px;
    overflow-x:hidden;
    overflow-y:hidden;
}
.list{
    margin-left: 50px;
}
body {
    overflow-x:hidden;
    overflow-y:hidden;
}
.search{
    margin-bottom: 10px;
}
</style>
