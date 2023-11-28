<template>
  <div class="public-table-block public-hoverItem logCon">
    <span class="public-firstHead">性能-超100毫秒时序图</span>
    <div id="dataChart" class="flowEchart"></div>
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
    };
  },
  mounted() {},
  methods: {
    getRequestimeGt100ms(commonParams) {
      getRequestimeGt100msApi(commonParams).then((res) => {
        if (res.code == 200) {
          let apiList = res.data;
          this.getChartsData(apiList); //ecahts init
        }
      });
    },
    // getChartsData(apiList) {
    //   //模拟后台数据的返回
    //     let res = {
    //       data: [
    //         {
    //           name: "Email",
    //           data: [120, 132, 101, 134, 90, 230, 210],
    //         },
    //         {
    //           name: "Union Ads",
    //           data: [220, 182, 191, 234, 290, 330, 310],
    //         },
    //         {
    //           name: "Video Ads",
    //           data: [150, 232, 201, 154, 190, 330, 410],
    //         },
    //         {
    //           name: "Direct",
    //           data: [320, 332, 301, 334, 390, 330, 320],
    //         },
    //         {
    //           name: "www.baidu.com",
    //           data: [320, 332, 301, 334, 390, 330, 1320],
    //         },
    //       ],
    //       round: ["/api/inusevehicle/gaopai/gpCertificateAdd", "/api/inusevehicle/gaopai/gpCertificateAdd66", "Wed", "Thu", "Fri", "Sat", "/api/inusevehicle/gaopai/gpCertificateAdd435"],
    //     };
    // //   let res = apiList;

    //   this.dataChart.seriesData = res.data;
    //   this.dataChart.roundsData = res.round;

    // //   this.dataChart.seriesData = apiList.rows.slice(0,3);
    // //   this.dataChart.roundsData = res.times;
    // //   console.log(apiList,"apiList");
    //   //定义图表的一些配置项
    //   for (let i = 0; i < this.dataChart.seriesData.length; i++) {
    //     this.dataChart.seriesData[i].type = "line";
    //     this.dataChart.seriesData[i].smooth = true;
    //     // this.dataChart.legend.push(this.dataChart.seriesData[i].pv);
    //     this.dataChart.legend.push(this.dataChart.seriesData[i].name);
    //   }

    //   this.drawEcharts(
    //     this.dataChart.legend,
    //     this.dataChart.roundsData,
    //     this.dataChart.seriesData
    //   );
    // },
    getChartsData(apiList) {
      apiList.rows.map((item, index) => {
        item.name = item.uri;
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
          // position: [100, 30]
          position: ["40%", "5%"],

          // position: 'bottom'
        },
        dataZoom: [
          {
            type: "inside",
            startValue: 0,
            endValue: 10,
            minValueSpan: 10,
            zoomOnMouseWheel: false,
            moveOnMouseWheel: true,
            moveOnMouseMove: true,
          },
        ],
        legend: {
          //   data: legendData,
          //   orient: "vertical", //垂直显示
          // //   y: "center", //延Y轴居中
          //   y: "center", //延Y轴居中
          //   x: "right", //居右显示
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
  //   min-height: 438px;
  min-height: 438px;
  background-color: #fff;
}
.flowEchart {
  width: 100%;
  height: 500px;
}
</style>
