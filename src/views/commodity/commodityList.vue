<template>
	<div class="commodity">
			<div class="button">
				<el-button type="warning" plain @click="Dropoff">{{$t('button.Dropoff')}}</el-button>
                <el-button type="success" plain @click="Shelf">{{$t('button.Shelf')}}</el-button>
				<el-button type="primary" plain @click="add">{{$t('button.addto')}}</el-button>
			</div>
			<div class="list">
                <el-table ref="multipleTable" :data="tableData3" tooltip-effect="dark" style="width: 100%" v-loading="loading">
                    <el-table-column type="selection" width="55"></el-table-column>
                    <el-table-column prop="id" width="100px" :label="$t('table.ProductNumber')"></el-table-column>
                    <el-table-column prop="image" :label="$t('table.image')"  width="100">
                        <template slot-scope="scope">
                            <img  :src="scope.row.image" alt="" style="width: 50px;height: 50px">
                        </template>
                    </el-table-column>
                        <el-table-column prop="name" :label="$t('table.productname')" width="120"></el-table-column>
                        <el-table-column prop="currentPrice" :label="$t('table.Commodityprice')" width="100"></el-table-column>
                        <el-table-column prop="total" :label="$t('table.Thetotalamount')" width="100px"></el-table-column>
                    <el-table-column prop="current" :label="$t('table.margin')" width="90px"></el-table-column>
                        <el-table-column prop="addTime" :label="$t('table.Effectivetime')" width="160px"></el-table-column>
                        <el-table-column prop="endTime" :label="$t('table.Failuretime')" width="160px"></el-table-column>
                    <el-table-column prop="state" :label="$t('table.status')" width="80px">
                        <template slot-scope="scope">
                            <a href="javascript:;">{{scope.row.state==1?$t('table.status1'):$t('table.status0')}}</a>
                        </template>
                    </el-table-column>
                    <el-table-column :label="$t('table.actions')" width="80">
                        <template slot-scope="scope">
                            <el-button type="text" size="small" @click="openUpdateShow(scope.$index,scope.row)">{{$t('table.edit')}}</el-button>
                        </template>
                    </el-table-column>
                </el-table>
			</div>
        <div class="block">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="currentPage1" :page-size="10" layout="total, prev, pager, next" :total="totalCount"></el-pagination>
        </div>
        <div class="box" v-if="updateShow">
            <div class="centont">
                <table class="table">
                    <tr>
                        <td><span class="demonstration">{{$t('table.productname')}}:</span></td>
                        <td><el-input :placeholder="$t('button.pleaseentercontent')" style="width:80%"  v-model="form.name"></el-input></td>
                    </tr>
                    <tr>
                       <td><span class="demonstration">{{$t('table.ProductTypes')}}:</span></td>
                       <td>
                          <el-select v-model="productType" clearable :placeholder="$t('button.pleasechoose')">
                            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
                          </el-select>
                        </td>
                    </tr>
                    <tr>
                        <td><span class="demonstration">{{$t('table.Commodityprice')}}:</span></td>
                        <td><el-input v-model="form.currentPrice" :placeholder="$t('button.pleaseentercontent')" type="number" style="width:80%"></el-input></td>
                    </tr>
                    <tr>
                        <td><span class="demonstration">{{$t('table.Thetotalamount')}}:</span></td>
                        <td><el-input v-model="form.total" :placeholder="$t('button.pleaseentercontent')" type="number" style="width:80%"></el-input></td>
                    </tr>
                    <tr>
                        <td><span class="demonstration">{{$t('table.margin')}}:</span></td>
                        <td><el-input v-model="form.current" :placeholder="$t('button.pleaseentercontent')" type="number" style="width:80%"></el-input></td>
                    </tr>
                    <tr>
                        <td><span class="demonstration">{{$t('table.Effectivetime')}}:</span></td>
                        <td> <el-date-picker v-model="form.addTime" type="datetime" :placeholder="$t('button.Selectdatetime')" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker></td>
                    </tr>
                    <tr>
                        <td><span class="demonstration">{{$t('table.Failuretime')}}:</span></td>
                        <td><el-date-picker v-model="form.endTime" type="datetime" :placeholder="$t('button.Selectdatetime')" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker></td>
                    </tr>
                     <tr>
                        <td><span class="demonstration">{{$t('table.uploadimage')}}:</span></td>
                        <td>
                            <el-upload class="avatar-uploader" 
                                action="https://ai.caping.co.id/Start/uploadpic" 
                                name="imageData"
                                :data="a"
                                :show-file-list="false" 
                                :on-success="handleAvatarSuccess" 
                                :before-upload="beforeAvatarUpload"
                                :on-progress="handleAvatarProgress"
                                :on-error="handleAvatarError">
                                <img v-if="imageUrl" :src="imageUrl" class="avatar">
                                <i v-else class="el-icon-plus avatar-uploader-icon"  v-loading="iconUploading" element-loading-text="Loading"></i>
                            </el-upload>
                        </td>
                    </tr>
                    <tr>
                        <td></td>
                        <td><el-button type="primary" @click="closeUpdateShow">{{$t('button.cancel')}}</el-button><el-button type="primary" @click="tijiao">{{$t('button.submit')}}</el-button></td>
                    </tr>
                   
                </table>
            </div>
        </div>
	</div>
    
</template>

<script>

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
        }
      }
    },
    mounted(){
      this.getTableData3()
    },
    methods: {
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
        this.form = {
            id:item.id,
            name:item.name,
            currentPrice:item.currentPrice,
            total:item.total,
            current:item.current,
            addTime:item.addTime,
            endTime:item.endTime,
            image:item.image,
            productType:item.productType
        }
        this.imageUrl = this.form.image
        this.updateShow = true
      },
      add(){
         this.form={
            id:null,
            name:null,
            productType:null,
            currentPrice:null,
            total:null,
            current:null,
            addTime:null,
            endTime:null,
            image:''
        }
        this.imageUrl = this.form.image
        this.updateShow = true
      },
      closeUpdateShow(){
        this.updateShow = false
      },
        // 分页
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
      },
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
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
        that.$http.get('http://ccsp.caping.co.id/cms/product/list'
        ).then(function(response){
            console.log(response)
            const datas = response.data;
            this.tableData3 = datas.data.data
            this.totalCount = datas.data.total
            this.loading = false
        },function(error){
            this.loading = false
            console.log(error)
        })
      },
      //提交修改或新增
      tijiao(){
        this.form.productType = this.productType
        var that = this;
        that.$http.post('http://ccsp.caping.co.id/cms/product/saveOrUpdate', this.form
        ).then(function(response){
            console.log(response);
            const datas = response.data;
            if(datas.message==="OK"){
                this.$message({
                    message: this.$t('message.updateSucc'),
                    type: 'success'
                })
                this.closeUpdateShow()
                this.getTableData3()
            }else{
                this.$message({
                    message: this.$t('message.fail'),
                    type: 'error'
                })
            }
        },function(error){
            console.log(error)
        })
      },
      //下架
      Dropoff(){
         const id=[]
         for(let i=0;i<this.multipleSelection.length;i++){
           id.push(this.multipleSelection[i].id)
         }
          var that = this;
          that.$http.get('http://ccsp.caping.co.id/cms/product/ban'+'?ids='+id
          ).then(function(response){
              console.log(response)
              const datas = response.data;
              if(datas.code===0){
                  this.$message({
                    message: this.$t('message.succ'),
                    type: 'success'
                })
              }else{
                  this.$message({
                    message: this.$t('message.fail'),
                    type: 'error'
                })
              }
          },function(error){
              console.log(error)
          })
      },
      //上架
      Shelf(){
         const id=[]
         for(let i=0;i<this.multipleSelection.length;i++){
           id.push(this.multipleSelection[i].id)
         }
          var that = this;
          that.$http.get('http://ccsp.caping.co.id/cms/product/active'+'?ids='+id
          ).then(function(response){
              console.log(response)
              const datas = response.data;
              if(datas.code===0){
                  this.$message({
                    message: this.$t('message.succ'),
                    type: 'success'
                })
              }else{
                  this.$message({
                    message: this.$t('message.fail'),
                    type: 'error'
                })
              }
          },function(error){
              console.log(error)
          })
      }
    },
     watch: {
    'currentPage1': function () {
      this.getTableData3()
    },
    'multipleSelection': function () {
       console.log(this.multipleSelection)
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
    width: 80%;
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
</style>

