<template>
    <div class="box">
        <div class="centont">
            <table>
                <tr>
                    <td><span class="demonstration">Key:</span></td>
                    <td><el-input v-model="addData.key" :placeholder="$t('button.pleaseentercontent')" style="width:80%"></el-input></td>
                </tr>
                <tr>
                    <td><span class="demonstration">Value</span></td>
                    <td><el-input v-model="addData.value" :placeholder="$t('button.pleaseentercontent')" style="width:80%"></el-input></td>
                </tr>
                <tr>
                    <td><span class="demonstration">{{$t('table.status')}}:</span></td>
                    <td>
                        <el-select v-model="addData.state" :placeholder="$t('button.pleasechoose')">
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
export default {
    data() {
        return{
             props:['form'],
            pickerOptions1: {
            disabledDate(time) {
                return time.getTime() > Date.now();
            },
            shortcuts: [{
                text: this.$t('message.today'),
                onClick(picker) {
                picker.$emit('pick', new Date());
                }
            }, {
                text:this.$t('message.yesterday'),
                onClick(picker) {
                const date = new Date();
                date.setTime(date.getTime() - 3600 * 1000 * 24);
                picker.$emit('pick', date);
                }
            }, {
                text: this.$t('message.aweekago'),
                onClick(picker) {
                const date = new Date();
                date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
                picker.$emit('pick', date);
                }
            }]
            },
            options: [{
                state: 1,
                label: this.$t('table.status1')
            }, {
                state: 0,
                label: this.$t('table.status0')
            }],
            addData:{
                key:null,
                value:null,
                state:null,
            }
        }
    },
    methods:{
        closeShow(){
            this.$emit('on-close')
        },
        add(){
            var that = this;
            that.$http.post(process.env.API_ROOT+'/cms/set/config/save', this.addData
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
    height: 500px;
    margin: 50px auto;
    border-radius:10px 10px 10px 10px;
    background-color: #fff
}
table{
    width: 80%;
    margin: 0 auto;
    line-height: 80px;
    position: relative;
    top: 70px;
}
</style>

