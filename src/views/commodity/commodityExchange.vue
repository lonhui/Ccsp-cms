<template>
<!-- 商品兑换 -->
    <div id="commodityExchange">
        <div v-if="!redemptionDetailsShow">
            <div class="search">
                <el-date-picker
                    v-model="timeInterval"
                    value-format="yyyy-MM-dd"
                    type="daterange"
                    align="right"
                    @change="search(timeInterval)"
                    unlink-panels
                    range-separator="-"
                    :start-placeholder="this.$t('table.startDate')"
                    :end-placeholder="this.$t('table.endDate')"
                    :picker-options="pickerOptions">
                </el-date-picker>
                <span class="demonstration">{{$t('table.productname')}}：</span>
                <el-select v-model="value" :placeholder="$t('button.pleasechoose')">
                    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
            </div>
            <div class="table">
                <el-table :data="DataList" border style="width: 100%" v-loading="loading">
                    <el-table-column type="index" :index="typeIndex" width="100px" :label="$t('table.no')"></el-table-column>
                    <el-table-column prop="productName" :label="$t('table.productname')"></el-table-column>
                    <el-table-column prop="personCount" :label="$t('table.Exchangenumber')" width="150px"></el-table-column>
                    <el-table-column prop="time" :label="$t('table.date')" width="120px"></el-table-column>
                    <el-table-column :label="$t('table.detail')" width="120">
                            <template slot-scope="scope">
                                <el-button type="text" size="small" @click="openDetailsShow(scope.$index,scope.row)">{{$t('table.seedetails')}}</el-button>
                            </template>
                        </el-table-column>
                </el-table>
            </div>
            <div class="block">
                <el-pagination :current-page.sync="currentPage" :page-size="10" layout="total, prev, pager, next" :total="totalCount"></el-pagination>
            </div>
        </div>
        <div class="component">
            <v-redemptionDetails v-if="redemptionDetailsShow" :data = redemptionDetailsParams @on-close='redemptionDetailsShow = false'></v-redemptionDetails>
        </div>
    </div>
</template>

<script>
import redemptionDetails from './components/redemptionDetails'
import {productExchange} from '@/api/commodity'

export default {
    data(){
        return{
            pickerOptions: {
                disabledDate(time) {
                    return time.getTime() > Date.now();
                }
            },
            timeInterval:['',''],
            startDate:'',
            endDate:'',
            DataList:[],
            currentPage: 1,
            totalCount: 0,
            loading:false,
            options: [],
            value: 0,
            redemptionDetailsParams:{},
            redemptionDetailsShow:false
        }
    },
    components:{
        'v-redemptionDetails':redemptionDetails
    },
     mounted() {
        this.endDate = this.getEndTime()
        this.startDate = this.getStartTime()
        this.timeInterval = [this.startDate,this.endDate]
        this.getProductId()
        this.getDataList()
    },
    methods:{
        search(timeInterval){
            this.endDate = timeInterval[1]
            this.startDate = timeInterval[0]
            if(this.currentPage === 1){
                this.getDataList()
            }else{
                this.currentPage = 1
            }
        },
        openDetailsShow($index,row){
            this.redemptionDetailsParams = {
                productId:row.productId,
                startTime:this.startDate,
                endTime:this.endDate,
                pageNum:10,
                currentPage:1
            }
            this.redemptionDetailsShow = true
        },
        // 获取时间
        getEndTime() {
            const d = new Date()
            const myday = new Date(d-24*3600*1000)
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
        typeIndex(index) {
            return index + (this.currentPage - 1) * 10 + 1
        },
        table(val) {
            this.currentPage = val
        },
        getDataList(){
            this.loading = true
            let dataq = {
                startTime:this.startDate,
                endTime:this.endDate,
                productId:this.value,
                pageNum:this.currentPage,
                pageSize:10
            }
            productExchange(dataq).then(response => {
                const datas = response.data
                this.DataList = datas.list
                this.totalCount = datas.total
                this.loading = false
            },error =>{

            })
        },
        // 获取下拉商品名称列表
        getProductId(){
            this.options = [{
                    value:0,
                    label:this.$t('button.selectAll')
                }]
            var that = this;
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
                } 
            })
        },
    },
    watch:{
        'currentPage':function(){
            this.getDataList()
        },
        'value': function(){
            this.getDataList()
        }
    }

}
</script>

<style scoped>
#commodityExchange{
    margin-left: 100px;
    margin-top: 20px;
}
.table{
    margin-top: 20px;
    width: 80%;
}
.startDate{
    width: 75%;
    float: left;
}
.block{
    margin-bottom: 200px
}
</style>
