<template>
  <div class="dashboard-container">
    <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
      <el-radio-group v-model="active" style="margin-bottom: 30px;">
        <el-radio-button label="overview" :class="{active: active === 'overview'}" @click="show('overview')">{{$t('route.overview')}}</el-radio-button>
        <!-- <el-radio-button label="dailyData" :class="{ active: active === 'dailyData' }" @click="show('dailyData')">{{$t('route.dailydata')}}</el-radio-button> -->
        <el-radio-button label="leaderboard" :class="{ active: active === 'leaderboard' }" @click="show('leaderboard')">{{$t('route.leaderboard')}}</el-radio-button>
        <el-radio-button label="incident" :class="{ active: active === 'incident' }" @click="show('incident')">{{$t('route.event')}}</el-radio-button>
      </el-radio-group>
      <div class="view">
        <v-overview v-if="active==='overview'"></v-overview>
        <!-- <v-dailyData v-if="active==='dailyData'"></v-dailyData> -->
        <v-leaderboard v-if="active==='leaderboard'"></v-leaderboard>
        <v-incident v-if="active==='incident'"></v-incident>
      </div>
    </el-row>
  </div>
</template>

<script>
import overview from './components/overview'
import dailyData from './components/dailyData'
import leaderboard from './components/leaderboard'
import incident from './components/incident'

export default {
  name: 'dashboard',
  components: {
    'v-overview': overview,
    'v-dailyData': dailyData,
    'v-leaderboard': leaderboard,
    'v-incident': incident
  },
  data() {
    return {
      active: 'overview',
      loadingActiveData: false,
      // TODO: 默认只查7天内的数据
      days: 7
    }
  },
  computed: {

  },
  methods: {
    show(i) {
      this.active = i
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;

    el-button .overview,el-button .leaderboard,el-button .dailyData,el-button .incident {
       color: #fff;
       background: #2896ff;
    }
  }
}
  .dashboard-container{
    width: 80%;
    margin-left: auto;
    margin-right: auto;
  }
</style>
