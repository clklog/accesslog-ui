<template>
  <div class="echartsCommon">
    <div :id="id" :style="{ height: height, width: width }"></div>
  </div>
</template>
<script>
import * as echarts from "echarts";
export default {
  name: "echartsLog",
  data() {
    return {
      arr: [],
      logTitle: "",
    };
  },
  props: {
    chartData: {},
    id: {
      type: String,
    },
    nameData: {
      type: Array,
    },
    width: {
      type: String,
      default: "200px",
    },
    height: {
      type: String,
      default: "200px",
    },
  },
  created() {
    this.initData();
  },
  mounted() {
    this.drawCharts();
  },
  watch: {
    chartData: {
      handler(newValue, oldValue) {
        this.arr.length = 0;
        this.initData();
        this.drawCharts();
      },
      deep: true,
    },
  },
  methods: {
    drawCharts() {
      var myChart = echarts.init(document.getElementById(this.id));
      const COLORS = [
        "#2c7be5",
        "#80bdef",
        "#c4ebad",
        "#85dec8",
        "#FFDE84",
        "#FEB272",
      ];
      myChart.setOption({
        title: {
          text: this.logTitle,
          left: "center",
        },
        tooltip: {
          trigger: "item",
          formatter: (params) => {
            let htmlStr;
            if (params.data.flag) {
              // 平均时长的展示
              htmlStr = `
              <div style="padding:10px;">
                <div style='font-size:14px;'> ${params.data.host}</div>
                <div style='font-size:14px;margin-top:5px;'> ${params.data.logTitle}：${params.value}</div>
              </div>
              `;
            } else {
              htmlStr = `
              <div style="padding:10px;">
                <div style='font-size:14px;'> ${params.data.host}</div>
                <div style='font-size:14px;margin-top:5px;'> ${
                  params.data.logTitle
                }：${params.data.total}</div>
                <div v-if="${
                  params.flag
                } == false" style='text-align:left;margin-top:5px;'>
                  占比：${this.$options.filters.percentage(params.value)}<br/>
                </div>
              </div>
              `;
            }

            return htmlStr;
          },
        },
        // legend: {
        //   icon: "rect",
        //   itemWidth: 10,
        //   itemHeight: 10,
        //   left: "1%",
        //   top: "5%",
        //   data: this.nameData,
        // },
        series: [
          {
            type: "pie",
            radius: ["30%", "45%"],
            avoidLabelOverlap: true,
            itemStyle: {
              normal: {
                color: (item) => {
                  return COLORS[item.dataIndex % COLORS.length];
                },
              },
            },
            label: {
              normal: {
                show: true,
                padding: [20, 0],
                position: "outside",
                formatter: (params) => {
                  if (params.data.flag) {
                    return params.value;
                  } else {
                    return this.$options.filters.percentage(params.value);
                  }
                },
                show: true,
                position: "left",
              },
              emphasis: {
                show: true,
              },
            },
            labelLine: {
              length: 10, // 引导线起点到文字的距离
              lineStyle: {
                color: "rgba(255, 255, 255, 0.3)",
              },
              normal: {
                show: true,
              },
            },
            data: this.arr,
          },
        ],
      });
      window.addEventListener("resize", function () {
        myChart.resize();
      });
    },
    initData() {
      this.nameData.forEach((val, i) => {
        this.chartData.forEach((item, index) => {
          if (i == index) {
            this.arr.push({
              value: item.value,
              total: item.total,
              flag: item.flag ? item.flag : false,
              host: item.host,
              logTitle: item.logTitle,
            });
          }
        });
      });
    },
  },
};
</script>
<style lang="scss" scoped></style>
