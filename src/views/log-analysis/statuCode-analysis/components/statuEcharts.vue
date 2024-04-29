<template>
  <div class="public-table-block public-hoverItem logCon">
    <span class="public-firstHead">请求状态占比</span>
    <div style="display: flex">
      <div style="width: 50%">
        <div id="pieStatu" class="pieStatu"></div>
      </div>
      <div style="width: 50%">
        <div id="barStatu" class="barStatu"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { getStatusApi } from "@/api/trackingapi/accessLog";
import echarts from "echarts";
export default {
  data() {
    return {
      filterBarParams: {},
      sortOrder: "desc",
      pageNum: 1,
      pageSize: 10,
      status: "200",
      statuCodeList: [],
      total: 0,
      currentPage: 1,
      current: {
        sortName: null,
        sortOrder: null,
      },
      statusFilter: [],
      statusShowList: [],
      hostList: [],
      allDataList: [],
      funList: [],

      xbarData: [],
      ybarData: [],
    };
  },
  computed: {
    applicationCode() {
      return this.$store.getters.applicationCode;
    },
  },
  watch: {
    commonParams(val) {},
  },
  mounted() {},
  methods: {
    echartEvent(commonParams) {
      getStatusApi(commonParams).then((res) => {
        if (res.code == 200) {
          this.xbarData = [];
          this.ybarData = [];
          this.funList = res.data;

          this.funList.sort((a, b) => {
            const statusA = parseInt(a.status, 10) || 0;
            const statusB = parseInt(b.status, 10) || 0;
            return statusA - statusB;
          });
          this.funList.map((item) => {
            item.value = item.pvRate;
            item.name = item.status;
            item.pv = item.pv;
            // bar echarts
            this.xbarData.push(item.status);
            this.ybarData.push(item.pvRate);
          });
          this.pieStatuEcharts();
          //  bar echarts
          this.barStatuEcharts();
        }
      });
    },
    pieStatuEcharts() {
      this.funApis = echarts.init(document.getElementById("pieStatu"));
      const COLORS = [
        "#2c7be5",
        "#80bdef",
        "#c4ebad",
        "#85dec8",
        "#fff2ce",
        "#ffde84",
      ];
      this.funApis.setOption({
        title: {
          left: "center",
          top: "center",
        },
        tooltip: {
          trigger: "item",
          type: "cross",
          formatter: (params) => {
            let htmlStr;
            htmlStr = `
              <div style="padding:10px;">
                <div style='font-size:14px;'>状态码： ${params.name}</div>
                <div style='font-size:14px;margin-top:5px;'>占比： ${
                  params.percent + "%"
                }</div>
                <div style='font-size:14px;margin-top:5px;'> 总量： ${
                  params.data.pv
                }</div>
               
              </div>
              `;
            return htmlStr;
          },
        },
        legend: {
          // orient: "line-through",
          // x: "right",
          // y: "bottom",
          bottom: "0%",
          left: "0%",
        },
        grid: {
          left: "20%",
          right: "20%",
          bottom: "10%",
          top: "20%",
        },
        series: [
          {
            type: "pie",
            radius: ["30%", "43%"],
            symbol: "circle",
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
                padding: [60, -5],
                position: "outside",
                formatter: (params) => {
                  return (
                    params.name +
                    "：" +
                    params.data.pv +
                    // "\n" +

                    "(" +
                    params.percent +
                    "%" +
                    ")"
                  );
                },
                show: true,
                position: "left",
              },
              emphasis: {
                show: true,
              },
            },
            labelLine: {
              show: true,
            },
            labelLayout: {
              // 选择合适的标签布局策略
              hideOverlap: true, // 隐藏重叠的标签
              // 或者使用 'normal' 或 'emphasis'
            },
            emphasis: {
              label: {
                show: true,
                fontSize: "15",
                // fontWeight: "bold",
              },
            },
            data: this.funList,
          },
        ],
      });
      window.addEventListener("resize", this.handleSize);
    },
    barStatuEcharts() {
      const mulColumnZZTData = {
        tooltip: {
          trigger: "axis",
          formatter: function (params) {
            var html = "状态码：" + params[0].name + "<br>";
            for (var i = 0; i < params.length; i++) {
              html +=
                params[i].marker +
                params[i].seriesName +
                "：" +
                (params[i].value * 100).toFixed(2) +
                "%";
            }
            return html + "<br>";
          },
        },
        xAxis: {
          data: this.xbarData,
          axisTick: {
            show: false,
            alignWithLabel: true,
          },
          axisLabel: {
            show: true,
            interval: 0,
            rotate: 35,
          },
        },

        dataZoom: [
          {
            type: "inside",
            startValue: 0,
            endValue: 24,
            zoomOnMouseWheel: false,
            moveOnMouseWheel: true,
            moveOnMouseMove: true,
          },
        ],
        yAxis: {
          axisTick: {
            show: false,
            alignWithLabel: true,
          },
          type: "value",
          splitNumber: 5, // 分割为5段，包括0和100%
          min: 0,
          max: 1,
          interval: 0.2, // 间隔为0.2，确保有五个主要刻度
          axisLabel: {
            //rotate: 50,
            //formatter: "{value}%", // 将值格式化为百分比
            formatter (value) {
              return (value * 100).toFixed(0) + "%";
            },
          },
          splitLine: {
            // 添加分隔线以匹配刻度
            lineStyle: {
              type: "solid",
            },
          },
        },
        series: [
          {
            type: "bar",
            data: this.ybarData,
            barWidth: 20,
            name: "请求状态占比",
            label: {
              show: true,
              position: "top",
              formatter: function (d) {
                let sum = (d.data * 100).toFixed(2) + "%";
                return sum;
              },
            },
            itemStyle: {
              color: "#2c7be5",
            },
          },
        ],
      };
      const barStatu = echarts.init(document.getElementById("barStatu"));
      barStatu.setOption(mulColumnZZTData);
      window.addEventListener("resize", () => {
        if (barStatu) {
          barStatu.resize();
        }
      });
      //   window.addEventListener("resize", this.handleSize(barStatu));
    },
    handleSize() {
      this.funApis.resize();
    },
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.handleSize);
    this.funApis.dispose();
    this.funApis = null;
  },
};
</script>

<style lang="scss" scoped>
.logCon {
  width: 100%;
  min-height: 438px;
  background-color: #fff;
}
.pieStatu {
  width: 100%;
  height: 450px;
}
.barStatu {
  width: 100%;
  height: 450px;
}
</style>
