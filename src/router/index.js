import Vue from 'vue'
import Router from 'vue-router'

// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirect in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
**/
export const constantRouterMap = [
  { path: '/', component: () => import('@/views/login/index'), hidden: true },
  { path: '/404', component: () => import('@/views/404'), hidden: true },
  { path: '/401', component: () => import('@/views/401'), hidden: true },

  // 首页
  {
    path: '/',
    component: Layout,
    redirect: 'dashboard',
    children: [
      {
        path: '/dashboard',
        component: () => import('@/views/dashboard/index'),//@/views/dashboard/index
        name: 'dashboard',
        meta: { title: 'dashboard', icon: 'dashboard', noCache: true }
      }
    ]
  },
  //用户管理
  //用户列表
  //用户设备表
  {
    path:'',
    component: Layout,
    redirect: 'noredirect',
    name:'user',
    meta:{title:'userManagement'},
    children:[
      {
        path:'userList',
        component:()=>import('@/views/user/userList'),
        name:'userList',
        meta: { title: 'userlist' }
      },
      {
        path:'userEquipmentList',
        component:()=>import('@/views/user/userEquipmentList'),
        name:'userEquipmentList',
        meta:{title:'userequipmentlist'}
      },
      {
        path:'blackList',
        component:()=>import('@/views/user/blackList'),
        name:'blacklist',
        meta:{title:'blacklist'}
      },
    ]
  },
   //管理员设置
   {
    path: '',
    component:Layout,
    redirect: 'noredirect',
    name: 'admin',
    meta:{title:'administratorsettings'},
    children:[
      {
        path: 'adminList',
        component:()=>import('@/views/administrator/administrator'),
        name: 'adminList',
        meta:{title: 'Administratorlist' }
      },
      {
        path: 'roleList',
        component:()=>import('@/views/administrator/roleList'),
        name: 'roleList',
        meta:{title: 'Rolelist' }
      }
    ]
  },
   //商品管理
    //商品列表
    //日成交记录
    //话费兑换管理
    //优惠码管理
    //商品兑换
    {
      path:'',
      component:Layout,
      redirect: 'noredirect',
      name:'commodity',
      meta:{title:'commoditymanagement'},
      children:[
        {
          path:'commodityList',
          component:()=>import('@/views/commodity/commodityList'),
          name:'commodityList',
          meta:{title:'productlist'}
        },
        {
          path:'dailyTransactionRecord',
          component:()=>import('@/views/commodity/dailyTransactionRecord'),
          name:'dailyTransactionRecord',
          meta:{title:'dailytransactionrecord'}
        },
        {
          path:'exchangeFee',
          component:()=>import('@/views/commodity/exchangeFee'),
          name:'exchangeFee',
          meta:{title:'callchargemanagement'}
        },
        {
          path:'promoCode',
          component:()=>import('@/views/commodity/promoCode'),
          name:'promoCode',
          meta:{title:'discountcodemanagement'}
        },
        {
          path:'commodityExchange',
          component:()=>import('@/views/commodity/commodityExchange'),
          name:'promoCode',
          meta:{title:'commodityExchange'}
        }
      ]
    },
    //事件管理
    //事件列表
    //事件配置
    //阅读事件预览
    //特殊内容管理
    //开宝事件预览
    //邀请事件
    //邀请跟踪
    //触发型事件
    //签到
    
    
  {
    path:'',
    component:Layout,
    redirect: 'noredirect',
    name:'event',
    meta:{title:'eventManagement'},
    children:[
      {
        path:'eventList',
        component:()=>import('@/views/eventManagement/eventList'),
        name:'eventList',
        meta:{title:'listofevents'}
      },
      {
        path:'eventConfiguration',
        component:()=>import('@/views/eventManagement/EventConfiguration'),
        name:'eventConfiguration',
        meta:{title:'事件配置'}
      },
      {
        path:'read',
        component:()=>import('@/views/eventManagement/read'),
        name:'read',
        meta:{title:'readingeventpreview'}
      },
      {
        path:'kaiBao',
        component:()=>import('@/views/eventManagement/kaiBao'),
        name: 'kaiBao',
        meta:{title: 'opentreasurecasepreview'}
      },
      {
        path: 'invite',
        component:()=>import('@/views/eventManagement/invite'),
        name: 'invite',
        meta:{title: 'invitationevent'}
      },
      {
        path: 'invitationTracking',
        component:()=>import('@/views/eventManagement/invitationTracking'),
        name: 'invitationTracking',
        meta:{title: 'invitationtracking'}
      },
      {
        path: 'trigger',
        component:()=>import('@/views/eventManagement/trigger'),
        name: 'trigger',
        meta:{title: 'triggeredevents'}
      },
      {
        path: 'share',
        component:()=>import('@/views/eventManagement/checkin'),
        name: 'share',
        meta:{title: 'signin'}
      } 
    ]
  },
  //系统配置
  {
    path: '',
    component:Layout,
    redirect: 'noredirect',
    name: 'system',
    children:[
      {
        path: 'system',
        component:()=>import('@/views/systemConfig/configList'),
        name: 'system',
        meta:{title: 'systemConfiguration' }
      }
    ]
  },
  { path: '*', redirect: '/404', hidden: true }
]

export default new Router({
  //mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

export const asyncRouterMap = [
  
  
]
