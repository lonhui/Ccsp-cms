<template>
    <div class="box">
        <div class="centont">
            <table>
                <tr>
                    <td><span class="demonstration">账号:</span></td>
                    <td><el-input v-model="addData.account" placeholder="请输入新账号" ></el-input></td>
                </tr>
                <tr>
                    <td><span class="demonstration">密码:</span></td>
                    <td><el-input v-model="addData.password" placeholder="请输入新密码" ></el-input></td>
                </tr>
                <tr>
                    <td><span class="demonstration">角色名:</span></td>
                    <td><el-input v-model="addData.name" placeholder="请输入新角色" ></el-input></td>
                </tr>
                <tr>
                    <td><span class="demonstration">可访问菜单:</span></td>
                    <td>
                        <el-select v-model="addData.role_id" :placeholder="$t('button.pleasechoose')">
                            <el-option v-for="item in options2" :key="item.state" :label="item.label" :value="item.state">
                            </el-option>
                        </el-select>
                    </td>
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
                    <td><span class="demonstration">角色描述名:</span></td>
                    <td><el-input v-model="addData.description" placeholder="请输入描述" ></el-input></td>
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
export default {
    data() {
        return{
            options2:[],
            options1:[],
            options: [{
                state: 1,
                label: this.$t('table.Enabled')
            }, {
                state: 0,
                label: this.$t('table.Disabled')
            }],
            addData:{
                account:null,
                password:null,
                role_id:null,
                description:null,
                status:null
            },
            roleData:[],
            menuList:[]

        }
    },
    mounted(){
      this.getMenu()
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
            this.$http.post('http://ccsp.caping.co.id/cms/sys/user/add', this.addData,{'headers':{
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
            },function(error){
                // console.log(error)
            })
        },
        getMenu(){
             this.$http.get('http://ccsp.caping.co.id/cms/sys/menu/list',{'headers':{
                'X-abn-session-token':this.GLOBAL.token
            }}
            ).then(function(response){
                this.options2=[]
                const datas = response.data;
                //this.menuList = datas.data.menuList
                for(let i = 0;i < datas.data.menuList.length;i++){
                    const menuList={
                        state:null,
                        label:null,
                    }
                    menuList.label = datas.data.menuList[i].name
                    menuList.state = datas.data.menuList[i].id
                    this.options2.push(menuList)
                }
            },function(error){
                // console.log(error)
            })
        },
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
    width: 40%;
    height: 80%;
    margin: 100px auto;
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

