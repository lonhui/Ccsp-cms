<template>
    <!-- 添加caping商品 -->
    <el-form ref="form" :model="form" label-width="180px">
        <el-form-item :label="$t('table.productname')" class="property" prop="name"
        :rules="[
            { required: true, message: $t('message.enterProductName'), trigger: 'blur' },
        ]">
            <el-input v-model="form.name" style="width:500px"></el-input>
        </el-form-item>
        <!-- 下拉框选项写死 商品类型-->
        <el-form-item :label="$t('table.ProductTypes')" class="property" 
        :rules="[
            { required: true, message: '', trigger: 'blur' },
        ]">
            <el-select v-model="form.productType" :placeholder="$t('table.selectproducttype')" style="width:300px">
                <el-option :label="$t('table.Recharge')" :value=1 ></el-option>
                <el-option :label="$t('table.coupon')" :value=2 ></el-option>
            </el-select>
        </el-form-item>
        <!-- 下拉框选项写死 商品类别-->
        <el-form-item :label="$t('table.ProductCategory')" class="property" 
        :rules="[
            { required: true, message: '', trigger: 'blur' },
        ]">
            <el-select v-model="form.productCategory" :placeholder="$t('table.ProductSelectType')" style="width:300px">
                <el-option :label="$t('button.virtualmerchandise')" :value=1></el-option>
                <el-option :label="$t('button.Physicalgoods')" :value=2></el-option>
            </el-select>
        </el-form-item>
        <!-- 下拉框选项写死   话费金额(仅当商品类型为话费充值的时候显示) -->
        <el-form-item :label="$t('table.Callamount')" class="property" v-if="form.productType==1" prop="pulsa_code"
        :rules="[
            { required: true, message: '', trigger: 'blur' },
        ]">
            <el-select v-model="form.pulsa_code" :placeholder="$t('message.selectAmountCall')" style="width:300px">
                <el-option label="10000" value="pulsa10000"></el-option>
                <el-option label="20000" value="pulsa20000"></el-option>
                <el-option label="30000" value="pulsa30000"></el-option>
                <el-option label="50000" value="pulsa50000"></el-option>
            </el-select>
        </el-form-item>
        <!-- 开关按钮  是否为特殊优惠卷(仅当优惠卷数量为一时)-->
         <el-form-item :label="$t('button.isSpecial')" class="property" v-if="form.productType==2">
            <el-switch v-model="form.is_special"></el-switch><span class="special-prompt">（{{$t('message.isSpecial')}}）</span>
        </el-form-item>
        <!-- 商品价格 -->
        <el-form-item :label="$t('table.Commodityprice')" class="property">
            <el-input-number v-model="form.currentPrice" controls-position="right" @change="handleChange" :min="0"></el-input-number>
        </el-form-item>
        <!-- 商品原价 -->
        <el-form-item :label="$t('table.ProducOriginalPrice')" class="property">
            <el-input-number v-model="form.originalPrice" controls-position="right" @change="handleChange" :min="0"></el-input-number>
        </el-form-item>
        <!-- 商品总量 -->
        <el-form-item :label="$t('table.ProductTotal')" class="property">
            <el-input-number v-model="form.total" controls-position="right" @change="handleChange" :min="0"></el-input-number>
        </el-form-item>
        <!-- 商品余量 -->
        <el-form-item :label="$t('table.ProductBalance')" class="property">
            <el-input-number v-model="form.current" controls-position="right" @change="handleChange" :min="0"></el-input-number>
        </el-form-item>
        <!-- 失效时间 -->
        <el-form-item :label="$t('table.Failuretime')">
            <el-date-picker v-model="form.endTime" type="datetime" :placeholder="$t('button.Selectdatetime')" value-format="yyyy-MM-dd HH:mm:ss" style="width:300px"></el-date-picker>
        </el-form-item>
        <!-- 商品状态 -->
        <el-form-item :label="$t('table.ProductStatus')" class="property">
            <el-switch v-model="form.state"></el-switch>
        </el-form-item>
        <!-- 商品图片 -->
        <el-form-item :label="$t('table.productPicture')" 
        :rules="[
            { required: true, message: '', trigger: 'blur' },
        ]">
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
        <!-- 来源网站 -->
        <el-form-item :label="$t('table.SourceWebsite')">
            <el-input type="textarea" v-model="form.sourceWeb"></el-input>
        </el-form-item>
        <!-- 商品简介-->
        <el-form-item :label="$t('table.ProductDescription')">
            <el-input type="textarea" v-model="form.shortIntro"></el-input>
        </el-form-item>
        <!-- 商品详情 -->
         <el-form-item :label="$t('table.productDetails')" prop="fullIntro">
            <quill-editor v-model="form.fullIntro"
                        ref="myQuillEditor"
                        :options="editorOption"
                        @blur="onEditorBlur($event)"
                        @focus="onEditorFocus($event)"
                        @ready="onEditorReady($event)">
            </quill-editor>
        </el-form-item>
        <!-- 协议条款 -->
         <el-form-item :label="$t('table.TermsAgreement')" prop="termsConditions">
            <quill-editor v-model="form.termsConditions"
                        ref="myQuillEditor"
                        :options="editorOption"
                        @blur="onEditorBlur($event)"
                        @focus="onEditorFocus($event)"
                        @ready="onEditorReady($event)">
            </quill-editor>
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
  Quill.register('modules/imageDrop', ImageDrop)
  Quill.register('modules/imageResize', ImageResize)

export default {
    props:['data'],
    data() {
      return {
        form: {
            name: '',//商品名称
            productType:null,//商品类型
            productCategory:null,//商品类别
            currentPrice:0,//商品价格
            originalPrice:0,//商品原始价格
            total:0,//商品数量
            is_special:0,
            current:0,//商品剩余数量
            endTime:'',//失效时间
            state:0,//商品状态 1为有效，0为无效
            image:'',//商品图片
            sourceWeb:'',//来源网站
            shortIntro:'',//商品短介绍
            fullIntro:'',//商品详细介绍
            termsConditions:'',//协议条款
        },
        iconUploading: false,
        productType: 1,
        imageUrl: '',
        a:{
          imageType:8
        },
        editorOption: {
          modules: {
            toolbar: [
              ['bold', 'italic', 'underline', 'strike'],
              ['blockquote', 'code-block'],
              [{ 'header': 1 }, { 'header': 2 }],
              [{ 'list': 'ordered' }, { 'list': 'bullet' }],
              [{ 'script': 'sub' }, { 'script': 'super' }],
              [{ 'indent': '-1' }, { 'indent': '+1' }],
              [{ 'direction': 'rtl' }],
              [{ 'size': ['small', false, 'large', 'huge'] }],
              [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
              [{ 'font': [] }],
              [{ 'color': [] }, { 'background': [] }],
              [{ 'align': [] }],
              ['clean'],
              ['link', 'image', 'video']
            ],
            history: {
              delay: 1000,
              maxStack: 50,
              userOnly: false
            },
            imageDrop: true,
            imageResize: {
              displayStyles: {
                backgroundColor: 'black',
                border: 'none',
                color: 'white'
              },
              modules: ['Resize', 'DisplaySize', 'Toolbar']
            }
          }
        }
      }
    },
    mounted(){
        if(this.data!=null){
            if(this.data.state==1){
                this.data.state = true
            }else{
                this.data.state = false
            }
            this.imageUrl = this.data.image
            this.form = this.data
            if(this.data.is_special){
                if(this.data.is_special==1){
                    this.form.is_special=true
                }else{
                    this.form.is_special=false
                }
            }
            
        }
    },
    methods: {
        close(){
            this.$emit('on-close')
        },
        onSubmit() {
            if(this.form.name==null||this.form.name==''){
                this.$message.warning(this.$t('message.productNameCannotNull'));
            }else if(this.form.productType==null||this.form.productType==''){
                this.$message.warning(this.$t('message.productTypeCannotNull'));
            }else if(this.form.productCategory==null||this.form.productCategory==''){
                this.$message.warning(this.$t('message.productCategoryCannotNull'));
            }else{
                if(this.form.productType==1){
                    if(this.form.pulsa_code==null||this.form.pulsa_code==''){
                        this.$message.warning(this.$t('message.pulsa_codeCannotNull'));
                    }else{
                        this.send()
                    }
                }else{
                    this.send()
                }
            }
        },
        // 提交发送请求
        send(){
            if(this.form.state){
                this.form.state = 1
            }else{
                this.form.state = 0
            }
            if(this.form.is_special){
                this.form.is_special = 1
            }else{
                this.form.is_special = 0
            }
            this.$http.post(
                process.env.API_ROOT+'/cms/product/saveOrUpdate',
                this.form,
                {'headers':{'Content-Type':'application/json'}}
            ).then(function(response){
                if(response.data.code==0){
                    this.$message({
                        message: this.$t('message.updateSucc'),
                        type: 'success'
                    })
                    this.close()
                }else{
                    this.$message({
                        message: '更新失败！',
                        type: 'danger'
                    })
                }
            })
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
        },
        //上传图片end
       
        onEditorBlur(editor) {
            //console.log('editor blur!', editor)
        },
        onEditorFocus(editor) {
            //console.log('editor focus!', editor)
        },
        onEditorReady(editor) {
            //console.log('editor ready!', editor)
        }
    },
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
  .special-prompt{
      color: #E6A23C;
      padding-left: 10px;
  }
</style>
