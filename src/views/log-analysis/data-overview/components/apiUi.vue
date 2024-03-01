<template>
  <div class="block-main public-hoverItem logCon">
    <div class="block-head">
      <div class="block-title">
        请求UA
        <el-radio-group
          size="mini"
          v-model="checkValue"
          @change="changeEchartEvent"
          style="font-size: 13px; height: 30px; padding-left: 20px"
        >
          <el-radio-button label="TOP10">TOP10</el-radio-button>
          <el-radio-button label="全部">全部</el-radio-button>
        </el-radio-group>
      </div>
      <div class="block-head-icon">
        <!-- <img src="@/assets/images/icon.png" alt="" width="10px" /> -->
      </div>
    </div>
    <div v-if="checkValue == 'TOP10'" id="uiCharts"></div>
    <div v-if="checkValue == '全部'">
      <el-table
        :data="UAListData"
        class="public-radius"
        :header-cell-style="{ textAlign: 'center', background: '#f7fafe ' }"
        style="width: 100%"
        height="405px"
        :cell-style="{ textAlign: 'center' }"
        border
      >
        <el-table-column
          type="index"
          label="序号"
          min-width="30%"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          prop="browser"
          min-width="40%"
          :show-overflow-tooltip="true"
          label="浏览器"
        />
        <el-table-column
          prop="uv"
          label="用户数(UA)"
          min-width="30%"
          :show-overflow-tooltip="true"
        />
       
      </el-table>
    </div>
  </div>
</template>

<script>
import echarts from "echarts";
import { getUaApi } from "@/api/trackingapi/accessLog";
export default {
  data() {
    return {
      uiChart: null,
      uAList: [],
      xDataList: [],
      yDataList: [],
      checkValue: "TOP10",
      UAListData: [],
    };
  },
  mounted() {
    this.uiApiEcharts();
  },
  methods: {
    changeEchartEvent(val) {
      if (val == 'TOP10') {
        this.uiApiEcharts();
      }
    },
    // getUaApi
    getUa(commonParams) {
      getUaApi(commonParams).then((res) => {
        if (res.code == 200) {
          this.UAListData = res.data;
          this.xDataList = [];
          this.yDataList = [];
          this.uAList = res.data.slice(0, 10).reverse();
          this.uAList.map((item, index) => {
            if (item.browser) {
              this.yDataList.push(item.browser);
            } else {
              this.yDataList.push("");
            }
            if (item.uv) {
              this.xDataList.push(item.uv);
            } else {
              this.yDataList.push(0);
            }
          });
          // console.log(this.xDataList, this.yDataList);
          this.uiApiEcharts();
        }
      });
    },
    uiApiEcharts() {
      this.uiChart = echarts.init(document.getElementById("uiCharts"));
      const option = {
        tooltip: {
          trigger: "axis",
          // axisPointer: { type: "shadow" },
        },
        legend: {
          // data: ["访问量(PV)"],
          right:'5%',
        },
        grid: {
          left: "35%",
          top: "12%",
          bottom: "10%",
        },
        yAxis: [
          {
            type: "category",

            axisTick: {
              show: false,
              alignWithLabel: true,
            },
            // barWidth: 20,
            // axisLine: {
            //   onZero: false,
            // },
            data: this.yDataList,
          },
        ],
        xAxis: [
          {
            type: "value",
            axisTick: {
              show: false,
              alignWithLabel: true,
            },
            axisLabel: {
              interval: 0,
              rotate: "26",
            },
          },
        ],
        series: [
          {
            name: "用户数(UV)",
            type: "bar",
            barWidth: 10,
            data: this.xDataList,
            label: {
              show: true,
              position: "right",
            },
            itemStyle: {
              color: "#2c7be5",
            },
          },
        ],
      };
      this.uiChart.setOption(option);
      window.addEventListener("resize", () => {
        if (this.uiChart) {
          this.uiChart.resize();
        }
      });
    },
  },
  beforeDestroy() {
    if (!this.uiChart) {
      return;
    }
    this.uiChart.dispose();
    this.uiChart = null;
  },
};
</script>

<style lang="scss" scoped>
.logCon {
  width: calc(23% - 15px);
  #uiCharts {
    width: 100%;
    height: 400px;
  }
}
</style>
