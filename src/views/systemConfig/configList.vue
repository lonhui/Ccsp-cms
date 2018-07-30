<template>
    <div class="config">
        <div class="button1">
            <el-button type="primary" @click="add()">{{$t('button.Added')}}</el-button>
        </div>
        <div class="tabl">
            <el-table :data="DataList" border style="width: 100%" v-loading="loading">
                <el-table-column prop="id" width="100px" label="ID"></el-table-column>
                <el-table-column prop="key" label="Key" width="180"></el-table-column>
                <el-table-column prop="value" label="Value" ></el-table-column>
                <el-table-column prop="timestamp" :label="$t('table.date')" ></el-table-column>
                <el-table-column :label="$t('table.status')" width="100">
                    <template slot-scope="scope">
                        <a href="javascript:;">{{scope.row.state==1?$t('table.status1'):$t('table.status0')}}</a>
                    </template>
                </el-table-column>
                <el-table-column :label="$t('table.edit')" width="100">
                    <template slot-scope="scope">
                        <el-button type="text" size="small" @click="bianji(scope.$index,scope.row)">{{$t('table.edit')}}</el-button>
                        <!-- <el-button type="text" size="small" @click="del(scope.$index,scope.row)">{{$t('button.delete')}}</el-button> -->
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="block">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="currentPage1" :page-size="8" layout="total, prev, pager, next" :total="totalCount"></el-pagination>
        </div>
        <v-add v-if="addShow" @on-close="closeAddShow"></v-add>
        <div class="box" v-show="show">
            <div class="centont">
                <table class="table2">
                    <tr>
                        <td><span class="demonstration">ID:</span></td>
                        <td><el-input :placeholder="$t('button.pleaseentercontent')" style="width:80%" v-model="form.id" :disabled="true"></el-input></td>
                    </tr>
                    <tr>
                        <td><span class="demonstration">Key:</span></td>
                        <td><el-input v-model="form.key" :placeholder="$t('button.pleaseentercontent')" style="width:80%"></el-input></td>
                    </tr>
                    <tr>
                        <td><span class="demonstration">Value</span></td>
                        <td><el-input v-model="form.value" :placeholder="$t('button.pleaseentercontent')" style="width:80%"></el-input></td>
                    </tr>
                    <tr>
                        <td><span class="demonstration">{{$t('table.date')}}:</span></td>
                        <td> <el-date-picker v-model="form.timestamp" align="right" type="date" :placeholder="$t('button.selectdate')" :picker-options="pickerOptions1"></el-date-picker></td>
                    </tr>
                    <tr>
                        <td><span class="demonstration">{{$t('table.status')}}:</span></td>
                        <td>
                            <el-select v-model="form.state" :placeholder="$t('button.pleasechoose')">
                                <el-option v-for="item in options" :key="item.state" :label="item.label" :value="item.state">
                                </el-option>
                            </el-select>
                        </td>
                    </tr>
                    <tr>
                        <td></td>
                        <td><el-button type="primary" @click="closeShow">{{$t('button.cancel')}}</el-button>
                            <el-button type="primary" @click="tijiao">{{$t('button.submit')}}</el-button>
                        </td>
                    </tr>
                </table>
            </div>
        </div>
    </div>
</template>

<script>
import add from './components/add'
export default {
    data() {
        return {
            pickerOptions1: {
                disabledDate(time) {
                    return time.getTime() > Date.now();
                },
                shortcuts: [{
                    text: this.$t('message.today'),
                    onClick(picker) {
                    picker.$emit('pick', new Date());
                    }
                }, {
                    text: this.$t('message.yesterday'),
                    onClick(picker) {
                    const date = new Date();
                    date.setTime(date.getTime() - 3600 * 1000 * 24);
                    picker.$emit('pick', date);
                    }
                }, {
                    text: this.$t('message.aweekago'),
                    onClick(picker) {
                    const date = new Date();
                    date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
                    picker.$emit('pick', date);
                    }
                }]
            },
            options: [{
                state: 1,
                label: this.$t('table.status1')
            }, {
                state: 0,
                label: this.$t('table.status0')
            }],
            DataList: [],
            currentPage1: 1,
            totalCount: 0,
            loading:false,
            show:false,
            form:{
                id:null,
                key:null,
                value:null,
                timestamp:null,
                state:null,
            },
            addShow:false,
        }
    },
     components: {
        'v-add': add
        },
     mounted() {
        this.getDataList();
    },
     methods: {
        // 分页
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
      },
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
      },
      bianji(index,row){
        this.idx = index;
        const item = this.DataList[index]
        this.form = {
            id:item.id,
            key:item.key,
            value:item.value,
            timestamp:item.timestamp,
            state:item.state,
        }
        console.log(this.form)
        this.show = true
       
      },
      closeShow(){
          this.show = false
      },
      getDataList() {
          this.loading = true
        var that = this;
        that.$http({
            method:'GET',
            url:'http://ccsp.caping.co.id/cms/set/config/list'+'?pageSize='+8+'&pageNum='+this.currentPage1,
        }).then(function(response){
            console.log(response);
            const datas = response.data
            this.DataList = datas.data.data
            this.totalCount = datas.data.total
            this.loading = false
        },function(error){
            this.loading = false
            console.log(error);
        })
      },
      add(){
         this.addShow = true 
      },
      closeAddShow(){
           this.addShow = false
           this.getDataList()
      },
      tijiao(){
        var that = this;
        that.$http.post('http://ccsp.caping.co.id/cms/set/config/update', this.form
        ).then(function(response){
            console.log(response);
            const datas = response.data;
            if(datas.message==="OK"){
                 this.$message({
                    message: this.$t('message.updateSucc'),
                    type: 'success'
                })
                this.closeShow()
                this.getDataList()
            }else{
                this.$message({
                    message: this.$t('message.fail'),
                    type: 'error'
                })
            }
        },function(error){
            console.log(error);
        })
      }
    },
    watch: {
        'currentPage1': function () {
            this.getDataList()
        },
        'show':function(){
            if(this.show == true){
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
.config{
    width: 80%;
    margin: 20px auto;
}
.box{
    position: fixed;
    z-index: 100;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(7, 17, 27, 0.8);
    overflow-y: auto;
}
.centont{
    width: 450px;
    height: 550px;
    margin: 50px auto;
    border-radius:10px 10px 10px 10px;
    background-color: #fff
}
.table2{
    width: 80%;
    margin: 0 auto;
    line-height: 80px;
    position: relative;
    top: 30px;
}
.button1{
    float: left;
    margin-bottom: 10px;
}
</style>
