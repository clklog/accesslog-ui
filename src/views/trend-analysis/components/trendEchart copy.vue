<template>
  <div>
    <div
      class="block-main public-hoverItem logCon"
      style="height: 500px; margin-top: 20px"
    >
      <div class="block-head" style="justify-content: flex-start">
        <div class="block-title">趋势图</div>
        <!-- 刷选框 -->
        <el-select
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
      </div>
      <!-- echarts -->
      <div id="trendLine" :style="{ height: '400px', width: '100%' }" />
    </div>
    <!-- table -->
    <trend-table ref="trendTable" @refreshApi="refreshApi"></trend-table>
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
      bodySentBytesList: [],
      pvList: [],
      uvList: [],
      statTime: [],
      cologStyle: this.$store.state.settings.cologStyle,
    };
  },
  methods: {
    refreshApi() {
      this.getFlowTrendEvent(this.commonParams);
    },
    trendApiEvent(params) {
      this.commonParams = params;
      this.getFlowTrendEvent();
    },
    handleCheckPointer() {
      this.filterEvent();
    },
    filterEvent() {
      this.statTime = [];
      this.uvList = [];
      this.pvList = [];
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

    getFlowTrendEvent() {
      getFlowTrendApi(this.commonParams).then((res) => {
        if (res.code == 200) {
          this.$refs.trendTable.trendApiEvent(res.data, this.commonParams);
          let toDateTime = this.$options.filters.formatDateToday();
          if (
            this.commonParams.timeType == "hour" &&
            this.commonParams.endTime == this.commonParams.startTime &&
            this.commonParams.startTime == toDateTime
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
          this.filterEvent();
        }
      });
    },
    initChart() {
      this.chart = echarts.init(document.getElementById("trendLine"));
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
