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
      <div
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
      </div>
    </div>
    <div class="block-echarts">
      <div id="visitchart" class="visitEchart"></div>
      <div class="flowEchart"></div>
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
      test:'',
    };
  },
  mounted() {
    this.initChartData();
  },
  methods: {
    initChartData() {
      this.chart = echarts.init(document.querySelector(".visitEchart"));
      this.chart.setOption({
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
        },
        grid: {
          left: "3%",
          right: "3%",
          bottom: "3%",
          containLabel: true,
        },
        legend: {
          // 距离容器10%
          right: "10%",
          // 修饰图例文字的颜色
          textStyle: {
            color: "red",
          },
        },
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
  width: calc(70% - 10px);
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
    height: 100%;
  }
}
</style>
