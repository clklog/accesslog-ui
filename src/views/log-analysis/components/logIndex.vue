<template>
  <div class="block-main public-hoverItem logCon">
    <!-- <div class="block-head">
      <div class="block-title">流量指标</div>
    </div> -->
    <div class="warryItem" v-if="msg.chartData1.length > 2">
      <div class="block-head">
        <div class="block-title">日志总数占比</div>
      </div>
      <echartsLog
        :title="logTitle"
        id="logChart1"
        width="100%"
        height="300px"
        :chartData="msg.chartData1"
        :nameData="msg.rows1"
        autoresize
      ></echartsLog>
    </div>
    <div class="warryItem" v-if="msg.chartData2.length > 2">
      <div class="block-head">
        <div class="block-title">流入流量</div>
      </div>
      <echartsLog
        :title="logTitle"
        width="100%"
        height="300px"
        id="logChart2"
        :chartData="msg.chartData2"
        :nameData="msg.rows2"
        autoresize
      ></echartsLog>
    </div>
    <div class="warryItem" v-if="msg.chartData3.length > 2">
      <div class="block-head">
        <div class="block-title">流出流量</div>
      </div>
      <echartsLog
        :title="logTitle"
        width="100%"
        height="300px"
        id="logChart3"
        :chartData="msg.chartData3"
        :nameData="msg.rows3"
        autoresize
      ></echartsLog>
    </div>
    <div class="warryItem" v-if="msg.chartData4.length > 2">
      <div class="block-head">
        <div class="block-title">访问IP数占比</div>
      </div>
      <echartsLog
        :title="logTitle"
        width="100%"
        height="300px"
        id="logChart4"
        :chartData="msg.chartData4"
        :nameData="msg.rows4"
        autoresize
      ></echartsLog>
    </div>
    <div class="warryItem" v-if="msg.chartData5.length > 2">
      <div class="block-head">
        <div class="block-title">访问平均时长</div>
      </div>
      <echartsLog
        :title="logTitle"
        width="100%"
        height="300px"
        id="logChart5"
        :chartData="msg.chartData5"
        :nameData="msg.rows5"
        autoresize
      ></echartsLog>
    </div>
  </div>
</template>

<script>
// id --> 为了多图渲染
// chartData --> value数组
// nameData --> name数组
import echartsLog from "./echartsLog";
export default {
  components: {
    echartsLog,
  },
  data() {
    return {
      msg: {
        rows1: [],
        rows2: [],
        rows3: [],
        rows4: [],
        rows5: [],
        rows6: [],
        chartData1: [],
        chartData2: [],
        chartData3: [],
        chartData4: [],
        chartData5: [],
        chartData6: [],
      },
      logList: [],
      xaxis: [],
      logTitle: "",
      pieEcharts: {
        pvRate: [],
        requestLengthRate: [],
        bodyBytesSentRate: [],
        ipCountRate:[],
        avgVisitTime:[],
      },
    };
  },
  methods: {
    logEvent(val) {
      this.clearEcharts();
      this.logList = val;
      if (this.logList.length > 0) {
        this.logList.map((item, index) => {
          item.xaxis = index + 1;
        });
        this.logList.map((item) => {
          if (item.xaxis) {
            this.xaxis.push(item.xaxis);
          }
          if (item.pvRate && item.host) {
            item.value = item.pvRate;
            item.total = item.pv
            item.logTitle = "日志总数"
            this.pieEcharts.pvRate.push(JSON.parse(JSON.stringify(item)));
          }
          if (item.requestLengthRate) {
            item.value = item.requestLengthRate;
            item.logTitle = "流入流量"
            item.total = this.$options.filters.conver(item.requestLength)
            this.pieEcharts.requestLengthRate.push(JSON.parse(JSON.stringify(item)));
          }
          if (item.bodyBytesSentRate) {
            item.value = item.bodyBytesSentRate;
            item.total = this.$options.filters.conver(item.bodyBytesSent)
            item.logTitle = "流出流量"
            this.pieEcharts.bodyBytesSentRate.push(JSON.parse(JSON.stringify(item)));
          }
          if (item.ipCountRate) {
            item.value = item.ipCountRate;
            item.total = item.ipCount;
            item.logTitle = "访问IP数"
            this.pieEcharts.ipCountRate.push(JSON.parse(JSON.stringify(item)));
          }
          if (item.ipCountRate) {
            item.value = item.avgVisitTime;
            item.flag = true;
            item.logTitle = "访问平均时长"
            this.pieEcharts.avgVisitTime.push(JSON.parse(JSON.stringify(item)));
          }
        });
        this.msg.chartData1 = this.pieEcharts.pvRate;
        this.msg.rows1 = this.xaxis;
        this.msg.chartData2 = this.pieEcharts.requestLengthRate;
        this.msg.rows2 = this.xaxis;
        this.msg.chartData3 = this.pieEcharts.bodyBytesSentRate;
        this.msg.rows3 = this.xaxis;
        this.msg.chartData4 = this.pieEcharts.ipCountRate;
        this.msg.rows4 = this.xaxis;
        this.msg.chartData5 = this.pieEcharts.avgVisitTime;
        this.msg.rows5 = this.xaxis;
        console.log( this.msg.chartData4," this.msg.chartData4");
        console.log( this.msg.rows4," this.msg.rows4");
        console.log( this.msg.chartData5," this.msg.chartData5");
        console.log( this.msg.rows5," this.msg.rows5");
      } else {
        console.log("执行了");
        this.msg = Object.assign(
          {},
          {
            rows1: [],
            rows2: [],
            rows3: [],
            rows4: [],
            rows5: [],
            rows6: [],
            chartData1: [],
            chartData2: [],
            chartData3: [],
            chartData4: [],
            chartData5: [],
            chartData6: [],
          }
        );
      }
    //   console.log(this.pieEcharts.pvRate, "this.pieEcharts.pvRate.");
      //   console.log(this.logList, "传递过来的日志");
      //   this.msg.chartData1 = [324, 568, 142, 3, 23, 543, 432];
      //   this.msg.rows1 = ["x1", "x2", "x3", "x1", "x2", "x3", , "21"];
      //   this.msg.chartData2 = [3243, 5683, 1423];
      //   this.msg.rows2 = ["x45", "x23", "x33"];
      //   this.msg.chartData3 = [324, 568, 142];
      //   this.msg.rows3 = ["x1", "x2", "x3"];
    },
    clearEcharts() {
      this.pieEcharts = Object.assign(
        {},
        {
          pvRate: [],
          requestLengthRate: [],
          bodyBytesSentRate: [],
          ipCountRate:[],
          avgVisitTime:[],
        }
      );
    },
  },
};
</script>

<style lang="scss" scoped>
.logCon {
  width: 100%;
  display: flex;
  // justify-content: center;
  flex-wrap: wrap;
  .warryItem {
    width: 33.33%;
    height: 300px;
  }
}
</style>
