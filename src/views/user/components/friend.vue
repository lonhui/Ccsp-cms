<template>
    <div class="box">
        <div class="centont">
            <br>
             <el-button type="danger" icon="el-icon-close" circle class="end1" @click="closeFriendShow"></el-button>
            <div class="table1">
                 <el-table :data="activeData" border style="width: 100%" >
                    <el-table-column align="center" prop="content" :label="$t('table.Eventname')"></el-table-column>
                    <el-table-column align="center" prop="uid" :label="$t('table.userID')"></el-table-column>
                    <el-table-column align="center" prop="giveCoin" :label="$t('table.Earnpoints')" ></el-table-column>
                    <el-table-column align="center" prop="date" :label="$t('table.date')" ></el-table-column>
                </el-table>
            </div>
            <br>
        </div>
    </div>
</template>

<script>
export default {
    props:['activeData'],
    methods:{
        closeFriendShow(){
            this.$emit('on-close')
        }
    }
}
</script>

<style scoped>
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
    width: 650px;
    margin: 50px auto;
    border-radius:10px 10px 10px 10px;
    background-color: #fff
}
.table1{
    width: 95%;
    height: 550px;
    margin: 0 auto;
    overflow-x: hidden;
    overflow-y: scroll;
}
.end1{
    float: right;
    margin-right: -15px;
    margin-top:-40px;
}
</style>
