<template>
    <div class="admin">
       <div class="button">
           <div class="button-button">
               <el-button type="primary" @click="openAddShow">+{{$t('button.addto')}}</el-button>
           </div>
           <!-- <div class="input">
               <el-input placeholder="搜索用户名、真实姓名" v-model="input10" clearable style="width:200px"></el-input>
               <el-button icon="el-icon-search" circle></el-button>
           </div> -->
       </div>
       <div class="table1">
            <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%" v-loading="loading" @selection-change="handleSelectionChange">
                <el-table-column type="index" :index="typeIndex" width="100px" :label="$t('table.id')"></el-table-column>
                <el-table-column prop="description" :label="$t('table.roleName')"></el-table-column>
                <el-table-column prop="name" :label="$t('table.actualname')"></el-table-column>
                <el-table-column :label="$t('table.AccountStatus')">
                    <template slot-scope="scope">
                        <a href="javascript:;">{{scope.row.status==1?$t('table.Enabled'):$t('table.Disabled')}}</a>
                    </template>
                </el-table-column>
                <el-table-column :label="$t('table.actions')">
                    <template slot-scope="scope">
                        <el-button type="text" size="small" @click="openUpdataShow(scope.$index,scope.row)">{{$t('table.edit')}}</el-button>
                    </template>
                </el-table-column>
            </el-table>
       </div>
       <div class="block">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="currentPage1" :page-size="8" layout="total, prev, pager, next" :total="totalCount"></el-pagination>
        </div>
        <v-add v-if="addShow" @on-close="closeAddShow"></v-add>
        <v-updata v-if="updataShow" @on-close="closeUpdataShow" v-bind:datas="datas"></v-updata>
    </div>    
</template>

<script>
import  add from './components/add'
import  updata from './components/updata'
import { getToken } from '@/utils/auth'

export default {
    data() {
        return{
            tableData:[],
            input10:'',
            multipleSelection: [],
            currentPage1: 1,
            totalCount: 0,
            addShow:false,
            updataShow:false,
            datas:[],
            loading:false
        }
    },
    components: {
        'v-add': add,
        'v-updata':updata,
    },
    mounted(){
        this.getadminList()
    },
    methods: {
      openUpdataShow(index,row){
        const item = this.tableData[index]
        this.datas = {
            id:item.id,
            role_id: item.role_id,
            name: item.name,
            status: item.status,
            account: item.account,
            password: item.password,
        }
        this.updataShow = true
    },
      closeUpdataShow(){
          this.updataShow = false
          this.getadminList()
      },
      openAddShow(){
          this.addShow = true
      },
      closeAddShow(){
          this.addShow = false
          this.getadminList()
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
       typeIndex(index) {
        return index + (this.currentPage1 - 1) * 8 + 1
       },
         // 分页
      handleSizeChange(val) {
        // console.log(`每页 ${val} 条`);
      },
      handleCurrentChange(val) {
        // console.log(`当前页: ${val}`);
      },
      getadminList(){
           const token = getToken()
          this.loading = true
            const data = {
                pageNo:this.currentPage1,
                pageSize:8,
        }
            this.$http.post('http://ccsp.caping.co.id/cms/sys/user/list',data,{'headers':{
                'X-abn-session-token':token
            }}
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
      }
    },
     watch: {
    'currentPage1': function () {
      this.getadminList()
    },
    'updataShow':function(){
        if(this.updataShow == true){
            document.body.style.overflow = "hidden"
        }else{
            document.body.style.overflow = "auto"
        }
    },
    'addShow':function(){
        if(this.addShow == true){
            document.body.style.overflow = "hidden"
        }else{
            document.body.style.overflow = "auto"
        }
    }
  }
}
</script>

<style scoped>
.admin{
    width: 85%;
    margin: 20px auto;
}
.button{
    height: 60px;
}
.input{
    float: right;
}
.button-button{
    float: left;
}
</style>

