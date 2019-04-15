<template>
    <!-- 添加京东商品 -->
    <el-form ref="form" :rules="rules" :model="form" label-width="180px">
        <el-form-item :label="$t('table.productname')" class="property" prop="name">
            <el-input v-model="form.name" style="width:500px"></el-input>
        </el-form-item>
        <el-form-item :label="$t('table.ProductCategory')" class="property" prop="productCategory">
            <el-select v-model="form.productCategory" :placeholder="$t('table.ProductSelectType')" style="width:300px">
            <el-option :label="$t('button.virtualmerchandise')" :value=1></el-option>
            <el-option :label="$t('button.Physicalgoods')" :value=2></el-option>
            </el-select>
        </el-form-item>
        <el-form-item :label="$t('table.Commodityprice')" class="property">
            <el-input-number v-model="form.currentPrice" controls-position="right" @change="handleChange" :min="0"></el-input-number>
        </el-form-item>
        <el-form-item :label="$t('table.ProductStatus')" class="property">
            <el-switch v-model="form.state"></el-switch>
        </el-form-item>
        <el-form-item :label="$t('table.productPicture')" prop="image">
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
        </el-form-item>
        <el-form-item :label="$t('table.SourceWebsite')" prop="sourceWeb">
            <el-input type="textarea" v-model="form.sourceWeb"></el-input>
        </el-form-item>
        <el-form-item :label="$t('table.ProductDescription')">
            <el-input type="textarea" v-model="form.shortIntro"></el-input>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="onSubmit">{{$t('button.confirm')}}</el-button>
            <el-button @click="close">{{$t('button.cancel')}}</el-button>
        </el-form-item>
    </el-form>
</template>

<script>
  import VueQuillEditor, { Quill } from 'vue-quill-editor'
  import { ImageDrop } from 'quill-image-drop-module'
  import ImageResize from 'quill-image-resize-module'

export default {
    props:['data'],
    data() {
      return {
        form: {
            name: '',//商品名称
            productCategory:null,//商品类别
            currentPrice:0,//商品价格
            state:true,//商品状态 1为有效，0为无效
            image:'',//商品图片
            sourceWeb:'',//来源网站
            shortIntro:'',//商品短介绍
            fullIntro:'',//商品详细介绍
            termsConditions:'',//协议条款
            isShow:1
        },
        iconUploading: false,
        productType: 1,
        imageUrl: '',
        a:{
          imageType:8
        },
        rules: {
          name: [
            { required: true, message: '请输入商品名称', trigger: 'blur' }
          ],
          productCategory:[
              { required: true, message: '请选择商品类型', trigger: 'blur' }
          ],
          image:[
              { required: true, message: '请上传商品图片', trigger: 'blur' }
          ],
          sourceWeb:[
              { required: true, message: '请输入商品来源网站', trigger: 'blur' }
          ]
        }
      }
    },
    mounted(){
        if(this.data.state==1){
            this.data.state = true
        }else{
            this.data.state = false
        }
        this.imageUrl = this.data.image
        this.form = this.data
        
    },
    methods: {
        close(){
            this.$emit('on-close')
        },
        onSubmit() {
             if(this.form.name==null||this.form.name==''){
                this.$message({
                    message: '请选择商品名称',
                    type: 'warning'
                })
            
            }else if(this.form.productCategory==null||this.form.productCategory==''){
                this.$message({
                    message: '请选择商品类型',
                    type: 'warning'
                })
            }else if(this.form.image==null||this.form.image==''){
                this.$message({
                    message: '请上传商品图片',
                    type: 'warning'
                })
            }else if(this.form.sourceWeb==null||this.form.sourceWeb==''){
                this.$message({
                    message: '请输入商品来源网站',
                    type: 'warning'
                })
            }else{
                if(this.form.state){
                    this.form.state = 1
                }else{
                    this.form.state = 0
                }
                this.form.isShow=1
                this.$http.post(
                    process.env.API_ROOT+'/cms/product/saveOrUpdate',
                    this.form,
                    {'headers':{'Content-Type':'application/json'}}
                ).then(function(response){
                    this.$message({
                        message: this.$t('message.updateSucc'),
                        type: 'success'
                    })
                    this.close()
                })
            }
        },
        handleChange(value) {
            // console.log(value);
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
        }
    }
}
</script>

<style scoped>
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
  .el-form{
      margin-bottom: 100px;
  }
</style>
