<template>
    <div id="userList">
        <div v-if="!show" class="list">
            <div class="search">
                <el-input :placeholder="$t('button.enteruid')" v-model="inputData" clearable style="width:200px"></el-input>
                <el-button icon="el-icon-search" circle @click="getUserDatas"></el-button>
            </div>
            <div>
                <el-table :data="userDatas" border style="width: 70%" v-loading="loading">
                    <el-table-column type="index" :index="typeIndex" cc :label="$t('table.no')" width="70"></el-table-column>
                    <el-table-column prop="uid" :label="$t('table.userID')" width="110"></el-table-column>
                    <el-table-column prop="total_coin" :label="$t('table.Totalnumberofpoints')" width="140"></el-table-column>
                    <el-table-column prop="total_money" :label="$t('table.totalnumberofgoldcoins')"></el-table-column>
                    <el-table-column prop="create_time" :label="$t('table.useractivationtime')" width="160"></el-table-column>
                    <el-table-column prop="total_invite_user" :label="$t('table.invitedusers')" width="140"></el-table-column>
                    <el-table-column :label="$t('table.detail')" width="110">
                        <template slot-scope="scope">
                            <el-button type="text" size="small" @click="openDetailShow(scope.$index,scope.row)">{{$t('table.seedetails')}}</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div>
                <div class="block" >
                    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="currentPage1" :page-size="8" layout="total, prev, pager, next" :total="totalCount"></el-pagination>
                </div>
            </div>
        </div>
        <v-detail v-if="show" @on-close="closeDetailShow" v-bind:datas="datas"></v-detail>
    </div>
</template>

<script>
import detail from './components/detail'

export default {
    components: {
        'v-detail': detail
    },
    data() {
        return {
            // 子组件参数
            show:false,
            datas:{},
            // 分页参数
            currentPage1: 1,
            totalCount: 0,
            // 表格数据
            userDatas: [],
            // 加载参数
            loading:false,
            //搜索框数据
            inputData:null,
        }
    },
    mounted(){
        this.getUserDatas()
    },
    methods: {
        // 分页
        handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
        },
        handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
        },
        // 子组件操作
        openDetailShow(index,row) {
            const item = this.userDatas[index]
            this.datas = {
                id: item.id,
                uid: item.uid,
                os: item.os,
                os_version: item.os_version,
                coin: item.total_coin,
                money: item.total_money,
                version: item.version
            }
            this.show = true
        },
        closeDetailShow() {
            this.show = false
        },
        // 获取表格数据
        getUserDatas() {
            this.loading = true
            var that = this
            that.$http.post('http://ccsp.caping.co.id/cms/user/page', {pageSize:8,pageNum:this.currentPage1,uid:Number(this.inputData)}
            ).then(function(response){
                console.log(response);
                const datas = response.data;
                this.userDatas = datas.data.list
                this.totalCount = datas.data.totalCount
                this.loading = false
            },function(error){
                this.loading = false
                console.log(error);
            })
        },
        // 序号
        typeIndex(index) {
            return index + (this.currentPage1 - 1) * 8 + 1
        },
        table(val) {
            this.currentPage1 = val
        }
    },
    watch: {
        'currentPage1': function () {
            this.getUserDatas()
        }
    }
}
</script>

<style scoped>
#userList{
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
