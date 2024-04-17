<template>
  <div class="block-main public-hoverItem logCon">
    <div class="block-head" style="position: relative;">
      <div style="display: flex; align-items: center;z-index: 999;" >
        <div class="block-title">趋势图</div>
        <el-radio-group
          size="mini"
          v-model="timeType"
          style="font-size: 13px; height: 30px; padding-left: 20px"
          @change="changeDateEvent"
        >
          <el-radio-button label="hour">按时</el-radio-button>
          <el-radio-button label="day">按日</el-radio-button>
          <el-radio-button label="week">按周</el-radio-button>
          <el-radio-button label="month">按月</el-radio-button>
        </el-radio-group>
      </div>
      <div
        class="block-head-icon"
        @click="$router.push('/logAnalysis/trend')"
        style="width: 100%;position: absolute;right: 0;"
      >
        <img src="@/assets/images/icon.png" alt="" width="10px" />
      </div>
    </div>
    <div class="block-echarts">
      <div id="visitchart" class="visitEchart"></div>
      <div id="dataChart" class="flowEchart"></div>
    </div>
  </div>
</template>

<script>
import echarts from "echarts";
import { getFlowTrendApi } from "@/api/trackingapi/accessLog";
export default {
  data() {
    return {
      timeType: "day",
      dayFlag: false,
      chart: null,
      flowEchart: null,
      trendList: [],
      xLineList: [],
      yLineList: [],
      bodySentBytesList: [],
      pvList: [],
      uvList: [],
      uvMax: 0,
      pvMax: 0,
      dataChart: {
        legend: [], // 图例名称
        seriesData: [], // 曲线数据
        roundsData: [], // x轴数据
        tooltip: {
          index: null, // 当前数据索引
          timer: null, // 定时器
        },
      },
      myChart: [],
      oldCommonParams: {},
    };
  },
  computed: {
    httpHost() {
      return this.$store.getters.httpHost;
    },
  },
  watch: {},
  methods: {
    changeDateEvent() {
      this.getFlowTrendEvent(this.oldCommonParams, "check");
    },
    getFlowTrendEvent(commonParams, event) {
      this.oldCommonParams = commonParams;
      let copyParams = JSON.parse(JSON.stringify(commonParams));
      if (!event) {
        if (copyParams.startTime == copyParams.endTime) {
          copyParams.timeType = "hour";
          this.timeType = "hour";
        } else {
          //月 2476800000
          let timeDiff =
            Date.parse(copyParams.endTime) - Date.parse(copyParams.startTime);
          if (timeDiff > 489600000 && timeDiff != 604800000) {
            copyParams.timeType = "week";
            this.timeType = "week";
          } else {
            copyParams.timeType = "day";
            this.timeType = "day";
          }
          // 大于三个月按月标准
          if (timeDiff > 7776000000) {
            copyParams.timeType = "month";
            this.timeType = "month";
          }
        }
      } else {
        copyParams.timeType = this.timeType;
      }
      getFlowTrendApi(copyParams).then((res) => {
        if (res.code == 200) {
          this.xLineList = [];
          this.bodySentBytesList = [];
          this.pvList = [];
          this.uvList = [];
          this.trendList = res.data;
          this.trendList.map((item) => {
            if (item.bodySentBytes) {
              let kbs = this.$options.filters.convertMB(item.bodySentBytes);

              this.bodySentBytesList.push(kbs);
            } else {
              this.bodySentBytesList.push(0);
            }
            if (item.pv) {
              this.pvList.push(item.pv);
            } else {
              this.pvList.push(0);
            }
            if (item.uv) {
              this.uvList.push(item.uv);
            } else {
              this.uvList.push(0);
            }
            item.statTime = item.statTime.replace(/\d{4}-/g, "");
            this.xLineList.push(item.statTime);
          });
          this.uvMax = this.uvList;
          this.pvMax = this.pvList;
          this.initFlowEchart(); //line chart
          this.initVisitEchart(); //双线图
        }
      });
    },
    // 双线图
    initVisitEchart() {
      this.chart = echarts.init(document.querySelector(".visitEchart"));
      this.chart.setOption({
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            crossStyle: {
              color: "#999",
            },
          },
        },
        grid: {
          left: "6%",
          right: "6%",
          top: "25%",
          bottom: "10%",
        },

        legend: {
          top: 20,
          icon: "roundRect",
          itemWidth: 14,
          itemHeight: 5,
          itemGap: 13,
          right: "4%",
          textStyle: {
            fontSize: 12,
            color: "black",
          },
        },
        dataZoom: [
          {
            type: "inside",
            startValue: 0,
            endValue: 24,
            minValueSpan: 10,
            zoomOnMouseWheel: false,
            moveOnMouseWheel: true,
            moveOnMouseMove: true,
          },
        ],
        xAxis: [
          {
            type: "category",
            data: this.xLineList,
            axisPointer: {
              type: "shadow",
            },
            axisTick: {
              show: false,
            },
          },
        ],
        yAxis: [
          {
            axisTick: {
              show: false,
            },
            type: "value",
            min: 0,
            // max: this.uvMax,
          },
          {
            type: "value",
            // name: "浏览量(PV)",
            min: 0,
            // max: this.pvMax,
            axisTick: {
              show: false,
            },
          },
        ],
        series: [
          {
            name: "用户数(UV)",
            type: "bar",
            symbol: "circle",
            itemStyle: {
              color: "#2c7be5",
            },
            // label: {
            //   show: true,
            //   position: "top",
            // },
            barWidth: 10,
            tooltip: {
              valueFormatter: function (value) {
                return value;
              },
            },
            data: this.uvList,
          },

          {
            name: "访问量(PV)",
            symbol: "circle",
            type: "line",
            itemStyle: {
              color: "#80bdef",
            },
            yAxisIndex: 1,
            tooltip: {
              valueFormatter: function (value) {
                return value;
              },
            },
            data: this.pvList,
          },
        ],
      });
      window.addEventListener("resize", () => {
        this.chart.resize();
      });
    },

    // 折现图
    initFlowEchart() {
      this.flowEchart = echarts.init(document.querySelector(".flowEchart"));
      this.flowEchart.setOption({
        // backgroundColor: "#fff",
        // tooltip: {
        //   trigger: "axis",
        //   axisPointer: {
        //     lineStyle: {
        //       color: "#2c7be5",
        //       width: 3,
        //     },
        //   },
        // },
        tooltip: {
          trigger: "axis",
          showContent: true,
          formatter: function (params) {
            var res = "<div><p>" + params[0].name + "</p></div>";
            for (var i = 0; i < params.length; i++) {
              res +=
                "<p>" +
                params[i].seriesName +
                ":" +
                params[i].value +
                "(MB)" +
                "</p>";
            }
            return res;
          },
        },
        legend: {
          top: 20,
          icon: "rect",
          itemWidth: 14,
          itemHeight: 5,
          itemGap: 13,
          right: "4%",
          textStyle: {
            fontSize: 12,
            color: "black",
          },
        },
        dataZoom: [
          {
            type: "inside",
            startValue: 0,
            endValue: 24,
            minValueSpan: 10,
            zoomOnMouseWheel: false,
            moveOnMouseWheel: true,
            moveOnMouseMove: true,
          },
        ],
        grid: {
          top: 100,
          left: "10%",
          right: "2%",
          bottom: "2%",
          containLabel: true,
        },
        xAxis: [
          {
            type: "category",
            boundaryGap: false,
            data: this.xLineList,
            axisLabel: { interval: 1 },
            nameTextStyle: {
              fontWeight: 600,
              fontSize: 18,
            },
            axisTick: {
              show: false,
            },
            axisLabel: {
              interval: 0,
              rotate: "45",
            },
          },
        ],
        yAxis: [
          {
            name: "单位（MB）",
            type: "value",
            nameTextStyle: {
              fontWeight: 400,
              fontSize: 13,
              color: "#2c7be5",
            },
            axisTick: {
              show: false,
            },
          },
        ],
        series: [
          {
            name: "流出流量",
            type: "line",
            itemStyle: {
              normal: {
                color: "#2c7be5",
              },
            },
            lineStyle: {
              width: 3,
            },
            data: this.bodySentBytesList,
          },
        ],
      });
      window.addEventListener("resize", () => {
        this.flowEchart.resize();
      });
    },
    //动态折线图数据接口展示
    // getChartsData() {
    //   //模拟后台数据的返回
    //   let res = {
    //     data: [
    //       {
    //         name: "Email",
    //         data: [120, 132, 101, 134, 90, 230, 210],
    //       },
    //       {
    //         name: "Union Ads",
    //         data: [220, 182, 191, 234, 290, 330, 310],
    //       },
    //       {
    //         name: "Video Ads",
    //         data: [150, 232, 201, 154, 190, 330, 410],
    //       },
    //       {
    //         name: "Direct",
    //         data: [320, 332, 301, 334, 390, 330, 320],
    //       },
    //       {
    //         name: "www.baidu.com",
    //         data: [320, 332, 301, 334, 390, 330, 1320],
    //       },
    //     ],
    //     round: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    //   };

    //   this.dataChart.seriesData = res.data;
    //   this.dataChart.roundsData = res.round;

    //   //定义图表的一些配置项
    //   for (let i = 0; i < this.dataChart.seriesData.length; i++) {
    //     this.dataChart.seriesData[i].type = "line";
    //     this.dataChart.seriesData[i].smooth = true;
    //     this.dataChart.legend.push(this.dataChart.seriesData[i].name);
    //   }

    //   this.drawEcharts(
    //     this.dataChart.legend,
    //     this.dataChart.roundsData,
    //     this.dataChart.seriesData
    //   );
    // },
    //图表方法
    drawEcharts(legendData, xAxisData, seriesData) {
      seriesData = seriesData.map((item) => ({
        ...item,
        data: item.data,
      }));
      //获取id并初始化图表
      this.myChart = this.$echarts.init(document.getElementById("dataChart"));

      //配置项
      let option = {
        tooltip: {
          trigger: "axis",
        },
        legend: {
          data: legendData,
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
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
        series: seriesData,
      };

      this.myChart.setOption(option); //通过setOption()方法生成图表
    },

    beforeDestroy() {
      if (this.flowEchart) {
        this.flowEchart.dispose();
        this.flowEchart = null;
      }
      if (this.chart) {
        this.chart.dispose();
        this.chart = null;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep {
  .appli_select .el-input__inner {
    border-radius: 0px;
    border-top-width: 0px;
    border-left-width: 0px;
    border-right-width: 0px;
    border-bottom-width: 1px;
    border-bottom: 1px solid #acb2ba;
    background-color: transparent;
    font-size: 12px;
    transform: scale(0.9);
    height: 30px;
    line-height: 30px;
    border-bottom-width: 0;
  }
}
@import "~@/styles/components/custom-select.scss";
.logCon {
  width: calc(65% - 10px);
  // min-height: 300px;
}
.block-head {
  display: flex;
  width: 100%;
  height: 30px;
  align-items: center;
  justify-content: space-between;
  position: relative;
}
.block-echarts {
  display: flex;
  justify-content: space-between;
  .visitEchart {
    width: calc(50% - 15px);
    height: 300px;
  }
  .flowEchart {
    width: calc(50% - 15px);
    height: 300px;
  }
}
</style>
