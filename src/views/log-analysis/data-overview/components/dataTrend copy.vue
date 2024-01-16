<template>
  <div class="block-main public-hoverItem logCon">
    <div class="block-head">
      <div style="display: flex; align-items: center">
        <div class="block-title">趋势图</div>
        <el-radio-group
          size="mini"
          v-model="timeType"
          style="font-size: 13px; height: 30px; padding-left: 20px"
        >
          <el-radio-button label="hour">按时</el-radio-button>
          <el-radio-button label="day">按日</el-radio-button>
          <el-radio-button label="week">按周</el-radio-button>
          <el-radio-button label="month">按月</el-radio-button>
        </el-radio-group>
      </div>
      <!-- <div
        style="
          display: flex;
          border: 1px solid #acb2ba;
          border-radius: 4px;
          align-items: center;
        "
      >
        <div style="font-size: 12px; color: #4d4d4d; padding-left: 6px">
          host:
        </div>
        <el-select
          class="appli_select"
          v-model="value"
          placeholder="请选择应用"
          size="small"
          style="min-width: 100px"
        >
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
            :disabled="item.disabled"
          >
          </el-option>
        </el-select>
      </div> -->
    </div>
    <div class="block-echarts">
      <div id="visitchart" class="visitEchart"></div>
      <div id="dataChart" class="flowEchart"></div>
    </div>
  </div>
</template>

<script>
import echarts from "echarts";
export default {
  data() {
    return {
      timeType: "hour",
      dayFlag: false,
      options: [
        {
          value: "选项1",
          label: "黄金糕",
        },
        {
          value: "选项2",
          label: "双皮奶",
          disabled: true,
        },
        {
          value: "选项3",
          label: "蚵仔煎",
        },
        {
          value: "选项4",
          label: "龙须面",
        },
        {
          value: "选项5",
          label: "北京烤鸭",
        },
      ],
      value: "",
      chart: null,
      flowEchart: null,

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
    };
  },
  mounted() {
    this.initVisitEchart();
    // this.initFlowEchart();
    this.getChartsData() //測試循环数据
  },
  methods: {
    initVisitEchart() {
      this.chart = echarts.init(document.querySelector(".visitEchart"));
      this.chart.setOption({
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
        },
        legend: {
          top: 20,
          icon: "rect",
          itemWidth: 14,
          itemHeight: 5,
          itemGap: 13,
          data: [4324, 4234],
          right: "4%",
          textStyle: {
            fontSize: 12,
            color: "black",
          },
        },
        grid: {
          left: "3%",
          right: "3%",
          bottom: "3%",
          containLabel: true,
        },
        // legend: {
        //   // 距离容器10%
        //   right: "10%",
        //   // 修饰图例文字的颜色
        //   textStyle: {
        //     color: "red",
        //   },
        // },

        xAxis: {
          type: "category",
          data: [
            "历下区",
            "市中区",
            "历城区",
            "章丘区",
            "天桥区",
            "槐荫区",
            "莱芜区",
            "长清区",
            "钢城区",
            "济阳区",
          ],

          axisLine: {
            lineStyle: {
              color: "#1f78af",
              width: 2,
            },
          },
        },

        yAxis: [
          {
            splitLine: { show: false },
            type: "value",
            position: "left",

            show: true,
            min: 15,
            max: 100,

            axisLine: {
              lineStyle: {
                color: "#1f78af",
                width: 2,
              },
            },
            axisTick: {
              show: false,
            },
          },
          {
            splitLine: { show: false },
            type: "value",
            position: "right",
            name: "",

            axisLine: {
              lineStyle: {
                color: "#1f78af",
                width: 2,
              },
            },
            axisTick: {
              show: false,
            },
          },
        ],
        series: [
          {
            type: "bar",
            data: [
              78.49, 76.01, 70.55, 70.03, 65.77, 53.2, 51.63, 34.26, 22.64,
              17.76,
            ],
            itemStyle: {
              normal: {
                label: {
                  show: true,
                  position: "inside",
                  formatter: "{c}",
                },
                color: "#1f78af",
              },
            },
          },
          {
            type: "line",
            data: [
              1.056, 0.883, 0.352, 1.344, 1.069, 0.961, 0.735, 0.896, 0.694,
              0.735,
            ],
            yAxisIndex: 1,
            symbol: "circle",
            symbolSize: 10,
            itemStyle: {
              normal: {
                color: "#e09216",
              },
            },
          },
        ],
      });
      window.addEventListener("resize", () => {
        this.chart.resize();
      });
    },
    // initFlowEchart() {
    //   this.flowEchart = echarts.init(document.querySelector(".flowEchart"));
    //   this.flowEchart.setOption({
    //     backgroundColor: "#fff",
    //     tooltip: {
    //       trigger: "axis",
    //       axisPointer: {
    //         lineStyle: {
    //           color: "#C0CADB",
    //           width: 3,
    //         },
    //       },
    //     },
    //     legend: {
    //       top: 20,
    //       icon: "rect",
    //       itemWidth: 14,
    //       itemHeight: 5,
    //       itemGap: 13,
    //       data: this.headLege,
    //       right: "4%",
    //       textStyle: {
    //         fontSize: 12,
    //         color: "black",
    //       },
    //     },
    //     dataZoom: [
    //       {
    //         type: "inside",
    //         startValue: 0,
    //         endValue: 24,
    //         minValueSpan: 10,
    //         zoomOnMouseWheel: false, // 关闭滚轮缩放
    //         moveOnMouseWheel: true, // 开启滚轮平移
    //         moveOnMouseMove: true, // 鼠标移动能触发数据窗口平移
    //       },
    //     ],
    //     grid: {
    //       top: 100,
    //       left: "2%",
    //       right: "2%",
    //       bottom: "2%",
    //       containLabel: true,
    //     },
    //     xAxis: [
    //       {
    //         type: "category",
    //         boundaryGap: false,
    //         data: [1, 2, 3, 4, 5, 6, 7, 8],
    //         axisLabel: { interval: 1 },
    //         nameTextStyle: {
    //           fontWeight: 600,
    //           fontSize: 18,
    //         },
    //         axisTick: {
    //           show: false,
    //         },
    //         axisLabel: {
    //           interval: 0,
    //           rotate: "45",
    //         },
    //       },
    //     ],
    //     yAxis: [
    //       {
    //         type: "value",
    //         nameTextStyle: {
    //           fontWeight: 600,
    //           fontSize: 18,
    //         },
    //         axisTick: {
    //           show: false,
    //         },
    //       },
    //     ],
    //     series: [
    //       {
    //         name: "流入流量",
    //         type: "line",
    //         itemStyle: {
    //           normal: {
    //             color: "blue",
    //           },
    //         },
    //         lineStyle: {
    //           width: 3,
    //         },
    //         data: [3100, 2044, 233, 331, 923, 543, 2112, 3932],
    //       },
    //       {
    //         name: "流出流量",
    //         type: "line",
    //         itemStyle: {
    //           normal: {
    //             color: "pink",
    //           },
    //         },
    //         lineStyle: {
    //           width: 3,
    //         },
    //         data: [3000, 2000, 2323, 2331, 1223, 5432, 2112, 3432],
    //       },
    //     ],
    //   });
    //   window.addEventListener("resize", () => {
    //     this.flowEchart.resize();
    //   });
    // },
    // 处理后端接口
    getChartsData() {
      //模拟后台数据的返回
      let res = {
        data: [
          {
            name: "Email",
            data: [120, 132, 101, 134, 90, 230, 210],
          },
          {
            name: "Union Ads",
            data: [220, 182, 191, 234, 290, 330, 310],
          },
          {
            name: "Video Ads",
            data: [150, 232, 201, 154, 190, 330, 410],
          },
          {
            name: "Direct",
            data: [320, 332, 301, 334, 390, 330, 320],
          },
          {
            name: "www.baidu.com",
            data: [320, 332, 301, 334, 390, 330,1320],
          },
        ],
        round: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      };

      this.dataChart.seriesData = res.data;
      this.dataChart.roundsData = res.round;

      //定义图表的一些配置项
      for (let i = 0; i < this.dataChart.seriesData.length; i++) {
        this.dataChart.seriesData[i].type = "line";
        this.dataChart.seriesData[i].smooth = true;
        this.dataChart.legend.push(this.dataChart.seriesData[i].name);
      }

      this.drawEcharts(
        this.dataChart.legend,
        this.dataChart.roundsData,
        this.dataChart.seriesData
      );
    },
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
  min-height: 300px;
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
