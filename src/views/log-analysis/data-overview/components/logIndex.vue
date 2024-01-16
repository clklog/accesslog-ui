<template>
  <div class="block-main public-hoverItem logCon">
    <div class="block-title public-firstHead">访问数据占比</div>
    <div class="logCon">
      <div class="warryItem" v-if="msg.chartData1.length > 1">
        <echartsLog
          :title="logTitle"
          id="logChart1"
          width="100%"
          height="300px"
          :chartData="msg.chartData1"
          :nameData="msg.rows1"
          autoresize
        ></echartsLog>
        <div class="block-head">
          <div class="public-secondHead" style="text-align: center; width: 100%">
            访问量(PV)
          </div>
        </div>
      </div>
      <!-- <div class="warryItem" v-if="msg.chartData2.length > 1">
        <echartsLog
          :title="logTitle"
          width="100%"
          height="300px"
          id="logChart2"
          :chartData="msg.chartData2"
          :nameData="msg.rows2"
          autoresize
        ></echartsLog>
      </div> -->
      <div class="warryItem" v-if="msg.chartData4.length > 1">
        <echartsLog
          :title="logTitle"
          width="100%"
          height="300px"
          id="logChart4"
          :chartData="msg.chartData4"
          :nameData="msg.rows4"
          autoresize
        ></echartsLog>
        <div class="block-head">
          <div class="public-secondHead" style="text-align: center; width: 100%">
            用户数(UV)
          </div>
        </div>
      </div>
      <div class="warryItem" v-if="msg.chartData3.length > 1">
        <echartsLog
          :title="logTitle"
          width="100%"
          height="300px"
          id="logChart3"
          :chartData="msg.chartData3"
          :nameData="msg.rows3"
          autoresize
        ></echartsLog>
        <div class="block-head">
          <div class="public-secondHead" style="text-align: center; width: 100%">
            流出流量
          </div>
        </div>
      </div>
    </div>
    <!-- <div class="warryItem" v-if="msg.chartData5.length > 2">
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
    </div> -->
  </div>
</template>

<script>
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
        uvRate: [],
        avgVisitTime: [],
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
          if (item.pvRate) {
            item.value = item.pvRate;
            item.total = item.pv;
            item.host = item.httpHost
            item.logTitle = "访问量(PV)";
            this.pieEcharts.pvRate.push(JSON.parse(JSON.stringify(item)));
          }
          if (item.bodySentBytesRate) {
            item.value = item.bodySentBytesRate;
            item.host = item.httpHost
            item.total = this.$options.filters.conver(item.bodySentBytes);
            item.logTitle = "流出流量";
            this.pieEcharts.bodyBytesSentRate.push(
              JSON.parse(JSON.stringify(item))
            );
          }
          if (item.uvRate) {
            item.value = item.uvRate;
            item.host = item.httpHost
            item.total = item.uv;
            item.logTitle = "用户数(UV)";
            this.pieEcharts.uvRate.push(JSON.parse(JSON.stringify(item)));
          }
        });
        this.msg.chartData1 = this.pieEcharts.pvRate;
        this.msg.rows1 = this.xaxis;
        this.msg.chartData2 = this.pieEcharts.requestLengthRate;
        this.msg.rows2 = this.xaxis;
        this.msg.chartData3 = this.pieEcharts.bodyBytesSentRate;
        this.msg.rows3 = this.xaxis;
        this.msg.chartData4 = this.pieEcharts.uvRate;
        this.msg.rows4 = this.xaxis;
        this.msg.chartData5 = this.pieEcharts.avgVisitTime;
        this.msg.rows5 = this.xaxis;
      } else {
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
    },
    clearEcharts() {
      this.pieEcharts = Object.assign(
        {},
        {
          pvRate: [],
          requestLengthRate: [],
          bodyBytesSentRate: [],
          uvRate: [],
          avgVisitTime: [],
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
  flex-wrap: wrap;
  .warryItem {
    width: 30%;
    min-height: 300px;
  }
}
</style>
