<template>
    <div id="commodityExchange">
        <div class="search">
            <div class="startDate">
                <span class="demonstration">{{$t('table.startDate')}}：</span>
                <el-date-picker v-model="startDate" align="right" type="date" value-format="yyyy-MM-dd" :picker-options="pickerOptions1"></el-date-picker>
            </div>
            <div class="endDate">
                <span class="demonstration">{{$t('table.endDate')}}：</span>
                <el-date-picker v-model="endDate" align="right" type="date" value-format="yyyy-MM-dd" :picker-options="pickerOptions1"></el-date-picker>
            </div>
            <el-button icon="el-icon-search" circle @click="getDataList"></el-button>
        </div>
        <div class="table">
            <el-table :data="DataList" border style="width: 100%" v-loading="loading">
                <el-table-column type="index" :index="typeIndex" width="100px" :label="$t('table.no')"></el-table-column>
                <el-table-column prop="productName" :label="$t('table.productname')"></el-table-column>
                <el-table-column prop="personCount" :label="$t('table.Exchangenumber')" width="150px"></el-table-column>
                <el-table-column prop="time" :label="$t('table.date')" width="120px"></el-table-column>
            </el-table>
        </div>
        <div class="block">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-size="10" layout="total, prev, pager, next" :total="totalCount"></el-pagination>
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
            startDate:'',
            endDate:'',
            DataList:[],
            currentPage: 1,
            totalCount: 0,
            loading:false
        }
    },
     mounted() {
        this.endDate = this.getEndTime()
        this.startDate = this.getStartTime()
        this.getDataList()
    },
    methods:{
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
        // 分页
        handleSizeChange(val) {
            // console.log(`每页 ${val} 条`);
        },
        handleCurrentChange(val) {
            // console.log(`当前页: ${val}`);
        },
        typeIndex(index) {
            return index + (this.currentPage - 1) * 10 + 1
        },
        table(val) {
            this.currentPage = val
        },
        getDataList(){
            this.loading = true
            const   data='?startTime='+this.startDate+'&endTime='+this.endDate+'&pageNum='+this.currentPage+'&pageSize='+10
            this.$http({
                method:'post',
                url:'http://ccsp.caping.co.id/cms/product/order/count'+data,
                headers:{
                    'Content-Type':'application/json'
                }
            }).then(function(response){
                const datas = response.data
                this.DataList = datas.data.list
                this.totalCount = datas.data.total
                this.loading = false
            },function(error){
                // console.log(error)
            })
        }
    },
    watch:{
        'currentPage':function(){
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
    width: 330px;
    float: left;
}
.endDate{
    width: 330px;
    float: left;
}
</style>
