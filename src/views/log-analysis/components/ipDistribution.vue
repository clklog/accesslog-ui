<template>
  <div class="block-main public-hoverItem logCon">
    <div class="block-head">
      <div class="block-title">IP分布</div>
      <div class="block-head-icon">
        <img src="@/assets/images/icon.png" alt="" width="10px" />
      </div>
    </div>
    <div id="app" style="width: 100%; height: 250px">
      <div
        id="echart_china"
        ref="echart_china"
        style="width: 100%; height: 250px"
      />
    </div>
  </div>
</template>
<script>
import chinamap from "echarts/map/json/china.json";
import { percentage } from "@/utils/percent";
export default {
  data() {
    return {
      maxValue: 200,
      myChart: null,
      provinceList: [
        // { name: "北京", value: this.randomData() },
        { name: "上海", value: this.randomData() },
        { name: "广东", value: 0 },
        { name: "北京", value: 0 },
        { name: "天津", value: this.randomData() },
        { name: "重庆", value: this.randomData() },
        { name: "河北", value: this.randomData() },
        { name: "河南", value: this.randomData() },
        { name: "云南", value: this.randomData() },
        { name: "辽宁", value: this.randomData() },
        { name: "黑龙江", value: 0 },
        { name: "湖南", value: 0 },
        { name: "安徽", value: 0 },
        { name: "山东", value: 0 },
        { name: "新疆", value: 0 },
        { name: "江苏", value: 0 },
        { name: "浙江", value: 0 },
        { name: "江西", value: 0 },
        { name: "湖北", value: 0 },
        { name: "广西", value: 0 },
        { name: "甘肃", value: 0 },
        { name: "山西", value: 0 },
        { name: "内蒙古", value: 0 },
        { name: "陕西", value: 0 },
        { name: "吉林", value: 0 },
        { name: "福建", value: 0 },
        { name: "贵州", value: 0 },
        { name: "青海", value: 0 },
        { name: "西藏", value: 0 },
        { name: "四川", value: 0 },
        { name: "宁夏", value: 0 },
        { name: "海南", value: 0 },
        { name: "台湾", value: 0 },
        { name: "香港", value: 0 },
        { name: "澳门", value: 0 },
      ],
      getAreaList: null,
    };
  },
  mounted(){
    this.getMapChartsData()
  },
  methods: {
    getMapChartsData(val) {
    //   this.provinceList.map((item) => {
    //     item.value = 0;
    //   });
    //   let maxValue = [];
    //   let result = val;
    //   // 地图数据匹配
    //   for (let i = 0; i < this.provinceList.length; i++) {
    //     this.provinceList[i].visitCountRate = 0;
    //     this.provinceList[i].uv = 0;
    //     this.provinceList[i].uvRate = 0;
    //     for (let j = 0; j < result.length; j++) {
    //       if (this.provinceList[i].name == result[j].province) {
    //         this.provinceList[i].value = result[j].visitCount;
    //         this.provinceList[i].visitCountRate = percentage(
    //           result[j].visitCountRate
    //         );
    //         this.provinceList[i].uv = result[j].uv;
    //         this.provinceList[i].uvRate = percentage(result[j].uvRate);
    //         maxValue.push(result[j].visitCount);
    //       }
    //     }
    //   }
    //   if (maxValue.length > 0) {
    //     let max = maxValue.sort(function (a, b) {
    //       return b - a;
    //     })[0];
    //     this.maxValue = max;
    //   } else {
    //     this.provinceList.map((item) => {
    //       item.value = 0;
    //     });
    //   }
      this.showScatterInGeo();
    },
    randomData() {
      return Math.round(Math.random() * 500);
    },
    resizeMyChartContainer() {
      this.myChart.height = 100 + "px"; 
      this.myChart.width = 100 + "px"; 
    },
    showScatterInGeo() {
      this.$echarts.registerMap("china", chinamap);
      this.myChart = this.$echarts.init(
        document.getElementById("echart_china")
      );
      var option = {
        geo: {
          map: "china",
          aspectScale: 0.75,
          zoom: 1.1,
        },
        visualMap: {
          min: 0,
          max: this.maxValue,
          left: "10%",
          top: "bottom",
          text: ["高", "低"],
          calculable: true,
          color: ["#2c7be5", "#fff"],
        },
        series: [
          {
            zoom: 1.1,
            map: "china",
            type: "map",
            itemStyle: {
              normal: {
                borderColor: "rgba(0, 0, 0, 0.2)",
              },
              emphasis: {
                shadowOffsetX: 0,
                shadowOffsetY: 0,
                shadowBlur: 20,
                borderWidth: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)",
              },
            },
            label: {
              normal: {
                show: false,
              },
              emphasis: {
                show: false,
              },
            },
            data: this.provinceList,
          },
        ],
      };
      this.myChart.setOption(option);
      window.addEventListener("resize", () => {
        this.myChart.resize();
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.logCon {
  width: calc(30% - 10px);
  display: flex;
  flex-wrap: wrap;
  min-height: 300px;
}
</style>
