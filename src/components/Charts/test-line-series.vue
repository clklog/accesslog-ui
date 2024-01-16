<template>
    <!-- 图表的容器，一定要有宽高 -->
    <div class="Box">
      <div class="chartBox">
        <div id="dataChart" :style="{ width: '100%', height: '100%' }"></div>
      </div>
    </div>
  </template>
  
  <script>
  import { debounce } from "@/utils/throttle-debounce"; //引入消抖节流函数
  
  export default {
    data() {
      return {
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
      this.getChartsData();
      let onResizeDeb = debounce(() => {
        this.myChart && this.myChart.resize(); //图表自适应的一个方法
      }, 350);
      window.addEventListener("resize", onResizeDeb);
      // 然后监听window的resize事件．在浏览器窗口变化时再设置下背景图高度．
    },
  
    methods: {
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
  
        this.myChart.on("mousemove", () => {
          if (this.dataChart.tooltip.timer) {
            clearInterval(this.dataChart.tooltip.timer);
            this.dataChart.tooltip.timer = null;
            // 实现鼠标操作后，停止定时显示数据1分钟
            setTimeout(() => {
              this.dataChart.tooltip.index = 0;
              this.dataChart.tooltip.timer = setInterval(
                this.showChartToolTip,
                3000
              );
            }, 60000);
          }
        });
  
        this.dataChart.tooltip.index = 0;
  
        if (this.dataChart.tooltip.timer) {
          clearInterval(this.dataChart.tooltip.timer);
        }
  
        //控制播放的速度
        this.dataChart.tooltip.timer = setInterval(this.showChartToolTip, 1500);
      },
  
      //展示提示框
      showChartToolTip() {
        if (
          this.dataChart.seriesData &&
          this.dataChart.seriesData.length > 0 &&
          this.dataChart.seriesData[0].data &&
          this.dataChart.seriesData[0].data.length > 0
        ) {
          this.myChart.dispatchAction({
            type: "showTip", //提示框
            seriesIndex: 0,
            dataIndex: this.dataChart.tooltip.index++, //第 lightIndex   柱子高亮
          });
          if (
            this.dataChart.tooltip.index >=
            this.dataChart.seriesData[0].data.length
          ) {
            this.dataChart.tooltip.index = 0;
          }
        }
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
    },
  }
  </script>
  
  <style scoped>
  .Box {
    width: 30%;
    height: 50vh;
    margin-left: 30%;
  }
  .chartBox {
    float: left;
    width: 100%;
    height: 50vh;
  }
  </style>