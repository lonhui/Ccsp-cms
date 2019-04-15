<template>
    <div id="leaderboard">
        <div>
            <span class="demonstration">{{$t('button.list')}}：</span>
            <el-select v-model="value1">
                <el-option v-for="item in options1" :key="item.value" :label="item.label" :value="item.value" :disabled="item.disabled"></el-option>
            </el-select>
            <span class="demonstration">{{$t('button.sortingrules')}}：</span>
            <el-select v-model="value2">
                <el-option v-for="item in options2" :key="item.value" :label="item.label" :value="item.value" :disabled="item.disabled"></el-option>
            </el-select>
        </div>
        <div class="rank">
            <!-- 日榜 -->
            <v-dayRank v-if="value1 === '1'" :value2="value2"></v-dayRank>
            <!-- 周绑 -->
            <v-weekRank v-if="value1 === '2'" :value2="value2"></v-weekRank>
            <!-- 月榜 -->
            <v-monthRank v-if="value1 === '3'" :value2="value2"></v-monthRank>
        </div>
    </div>
</template>

<script>
import dayRank from "./rank/dayRank"
import weekRank from "./rank/weekRank"
import monthRank from "./rank/monthRank"

export default {
    data() {
        return {
            // 榜单选项
            options1: [{
                value: '1',
                label: this.$t('button.dailyranking')
            }, {
                value: '2',
                label: this.$t('button.weeklyranking')
            }, {
                value: '3',
                label: this.$t('button.monthlyrankings')
            }],
            value1: '1',
            // 查询条件选项
            options2: [{
                value: '1',
                label: this.$t('button.gold')
            }, {
                value: '2',
                label: this.$t('button.integral')
            }],
            value2: '1'
        }
    },
    components: {
        'v-dayRank': dayRank,
        'v-weekRank': weekRank,
        'v-monthRank': monthRank
    }
}
</script>

<style scoped>

.block{
    margin-top: 20px;
}
.search{
     margin-top: 20px;
}
.rank{
    margin-top: 20px;
}
</style>

