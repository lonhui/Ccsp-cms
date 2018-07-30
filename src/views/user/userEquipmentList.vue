<template>
    <div class="userEList">
        <div class="input-button">
            <span class="activeTime">{{$t('table.startDate')}}</span>
            <el-date-picker v-model="activeTime" align="right" type="date" value-format="yyyy-MM-dd" placeholder="选择日期" :picker-options="pickerOptions1"></el-date-picker>
            <span class="endTime">{{$t('table.endDate')}}</span>
            <el-date-picker v-model="endTime" align="right" type="date" value-format="yyyy-MM-dd" placeholder="选择日期" :picker-options="pickerOptions1"></el-date-picker>
            <el-input :placeholder="$t('table.pleaseenterthedevicename')" v-model="input10" style="width:200px" clearable></el-input>
            <el-button icon="el-icon-search" @click="inquire" circle></el-button>
        </div>
        <div class="tabl">
            <el-table :data="DataList" border style="width: 100%" v-loading="loading">
                <el-table-column type="index" :index="typeIndex" width="100px" :label="$t('table.rank')"></el-table-column>
                <el-table-column prop="uid" :label="$t('table.userID')"></el-table-column>
                <el-table-column prop="create_time" :label="$t('table.useractivationtime')" ></el-table-column>
                <el-table-column prop="os" :label="$t('table.useractivationdevice')" ></el-table-column>
            </el-table>
        </div>
        <div class="block">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="currentPage1" :page-size="10" layout="total, prev, pager, next" :total="totalCount"></el-pagination>
        </div>
    </div>
</template>

<script>
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
            // 表格数据
            DataList:[],
            // 分页参数
            currentPage1: 1,
            totalCount: 0,
            
            input10: '',
            activeTime: null,
            endTime:null,
            // 加载参数
            loading:false
        }
    },
    mounted(){
        // this.activeTime = this.getStartTime()
        // this.endTime = this.getEndTime()
        this.getDataList()
    },
    methods: {
        // 分页
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
      },
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
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
    //     this.loading = true
    //   var that = this;
    //   that.$http.post('http://ccsp.caping.co.id/cms/statistic/device'+'?&pageSize='+10+'&pageNum='+this.currentPage1, {'os':this.input10,'activeTime':this.activeTime,'endTime':this.endTime}
    //   ).then(function(response){
    //       console.log(response);
    //       const datas = response.data;
    //       this.totalCount = datas.data.totalCount
    //       this.DataList = datas.data.data
    //       this.loading = false
    //   },function(error){
    //       this.loading = false
    //       console.log(error);
    //   })
     this.loading = true
            var that = this;
            that.$http.post('http://ccsp.caping.co.id/cms/user/page', {
                pageSize:8,
                pageNum:this.currentPage1,
                startTime:this.activeTime,
                endTime:this.endTime,
                deviceName:this.input10
                }
            ).then(function(response){
                console.log(response);
                const datas = response.data;
                this.DataList = datas.data.list
                this.totalCount = datas.data.totalCount
                this.loading = false
            },function(error){
                this.loading = false
                console.log(error);
            })
          
    },
    
  },
  watch: {
    'currentPage1': function () {
      this.getDataList()
    }
  }    
}
</script>

<style scoped>
.userEList{
    width: 80%;
    margin: 20px auto;
}
.input-button{
    margin-top: 20px;
}
.tabl{
    margin-top: 20px; 
}
.input-button .input_inner{
    width: 200px;
}
</style>

