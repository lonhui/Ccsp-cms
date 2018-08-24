<template>
<!-- 被邀请人列表 -->
    <div class="invitedList">
        <div><button class="esc"><img src="../../../assets/esc_t.png" @click="closeFriendShow"></button></div>
        <el-table :data="invitedList" class="el-icon-d-arrow-left" height="600" border style="width: 60%">
            <el-table-column type="index" :index="typeIndex" width="100px" :label="$t('table.id')"></el-table-column>
            <el-table-column prop="uid" :label="$t('table.userID')" width="180"></el-table-column>
            <el-table-column prop="day" :label="$t('table.date')"></el-table-column>
            <el-table-column :label="$t('table.detail')" width="120">
                <template slot-scope="scope">
                    <el-button type="text" size="small" @click="openInvitedShow(scope.$index,scope.row)">{{$t('table.seedetails')}}</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="component">
            <v-invited v-if="invitedShow" :data="invitedParams" @on-close="closeInvited"></v-invited>
        </div>
    </div>
</template>

<script>
import invited from './invited'
export default {
    props:['data'],
    data(){
        return{
           invitedShow:false,
           invitedParams:{

           },
           invitedList:[],
           currentPage:1
        }
    },
    components:{
        'v-invited':invited
    },
    mounted(){
        this.getInvitedList()
    },
    methods:{
        //序号
        typeIndex(index) {
            return index + (this.currentPage - 1) * 8 + 1
        },
        closeInvited(){
            this.invitedShow = false
        },
        closeFriendShow(){
            this.$emit('on-close')
        },
        // 打开被邀请人详情
        openInvitedShow(index,row){
            let item = this.invitedList[index]
            let uid = item.uid
            this.invitedParams={
                uid:uid,
                beginDate:this.data.beginDate,
                endDate:this.data.endDate
            }
            this.invitedShow = true
        },
        // 获取被邀请人列表数据
        getInvitedList(){
            let data = {
                invite_uid:this.data.uid,
                beginDate:this.data.beginDate,
                endDate:this.data.endDate
            }
            this.$http.post(process.env.API_ROOT+'/cms/statistic/invite/info',data
            ).then(function(response){
                const datas = response.data
                this.invitedList = datas.data
            },function(error){
                this.loading = false
                // console.log(error)
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
.invitedList{
    width: 100%;
    height: 100%;
    overflow: auto;
    margin-bottom: 200px;
}
</style>
