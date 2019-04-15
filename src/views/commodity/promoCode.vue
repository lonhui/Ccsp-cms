<template>
<!-- 优惠码管理 -->
    <div class="promoCode">
        <div class="search">
             <div class="shuru">
                 <span class="demonstration">{{$t('table.productname')}}</span>
                 <el-select v-model="value3" :placeholder="$t('button.pleasechoose')">
                    <el-option v-for="item in productname" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
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
            <el-pagination :current-page.sync="currentPage1" :page-size="5" layout="total, prev, pager, next" :total="totalCount"></el-pagination>
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
import {codeExchange,productNameList} from '@/api/commodity'

export default {
    data(){
        return{
            // 商品名称下拉框，查询条件
            productname: [],
            value3: 2,
            // 商品状态下拉款，查询条件
            options1: [{
                value: 1,
                label: this.$t('table.Redeemed')
            }, {
                value: 0,
                label: this.$t('table.Notredeemed')
            }],
            value1: 0,
            // 商品名称下拉框，上传条件
            options: [],
            productId: 1,
            doUpload:process.env.API_ROOT+'/cms/product/code/upload?productId=',
            DataList:[],
            input10:'',
            failureTime:'',
            currentPage1: 1,
            totalCount: 0,
            fileList:[],
            loading:false
        }
    },
    mounted(){
        this.getDataList()
        this.getProductId()
        this.doUpload = process.env.API_ROOT+"/cms/product/code/upload?productId="+this.productId
    },
    methods:{
        getDataList() {
            this.loading = true
            let data = {
                pageSize:5,
                pageNum:this.currentPage1,
                productId:this.value3,
                state:this.value1
            }
            codeExchange(data).then(response => {
                this.DataList = response.data.list
                this.totalCount = response.data.total
                this.loading = false
            },error => {
                this.loading = false
            })
        },
        // 获取下拉商品名称列表
        getProductId(){
            this.productname=[]
            this.options = []
            var that = this;

            // productNameList().then(response => {
            //     // console.log(response)
            //     let list = response
            //     for(let i = 0;i < list.length;i++){
            //         const a = {
            //             value : list[i].id,
            //             label : list[i].name
            //         }
            //         this.options.push(a)

            //         if(a.value != 1){
            //             this.productname.push(a)
            //         }
            //     } 
            // },error => {

            // })

            that.$http.get(process.env.API_ROOT+'/cms/product/simple/list'
            ).then(function(response){
                const datas = response.data
                const list = datas
                for(let i = 0;i < list.length;i++){
                    const a = {
                        value : list[i].id,
                        label : list[i].name
                    }
                    this.options.push(a)

                    if(a.value != 1){
                        this.productname.push(a)
                    }
                } 
            })
        },
        inquire() {
             this.getDataList()
        },
        typeIndex(index) {
            return index + (this.currentPage1 - 1) * 5 + 1
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
             this.doUpload = process.env.API_ROOT+"/cms/product/code/upload?productId="+this.productId
        },
        'failureTime':function(){
            this.doUpload = process.env.API_ROOT+'/cms/product/code/upload?productId='+this.productId+'&expireTime='+this.failureTime
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
