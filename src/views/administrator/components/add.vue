<template>
    <div class="box">
        <div class="centont">
            <table>
                <tr>
                    <td><span class="demonstration">{{$t('table.roleName')}}:</span></td>
                    <td><el-input v-model="addData.account" :placeholder="$t('table.newaccount')" style="width:80%"></el-input></td>
                </tr>
                <tr>
                    <td><span class="demonstration">{{$t('table.password')}}:</span></td>
                    <td><el-input v-model="addData.password" :placeholder="$t('table.newpassword')" style="width:80%"></el-input></td>
                </tr>
                <tr>
                    <td><span class="demonstration">{{$t('table.Character')}}:</span></td>
                    <td>
                        <el-select v-model="addData.role_id" :placeholder="$t('button.pleasechoose')">
                            <el-option v-for="item in options1" :key="item.state" :label="item.label" :value="item.state">
                            </el-option>
                        </el-select>
                    </td>
                </tr>
                <tr>
                    <td><span class="demonstration">{{$t('table.actualname')}}</span></td>
                    <td><el-input v-model="addData.name" :placeholder="$t('table.inyourname')" style="width:80%"></el-input></td>
                </tr>
                <tr>
                    <td><span class="demonstration">{{$t('table.status')}}:</span></td>
                    <td>
                        <el-select v-model="addData.status" :placeholder="$t('button.pleasechoose')">
                            <el-option v-for="item in options" :key="item.state" :label="item.label" :value="item.state">
                            </el-option>
                        </el-select>
                    </td>
                </tr>
                <tr>
                    <td></td>
                    <td><el-button type="primary" @click="closeShow">{{$t('button.cancel')}}</el-button><el-button type="primary" @click="add()">{{$t('button.submit')}}</el-button></td>
                </tr>
            </table>
        </div>
    </div>
</template>

<script>
import {addAdmin} from '@/api/event'

export default {
    data() {
        return{
            options1:[],
            options: [{
                state: 1,
                label: this.$t('table.Enabled')
            }, {
                state: 0,
                label:  this.$t('table.Disabled')
            }],
            addData:{
                account:null,
                password:null,
                role_id:null,
                description:null,
                status:null
            },
            roleData:[]
        }
    },
    mounted(){
      this.getRole()
    },
    methods:{
        closeShow(){
            this.$emit('on-close')
        },
        add(){
            for(let i = 0;i < this.roleData.length;i++){
                if(this.roleData[i].id === this.addData.role_id){
                    this.addData.description = this.roleData[i].description
                    break
                }
            }
            // addAdmin(this.addData).then(response => {
            //     if(response.message==="OK"){
            //         this.$message({
            //             message: this.$t('message.updateSucc'),
            //             type: 'success'
            //         })
            //         this.$emit('on-close')
            //     }else{
            //        this.$message({
            //             message: this.$t('message.fail'),
            //             type: 'error'
            //         })
            //     }
            // },error => {

            // })

            this.$http.post(process.env.API_ROOT+'/cms/sys/user/add', this.addData,{'headers':{
                'Content-Type':'application/json',
                'X-abn-session-token':this.GLOBAL.token
            }}
            ).then(function(response){
                const datas = response.data;
                if(datas.message==="OK"){
                    this.$message({
                        message: this.$t('message.updateSucc'),
                        type: 'success'
                    })
                    this.$emit('on-close')
                }else{
                   this.$message({
                        message: this.$t('message.fail'),
                        type: 'error'
                    })
                }
            })
        },
        getRole(){
            this.$http.get(process.env.API_ROOT+'/cms/sys/role/list',{'headers':{
                'X-abn-session-token':this.GLOBAL.token
            }}
            ).then(function(response){
                this.options1=[]
                const datas = response.data;
                this.roleData = datas.data.roles
                for(let i = 0;i < datas.data.roles.length;i++){
                    const roles={
                        state:null,
                        label:null,
                    }
                    roles.label = datas.data.roles[i].description
                    roles.state = datas.data.roles[i].id
                    this.options1.push(roles)
                }
                datas.role
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
    width: 450px;
    height: 550px;
    margin: 50px auto;
    border-radius:10px 10px 10px 10px;
    background-color: #fff
}
table{
    width: 80%;
    margin: 0 auto;
    line-height: 80px;
    position: relative;
    top: 30px;
}
</style>

