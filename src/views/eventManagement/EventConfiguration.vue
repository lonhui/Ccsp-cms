<template>
    <div class="box1">
        <div class="centont">
            <div class="tab1">
                <el-table :data="tableData" border>
                    <el-table-column prop="id" label="ID" width="50"></el-table-column>
                    <el-table-column prop="type" :label="$t('table.type')" width="80"></el-table-column>
                    <el-table-column prop="key" label="KEY" width="130"></el-table-column>
                    <el-table-column prop="comment" :label="$t('table.description')"></el-table-column>
                    <el-table-column prop="addtime" :label="$t('table.addtime')" width="110"></el-table-column>
                    <!-- <el-table-column prop="isShowingMobile" label="isShowingMobile"></el-table-column> -->
                    <!-- <el-table-column prop="detail" label="detail"></el-table-column> -->
                    <el-table-column prop="status" :label="$t('table.status')" width="90">
                        <template slot-scope="scope">
                            <a href="javascript:;">{{scope.row.status==0?$t('table.Removed'):$t('table.normal')}}</a>
                        </template>
                    </el-table-column>
                    <el-table-column prop="title" :label="$t('table.title')" width="200"></el-table-column>
                    <el-table-column prop="intro" :label="$t('table.Eventname')" width="100"></el-table-column>
                    <el-table-column :label="$t('table.actions')" width='80px'>
                        <template slot-scope="scope">
                            <el-button type="text" size="small" @click="openUpdataShow(scope.$index,scope.row) ">{{$t('button.edit')}}</el-button>
                        </template>
                </el-table-column>
                </el-table>
            </div>
             <div class="block">
                <el-pagination :current-page.sync="currentPage1" :page-size="6" layout="total, prev, pager, next" :total="totalCount"></el-pagination>
            </div>
            <div>
                <v-updata v-if="updataShow" @on-close="closeUpdataShow" :data='data'></v-updata>
            </div>
        </div>
    </div>
</template>

<script>
import updata from './components/updata'
import {eventConfigList} from '@/api/event'

export default {
    data() {
        return{
            totalCount:1,
            currentPage1:0,
            tableData:[],
            updataShow:false,
            data:{}
        }
    },
    components: {
        'v-updata':updata
    },
    mounted(){
        this.getData()
    },
    methods:{
        openUpdataShow(index,row){
            const item = this.tableData[index]
            this.data = {
                id : item.id,
                status : item.status,
                intro : item.intro
            }
            this.updataShow = true
        },
        closeUpdataShow(){
            this.updataShow = false
            this.getData()
        },
        getData(){
            let data = {
                pageSize:6,
                pageNum:this.currentPage1
            }
            eventConfigList(data).then(response => {
                this.tableData = response.data.data
                this.totalCount = response.data.total
            },error => {

            })
        }
    },
    watch:{
        'currentPage1':function(){
            this.getData()
        },
        'updataShow':function(){
            if(this.updataShow == true){
                document.body.style.overflow = "hidden"
            }else{
                document.body.style.overflow = "auto"
            }
        }
    }
    
}
</script>

<style scoped>
.centont{
    width: 100%;
    height: 100%;
    margin-top:20px;
    margin-left: 120px;
    background-color: #fff
}
.table1{
    width: 95%;
    margin: 0 auto;
}
table{
    line-height: 80px;
    margin: 0 auto;
}
.tab1{
    padding-top: 30px;
    width: 80%;
}
</style>
