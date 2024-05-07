<template>
  <div class="block-main public-hoverItem logCon" v-loading="loading">
    <div class="block-head" style="position: relative">
      <div
        class="block-title"
        style="display: flex; align-items: center; z-index: 999"
      >
        IP分布
        <el-radio-group
          size="mini"
          v-model="checkValue"
          style="font-size: 13px; height: 30px; padding-left: 20px"
          @change="changeEchartEvent"
          :disabled="!indexCanClick"
        >
          <el-radio-button label="map">地图</el-radio-button>
          <el-radio-button label="table">列表</el-radio-button>
        </el-radio-group>
      </div>
      <div
        class="block-head-icon"
        @click="$router.push('/logAnalysis/ip')"
        style="width: 100%; position: absolute; right: 0"
      >
        <img src="@/assets/images/icon.png" alt="" width="10px" />
      </div>
    </div>
    <div id="app" style="width: 100%">
      <div
        v-if="checkValue == 'map'"
        id="echart_china"
        ref="echart_china"
        style="width: 100%; height: 250px"
      />
      <div v-if="checkValue == 'table'">
        <el-table
          :data="areaListData"
          class="public-radius"
          :header-cell-style="{ textAlign: 'center', background: '#f7fafe ' }"
          style="width: 100%"
          :cell-style="tableHeaderColor"
          height="405"
          border
        >
          <el-table-column
            type="index"
            label="排序"
            min-width="20%"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            prop="province"
            min-width="30%"
            :show-overflow-tooltip="true"
            label="地域"
          />
          <el-table-column
            prop="uv"
            label="IP数"
            min-width="20%"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            prop="uvRate"
            label="占比"
            min-width="30%"
            :show-overflow-tooltip="true"
          >
            <template slot-scope="scope">
              {{ scope.row.uvRate | percentage }}
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>
<script>
import chinamap from "echarts/map/json/china.json";
// import { getIpByProvinceApi } from "@/api/trackingapi/accessLog";
import { getIpByAreaApi } from "@/api/trackingapi/accessLog";
import { percentage } from "@/utils/percent";
export default {
  data() {
    return {
      maxValue: 200,
      myChart: null,
      provinceList: [
        { name: "上海", value: 0 },
        { name: "广东", value: 0 },
        { name: "北京", value: 0 },
        { name: "天津", value: 0 },
        { name: "重庆", value: 0 },
        { name: "河北", value: 0 },
        { name: "河南", value: 0 },
        { name: "云南", value: 0 },
        { name: "辽宁", value: 0 },
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
      areaListData: [],
      getAreaList: null,
      checkValue: "map",
      commonParamsOld: "",
      loading: false,
    };
  },
  mounted() {},
  computed: {
    indexCanClick() {
      return this.$store.getters.indexCanClick;
    },
  },
  methods: {
    tableHeaderColor({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 1) {
        return "text-align:center";
      } else {
        return "text-align:center";
      }
    },
    changeEchartEvent(val) {
      if (val == "map") {
        this.showScatterInGeo();
      }
    },
    async getIpByProvince(commonParams) {
      this.loading = true;
      this.commonParamsOld = commonParams;
      //this.commonParamsOld.country='中国';
      let commonParams_plus = Object.assign({}, commonParams, {
        country: "中国",
      });
      await getIpByAreaApi(commonParams_plus).then((res) => {
        if (res.code == 200) {
          this.provinceList.map((item) => {
            item.value = 0;
          });
          let maxValue = [];
          function containsChinese(str) {
            return /[\u4E00-\u9FA5]/.test(str);
          }
          const filteredData = res.data.filter((obj) => {
            const province = obj.province ? obj.province.trim() : "";
            return province !== "" && containsChinese(province);
          });
          this.areaListData = filteredData;
          let result = filteredData;
          for (let i = 0; i < this.provinceList.length; i++) {
            this.provinceList[i].visitCountRate = 0;
            this.provinceList[i].uv = 0;
            this.provinceList[i].uvRate = 0;
            for (let j = 0; j < result.length; j++) {
              if (this.provinceList[i].name == result[j].province) {
                this.provinceList[i].value = result[j].uv;
                this.provinceList[i].uvRate = percentage(result[j].uvRate);
                maxValue.push(result[j].uv);
              }
            }
          }
          if (maxValue.length > 0) {
            let max = maxValue.sort(function (a, b) {
              return b - a;
            })[0];
            this.maxValue = max;
          } else {
            this.maxValue = 200;
            this.provinceList.map((item) => {
              item.value = 0;
            });
          }
          this.showScatterInGeo();
          this.loading = false;
        } else {
          this.loading = false;
        }
      });
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
        tooltip: {
          formatter(params, ticket, callback) {
            let visitCountRate, uv, uvRate;
            if (params.data) {
              uvRate = params.data.uvRate;
            } else {
              uvRate = 0;
            }
            let htmlStr = `
              <div style="padding:10px;">
                <div style='font-size:14px;'> ${params.name}</div>
                <p style='text-align:left;margin-top:10px;'>
                  访客数：${params.value}(占比：${uvRate})<br/>
                </p>
              </div>
               
              `;
            return htmlStr;
          },
          // backgroundColor:"#ff7f50",//提示标签背景颜色
          // textStyle:{color:"#fff"} //提示标签字体颜色
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
        if (this.myChart) {
          this.myChart.resize();
        }
      });
    },
    beforeDestroy() {
      if (!this.myChart) {
        return;
      }
      this.myChart.dispose();
      this.myChart = null;
    },
  },
};
</script>

<style lang="scss" scoped>
.logCon {
  width: calc(35% - 10px);
  display: flex;
  flex-wrap: wrap;
  min-height: 300px;
}
</style>
