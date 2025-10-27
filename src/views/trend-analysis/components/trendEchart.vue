<template>
  <div>
    <div
      class="block-main public-hoverItem logCon"
      style="height: 500px; margin-top: 20px"
      v-loading="loading"
    >
      <div class="block-head" style="justify-content: flex-start">
        <div class="block-title">趋势图</div>
        <!-- 多选 -->
        <el-select
          v-show="!contrastValue"
          class="custom_select"
          v-model="headLege"
          multiple
          placeholder="请选择"
          style="margin-left: 20px; min-width: 280px"
          @change="handleCheckPointer"
        >
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
            <div style="display: flex; align-items: center">
              <span class="checkbox__inner"><div class="inner-box"></div></span>
              <span style="">{{ item.label }}</span>
            </div>
          </el-option>
        </el-select>
        <!-- 单选 -->
        <el-select
          v-show="contrastValue"
          class="custom_select"
          v-model="headLegeRadio"
          placeholder="请选择"
          style="margin-left: 20px; min-width: 280px"
          @change="changeChartRadio"
        >
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
            style="min-width: 280px !important"
          >
            {{ item.label }}
          </el-option>
        </el-select>
      </div>
      <!-- 多选 -->
      <div
        v-show="!contrastValue"
        id="trendLine"
        :style="{ height: '400px', width: '100%' }"
      />
      <div
        v-show="contrastValue"
        id="radioEchart"
        style="height: 400px; width: 100%"
      ></div>
    </div>
    <!-- table -->
    <trend-table
      v-loading="loading"
      ref="trendTable"
      @refreshApi="refreshApi"
    ></trend-table>
  </div>
</template>

<script>
import echarts from "echarts";
import trendTable from "./trendTable";
import { getFlowTrendApi } from "@/api/trackingapi/accessLog";
import { copyObj } from "@/utils/copy";
import resize from "@/components/Charts/mixins/resize";
export default {
  components: {
    trendTable,
  },
  mixins: [resize],
  data() {
    return {
      loading: false,
      commonParams: {},
      headLege: ["用户数(UV)", "访问量(PV)"],
      options: [
        {
          value: "用户数(UV)",
          label: "用户数(UV)",
          disabled: false,
        },
        {
          value: "访问量(PV)",
          label: "访问量(PV)",
          disabled: false,
        },
        {
          value: "流出流量",
          label: "流出流量",
          disabled: false,
        },
      ],
      echartDataList: [],
      echartDataListDB: [],
      bodySentBytesList: [],
      pvList: [],
      uvList: [],
      statTime: [],
      cologStyle: this.$store.state.settings.cologStyle,
      contrastValue: "",
      headLegeRadio: "用户数(UV)",
      pointered: "用户数(UV)",
      dateTimeX: [],
      firstDateRadio: [],
      secondDateRadio: [],
      headName: "",
    };
  },
  methods: {
    // echarts radio 单选
    changeChartRadio(val) {
      this.pointered = val;
      this.apiDetailList();
    },
    getFlowTrendEvent() {
      getFlowTrendApi(this.commonParams).then((res) => {
        if (res.code == 200) {
          if (!this.contrastValue) {
            this.$refs.trendTable.trendApiEvent(res.data, this.commonParams);
          }

          let toDateTime = this.$options.filters.formatDateToday();
          if (
            this.commonParams.timeType == "hour" &&
            this.commonParams.endTime == this.commonParams.startTime &&
            this.commonParams.startTime == toDateTime &&
            !this.contrastValue
          ) {
            let currentHout = this.$options.filters.getCurrentHour();
            let newArray = copyObj(res.data).reverse();
            const index = newArray.findIndex(
              (item) => item.statTime == currentHout
            );
            const result = index !== -1 ? newArray.slice(index) : [];
            this.echartDataList = result.reverse();
          } else {
            this.echartDataList = res.data;
          }

          if (this.contrastValue) {
            let params = copyObj(this.commonParams);
            params.startTime = this.contrastValue[0];
            params.endTime = this.contrastValue[1];
            this.loading = true;
            getFlowTrendApi(params).then((res) => {
              if (res.code == 200) {
                // 处理对比数据图表类型
                this.echartDataListDB = res.data;
                let tableList1 = copyObj(this.echartDataList);
                let tableList2 = copyObj(this.echartDataListDB);
                // echarts
                this.apiDetailList();
                // 对比表格
                for (let i = 0; i < tableList1.length; i++) {
                  for (let j = 0; j < tableList2.length; j++) {
                    if (i == j) {
                      tableList1[i].children = tableList2[j];
                    }
                  }
                }
                this.$refs.trendTable.trendApiEvent(
                  tableList1,
                  this.commonParams,
                  this.contrastValue
                );
                this.loading = false;
              }
            });
          } else {
            this.loading = false;
          }
          this.filterEvent();
        }
      });
    },
    // 传递数据内容
    apiDetailList() {
      let val = this.contrastValue;
      this.timeFlag = this.commonParams.timeType;
      if (this.timeFlag != "hour") {
        this.endValue = 13;
      } else {
        this.endValue = 24;
      }
      if (this.contrastValue) {
        let pointer;
        this.dateName =
          this.commonParams.startTime + "~" + this.commonParams.endTime;
        this.dateNameTwo = this.contrastValue[0] + "~" + this.contrastValue[1];
        if (this.chart) {
          this.chart.dispose();
          this.chart = null;
        }
        this.firstDateRadio = [];
        this.secondDateRadio = [];
        this.dateTimeX = [];

        this.checkHeadName();
        this.echartDataList.map((item) => {
          if (item[this.headName]) {
            this.firstDateRadio.push(item[this.headName]);
          } else {
            this.firstDateRadio.push(0);
          }
        });
        this.echartDataListDB.map((item) => {
          if (item[this.headName]) {
            this.secondDateRadio.push(item[this.headName]);
          } else {
            this.secondDateRadio.push(0);
          }
        });

        for (let i = 0; i < this.echartDataListDB.length; i++) {
          for (let j = 0; j < this.echartDataList.length; j++) {
            if (i == j) {
              if (this.echartDataList[i] && this.echartDataList[i].statTime) {
                if (this.timeFlag != "hour") {
                  this.dateTimeX.push(
                    this.echartDataList[i].statTime +
                      "与" +
                      this.echartDataListDB[i].statTime
                  );
                } else {
                  if (this.echartDataList[i].statTime) {
                    this.dateTimeX.push(this.echartDataList[i].statTime + "时");
                  } else {
                    this.dateTimeX.push(0);
                  }
                }
              }
            }
          }
        }
        this.$nextTick(() => {
          this.countLineEcharts();
        });
      }
    },
    checkHeadName() {
      switch (this.headLegeRadio) {
        case "用户数(UV)":
          this.headName = "uv";
          break;
        case "访问量(PV)":
          this.headName = "pv";
          break;
        case "流出流量":
          this.headName = "bodySentBytes";
          break;
      }
    },
    // 单选事件
    countLineEcharts() {
      this.countLineChart = echarts.init(
        document.getElementById("radioEchart")
      );
      let _this = this;
      let option = {
        tooltip: {
          trigger: "axis",
          showContent: true,
          formatter: function (params) {
            var res = "";
            if (_this.timeFlag == "hour") {
              res =
                "<div style='display:flex;justify-content: space-between;padding:7px'>" +
                "<div style=''>" +
                params[0].name +
                "</div>" +
                "<div style=''>" +
                _this.pointered +
                "</div>" +
                "</div>";
              for (var i = 0; i < params.length; i++) {
                res +=
                  "<div style='display:flex;padding:5px 7px;'>" +
                  params[i].seriesName +
                  "<div style='min-width:100px;text-align:right;margin-right:20px'>" +
                  params[i].data +
                  "</div>" +
                  "</div>";
              }
              return res;
            } else {
              res =
                "<div style='display:flex;justify-content: space-between;padding:7px'>" +
                "<div style=''>" +
                "时间" +
                "</div>" +
                "<div style=''>" +
                _this.pointered +
                "</div>" +
                "</div>";
              let result = [0, 0];
              if (params[0].name) {
                result = params[0].name.split("与");
              }

              for (var i = 0; i < params.length; i++) {
                if (i == 0) {
                  params[i].newTime = result[0];
                } else if (i == 1) {
                  params[i].newTime = result[1];
                }
                if (_this.headName == "bodySentBytes") {
                  params[i].data = _this.$options.filters.conver(
                    params[i].data
                  );
                }
                res +=
                  "<div style='padding:5px 0;'>" +
                  "<div style='display:flex;justify-content: space-between;margin-left:8px;'>" +
                  params[i].newTime +
                  "<div style='min-width:100px;text-align:right;margin-right:20px'>" +
                  params[i].data +
                  "</div>" +
                  "</div>";

                ("</div>");
              }

              return res;
            }
          },
          //   },
        },
        legend: {
          x: "center",
          y: "top",
        },
        grid: {
          left: "5%",
          right: "2%",
          top: "15%",
          bottom: "5%",
        },
        dataZoom: [
          {
            type: "inside",
            startValue: 0,
            endValue: this.endValue,
            minValueSpan: 10,
            zoomOnMouseWheel: false,
            moveOnMouseWheel: true,
            moveOnMouseMove: true,
          },
        ],
        xAxis: {
          type: "category",
          data: this.dateTimeX,
          axisTick: {
            show: false,
          },
          axisLabel: {
            formatter: function (value) {
              if (value) {
                return value.length > 10 ? value.slice(0, 10) + "..." : value;
              }
            },
            show: true,
            interval: 0, // 显示全部标签
            textStyle: {
              fontSize: 12, // 可选：设置字体大小
            },
          },
        },
        yAxis: {
          axisTick: {
            show: false,
          },
          type: "value",
        },
        series: [
          {
            data: this.firstDateRadio,
            type: "line",
            name: this.dateName,
            color: "#2c7be5",
          },
          {
            data: this.secondDateRadio,
            type: "line",
            name: this.dateNameTwo,
            color: "#FFDE84",
          },
        ],
      };
      this.countLineChart.setOption(option);
      window.addEventListener("resize", () => {
        this.countLineChart && this.countLineChart.resize();
      });
    },
    refreshApi() {
      this.getFlowTrendEvent(this.commonParams);
    },
    trendApiEvent(params) {
      this.contrastValue = copyObj(params).contrastValue;
      delete params.contrastValue;
      this.commonParams = copyObj(params);
      this.getFlowTrendEvent();
    },
    handleCheckPointer() {
      this.filterEvent();
    },
    filterEvent() {
      this.statTime = [];
      this.uvList = [];
      this.pvList = [];
      this.bodySentBytesList = [];
      for (let i = 0; i < this.echartDataList.length; i++) {
        for (let j = 0; j < this.headLege.length; j++) {
          if (this.headLege[j] == "访问量(PV)") {
            this.pvList.push(this.echartDataList[i].pv || 0);
          }
          if (this.headLege[j] == "用户数(UV)") {
            this.uvList.push(this.echartDataList[i].uv || 0);
          }
          if (this.headLege[j] == "流出流量") {
            let kbs = this.$options.filters.convertMB(
              this.echartDataList[i].bodySentBytes || 0
            );
            this.bodySentBytesList.push(kbs);
          }
        }
        this.statTime.push(this.echartDataList[i].statTime);
      }
      this.initChart();
    },

    initChart() {
      const trendLineDom = document.getElementById("trendLine");
      if (!trendLineDom) {
        console.warn('Trend line chart DOM element not found');
        return;
      }
      this.chart = echarts.init(trendLineDom);
      this.chart.setOption({
        backgroundColor: "#fff",
        tooltip: {
          trigger: "axis",
          axisPointer: {
            lineStyle: {
              color: "#C0CADB",
              width: 3,
            },
          },
        },
        legend: {
          top: 20,
          icon: "rect",
          itemWidth: 14,
          itemHeight: 5,
          itemGap: 13,
          data: this.headLege,
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
          left: "2%",
          right: "2%",
          bottom: "2%",
          containLabel: true,
        },
        xAxis: [
          {
            type: "category",
            boundaryGap: false,
            data: this.statTime,
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
            type: "value",
            nameTextStyle: {
              fontWeight: 600,
              fontSize: 18,
            },
            axisTick: {
              show: false,
            },
          },
        ],
        series: [
          {
            name: "访问量(PV)",
            type: "line",
            itemStyle: {
              normal: {
                color: this.cologStyle.$pv,
              },
            },
            lineStyle: {
              width: 3,
            },
            data: this.pvList,
          },
          {
            name: "用户数(UV)",
            type: "line",
            itemStyle: {
              normal: {
                color: this.cologStyle.$uv,
              },
            },
            lineStyle: {
              width: 3,
            },
            data: this.uvList,
          },
          {
            name: "流出流量",
            type: "line",
            itemStyle: {
              normal: {
                color: this.cologStyle.$bounceRate,
              },
            },
            lineStyle: {
              width: 3,
            },
            data: this.bodySentBytesList,
          },
        ],
      });
    },

    setFilterBarParams(val) {
      this.filterBarParams = copyObj(val);
    },
  },
};
</script>

<style lang="scss" scoped></style>
