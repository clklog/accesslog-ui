<template>
  <div class="block-main public-hoverItem logCon">
    <div class="block-head">
      <div class="block-title">IP访问量Top10</div>
      <div class="block-head-icon">
        <img src="@/assets/images/icon.png" alt="" width="10px" />
      </div>
    </div>
    <div class="block-echarts">
      <div id="ipEchart" class="ip_echart"></div>
    </div>
  </div>
</template>

<script>
import echarts from "echarts";
import { getIpTop10Api } from "@/api/trackingapi/accessLog";
export default {
  data() {
    return {
      ipEchart: null,
      xDataList: [],
      yDataList: [],
      ipList: [],
    };
  },
  mounted() {},
  methods: {
    getIpTop10(commonParams) {
      getIpTop10Api(commonParams).then((res) => {
        if (res.code == 200) {
          // if (res.data && res.data.length > 10) {
          //   this.tableData = res.data.slice(0,10);
          // }
          this.xDataList = [];
          this.yDataList = [];
          this.ipList = res.data.slice(0, 10).reverse();
          this.ipList.map((item, index) => {
            if (item.ip) {
              this.yDataList.push(item.ip);
            }else{
              this.yDataList.push("");
            }
            if (item.pv) {
              this.xDataList.push(item.pv);
            }else{
              this.yDataList.push(0);
            }
          });
          // console.log(this.xDataList, this.yDataList);
          this.initIpEcharts();
        }
      });
    },
    initIpEcharts() {
      this.ipEchart = echarts.init(document.getElementById("ipEchart"));
      const option = {
        tooltip: {
          trigger: "axis",
          axisPointer: { type: "shadow" },
        },
        legend: {
          data: ["访问量(PV)"],
          right:'5%',
        },
      
        grid: {
          left: "20%",
          top:'12%',
          bottom:"10%",
        },
        yAxis: [
          {
            type: "category",
            data: this.yDataList,
            axisLabel: {
              interval: 0, 
              rotate: "0", 
            },
            axisTick: {
              show: false,
              alignWithLabel: true,
            },
            axisLine: {
              onZero: false,
            },
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
          // {
          //   name: "辅助",
          //   type: "bar",
          //   stack: "总量",
          //   itemStyle: {
          //     normal: {
          //       barBorderColor: "rgba(20,20,0,0.5)",
          //       barBorderWidth: 5,
          //       color: "rgba(0,220,0,0.8)",
          //     },
          //     emphasis: {
          //       barBorderColor: "rgba(0,0,0,0)",
          //       barBorderWidth: 25,
          //       color: "rgba(0,0,0,0)",
          //     },
          //   },
          //   data: [0, 1700, 1400, 1200, 300, 300, 0],
          // },
          {
            name: "访问量(PV)",
            type: "bar",
            itemStyle: {
              color: "#2c7be5",
            },
           
            barWidth: 20,
            label: {
              show: true,
              position: "right",
            },
            data: this.xDataList,
          },
        ],
      };
      this.ipEchart.setOption(option);
      window.addEventListener("resize", () => {
        if (this.ipEchart) {
          this.ipEchart.resize();
        }
        
      });
    },
  },
  beforeDestroy() {
    if (!this.ipEchart) {
      return;
    }
    this.ipEchart.dispose();
    this.ipEchart = null;
  },
};
</script>

<style lang="scss" scoped>
.logCon {
  width: calc(30%);
  display: flex;
  flex-wrap: wrap;
  min-height: 300px;
}
.block-echarts {
  width: 100%;
}
#ipEchart {
  width: 100%;
  height: 350px;
}
</style>
