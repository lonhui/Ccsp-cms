<template>
    <div class="roleList">
        <!-- 角色列表 -->
        <div class="button1">
            <el-button type="primary" @click="add()">{{$t('button.addto')}}</el-button>
        </div>
        <div class="tabl">
            <el-table :data="DataList" border style="width: 100%" v-loading="loading">
                <el-table-column prop="id" width="100px" label="ID"></el-table-column>
                <el-table-column prop="name" :label="$t('table.roleName')"></el-table-column>
                <el-table-column prop="description" :label="$t('table.Roledescription')" ></el-table-column>
                <el-table-column :label="$t('table.status')">
                     <template slot-scope="scope">
                        <a href="javascript:;">{{scope.row.status == 1?$t('table.status1'):$t('table.status0')}}</a>
                    </template>
                </el-table-column>
                
                <el-table-column :label="$t('table.edit')" width="120">
                    <template slot-scope="scope">
                        <el-button type="text" size="small" @click="bianji(scope.$index,scope.row)">{{$t('table.edit')}}</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <!-- 添加弹窗 -->
        <v-add v-if="addShow" @on-close="closeAddShow"></v-add>
        <!-- 编辑弹窗 -->
        <div class="box" v-show="show">
            <div class="centont">
               
                <table class="table2">
                    <tr>
                        <td><span class="demonstration">ID:</span></td>
                        <td><el-input :placeholder="$t('button.pleaseentercontent')" style="width:80%" v-model="form.id" :disabled="true"></el-input></td>
                    </tr>
                    <tr>
                        <td><span class="demonstration">{{$t('table.roleName')}}:</span></td>
                        <td><el-input v-model="form.name" :placeholder="$t('button.pleaseentercontent')" style="width:80%"></el-input></td>
                    </tr>
                    <tr>
                        <td><span class="demonstration">{{$t('table.Roledescription')}}</span></td>
                        <td><el-input v-model="form.description" :placeholder="$t('button.pleaseentercontent')" style="width:80%"></el-input></td>
                    </tr>

                    <tr>
                        <td><span class="demonstration">{{$t('table.status')}}:</span></td>
                        <td>
                            <el-select v-model="form.status" :placeholder="$t('button.pleasechoose')">
                                <el-option v-for="item in options" :key="item.state" :label="item.label" :value="item.state">
                                </el-option>
                            </el-select>
                        </td>
                    </tr>
                    <!-- tree -->
                    <tr>
                        <td><span class="demonstration">{{$t('table.RolePermissions')}}:</span></td>
                        <td>
                            <div class="tree" v-loading="loadingTree">
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
                        <td><el-button type="primary" @click="closeShow">{{$t('button.cancel')}}</el-button>
                            <el-button type="primary" @click="tijiao">{{$t('button.submit')}}</el-button>
                        </td>
                    </tr>
                </table>
            </div>
        </div>
    </div>
</template>

<script>
import add from './components/addRole'
import { getToken } from '@/utils/auth'

export default {
    data() {
        return {
            // tree数据
            data2: [],
            defaultProps: {
                children: 'children',
                label: 'label'
            },
            menus:[],
            options: [{
                state: 1,
                label: this.$t('table.status1')
            }, {
                state: 0,
                label: this.$t('table.status0')
            }],
            DataList: [],
            show:false,
            form:{
                id:null,
                name:null,
                description:null,
                status:null,
                menuIds:''
            },
            addShow:false,
            checkedCities:[],
            loading:false,
            loadingTree:false
        }
    },
    components: {
        'v-add': add
    },
    mounted() {
        this.getRoleList();
    },
     methods: {
        // 获取被勾选目录的id
        //为了获取半选状态的父目录id修改了element原码
        //修改地址为：node_modules\element-ui\lib\element-ui.common.js 第21822行
        //child.checked && (!leafOnly || leafOnly && child.isLeaf)改为(child.checked || child.indeterminate) && (!leafOnly || leafOnly && child.isLeaf)
        getCheckedKeys() {
            this.menus = this.$refs.tree.getCheckedKeys()
        },
        //通过key勾选目录 
        setCheckedKeys() {
            this.$refs.tree.setCheckedKeys(this.menus);
            this.loadingTree=false
        },
        //编辑
        bianji(index,row){
            this.idx = index;
            const item = this.DataList[index]
            this.form = {
                id:item.id,
                name:item.name,
                description:item.description,
                status:item.status,
            }
            console.log(this.form)
            this.show = true
            this.getMenu()
        },
        // 关闭编辑框
        closeShow(){
            this.show = false
        },
        //获取所有目录列表
        getMenu(){
            this.loadingTree=true
            this.data2 = []
            let token = getToken()
            this.$http.get(process.env.API_ROOT+'/cms/sys/menu/list',{'headers':{
                'X-abn-session-token':token
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
        
            this.getUSerMenu()
            },function(error){
                // console.log(error)
            })
        },
        //获取角色列表
        getRoleList() {
            let token = getToken()
            this.loading = true
            var that = this;
            that.$http({
                method:'GET',
                url:process.env.API_ROOT+'/cms/sys/role/list',
                headers:{
                    'X-abn-session-token':token
                }
            }).then(function(response){
                const datas = response.data
                this.DataList = datas.data.roles
                this.loading = false
            },function(error){
                this.loading = false
                // console.log(error)
            })
        },
        //获取该角色全部信息
        getUSerMenu(){
            this.menus = []
            const token = getToken()
            this.checkedCities=[]
            this.$http({
                method:'post',
                url:process.env.API_ROOT+'/cms/sys/role/info/'+this.form.id,
                headers:{
                    'Content-Type':'application/json',
                    'X-abn-session-token':token
            }
        }).then(function(response){
            const datas = response.data
            if(datas.data.menus!=null){
                for(let i = 0;i <  datas.data.menus.length;i++){
                    if(datas.data.menus[i].parent_id != 0){
                        this.menus.push(datas.data.menus[i].id)
                    }else{
                        var cc = 0
                        for(let j = 0;j <  datas.data.menus.length;j++){
                            if(datas.data.menus[i].id == datas.data.menus[j].parent_id){
                                cc = cc + 1
                            }
                        }
                        if(cc==0){
                            this.menus.push(datas.data.menus[i].id)
                        }
                    }
                }
            }else(
                this.menus = []
            ) 
           this.setCheckedKeys()
        },function(error){
            // console.log(error)
        })
        },
        //打开添加角色框
        add(){
            this.addShow = true 
        },
        //关闭添加角色框
        closeAddShow(){
            this.addShow = false
            this.getRoleList()
        },
        //提交编辑角色
        tijiao(){
            // 将menus转换为字符串赋值给this.form.menuIds
            var aa = ''
            for(let i = 0;i < this.menus.length;i++){
                aa = aa + this.menus[i] +','
            }
            this.form.menuIds = aa
            //提交请求
            var that = this;
            that.$http.post(process.env.API_ROOT+'/cms/sys/role/update', this.form,{'headers':{
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
                    this.closeShow()
                    this.getRoleList()
                }else{
                    this.$message({
                        message: this.$t('message.fail'),
                        type: 'error'
                    })
                }
            },function(error){
                // console.log(error)
            })
        }    
    },
    watch: {
        'currentPage1': function () {
            this.getDataList()
        },
        'show':function(){
            if(this.show == true){
                document.body.style.overflow = "hidden"
            }else{
                document.body.style.overflow = "auto"
            }
        },
        'addShow':function(){
            if(this.addShow == true){
                document.body.style.overflow = "hidden"
            }else{
                document.body.style.overflow = "auto"
            }
        }
    }
}
</script>

<style >
.roleList{
    width: 80%;
    margin: 20px auto;
}
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
    height: 600px;
    margin: 50px auto;
    border-radius:10px 10px 10px 10px;
    background-color: #fff
}
.table2{
    width: 80%;
    margin: 0 auto;
    line-height: 50px;
    position: relative;
    top: 60px;
}
.button1{
    float: left;
    margin-bottom: 10px;
}
.checke{
    width: 90%;
    margin: 0 auto;
    border: #ddd 2px solid;
    border-radius:10px 10px 10px 10px;
    position: relative;
    top: 50px;
}
.tree{
    width: 200px;
    height: 160px;
    overflow-y:auto;
}
</style>
