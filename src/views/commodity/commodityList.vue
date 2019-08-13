<template>
<!-- 商品列表 -->
	<div class="commodity">
        <div v-if="addCommodityShow==0">
			<div class="button">
				<el-button type="warning" plain @click="Dropoff">{{$t('button.Dropoff')}}</el-button>
                <el-button type="success" plain @click="Shelf">{{$t('button.Shelf')}}</el-button>
                <el-button icon="el-icon-circle-plus-outline" type="primary" plain @click="add">{{$t('button.Capingcommodity')}}</el-button>
                <!-- 添加京东商品按钮 -->
                <!-- <el-button icon="el-icon-circle-plus-outline" type="primary" plain @click="addH5">{{$t('button.JDCommodity')}}</el-button> -->
                <el-button type="primary" icon="el-icon-download" @click="$exportExcel('table_v',$t('route.productlist'))">{{$t('button.exportExcel')}}</el-button>
                
               <div class="select">
                    <!-- 类型选择 -->
                    <!-- <el-select v-model="value" placeholder="请选择">
                        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select> -->
                    <!-- 选择状态 -->
                    <el-select v-model="statusValue" :placeholder="$t('button.pleasechoose')">
                        <el-option :label="$t('table.status1')" :value='1'></el-option>
                        <el-option :label="$t('table.status0')" :value='0'></el-option>
                    </el-select>
                </div>
			</div>
			<div class="list">
                <el-table id="table_v" ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange" v-loading="loading">
                    <el-table-column align="center" type="selection" width="55"></el-table-column>
                    <el-table-column align="center" prop="id" width="100px" :label="$t('table.ProductNumber')"></el-table-column>
                    <el-table-column align="center" prop="image" :label="$t('table.image')"  width="100">
                        <template slot-scope="scope">
                            <img  :src="scope.row.image" alt="" style="width: 50px;height: 50px">
                        </template>
                    </el-table-column>
                        <el-table-column align="center" prop="name" :label="$t('table.productname')" width="120"></el-table-column>
                        <el-table-column align="center" prop="currentPrice" :label="$t('table.Commodityprice')" width="100"></el-table-column>
                        <el-table-column align="center" prop="total" :label="$t('table.Thetotalamount')" width="100px"></el-table-column>
                        <el-table-column align="center" prop="current" :label="$t('table.margin')" width="90px"></el-table-column>
                        <el-table-column align="center" prop="addTime" :label="$t('table.createTime')" width="160px"></el-table-column>
                        <el-table-column align="center" prop="endTime" :label="$t('table.Failuretime')" width="160px"></el-table-column>
                        <el-table-column align="center" prop="state" :label="$t('table.status')" width="80px">
                            <template slot-scope="scope">
                                <a href="javascript:;">{{scope.row.state==1?$t('table.status1'):$t('table.status0')}}</a>
                            </template>
                        </el-table-column>
                    <el-table-column align="center" :label="$t('table.actions')" width="80">
                        <template slot-scope="scope">
                            <el-button type="text" size="small" @click="openUpdateShow(scope.$index,scope.row)">{{$t('table.edit')}}</el-button>
                        </template>
                    </el-table-column>
                </el-table>
			</div>
        <div class="block">
            <el-pagination :current-page.sync="currentPage" :page-size="10" layout="total, prev, pager, next" :total="totalCount"></el-pagination>
        </div>
    </div>
    <div class="components">
        <!-- 添加caping商品 -->
        <v-addCommodity v-if="addCommodityShow==1" @on-close='closeAdd' :data='this.form'></v-addCommodity>
        <!-- 添加京东商品 -->
        <v-addH5 v-if="addCommodityShow==2" @on-close="closeH5()" :data='this.form'></v-addH5> 
    </div>
	</div>
    
</template>

<script>
import  addCommodity from './components/addCommodity'
import  addH5 from './components/addH5'
import {getcommodityList,dropoffAndShelf} from '@/api/commodity'
import {setCookie} from '@/utils/Cookie'

export default {
    data() {
      return {
        iconUploading: false,
        tableData: [],
        multipleSelection: [],
        currentPage: 1,
        totalCount:0,
        updateShow:false,
        loading:false,
        form:{
            id:null,
            name:null,
            productType:null,
            currentPrice:null,
            total:null,
            current:null,
            addTime:null,
            endTime:null,
            image:''
        },
        addCommodityShow:0,//0展示列表，1展示app商品添加，2展示h5商品添加
        productType: 1,
        imageUrl: '',
        a:{
          imageType:8
        },
        // 状态筛选数据
        statusValue:1,
        // 商品类型筛选数据
        options: [{
          value:'',
          label: this.$t('button.Allgoods')
        },{
          value: 0,
          label: this.$t('button.Capingcommodity')
        }, {
          value:1,
          label: this.$t('button.JDCommodity')
        }],
        value: null
      }
    },
    components:{
        'v-addCommodity':addCommodity,
        'v-addH5':addH5
    },
    mounted(){
      this.getTableData()
    },
    methods: {
        addH5(){
            this.form={
                state:true,//商品状态 1为有效，0为无效
            }
            this.addCommodityShow=2
        },
        closeH5(){
            this.addCommodityShow=0
            this.getTableData()
        },
        closeAdd(){
            this.addCommodityShow = 0
            this.getTableData()
        },
        //上传图片start
        handleAvatarSuccess(res, file) {
            this.imageUrl = URL.createObjectURL(file.raw);
            this.form.image = res.Message
            this.iconUploading = false
        },
        handleAvatarError(err, file) {
            this.$message.error(err)
            this.iconUploading = false
        },
        beforeAvatarUpload(file) {
            const isJPG = ['image/jpeg', 'image/jpg', 'image/png'].indexOf(file.type) > -1
            const isLt2M = file.size / 1024 / 1024 < 2;
            if (!isJPG) {
            this.$message.error('上传头像图片只能是 JPG 格式!');
            }
            if (!isLt2M) {
            this.$message.error('上传头像图片大小不能超过 2MB!');
            }
            return isJPG && isLt2M;
        },
        handleAvatarProgress() {
            this.iconUploading = true
        },
        openUpdateShow(index,row){
            this.idx = index;
            const item = this.tableData[index]
            if(item.isShow == 1){
                this.form = {
                    id:item.id,//商品ID
                    name: item.name,//商品名称
                    productCategory:item.productCategory,//商品类别
                    currentPrice:item.currentPrice,//商品价格
                    state:item.state,//商品状态 1为有效，0为无效
                    image:item.image,//商品图片
                    sourceWeb:item.sourceWeb,//来源网站
                    shortIntro:item.shortIntro,//商品短介绍
                }
                this.addCommodityShow = 2
            }else{
                this.form = {
                    id:item.id,//商品ID
                    name: item.name,//商品名称
                    productType:item.productType,//商品类型
                    productCategory:item.productCategory,//商品类别
                    currentPrice:item.currentPrice,//商品价格
                    originalPrice:item.originalPrice,//商品原始价格
                    total:item.total,//商品数量
                    is_special:item.is_special,
                    current:item.current,//商品剩余数量
                    endTime:item.endTime,//失效时间
                    state:item.state,//商品状态 1为有效，0为无效
                    image:item.image,//商品图片
                    sourceWeb:item.sourceWeb,//来源网站
                    shortIntro:item.shortIntro,//商品短介绍
                    fullIntro:item.fullIntro,//商品详细介绍
                    termsConditions:item.termsConditions,//协议条款
                    color:item.color,
                    size:item.size
                }
                if(this.form.productType==1){
                    this.form.pulsa_code=item.pulsa_code
                }
                this.addCommodityShow = 1
            }
        },
        // 添加
        add(){
            this.form=null
            this.addCommodityShow = 1
        },
        toggleSelection(rows) {
            if (rows) {
            rows.forEach(row => {
                this.$refs.multipleTable.toggleRowSelection(row);
            });
            } else {
            this.$refs.multipleTable.clearSelection();
            }
        },
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        // 获取表格数据
        getTableData(){
            this.loading = true
            var that = this;
            let data = {
            pageNum:this.currentPage,
            pageSize:10,
            state:this.statusValue
            }
            this.value !== null?data.isShow = this.value:null
            getcommodityList(data).then(response=>{
                const datas = response.data
                this.tableData = datas.data
                this.totalCount = datas.total
                this.loading = false
            },(error)=>{
            console.log(error)
            })
        },
        //下架
        Dropoff(){
            const id=[]
            if(this.multipleSelection.length<1){
                this.$message({
                    message: this.$t('message.ProductSelect'),
                    type: 'error'
                })
            }else{
                for(let i=0;i<this.multipleSelection.length;i++){
                id.push(this.multipleSelection[i].id)
                }
                let data = {
                ids:id,
                state:0
                }
                dropoffAndShelf(data).then(response=>{
                this.$message({
                    message: this.$t('message.updateSucc'),
                    type: 'success'
                })
                this.getTableData()
                },(error)=>{

                })
            }    
        },
        //上架
        Shelf(){
            const id=[]
            if(this.multipleSelection.length<1){
                this.$message({
                    message: this.$t('message.ProductSelect'),
                    type: 'error'
                })
            }else{
                for(let i=0;i<this.multipleSelection.length;i++){
                id.push(this.multipleSelection[i].id)
                }
                let data = {
                ids:id,
                state:1
                }
                dropoffAndShelf(data).then(response => {
                this.$message({
                    message: this.$t('message.updateSucc'),
                    type: 'success'
                })
                this.getTableData()
                })
            }
        }
    },
    watch: {
        'currentPage': function () {
        this.getTableData()
        },
        'value': function (){
            this.getTableData()
        },
        'updateShow':function(){
            if(this.updateShow == true){
                document.body.style.overflow = "hidden"
            }else{
                document.body.style.overflow = "auto"
            }
        },
        'statusValue':function(){
            this.getTableData()
        }
    }
  }
</script>

<style scoped>
.commodity{
	width: 90%;
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
    width: 500px;
    margin: 50px auto;
    border-radius:10px 10px 10px 10px;
    background-color: #fff;
}
.table{
    width: 90%;
    margin: 0 auto;
    line-height: 50px;
    padding-bottom: 40px;
    padding-top:20px;
    position: relative;
    top: 10px;
}
.button1{
    float: right;
}
 .avatar-uploader .el-upload {
    border: 1px dashed #8c939d;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    border: 1px dashed #d6d6d6;
    font-size: 28px;
    color: #8c939d;
    width: 100px;
    height: 100px;
    line-height: 100px;
    text-align: center;
    border-radius:10px 10px 10px 10px;
  }
  .avatar {
    width: 100px;
    height: 100px;
    display: block;
  }
  .select{
      float: right;
  }
</style>

