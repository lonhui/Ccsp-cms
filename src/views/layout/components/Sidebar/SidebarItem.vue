<template>
  <div class="sidebar">
    <el-menu
      class="sidebar-el-menu"
      :default-active="onRoutes"
      :collapse="collapse"
      background-color="#324157"
      text-color="#bfcbd9"
      active-text-color="#20a0ff"
      unique-opened
      router
    >
      <template v-for="item in item1">
        <template v-if="item.subs">
          <el-submenu :index="item.index" :key="item.index">
            <template slot="title">
              <i :class="item.icon"></i>
              <span slot="title">{{ item.title }}</span>
            </template>
            <el-menu-item
              v-for="(subItem,i) in item.subs"
              :key="i"
              :index="subItem.index"
            >{{ subItem.title }}</el-menu-item>
          </el-submenu>
        </template>
        <template v-else>
          <el-menu-item :index="item.index" :key="item.index">
            <i :class="item.icon"></i>
            <span slot="title">{{ item.title }}</span>
          </el-menu-item>
        </template>
      </template>
    </el-menu>
  </div>
</template>

<script>
import { generateTitle } from '@/utils/i18n'
import eventVue from '@/utils/eventBus'
import { getToken } from '@/utils/auth'

export default {
  props: {
    routes: {
      type: Array
    },
    isNest: {
      type: Boolean,
      default: false
    },
    lang: ''
  },
  methods: {
    generateTitle
  },

  data() {
    return {
      test: [],
      collapse: false,
      items: [],
      item1: [
        {
          icon: 'el-icon-menu',
          index: 'dashboard',
          title: this.$t('route.home')
        }
      ],
      item2: [],
      newlang: null
    }
  },
  computed: {
    onRoutes() {
      return this.$route.path.replace('/', '')
    }
  },
  mounted() {
    this.getMenu()
    this.bbtn()
  },
  methods: {
    getMenu() {
      if (!getToken()) {
        this.$router.push('/')
      } else {
        this.$http
          .get(process.env.API_ROOT + '/cms/sys/user/menu', {
            headers: {
              'X-abn-session-token': getToken()
            }
          })
          .then(
            function(response) {
              const datas = response.data
              const menuList = datas.data
              for (let i = 0; i < menuList.length; i++) {
                if (menuList[i].parent_id === 0) {
                  if (menuList[i].id === 31) {
                    var menu1 = {
                      icon: 'el-icon-setting',
                      id: null,
                      index: null,
                      title: null
                    }
                  } else {
                    var menu1 = {
                      icon: 'el-icon-tickets',
                      id: null,
                      index: null,
                      title: null,
                      subs: []
                    }
                  }
                  menu1.id = menuList[i].id
                  menu1.index = menuList[i].link
                  if (this.newlang == null) {
                    this.newlang = this.$i18n.locale
                  }
                  if (this.newlang === 'zh') {
                    menu1.title = menuList[i].name
                  } else if (this.newlang === 'en') {
                    menu1.title = menuList[i].elink
                  } else if (this.newlang === 'id') {
                    menu1.title = menuList[i].vlink
                  }

                  this.item1.push(menu1)
                } else {
                  for (let j = 0; j < this.item1.length; j++) {
                    if (this.item1[j].id === menuList[i].parent_id) {
                      const sub = {
                        id: null,
                        index: null,
                        title: null
                      }
                      sub.id = menuList[i].id
                      sub.index = menuList[i].link
                      if (this.newlang === 'zh') {
                        sub.title = menuList[i].name
                      } else if (this.newlang === 'en') {
                        sub.title = menuList[i].elink
                      } else if (this.newlang === 'id') {
                        sub.title = menuList[i].vlink
                      }
                      this.item1[j].subs.push(sub)
                    }
                  }
                }
              }
            }
          )
      }
      // let routes = this.$router.options.routes
    },

    bbtn: function() {
      eventVue.$on('myFun', message => {
        // 这里最好用箭头函数，不然this指向有问题
        this.newlang = message
      })
    }
  },
  watch: {
    newlang: function() {
      (this.item1 = [
        {
          icon: 'el-icon-menu',
          index: 'dashboard',
          title: this.$t('route.home')
        }
      ]),
      this.getMenu()
    }
  }
}
</script>
<style>
.sidebar {
  margin-left: -10px;
}
</style>
