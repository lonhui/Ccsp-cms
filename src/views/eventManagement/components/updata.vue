<template>
    <div class="box">
            <div class="centont">
                <br>
                <table>
                    <tr>
                        <td>ID</td>
                        <td>
                            <el-input :placeholder="$t('button.pleaseentercontent')" v-model="data.id" :disabled="true"></el-input>
                        </td>
                    </tr>
                     <tr>
                        <td>{{$t('table.Eventname')}}</td>
                        <td><el-input :placeholder="$t('button.pleaseentercontent')" v-model="data.intro" :disabled="true"></el-input></td>
                    </tr>
                     <tr>
                        <td>{{$t('table.status')}}</td>
                        
                        <td>
                            <el-select v-model="data.status" :placeholder="$t('button.pleasechoose')">
                                <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"> </el-option>
                            </el-select>
                        </td>
                    </tr>
                    <tr>
                        <td><el-button type="primary" @click="closeUpdataShow">{{$t('button.cancel')}}</el-button></td>
                        <td>
                             <el-button type="primary" @click="updata">{{$t('button.submit')}}</el-button> 
                        </td>
                    </tr>
                    <br>
                </table>
            </div>
        </div>
</template>

<script>
export default {
    props:['data'],
    data(){
        return{
            options: [{
                value: 0,
                label: this.$t('table.Removed')
            }, {
                value: 1,
                label: this.$t('table.normal')
            }],
        }
    },
    methods:{
        closeUpdataShow(){
            this.$emit('on-close')
        },
        updata(){
            this.$http({
                method:'GET',
                url:process.env.API_ROOT+'/cms/set/event/update',
                params:{
                    id:this.data.id,
                    status:this.data.status
                }
            }).then(function(response){
                const datas = response.data
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
    width: 500px;
    height: 400px;
    margin: 50px auto;
    border-radius:10px 10px 10px 10px;
    background-color: #fff
}
table{
    width: 300px;
    margin: 0 auto;
    line-height: 80px;
}
</style>
