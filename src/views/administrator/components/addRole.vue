<template>
    <div class="box">
        <div class="centont">
            <table>
                <tr>
                    <td><span class="demonstration">{{$t('table.roleName')}}:</span></td>
                    <td><el-input v-model="addData.name" :placeholder="$t('button.pleaseentercontent')" style="width:80%"></el-input></td>
                </tr>
                <tr>
                    <td><span class="demonstration">{{$t('table.Roledescription')}}:</span></td>
                    <td><el-input v-model="addData.description" :placeholder="$t('button.pleaseentercontent')" style="width:80%"></el-input></td>
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
                        <td><span class="demonstration">{{$t('table.RolePermissions')}}:</span></td>
                        <td>
                            <div class="tree" v-loading="loading">
                                <el-tree
                                    :data="data2"
                                    show-checkbox
                                    node-key="id"
                                    ref="tree"
                                    @check-change="getCheckedKeys"
                                    highlight-current
                                    :props="defaultProps">
                                </el-tree>
                            </div>
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
export default {
    data() {
        return{
            data2: [],
            defaultProps: {
                children: 'children',
                label: 'label'
            },
            options: [{
                state: 1,
                label: this.$t('table.status1')
            }, {
                state: 0,
                label: this.$t('table.status0')
            }],
            addData:{
                name:null,
                description:null,
                status:null,
                menuIds:null,
            },
            menuList:[],
            checkedCities:[11,14,19,28],
            menus:[],
            loading : false
        }
    },
    mounted(){
        this.getMenu()
    },
    methods:{
        //为了获取半选状态的父目录id修改了element原码
        //修改地址为：node_modules\element-ui\lib\element-ui.common.js 第21822行
        //child.checked && (!leafOnly || leafOnly && child.isLeaf)改为(child.checked || child.indeterminate) && (!leafOnly || leafOnly && child.isLeaf)
        getCheckedKeys() {
            this.menus = this.$refs.tree.getCheckedKeys()
        },
        closeShow(){
            this.$emit('on-close')
        },
        getMenu(){
            this.loading = true
            this.data2 = []
            this.$http.get('http://ccsp.caping.co.id/cms/sys/menu/list',{'headers':{
                'X-abn-session-token':this.GLOBAL.token
            }}
            ).then(function(response){
                 this.options2=[]
                const datas = response.data
                const menuList = datas.data.menuList
                for(let i = 0;i < menuList.length;i++){
                    if(menuList[i].parent_id == 0){
                        const menu = {
                            id: null,
                            label: null,
                            children: []
                        }
                        menu.id = menuList[i].id
                        menu.label = menuList[i].name
                        for(let j = 0;j < menuList.length;j++){
                            if(menuList[j].parent_id == menuList[i].id){
                                let menu2 = {
                                    id:null,
                                    label:null
                                }
                                menu2.id = menuList[j].id
                                menu2.label = menuList[j].name
                                menu.children.push(menu2)
                            }
                        }
                        this.data2.push(menu)
                    }  
                }
                this.loading = false                          
            },function(error){
                // console.log(error)
            })
        },
        add(){
             // 将menus转换为字符串赋值给this.form.menuIds
            var aa = ''
            for(let i = 0;i < this.menus.length;i++){
                aa = aa + this.menus[i] +','
            }
            this.addData.menuIds = aa
            var that = this;
            that.$http.post('http://ccsp.caping.co.id/cms/sys/role/add', this.addData,{'headers':{
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
                // console.log(error);
            })
        }
    },
   
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
    line-height: 60px;
    position: relative;
    top: 50px;
}
.checke{
    
    width: 90%;
    margin: 0 auto;
    border: #ddd 2px solid;
    border-radius:10px 10px 10px 10px;
    position: relative;
    top: 50px;
}
</style>

