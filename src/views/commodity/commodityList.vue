<template>
<!-- 商品列表 -->
	<div class="commodity">
        <div v-if="addCommodityShow==0">
			<div class="button">
				<el-button type="warning" plain @click="Dropoff">{{$t('button.Dropoff')}}</el-button>
                <el-button type="success" plain @click="Shelf">{{$t('button.Shelf')}}</el-button>
                <el-button icon="el-icon-circle-plus-outline" type="primary" plain @click="add">App</el-button>
                <el-button icon="el-icon-circle-plus-outline" type="primary" plain @click="addH5">H5</el-button>
                <div class="select">
                    <el-select v-model="value" placeholder="请选择">
                        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </div>
			</div>
			<div class="list">
                <el-table ref="multipleTable" :data="tableData3" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange" v-loading="loading">
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
            <el-pagination :current-page.sync="currentPage1" :page-size="10" layout="total, prev, pager, next" :total="totalCount"></el-pagination>
        </div>
    </div>
    <div class="components">
        <v-addCommodity v-if="addCommodityShow==1" @on-close='closeAdd' :data='this.form'></v-addCommodity>
        <v-addH5 v-if="addCommodityShow==2" @on-close="addCommodityShow=0" :data='this.form'></v-addH5> 
    </div>
	</div>
    
</template>

<script>
import  addCommodity from './components/addCommodity'
import  addH5 from './components/addH5'

export default {
    data() {
      return {
        iconUploading: false,
        tableData3: [],
        multipleSelection: [],
        currentPage1: 1,
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
        options: [{
          value: 1,
          label: this.$t('table.Recharge')
        },{
          value: 2,
          label: this.$t('table.coupon')
        }],
        productType: 1,
        imageUrl: '',
        a:{
          imageType:8
        },
        options: [{
          value:'',
          label: '全部商品'
        },{
          value: 0,
          label: 'App商品'
        }, {
          value:1,
          label: 'H5商品'
        }],
        value: ''
      }
    },
    components:{
        'v-addCommodity':addCommodity,
        'v-addH5':addH5
    },
    mounted(){
      this.getTableData3()
    },
    methods: {
        addH5(){
            this.form={
                state:true,//商品状态 1为有效，0为无效
            }
            this.addCommodityShow=2
        },
        closeAdd(){
            this.addCommodityShow = 0
            this.getTableData3()
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
    //上传图片end

    openUpdateShow(index,row){
        this.idx = index;
        const item = this.tableData3[index]
        if(item.isShow==1){
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
                current:item.current,//商品剩余数量
                endTime:item.endTime,//失效时间
                state:item.state,//商品状态 1为有效，0为无效
                image:item.image,//商品图片
                sourceWeb:item.sourceWeb,//来源网站
                shortIntro:item.shortIntro,//商品短介绍
                fullIntro:item.fullIntro,//商品详细介绍
                termsConditions:item.termsConditions,//协议条款
            }
            this.addCommodityShow = 1
        }
      },
      add(){
         this.form={
            id:'',//商品ID
            name: '',//商品名称
            productType:null,//商品类型
            productCategory:null,//商品类别
            currentPrice:0,//商品价格
            originalPrice:0,//商品原始价格
            total:0,//商品数量
            current:0,//商品剩余数量
            endTime:'',//失效时间
            state:true,//商品状态 1为有效，0为无效
            image:'',//商品图片
            sourceWeb:'',//来源网站
            shortIntro:'',//商品短介绍
            fullIntro:'',//商品详细介绍
            termsConditions:'',//协议条款
        }
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
      getTableData3(){
        this.loading = true
        var that = this;
        that.$http.get(process.env.API_ROOT+'/cms/product/list?pageNum='+this.currentPage1+'&pageSize=10'+'&isShow='+this.value
        ).then(function(response){
            const datas = response.data;
            this.tableData3 = datas.data.data
            this.totalCount = datas.data.total
            this.loading = false
        },function(error){
            this.loading = false
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
            this.$http.post(
                    process.env.API_ROOT+'/cms/product/saveOrUpdate',
                    {
                        ids:id,
                        state:0
                    },
                    {'headers':{'Content-Type':'application/json'}}
                ).then(function(response){
                    this.$message({
                        message: this.$t('message.updateSucc'),
                        type: 'success'
                    })
                    this.getTableData3()
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
            this.$http.post(
                    process.env.API_ROOT+'/cms/product/saveOrUpdate',
                    {
                        ids:id,
                        state:1
                    },
                    {'headers':{'Content-Type':'application/json'}}
                ).then(function(response){
                    this.$message({
                        message: this.$t('message.updateSucc'),
                        type: 'success'
                    })
                    this.getTableData3()
                })
         }
      }
    },
     watch: {
    'currentPage1': function () {
      this.getTableData3()
    },
    'value': function (){
        this.getTableData3()
    },
    'updateShow':function(){
        if(this.updateShow == true){
            document.body.style.overflow = "hidden"
        }else{
             document.body.style.overflow = "auto"
        }
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

