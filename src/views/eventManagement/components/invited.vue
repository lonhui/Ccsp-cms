<template>
<!-- 被邀请人详情 -->
    <div class="box">
        <div class="centont">
            <br>
             <el-button type="danger" icon="el-icon-close" circle class="end1" @click="closeFriendShow"></el-button>
            <div class="table1">
                 <el-table :data="invited" border style="width: 100%" >
                    <el-table-column prop="content" :label="$t('table.Eventcontent')"></el-table-column>
                    <el-table-column prop="uid" :label="$t('table.InviteeID')" width="150"></el-table-column>
                    <el-table-column prop="giveCoin" :label="$t('table.Earnpoints')" width="120"></el-table-column>
                    <el-table-column prop="date" :label="$t('table.date')" width="120" ></el-table-column>
                </el-table>
            </div>
            <br>
        </div>
    </div>
</template>

<script>
import {inviteesDetailsList} from '@/api/event'

export default {
    props:['data'],
    data() {
        return{
            invited:[]
        }
    },
    mounted(){
        this.getInvited()
    },
    methods:{
        closeFriendShow(){
            this.$emit('on-close')
        },
        getInvited(){
            let data = {
                uid:this.data.uid,
                beginDate:this.data.beginDate,
                endDate:this.data.endDate
            }
            inviteesDetailsList(data).then(response => {
                this.invited = response.data.list
            },error => {
                
            })
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
    background: rgba(7, 17, 27, 0.8);
    overflow-y: auto;
}
.centont{
    width: 750px;
    margin: 50px auto;
    border-radius:10px 10px 10px 10px;
    background-color: #fff;
  
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
