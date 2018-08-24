<template>
<!-- 兑换详情 -->
    <div>
        <button class="esc"><img src="../../../assets/esc_t.png" @click="closeDetailsShow"></button>
        <div class="table">
            <el-table :data="tableData" border height='600' style="width: 900px">
                <el-table-column prop="uid" :label="$t('table.RedeemerID')" width="200"></el-table-column>
                <el-table-column prop="state" :label="$t('table.Exchangestatus')" width="200">
                    <template slot-scope="scope">
                        <a href="javascript:;">{{scope.row.state==1?$t('message.succ'):$t('message.fail')}}</a>
                    </template>
                </el-table-column>
                <el-table-column prop="mobile" :label="$t('table.Exchangephonenumber')+'/'+$t('table.Redemptioncode')"></el-table-column>
                <!-- <el-table-column prop="couponCode" :label="$t('table.Redemptioncode')"></el-table-column> -->
                <el-table-column prop="time" :label="$t('table.Exchangetime')" width="200"></el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script>
export default {
    props:['data'],
    data(){
        return{
            tableData:[],
        }
    },
    mounted(){
        this.getTableData()
    },
    methods:{
        closeDetailsShow(){
            this.$emit('on-close')
        },
        getTableData(){
            this.$http({
                method:'post',
                url:process.env.API_ROOT+'/cms/product/order/count/detail',
                params:this.data,
                headers:{
                   'Content-Type':'application/x-www-form-urlencoded'
                }
            }).then(function(response){
                console.log(response)
                const datas = response.data
                this.tableData =datas.data
                for(let i = 0;i<this.tableData.length;i++){
                    if(this.tableData[i].mobile == null||this.tableData[i].mobile ==''){
                        this.tableData[i].mobile = this.tableData[i].couponCode
                    }
                }
            },function(error){
                
            })
        }
    }
}
</script>

<style scoped>
img{
    width: 100%;
    height: 100%;
}
.esc{
    width: 50px;
    background-color: #fff;
    border:#fff 0 solid;
}
.table{
    margin-bottom: 200px;
}
</style>
