<template>
    <div class="promoCode">
        <div class="search">
            <div>
                <span class="demonstration">{{$t('table.startDate')}}</span>
                <el-date-picker v-model="startTime" align="right" type="date" value-format="yyyy-MM-dd" :picker-options="pickerOptions1" style="width:200px"></el-date-picker>
            <span class="demonstration">{{$t('table.endDate')}}</span>
                <el-date-picker v-model="endTime" align="right" type="date" value-format="yyyy-MM-dd" :picker-options="pickerOptions1" style="width:200px"></el-date-picker>
            </div>
             <div class="shuru">
                 <span class="demonstration">{{$t('table.productname')}}</span>
                <el-input :placeholder="$t('button.pleaseentercontent')" v-model="input10" style="width:200px" clearable></el-input>
                <span class="demonstration" >{{$t('table.Exchangestatus')}}</span>
                <el-select v-model="value1" :placeholder="$t('button.pleasechoose')">
                    <el-option v-for="item in options1" :key="item.value" :label="item.label" :value="item.value" :disabled="item.disabled"></el-option>
                </el-select>
                <el-button icon="el-icon-search" @click="inquire" circle></el-button>
             </div>
            
        </div>
        <div class="biaoge">
            <el-table :data="DataList" border style="width: 100%" v-loading="loading">
                  <el-table-column type="index" :index="typeIndex" width="100px" :label="$t('table.id')"></el-table-column>
                  <el-table-column prop="code" :label="$t('table.PromoCode')"></el-table-column>
                  <el-table-column :label="$t('table.Exchangestatus')" >
                        <template slot-scope="scope">
                            <a href="javascript:;">{{scope.row.state===1?$t('table.Redeemed'):$t('table.Notredeemed')}}</a>
                        </template>
                  </el-table-column>
                  <el-table-column prop="productName" :label="$t('table.productname')" ></el-table-column>
                   <el-table-column prop="createTime" :label="$t('table.createTime')" ></el-table-column>
            </el-table>
        </div>
        <div class="block">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="currentPage1" :page-size="5" layout="total, prev, pager, next" :total="totalCount"></el-pagination>
        </div>
        <div class="upload">
             <div class="upload_id">
                <div class="productName">
                    <span class="demonstration">{{$t('table.uploadcouponcode')}}：</span>
                    <el-select v-model="productId" :placeholder="$t('table.uploadcouponcode')">
                        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </div>  
                <div class="failureTime">
                    <span class="demonstration">{{$t('button.Expiration')}}：</span>
                    <el-date-picker v-model="failureTime" @change="getSTime"  type="datetime" :placeholder="$t('button.Selectdatetime')"></el-date-picker>
                </div>
            </div>
            <div class="shangchuan">
                <el-upload class="upload-file" drag :action="doUpload" >
                    <i class="el-icon-upload"></i>
                    <div class="el-upload__text">{{$t('table.Dragfileheror')}}<em> {{$t('table.clickUpload')}}</em></div>
                </el-upload>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data(){
        return{
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
            options1: [{
                value: 1,
                label: this.$t('table.Redeemed')
            }, {
                value: 0,
                label: this.$t('table.Notredeemed')
            }],
            value1: 0,
            options: [],
            productId: 1,
            doUpload:'http://ccsp.caping.co.id/cms/product/code/upload?productId=',
            DataList:[],
            input10:'',
            startTime:'',
            failureTime:'',
            endTime:'',
            currentPage1: 1,
            totalCount: 0,
            fileList:[],
            loading:false
        }
    },
    mounted(){
        this.endTime = this.getEndTime()
        this.startTime = this.getStartTime()
        this.getDataList()
        this.getProductId()
        this.doUpload = "http://ccsp.caping.co.id/cms/product/code/upload?productId="+this.productId
    },
    methods:{
        getDataList() {
            this.loading = true
            const data = {
                pageNum:this.currentPage1,
                pageSize:10,
                startTime:this.startTime,
                endTime:this.endTime
            }
            var that = this;
            that.$http({
                method:'GET',
                url:'http://ccsp.caping.co.id/cms/product/code/list'+'?pageSize='+5+'&pageNum='+this.currentPage1+'&startTime='+this.startTime+'&endTime='+this.endTime+'&productName='+this.input10+'&state='+this.value1,
            }).then(function(response){
                console.log(response);
                const datas = response.data;
                this.DataList = datas.data.list
                this.totalCount = datas.data.total
                this.loading = false
            },function(error){
                this.loading = false
                console.log(error);
            })
        },
        getProductId(){
            this.options = []
            var that = this;
            that.$http.get('http://ccsp.caping.co.id/cms/product/list'
            ).then(function(response){
                console.log(response)
                const datas = response.data
                const list = datas.data.data
                for(let i = 0;i < list.length;i++){
                    const a = {
                        value : list[i].id,
                        label : list[i].name
                    }
                    this.options.push(a)
                } 
            },function(error){
                console.log(error)
            })
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
        inquire() {
             this.getDataList()
        },
        typeIndex(index) {
            return index + (this.currentPage1 - 1) * 5 + 1
        },
          // 分页
        handleSizeChange(val) {
            console.log(`每页 ${val} 条`);
        },
        handleCurrentChange(val) {
            console.log(`当前页: ${val}`);
        },
        //上传
        handleRemove(file, fileList) {
            console.log(file, fileList);
        },
        handlePreview(file) {
            console.log(file);
        },
        getSTime(val){
            const ts = (val+'').split(' ')
            const Year = ts[3]
            var Moth = ''
            if(ts[1]==='Jan'){
                 Moth = '01'
            }else if(ts[1]==='Feb'){
                Moth = '02'
            }else if(ts[1]==='Mar'){
                Moth = '03'
            }else if(ts[1]==='Apr'){
                Moth = '04'
            }else if(ts[1]==='May'){
                Moth = '05'
            }else if(ts[1]==='Jun'){
                Moth = '06'
            }else if(ts[1]==='Jul'){
                Moth = '07'
            }else if(ts[1]==='Aug'){
                Moth = '08'
            }else if(ts[1]==='Sep'){
                Moth = '09'
            }else if(ts[1]==='Oct'){
                Moth = '10'
            }else if(ts[1]==='Nov'){
                Moth = '11'
            }else if(ts[1]==='Dec'){
                Moth = '12'
            }
            const Day = ts[2]
            const time = ts[4]
            this.failureTime = Year + '-' + Moth + '-' + Day + ' ' + time
        }
    },
    watch:{
        'currentPage1':function(){
            this.getDataList()
        },
        'productId':function(){
             this.doUpload = "http://ccsp.caping.co.id/cms/product/code/upload?productId="+this.productId
        },
        'failureTime':function(){
            this.doUpload = 'http://ccsp.caping.co.id/cms/product/code/upload?productId='+this.productId+'&expireTime='+this.failureTime
        }
    }
}
</script>

<style scoped>
.promoCode{
    width: 85%;
    margin: 30px auto;
}
.chaxun .form-control,.chaxun div{
    width: 200px;
    margin-right: 10px;
}
.chaxun{
    height:120px; 
    float: right;  
}
.biaoge{
    margin-top:20px;
}
.button{
    width: 50px;
    float: right;
   margin-top: 25px;
   margin-left: 20px;
 
}
.shuru{
    margin-top: 10px;
}
.upload{
    margin-top: 10px;
    border: 2px #ddd solid;
    width: 480px;
    height: 280px;
    border-radius:10px 10px 10px 10px;
}
.upload_id,.shangchuan{
    width: 450px;
    margin: 10px auto 0;
}
.productName{
    width: 230px;
    height: 60px;
    float: left;
}
.failureTime{
    width: 200px;
    height: 60px;
    float: left;
}
</style>
