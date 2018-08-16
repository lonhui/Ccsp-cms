<template>
    <div class="eventList">
        <div>
             <span class="demonstration">{{$t('table.startDate')}}</span>
                <el-date-picker v-model="startTime" align="right" type="date" value-format="yyyy-MM-dd" :picker-options="pickerOptions1"></el-date-picker>
             <span class="demonstration">{{$t('table.endDate')}}</span>
                <el-date-picker v-model="endTime" align="right" type="date" value-format="yyyy-MM-dd" :picker-options="pickerOptions1"></el-date-picker>
                <el-button icon="el-icon-search" @click="inquire" circle></el-button>
                <!-- <el-popover placement="top" width="160" v-model="visible2">
                    <p>{{$t('message.Apakahdihapus')}}</p>
                    <div style="text-align: right; margin: 0">
                        <el-button size="mini" type="text" @click="visible2 = false">{{$t('button.cancel')}}</el-button>
                        <el-button type="primary" size="mini" @click="visible2 = false">{{$t('button.confirm')}}</el-button>
                    </div>
                    <el-button slot="reference" type="danger" class="del">{{$t('button.delete')}}</el-button>
                </el-popover>-->
                <!-- <el-button type="primary" class="add" @click="openAddShow">{{$t('button.addto')}}</el-button>  -->
        </div>
      
        <div class="biaoge">
             <el-table :data="tableData3"  ref="multipleTable" border style="width: 100%" v-loading="loading" >
                 <!-- tooltip-effect="dark"  @selection-change="handleSelectionChange" -->
                <!-- <el-table-column type="selection" width="55"></el-table-column> -->
                <!-- <el-table-column prop="keyId" :label="$t('table.Eventnumber')" width='120px'></el-table-column> -->
                <el-table-column prop="intro" :label="$t('table.Eventname')" width="200"></el-table-column>
                <el-table-column prop="title" :label="$t('table.title')" width="200"></el-table-column>
                <el-table-column prop="totalCoin" :label="$t('button.integral')" width='150px'></el-table-column>
                <el-table-column prop="totalCount" :label="$t('table.Totalnumberofparticipants')" ></el-table-column>
                <el-table-column prop="totalPer" :label="$t('table.Totalnumberofparticipation')" ></el-table-column>
               <!-- <el-table-column :label="$t('table.actions')" width='80px'>
                    <template slot-scope="scope">
                        <el-button type="text" size="small" @click="openUpdateShow(scope.$index,scope.row)">{{$t('button.edit')}}</el-button>
                    </template>
                </el-table-column> -->
            </el-table>
        </div>
         
        <div class="box" v-if="updateShow">
            <div class="centont">
                <table class="table1">
                    <tr>
                        <td><span class="demonstration">{{$t('table.Eventname')}}:</span></td>
                        <td><el-input :placeholder="$t('button.pleaseentercontent')" style="width:80%"  v-model="form.intro"></el-input></td>
                    </tr>
                    <tr>
                        <td><span class="demonstration">{{$t('button.integral')}}:</span></td>
                        <td><el-input v-model="form.coin" :placeholder="$t('button.pleaseentercontent')" type="number" :disabled="true" style="width:80%"></el-input></td>
                    </tr>
                    <tr>
                        <td></td>
                        <td>
                            <el-button type="primary" @click="closeUpdateShow">{{$t('button.cancel')}}</el-button>
                            <el-button type="primary">{{$t('button.submit')}}</el-button>
                        </td>
                    </tr>
                </table>
            </div>
        </div>
        <div>
            <v-add v-if="addShow" @on-close="closeAddShow"></v-add>
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
        tableData3: [],
        multipleSelection: [],
        updateShow:false,
        form:{},
        startTime:'',
        endTime:'',
        loading:false,
        addShow:false,
        multipleSelection:[],
        visible2: false,
      }
    },
    components: {
        'v-add':add
    },
    mounted(){
        this.endTime = this.getEndTime()
        this.startTime = this.getStartTime()
        this.getEventList()
    },
    methods: {
        openAddShow(){
            this.addShow = true
        },
        closeAddShow(){
            this.addShow = false
        },
        handleSelectionChange(val) {
                this.multipleSelection = val;
        },
        getEventList(){
            this.openFullScreen()
            var that = this;
            that.$http({
                method:'GET',
                url:'http://ccsp.caping.co.id/cms/statistic/event'+'?startTime='+this.startTime+'&endTime='+this.endTime
            }).then(function(response){
                const datas = response.data
                this.tableData3 = datas.data.data
                this.totalCount = datas.data.totalCount
                this.closeFullScreen()
            },function(error){
                this.closeFullScreen()
                // console.log(error)
            })
        },
        openFullScreen() {
            this.loading = true;
        },
        closeFullScreen(){
            this.loading = false
            this.loading = false;
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
        openUpdateShow(index,row){
            this.idx = index;
            const item = this.tableData3[index]
            this.form = {
                intro:item.intro,
                coin:item.coin,
                timestamp:item.timestamp
            }
            this.updateShow = true
        },
        closeUpdateShow(){
            this.updateShow = false
        },
        //查询
        inquire(){
            if(this.currentPage==1){
                this.getEventList()
            }else{
                this.currentPage=1
            }
        }
    }
}
</script>

<style scoped>
.eventList{
    width: 80%;
    margin: 20px auto 0;
}
.box{
    position: fixed;
    z-index: 100;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(7, 17, 27, 0.8)
}
.centont{
    width: 500px;
    margin: 100px auto;
    border-radius:10px 10px 10px 10px;
    background-color: #fff
}
.table1{
    width: 80%;
    margin: 0 auto;
    line-height: 80px;
    position: relative;
    top: 15px;
    padding-bottom: 30px;
}
.button1{
    float: right;
}
.biaoge{
    margin-top: 20px;
}
.button{
   float: right;
}
.add{
    float: right;
    margin-right: 10px;
}
.del{
    float: right;
}
</style>

