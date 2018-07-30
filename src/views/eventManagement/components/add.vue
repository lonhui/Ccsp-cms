<template>
    <div class="box1">
        <div class="centont">
            <h2>事件配置</h2>
            <div class="tab1">
                <el-table :data="tableData" borde style="width: 100%">
                    <el-table-column prop="id" label="id" width="180"></el-table-column>
                    <el-table-column prop="type" label="type" width="180"></el-table-column>
                    <el-table-column prop="key" label="key"></el-table-column>
                    <el-table-column prop="comment" label="comment"></el-table-column>
                    <el-table-column prop="addtime" label="addtime"></el-table-column>
                    <el-table-column prop="isShowingMobile" label="isShowingMobile"></el-table-column>
                    <el-table-column prop="detail" label="detail"></el-table-column>
                    <el-table-column prop="status" label="status"></el-table-column>
                    <el-table-column prop="title" label="title"></el-table-column>
                    <el-table-column prop="intro" label="intro"></el-table-column>
                </el-table>
            </div>
        </div>
    </div>
</template>

<script>
export default {
   
    data() {
        return{
            input:'',
            tableData:[]
        }
    },
    mounted(){
        this.getData()
    },
    methods:{
        closeAddShow(){
            this.$emit('on-close')
        },
        getData(){
             this.$http({
                method:'GET',
                url:'http://ccsp.caping.co.id/cms/set/event/list'+'?pageSize='+100+'&pageNum='+1
            }).then(function(response){
                console.log(response)
                const datas = response.data
                this.tableData = datas.data.data
            },function(error){
                
                console.log(error);
            })
        }
    }
    
}
</script>

<style scoped>
.box1{
    position: fixed;
    z-index: 100;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    /* background: rgba(7, 17, 27, 0.8) */
}
.centont{
    width: 100%;
    height: 100%;
    margin-top:60px;
    margin-left: 240px;
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
    width: 80%;
}
</style>
