<template>
  <el-dropdown trigger="hover" class='international' @command="handleSetLanguage">
    <div>
      <svg-icon class-name='international-icon' icon-class="language" />
    </div>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item command="zh" :disabled="language==='zh'">中文</el-dropdown-item>
      <el-dropdown-item command="en" :disabled="language==='en'">English</el-dropdown-item>
      <el-dropdown-item command="id" :disabled="language==='id'">Bahasa Indonesia</el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
import eventVue from '@/utils/eventBus'

export default {
  data(){
    return{
      msg:null
    }
  },
  computed: {
    language() {
      return this.$store.getters.language
    }
  },
  methods: {
    handleSetLanguage(lang) {
      this.$i18n.locale = lang
      this.$store.dispatch('setLanguage', lang)
      this.$message({
        message: this.$t('message.switchLangSucc'),
        type: 'success'
      })
      this.abtn()
    },
     abtn:function(){
        eventVue .$emit("myFun",this.msg)   //$emit这个方法会触发一个事件
      }
  }
}
</script>

<style scoped>
.international-icon {
  font-size: 20px;
  cursor: pointer;
  vertical-align: -5px!important;
}
</style>
