<template>
    <div class="exchangeFee">
        <div class="search">
            <span class="demonstration">{{$t('table.startDate')}}</span>
                <el-date-picker v-model="startTime" align="right" type="date" value-format="yyyy-MM-dd" :picker-options="pickerOptions1"></el-date-picker>
            <span class="demonstration">{{$t('table.endDate')}}</span>
                <el-date-picker v-model="endTime" align="right" type="date" value-format="yyyy-MM-dd" :picker-options="pickerOptions1"></el-date-picker>
                <el-button icon="el-icon-search" @click="inquire" circle ></el-button>
            <span class="commodityType">{{$t('table.ProductTypes')}}:</span>
                <el-select v-model="value" :placeholder="$t('button.pleasechoose')">
                  <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
        </div>
        <div class="tabl">
            <el-table :data="DataList" border style="width: 100%" v-loading="loading">
              <el-table-column type="index" :index="typeIndex" width="100px" :label="$t('table.id')"></el-table-column>
              <el-table-column prop="mobile" :label="$t('table.Exchangecode')"></el-table-column>
              <el-table-column prop="state" :label="$t('table.Exchangestatus')" width="80px">
                  <template slot-scope="scope">
                      <a href="javascript:;">{{scope.row.state == 1 ? $t('table.Redeemed'): $t('table.Notredeemed')}}</a>
                  </template>
              </el-table-column>
              <el-table-column prop="productName" :label="$t('table.productname')" ></el-table-column>
              <el-table-column prop="uid" :label="$t('table.userID')" ></el-table-column>
              <el-table-column prop="createTime" :label="$t('table.Exchangetime')" ></el-table-column>
              <el-table-column :label="$t('table.actions')" width="80" v-if="value===2">
                <template slot-scope="scope">
                    <el-button type="text" size="small" @click="openUpdata">{{$t('table.edit')}}</el-button>
                </template>
              </el-table-column>
          </el-table>
        </div>
        <div class="block">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="currentPage1" :page-size="10" layout="total, prev, pager, next" :total="totalCount"></el-pagination>
        </div>
        <v-updata v-if="updataShow" @on-close="closeUpdata"></v-updata>
    </div>
</template>

<script>
import updata from './components/updata'

export default {
	data() {
      return {
        pickerOptions1: {
          disabledDate(time) {
            return time.getTime() > Date.now();
          },
          shortcuts: [{
            text: this.$t('message.today'),
            onClick(picker) {
              picker.$emit('pick', new Date());
            }
          }, {
            text: this.$t('message.yesterday'),
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24);
              picker.$emit('pick', date);
            }
          }, {
            text: this.$t('message.aweekago'),
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', date);
            }
          }]
        },
        loading:false,
        currentPage1: 1,
        startTime: '',
        endTime: '',
        DataList:[],
        totalCount: 0,
        updataShow:false,
        options: [{
          value: 1,
          label: this.$t('button.virtualmerchandise')
        }, {
          value: 2,
          label: this.$t('button.Physicalgoods')
        }],
         value: 1
      }
    },
    components:{
      'v-updata':updata
    },
    mounted() {
        this.endTime = this.getEndTime()
        this.startTime = this.getStartTime()
        this.getDataList();
    },
    methods: {
        // 分页
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
      },
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
      },
       openUpdata(){
        this.updataShow = true
      },
      closeUpdata(){
        this.updataShow = false
      },
      getEndTime() {
        const myday = new Date()
        const year = myday.getFullYear()
        const month = (myday.getMonth()+1)<10 ? '0'+(myday.getMonth()+1) : (myday.getMonth()+1)
        const day = myday.getDate()<10 ? '0'+myday.getDate() : myday.getDate()
        return year + "-" + month + "-" + day
    },
    getStartTime() {
      const d = new Date()
      const weekdate = new Date(d-7*24*3600*1000) 
      const year = weekdate.getFullYear()
      const month = (weekdate.getMonth()+1)<10 ? '0'+(weekdate.getMonth()+1) : (weekdate.getMonth()+1)
      const day = weekdate.getDate()<10 ? '0'+weekdate.getDate() : weekdate.getDate()
      return year + "-" + month + "-" + day
    },
     
    getDataList() {
      this.loading = true
      const data = {
        pageNum:this.currentPage1,
        pageSize:10,
        startTime:this.startTime,
        endTime:this.endTime
      }
      var that = this;
      that.$http({
          method:'GET',
          url:'http://ccsp.caping.co.id/cms/product/mobile/list'+'?startTime='+this.startTime+'&endTime='+this.endTime+'&pageSize='+10+'&pageNum='+this.currentPage1+'&productCategory='+this.value,
      }).then(function(response){
          console.log(response);
          const datas = response.data
          if(datas.data!=null){
            this.DataList = datas.data.list
            this.totalCount = datas.data.total
          }
        this.loading = false
      },function(error){
        this.loading = false
          console.log(error);
      })
    },
    inquire() {
      if(this.currentPage1===1){
        this.getDataList()
      }else{
        this.currentPage1 = 1
      }
    },
    typeIndex(index) {
      return index + (this.currentPage1 - 1) * 10 + 1
    },
    table(val) {
      this.currentPage1 = val
    }
  },
  watch: {
    'currentPage1': function () {
      this.getDataList()
    },
    'value': function(){
      this.getDataList()
    }
  }
}

</script>

<style scoped>
.exchangeFee{
	width: 85%;
	margin: 20px auto 0;
}
.tabl{
  margin-top: 20px;
}
.commodityType{
  margin-left: 20px;
}
</style>

