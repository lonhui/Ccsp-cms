<template>
<!-- 用户详情 -->
    <div class="detail">
        <div class="content">
            <div class="end">
                <el-button type="primary" @click="closeDetailShow">{{$t('button.retreat')}}</el-button>
            </div>
            <div class="message">
                <div class="info">
                    <table>
                        <tr>
                            <td>{{$t('table.userID')}}：{{datas.uid}}</td>
                            <td></td>
                            <td></td>
                        </tr>
                        <tr>
                            <td>{{$t('table.username1')}}: </td>
                            <td></td>
                            <td></td>
                        </tr>
                        <tr>
                            <td>{{$t('table.cellphonenumber')}}：</td>
                            <td></td>
                            <td></td>
                        </tr>
                        <tr>
                            <td>{{$t('table.birthday')}}：</td>
                            <td>{{$t('table.twitternickname')}}：</td>
                            <td>{{$t('table.googlenickname')}}： </td>
                        </tr>
                        <tr>
                            <td>{{$t('table.email')}}： </td>
                            <td>{{$t('table.mobilephoneimei')}}：</td>
                            <td>{{$t('table.activatethdevice')}}：{{datas.os}}</td>
                        </tr>
                        <tr>
                            <td>{{$t('table.facebooknickname')}}：</td>
                            <td>{{$t('table.appversion')}}：{{datas.version}}</td>
                            <td></td>
                        </tr>
                    </table>
                </div>
                <div class="headPortrait">
                    <img src="">
                </div>
            </div>
            <div class="btn-group" role="group" aria-label="Basic example">
                <el-radio-group v-model="tabPosition" style="margin-bottom: 30px;">
                    <el-radio-button label="top">{{$t('button.totalgoldcoins')}}：{{datas.money}}</el-radio-button>
                    <el-radio-button label="right">{{$t('button.totalpoints')}}：{{datas.coin}}</el-radio-button>
                    <el-radio-button label="bottom">{{$t('button.historicalexchange')}}</el-radio-button>
                    <el-radio-button label="left">{{$t('button.invitationrecord')}}</el-radio-button>
                </el-radio-group>
                <el-switch style="display: block" v-model="value" active-color="#13ce66" inactive-color="#ff4949" :active-text="$t('button.addrecords')" :inactive-text="$t('button.reducerecords')" v-if="tabPosition==='top'"></el-switch>
            </div>
            <div class="tab">
                <el-table :data="userDatas_money" border style="width: 100%" v-if="tabPosition === 'top'" v-loading="loading">
                    <el-table-column align="center" prop="timestamp" :label="$t('table.createTime')"></el-table-column>
                    <el-table-column align="center" prop="title" :label="$t('table.actions')"></el-table-column>
                    <el-table-column align="center" prop="money" :label="$t('button.gold')" ></el-table-column>
                </el-table>	
                <el-table :data="userDatas_coin" border style="width: 100%" v-if="tabPosition === 'right'" v-loading="loading">
                    <el-table-column align="center" prop="timestamp" :label="$t('table.createTime')"></el-table-column>
                    <el-table-column align="center" prop="title" :label="$t('table.actions')"></el-table-column>
                    <el-table-column align="center" prop="addCoin" :label="$t('button.integral')" ></el-table-column>
                </el-table>
                <el-table :data="userDatas_convert" border style="width: 100%" v-if="tabPosition === 'bottom'" v-loading="loading">
                    <el-table-column align="center" prop="createTime" :label="$t('table.Exchangetime')"></el-table-column>
                    <el-table-column align="center" prop="productName" :label="$t('table.Lotteryname')"></el-table-column>
                    <el-table-column align="center" prop="price" :label="$t('table.price')" ></el-table-column>
                    <el-table-column align="center" :label="$t('table.Lotterytype')" >
                        <template slot-scope="scope">
                            <a href="javascript:;">{{scope.row.productType===1?$t('table.Recharge'):$t('table.coupon')}}</a>
                        </template>
                    </el-table-column>
                    <!-- 1.话费充值 2.优惠券-->
                </el-table>
                <el-table :data="userDatas_invite" border style="width: 100%" v-if="tabPosition === 'left'" v-loading="loading">
                    <el-table-column align="center" prop="timestamp" :label="$t('table.Invitationtime')"></el-table-column>
                    <el-table-column align="center" prop="inviteUser" :label="$t('table.Friendsname')"></el-table-column>
                    <el-table-column align="center" prop="timestamp" :label="$t('table.Friendsactivationtime')" ></el-table-column>
                    <el-table-column align="center" :label="$t('table.Friendactive')">
                        <template slot-scope="scope">
                            <el-button type="text" size="small" @click="getFrendactive(scope.$index,scope.row)">{{$t('table.Seefriendsactive')}}</el-button>
                        </template> 
                    </el-table-column>
                </el-table>
            </div>
             <div class="block">
                <el-pagination :current-page.sync="currentPage1" :page-size="5" layout="total, prev, pager, next" :total="totalCount"></el-pagination>
            </div>
            <div>
                <v-friend v-if="friendShow" :activeData="activeData" @on-close="closeFriendShow"></v-friend>
            </div>
        </div>
    </div> 
</template>

<script>
import friend from './friend'
import {getDetailInfo,getDetailMoney,getDetailInvite,getDetailCoin,getDetailConvert} from '@/api/user'

export default {
    components: {
        'v-friend':friend
    },
    data() {
        return {
            tabPosition: 'top',
            userDatas_money: [],
            userDatas_coin: [],
            userDatas_convert:[],
            userDatas_invite:[],
            value: true,
            currentPage1:1,
            totalCount:0,
            type:0,
            loading:false,
            activeData:[],
            friendShow:false
        }
    },
    props:['datas'],
    mounted(){
        this.getMoney()
    },
    methods: {
        closeFriendShow(){
            this.friendShow = false
        },
        closeDetailShow() {
            this.$emit('on-close')
        },
        getMoney(){
            this.loading = true
            if(this.value){
                this.type = 1
            }else{
                this.type = 2
            }
            let params={
                pageSize:5,
                pageNum:this.currentPage1,
                uid:this.datas.uid,
                type:this.type
            }
            getDetailMoney(params).then(response=>{
                const datas = response
                this.userDatas_money = datas.data.data;
                this.totalCount = datas.data.totalCount;
                this.loading = false   
            },(error)=>{
                this.loading = false
            })
        },
        getInvite(){
            this.loading = true
            let params={
                pageSize:5,
                pageNum:this.currentPage1,
                uid:this.datas.uid
            }
            getDetailInvite(params).then(response=>{
                const datas = response
                this.userDatas_invite = datas.data.data
                this.totalCount = datas.data.totalCount
                this.loading = false
            },(error)=>{
                this.loading = false
            })
        },
        getCoin() {
            this.loading = true
            let params={
                pageSize:5,
                pageNum:this.currentPage1,
                uid:this.datas.uid
            }
            getDetailCoin(params).then(response=>{
                const datas = response
                this.userDatas_coin = datas.data.list;
                this.totalCount = datas.data.totalCount;
                this.loading = false
            },(error)=>{
                this.loading = false
            })
        },
        // 兑换
        getConvert () {
            this.loading = true
             let params={
                pageSize:5,
                pageNum:this.currentPage1,
                uid:this.datas.uid
            }
            getDetailConvert(params).then(response=>{
                const datas = response
                this.userDatas_convert = datas.data.list;
                this.totalCount = datas.data.total;
                this.loading = false
            },(error)=>{
                this.loading = false
            })
        },
        getFrendactive(index,row){
            const item = this.userDatas_invite[index]
            const date = item.timestamp.substring(0,10)
            let data={
                uid:this.datas.uid,
                date:date
            }
            getDetailInfo().then(response=>{
                const datas = response.data
                const d = []
                for(let i = 0;i < datas.data.list.length;i++){
                    if(datas.data.list[i].uid==item.inviteUser){
                        d.push(datas.data.list[i])
                    }
                }
                this.activeData = d
                this.friendShow = true
            },(error)=>{
                this.loading = false
            })
        }
    },
    watch: {
    'currentPage1': function() {
      if(this.tabPosition=='top'){
             this.getMoney()
        }else if(this.tabPosition=='right'){
            this.getCoin()
        }else if(this.tabPosition=='bottom'){
           this.getConvert()
        }else if(this.tabPosition=='left'){
             this.getInvite()
        }
    },
    'tabPosition':function() {
        this.currentPage1 = 1
        this.totalCount = 0
        if(this.tabPosition=='top'){
             this.getMoney()
        }else if(this.tabPosition=='right'){
            this.getCoin()
        }else if(this.tabPosition=='bottom'){
           this.getConvert()
        }else if(this.tabPosition=='left'){
             this.getInvite()
        }
    },
    'value':function (){
        this.getMoney()
    },

  }
    
}
</script>

 <style scoped>
.detail{
    width: 100%;
    height: 100%;
    background: #fff;
    margin-left: 20px;
    overflow-y: auto;
}
.content{
    width: 1200px;
    margin: 20px auto 0;
}
.table{
    border: #DDD 1px solid;
}
.info{
    font-size: 20px;
    float: left;
}
.info td{
    width: 300px;
}
.info p{
    margin: 0;
}
.headPortrait{
    width: 140px;
    height: 170px;
    background-color: #DDD;
    float: left;
    margin-left: 150px;

}
.headPortrait img{
    width: 100%;
    height: 100%;
}
.message{
    width: 100%;
    height: 200px;
}
.tab{
    width: 60%;
    padding-top:10px;
}
.btn-group{
   margin-top: 20px;
   float: left
}
.end{
    margin-bottom: 20px;
    margin-left: 40px;
}
.message,.btn-group,.tab,.block{
    margin-left: 40px;
}
.block{
    margin-top: 10px;
}
.btn-group{
    margin-bottom: 20px;
}

</style>
