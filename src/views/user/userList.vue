<template>
    <div id="userList">
        <div v-if="!show" class="list">
            <div class="search">
                <!-- id搜索框 -->
                <el-input :placeholder="$t('button.enteruid')" v-model="inputData" clearable style="width:200px"></el-input>
                <!-- 搜索按钮 -->
                <el-button icon="el-icon-search" circle @click="getUserDatas"></el-button>
                <!-- 导出Excel -->
                <el-button type="primary" 
                    icon="el-icon-download" 
                    @click="$exportExcel('table_v',$t('route.userlist'))">
                    {{$t('button.exportExcel')}}
                </el-button>
            </div>
            <div>
                <el-table id="table_v" :data="userDatas" border v-loading="loading">
                    <el-table-column align="center" type="index" :index="typeIndex" :label="$t('table.no')" m-width="100"></el-table-column>
                    <el-table-column align="center" prop="uid" :label="$t('table.userID')" m-width="110"></el-table-column>
                    <el-table-column align="center" prop="total_coin" :label="$t('table.Totalnumberofpoints')" m-width="140"></el-table-column>
                    <el-table-column align="center" prop="total_money" :label="$t('table.totalnumberofgoldcoins')"></el-table-column>
                    <el-table-column align="center" prop="create_time" :label="$t('table.useractivationtime')" m-width="170"></el-table-column>
                    <el-table-column align="center" prop="total_invite_user" :label="$t('table.invitedusers')" m-width="140"></el-table-column>
                    <el-table-column align="center" :label="$t('table.detail')" m-width="110">
                        <template slot-scope="scope">
                            <el-button type="primary" plain size="small" @click="openDetailShow(scope.$index,scope.row)">{{$t('table.seedetails')}}</el-button>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" :label="$t('table.actions')" m-width="110">
                        <template slot-scope="scope">
                            <el-popover placement="left" m-width="220" trigger="manual" :ref="'popover-' + scope.row.id">
                                <el-button size="mini" type="text"  @click="pClose(scope.row.id)">{{$t('button.cancel')}}</el-button>
                                <p style="text-align: center;margin: 15px 0px">{{$t('message.chooseTheLengthOfBlack')}}</p>
                                <div style="text-align: center; margin: 0">
                                    
                                    <el-button size="mini" type="primary"  @click="addtoblacklist(scope.row,1)">3{{$t('button.day')}}</el-button>
                                    <el-button size="mini" type="danger" @click="addtoblacklist(scope.row,2)">{{$t('button.permanent')}}</el-button>
                                </div>
                                <el-button  type="warning" plain slot="reference" @click="pOpen(scope.row.id)">{{$t('table.black')}}</el-button>
                            </el-popover>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div>
                <div class="block" >
                    <el-pagination :current-page.sync="currentPage1" :page-size="10" layout="total, prev, pager, next" :total="totalCount"></el-pagination>
                </div>
            </div>
        </div>
        <!-- 用户详情 -->
        <v-detail v-if="show" @on-close="closeDetailShow" v-bind:datas="datas"></v-detail>
    </div>
</template>

<script>
import detail from './components/detail'
import {getUserList,setBlackList} from '@/api/user'

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
            userDatas: [],// 表格数据
            loading:false,// 加载参数
            inputData:null, //搜索框数据
        }
    },
    mounted(){
        this.getUserDatas()
    },
    methods: {
        pOpen(id){
            this.$refs[`popover-` + id].doShow()
        },
        pClose(id){
            this.$refs[`popover-` + id].doClose()
        },
        // 加入黑名单
        addtoblacklist(row,type){
            this.$refs[`popover-` + row.id].doClose()
            let data = {
                uid : row.uid,
                type : type
            }
            setBlackList(data).then(res => {
                if(res.code === 0){
                    this.$message({
                        message: row.uid + ' ' + this.$t('message.addblocksuss'),
                        type: 'success'
                    });
                    this.getUserDatas()
                }else{
                    this.$message.error(res.message )
                }
            })
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
            let data={
                pageSize:10,
                pageNum:this.currentPage1,
                uid:Number(this.inputData)
            }
            getUserList(data).then(response=>{
                const datas = response;
                this.userDatas = datas.data.list
                this.totalCount = datas.data.totalCount
                this.loading = false
            },(error)=>{
                this.loading = false
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
