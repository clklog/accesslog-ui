<template>
  <div class="public-table-block public-hoverItem logCon">
    <span class="public-firstHead">性能-超100毫秒时序图</span>
    <div v-if="timingList">
      <div id="dataChart" class="flowEchart"></div>
    </div>
    <div v-else style="display: flex;justify-content: center;align-items: center;height: 230px;">暂无数据</div>
  </div>
</template>

<script>
import echarts from "echarts";
import { getRequestimeGt100msApi } from "@/api/trackingapi/performance.js";
export default {
  data() {
    return {
      timeType: "hour",
      dayFlag: false,
      value: "",
      chart: null,
      flowEchart: null,

      dataChart: {
        legend: [],
        seriesData: [],
        roundsData: [],
        tooltip: {
          index: null,
          timer: null,
        },
      },
      myChart: null,
      timingList: false,
    };
  },
  mounted() {},
  methods: {
    getRequestimeGt100ms(commonParams) {
      let params = {
        applicationCode: commonParams.applicationCode,
        httpHost: commonParams.httpHost,
        startTime: commonParams.timeSlot,
        endTime: commonParams.timeSlot,
        timeType: commonParams.timeValue ? "min" : "hour",
        hour: commonParams.timeValue,
      };
      getRequestimeGt100msApi(params).then((res) => {
        if (res.code == 200) {
          let apiList = res.data;
          if (apiList.rows.length > 1) {
            this.timingList = true;
            this.$nextTick(() => {
              this.getChartsData(apiList);
            });
          } else {
            this.timingList = false;
          }
        }
      });
    },
    getChartsData(apiList) {
      apiList.rows.map((item, index) => {
        item.name = item.uri;
        if (item.name.length > 55) {
          item.name =  item.name.substring(0, 50)+'...'
        }
       
      });
      this.dataChart.seriesData = apiList.rows;
      this.dataChart.roundsData = apiList.times;
      for (let i = 0; i < this.dataChart.seriesData.length; i++) {
        this.dataChart.seriesData[i].type = "line";
        this.dataChart.seriesData[i].smooth = true;
        this.dataChart.legend.push(this.dataChart.seriesData[i].uri);
      }

      this.drawEcharts(
        this.dataChart.legend,
        this.dataChart.roundsData,
        this.dataChart.seriesData
      );
    },
    drawEcharts(legendData, xAxisData, seriesData) {
      seriesData = seriesData.map((item) => ({
        ...item,
        data: item.pv,
      }));

      this.myChart = this.$echarts.init(document.getElementById("dataChart"));
      let option = {
        color: [
          "#2c7be5",
          "#80bdef",
          "#c4ebad",
          "#85dec8",
          "#fff2ce",
          "#ffde84",
          "#003366",
          "#006699",
          "#4cabce",
          "#e5323e",
          "#9AFF9A",
          "#7B68EE",
          "#87CEFA",
          "#E0FFFF",
          "#2E8B57",
          "#FFFFE0",
          "#E9967A",
        ],
        tooltip: {
          trigger: "axis",
          position: 'center',
        },
        dataZoom: [
          {
            type: "inside",
            startValue: 0,
            endValue: 30,
            minValueSpan: 10,
            zoomOnMouseWheel: false,
            moveOnMouseWheel: true,
            moveOnMouseMove: true,
          },
        ],
        legend: {
          show: true,
          type: "plain",
          left: "right",
          top: "middle",
          width: 20,
        },
        grid: {
          left: "0%",
          right: "25%",
          bottom: "0%",
          containLabel: true,
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: xAxisData,
        },
        yAxis: {
          type: "value",
        },
        itemStyle: {
          normal: {
            color: (item) => {
              return COLORS[item.dataIndex % COLORS.length];
            },
          },
        },
        series: seriesData,
      };
      this.myChart.setOption(option);
      window.addEventListener("resize", this.handleSize);
    },
    handleSize() {
      this.myChart.resize();
    },
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.handleSize);
    if (this.myChart) {
      this.myChart.dispose();
      this.myChart = null;
    }
  },
};
</script>

<style lang="scss" scoped>
.logCon {
  width: 100%;
  min-height: 438px;
  background-color: #fff;
}
.flowEchart {
  width: 100%;
  height: 500px;
}
</style>
