<template>
  <el-menu class="navbar" mode="horizontal">
    <!-- :isActive="sidebar.opened" -->
    <hamburger class="hamburger-container" :isActive="true" :toggleClick="toggleSideBar"></hamburger>
    <breadcrumb></breadcrumb>

    <div class="right-menu">
      <!-- 选择语言 -->
      <lang-select class="international right-menu-item"></lang-select>

      <el-dropdown class="avatar-container right-menu-item" trigger="hover">
        <!-- <div class="avatar-wrapper">
          <img class="user-avatar" :src="avatar+'?imageView2/1/w/80/h/80'">
          <i class="el-icon-caret-bottom"></i>
        </div> -->
        <span class="user-icon-container">
          <svg-icon icon-class="user"></svg-icon>
        </span>
        <el-dropdown-menu class="user-dropdown" slot="dropdown">
          <el-dropdown-item disabled>{{name}}</el-dropdown-item>
          <router-link class="inlineBlock" to="/dashboard">
            <el-dropdown-item>
              Home
            </el-dropdown-item>
          </router-link>
          <el-dropdown-item divided>
            <span @click="logout" style="display:block;">LogOut</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </el-menu>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import LangSelect from '@/components/LangSelect'
 
export default {
  components: {
    Breadcrumb,
    Hamburger,
    LangSelect
  },
  computed: {
    ...mapGetters(['sidebar', 'name'])
  },
  methods: {
    toggleSideBar() {
      // this.$store.dispatch('ToggleSideBar')
    },
    logout() {
      this.$router.push({ path: '/' })
      this.$store.dispatch('LogOut').then(() => {
        location.reload() // 为了重新实例化vue-router对象 避免bug
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.navbar {
  height: 50px;
  line-height: 50px;
  border-radius: 0px !important;
  .hamburger-container {
    line-height: 58px;
    height: 50px;
    float: left;
    margin-left: 45px;
    padding: 0 10px;
  }
  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }
  .screenfull {
    position: absolute;
    right: 90px;
    top: 16px;
    color: red;
  }
  .right-menu {
    float: right;
    height: 100%;
    &:focus {
      outline: none;
    }
    .right-menu-item {
      display: inline-block;
      margin: 0 8px;
    }
    .international {
      vertical-align: top;
    }
    .avatar-container {
      height: 50px;
      margin-right: 30px;
      .avatar-wrapper {
        cursor: pointer;
        margin-top: 5px;
        position: relative;
        .user-avatar {
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }
        .el-icon-caret-bottom {
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
      .user-icon-container {
        font-size: 2em;
        cursor: pointer;
      }
    }
  }
}
.svg-container {
  padding: 6px 5px 6px 15px;
  color: #889aa4;
  vertical-align: middle;
  width: 30px;
  display: inline-block;
}
</style>

