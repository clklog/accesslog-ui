<template>
  <div>
    <div class="area_container public-hoverItem">
      <div style="width: 100%; position: relative">
        <el-tabs
          @tab-click="handleClick"
          v-model="activeMap"
          v-loading="loading"
        >
          <el-tab-pane label="按省份" name="province">
            <div style="display: flex">
              <div class="mapCharts" style="position: relative">
                <!-- 指标 -->
                <div style="position: absolute; left: 0">
                  <div
                    style="
                      display: flex;
                      border: 1px solid #acb2ba;
                      border-radius: 4px;
                      align-items: center;
                      height: 30px;
                      margin-left: 50px;
                    "
                  >
                    <div
                      style="font-size: 11px; color: #4d4d4d; padding-left: 6px"
                    >
                      指标:
                    </div>
                    <el-select
                      class="appli_select"
                      v-model="hostValue"
                      placeholder="请选择指标"
                      size="small"
                      style="width: 130px; z-index: 1"
                    >
                      <el-option
                        v-for="item in hostList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                        @click.native="handleChangeProject(item)"
                      >
                      </el-option>
                    </el-select>
                  </div>
                </div>
                <!-- 中国地图 -->
                <div
                  id="echart_china"
                  ref="echart_china"
                  style="width: 50vw; height: 400px; position: relative"
                ></div>
              </div>
              <div class="mapTable">
                <div
                  style="
                    width: 500px;
                    height: 410px;
                    margin-top: 30px;
                    overflow: hidden;
                    margin-bottom: 30px;
                  "
                >
                  <el-table
                    class="public-radius"
                    ref="singleTable"
                    height="400"
                    :header-cell-style="{
                      textAlign: 'center',
                      background: '#f7fafe  ',
                    }"
                    :cell-style="{ textAlign: 'center' }"
                    border
                    :data="apiProvinceList"
                    highlight-current-row
                    style="width: 100%"
                  >
                    <el-table-column type="index" width="80"> </el-table-column>
                    <el-table-column
                      :show-overflow-tooltip="true"
                      property="province"
                      label="省份"
                      width="200"
                    >
                    </el-table-column>
                    <el-table-column
                      :property="labelProperty"
                      :label="hostValue"
                    >
                    </el-table-column>

                    <el-table-column
                      :formatter="dateFormat"
                      :property="rateProperty"
                      label="占比"
                    >
                    </el-table-column>
                  </el-table>
                </div>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="按国家" name="country">
            <div style="display: flex">
              <div class="mapCharts" style="position: relative">
                <!-- 指标 -->
                <div style="position: absolute; left: 0">
                  <div
                    style="
                      display: flex;
                      border: 1px solid #acb2ba;
                      border-radius: 4px;
                      align-items: center;
                      height: 30px;
                      margin-left: 50px;
                    "
                  >
                    <div
                      style="font-size: 11px; color: #4d4d4d; padding-left: 6px"
                    >
                      指标:
                    </div>
                    <el-select
                      class="appli_select"
                      v-model="hostValue"
                      placeholder="请选择指标"
                      size="small"
                      style="width: 130px; z-index: 1"
                    >
                      <el-option
                        v-for="item in hostList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                        @click.native="handleChangeProject(item)"
                      >
                      </el-option>
                    </el-select>
                  </div>
                </div>
                <!-- 世界地图 -->
                <div
                  id="chart"
                  style="
                    width: 45vw;
                    height: 400px;
                    margin-left: 3vw;
                    margin-right: 3vw;
                  "
                ></div>
              </div>
              <div class="mapTable">
                <div
                  style="
                    width: 500px;
                    height: 410px;
                    margin-top: 30px;
                    overflow: hidden;
                    margin-bottom: 30px;
                  "
                >
                  <el-table
                    class="public-radius"
                    ref="singleTable"
                    height="400"
                    :header-cell-style="{
                      textAlign: 'center',
                      background: '#f7fafe  ',
                    }"
                    :cell-style="{ textAlign: 'center' }"
                    border
                    :data="apiCountyList"
                    highlight-current-row
                    style="width: 100%"
                  >
                    <el-table-column type="index" width="80"> </el-table-column>
                    <el-table-column
                      :show-overflow-tooltip="true"
                      property="country"
                      label="国家"
                      width="200"
                    >
                      <template slot-scope="{ row }">
                        <span>{{ row.country || "未知" }}</span>
                      </template>
                    </el-table-column>
                    <el-table-column
                      :property="labelProperty"
                      :label="hostValue"
                    >
                    </el-table-column>

                    <el-table-column
                      :formatter="dateFormat"
                      :property="rateProperty"
                      label="占比"
                    >
                    </el-table-column>
                  </el-table>
                </div>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>

<script>
import "echarts/map/js/world";
import echarts from "echarts";
import worldData from "@/utils/world.json";
import resize from "@/components/Charts/mixins/resize";
import chinamap from "echarts/map/json/china.json";
import { copyObj } from "@/utils/copy";
import { getIpByAreaApi } from "@/api/trackingapi/accessLog";
export default {
  mixins: [resize],
  data() {
    return {
      loading: false,
      hostValue: "访客数",
      labelProperty: "uv",
      rateProperty: "uvRate",
      //指标选择列表
      hostList: [
        { label: "浏览量", value: "浏览量", id: "pv", rate: "pvRate" },
        { label: "访客数", value: "访客数", id: "uv", rate: "uvRate" },
        // {
        //   label: "访问次数",
        //   value: "访问次数",
        //   id: "visitCount",
        //   rate: "visitCountRate",
        // },
        // {
        //   label: "新访客数",
        //   value: "新访客数",
        //   id: "newUv",
        //   rate: "newUvRate",
        // },
        { label: "IP数", value: "IP数", id: "ipCount", rate: "ipCountRate" },
      ],
      worldList: [],
      getAreaList: null,
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
      activeMap: "province",
      apiProvinceList: [], //省份
      apiCountyList: [], //国家
      maxValue: 200,
      commonParams: {},
      newWorldList: [],
    };
  },
  methods: {
    dateFormat(row, column) {
      const date = row[column.property];
      if (date) {
        return this.$options.filters.percenTable(date);
      } else {
        return 0;
      }
    },
    handleClick(val) {
      if (this.activeMap == "province") {
        this.getIpByAreaApiEvent();
        this.$bus.$emit("$IpEvent", "province");
      } else {
        this.countryApiEvent();
        this.$bus.$emit("$IpEvent", "country");
      }
    },
    showScatterInGeo() {
      let _that = this;
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
            let htmlStr = `
              <div style="padding:10px;">
                <div style='font-size:14px;'> ${params.name}</div>
                <p style='text-align:left;margin-top:10px;'>
                  ${_that.hostValue}：${params.value}<br/>
                  ${_that.hostValue}占比 ：${_that.$options.filters.percenTable(
              params.data.rate || 0
            )}<br/>
                </p>
              </div>

              `;
            return htmlStr;
          },
        },
        visualMap: {
          min: 0,
          max: this.maxValue || 200,
          left: "10%",
          top: "bottom",
          text: ["高", "低"],
          realtime: false,
          calculable: true,
          inRange: {
            color: ["#fff", "#2c7be5"],
          },
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
    ipApiEvent(params) {
      this.commonParams = copyObj(params);
      this.getIpByAreaApiEvent();
    },
    getIpByAreaApiEvent() {
      this.loading = true;
      this.commonParams.summaryOptions = this.activeMap;
      this.commonParams.indicator = this.labelProperty;
      getIpByAreaApi(this.commonParams).then((res) => {
        if (res.code == 200) {
          function containsChinese(str) {
            return /[\u4E00-\u9FA5]/.test(str);
          }
          // 过滤出包含中文的对象
          const filteredData = res.data.filter((obj) => {
            const province = obj.province ? obj.province.trim() : "";
            return province !== "" && containsChinese(province);
          });
          this.apiProvinceList = filteredData;
          this.checkMapDataEvent();
          this.loading = false;
        } else {
          this.loading = false;
        }
      });
    },
    checkMapDataEvent() {
      let maxValue = [];
      let result = this.apiProvinceList;
      for (let i = 0; i < this.provinceList.length; i++) {
        for (let j = 0; j < result.length; j++) {
          if (this.provinceList[i].name == result[j].province) {
            this.provinceList[i].value = result[j].uv;
            this.provinceList[i].rate = result[j].uvRate || 0;
            maxValue.push(this.provinceList[i].value);
          }
        }
      }
      if (maxValue.length > 0) {
        let max = maxValue.sort(function (a, b) {
          return b - a;
        })[0];
        this.maxValue = max;
      }
      // refresh map
      this.showScatterInGeo();
    },
    countryApiEvent(params) {
      // params.pageNum = 1;
      // params.pageSize = 100;
      this.commonParams.summaryOptions = this.activeMap;
      getIpByAreaApi(this.commonParams).then((res) => {
        if (res.code == 200) {
          let maxValue = [];
          let resList = res.data;
          this.apiCountyList = resList;
          this.newWorldList = copyObj(worldData.dataArr);
          for (let i = 0; i < this.newWorldList.length; i++) {
            for (let j = 0; j < resList.length; j++) {
              if (this.newWorldList[i].name == resList[j].country) {
                this.newWorldList[i].value = resList[j].uv;
                this.newWorldList[i].pv = resList[j].pv;
                this.newWorldList[i].pvRate = resList[j].pvRate;
                this.newWorldList[i].uv = resList[j].uv;
                this.newWorldList[i].uvRate = resList[j].uvRate;
                this.newWorldList[i].ipCount = resList[j].ipCount;
                this.newWorldList[i].ipCountRate = resList[j].ipCountRate;
              }
              if (this.newWorldList[i].name != "中国") {
                maxValue.push(this.newWorldList[i].value);
              }
            }
          }
          let max = maxValue.sort(function (a, b) {
            return b - a;
          })[0];
          this.worldChartEvent(max);
        }
      });
    },
    worldChartEvent(max) {
      let worldChart;
      let data = this.newWorldList;
      let name = worldData.namemap;
      this.$nextTick(() => {
        let domEcharts = document.getElementById("chart");
        if (!domEcharts) return;
        let _this = this;
        worldChart = echarts.init(domEcharts);
        worldChart.setOption({
          grid: {
            width: "100%",
            height: "100%",
            left: "10%",
            right: "0%",
            bottom: "0%",
            containLabel: true,
          },
          tooltip: {
            trigger: "item",
            formatter(params) {
              let visitCountRate, pvRate, pv, uv, uvRate, ipCount, ipCountRate;
              if (params.data) {
                visitCountRate = _this.$options.filters.percenTable(
                  params.data.visitCountRate
                );
                pv = params.data.pv;
                uv = params.data.uv;
                ipCount = params.data.ipCount;
                pvRate = _this.$options.filters.percenTable(params.data.pvRate);
                uvRate = _this.$options.filters.percenTable(params.data.uvRate);
                ipCountRate = _this.$options.filters.percenTable(
                  params.data.ipCountRate
                );
              }

              let htmlStr = `
                <div style="padding:10px;">
                  <div style='font-size:14px;'> ${params.name}</div>
                  <p style='text-align:left;margin-top:10px;'>
                    浏览量：${pv || 0}(占比：${pvRate || 0})<br/>
                    访客数：${uv || 0}(占比：${uvRate || 0})<br/>
                    IP数：${ipCount || 0}(占比：${ipCountRate || 0})<br/>
                  </p>
                </div>
                `;
              return htmlStr;
            },
          },
          visualMap: {
            min: 0,
            max: max || 100,
            text: ["高", "低"],
            left: "10%",
            top: "bottom",
            text: ["高", "低"],
            realtime: false,
            calculable: true,
            inRange: {
              color: ["#fff", "#eaf2fc", "#2c7be5"],
            },
          },
          series: [
            {
              type: "map",
              name: "世界地图",
              mapType: "world",
              // 是否开启鼠标缩放和平移漫游 默认不开启 如果只想要开启缩放或者平移，可以设置成 'scale' 或者 'move' 设置成 true 为都开启
              roam: false,
              label: {
                show: false,
              },
              zoom: 1.2,
              itemStyle: {
                // areaColor: '#7B68EE', // 地图区域的颜色 如果设置了visualMap，areaColor属性将不起作用
                borderWidth: 0.3,
                borderColor: "#000",
                borderType: "solid",
              },
              emphasis: {
                label: {
                  show: true,
                  color: "#fff",
                },
                itemStyle: {
                  areaColor: "#FF6347",
                },
              },
              nameMap: name,
              data: data,
            },
          ],
        });
      });
      window.addEventListener("resize", () => {
        worldChart.resize();
      });
    },
    handleChangeProject(val) {
      this.labelProperty = val.id;
      this.rateProperty = val.rate;
      this.getIpByAreaApiEvent();
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep {
  @import "~@/styles/components/custom-select.scss";
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
  .el-tabs__header {
    background-color: #f9fafd;
    margin: 0 0;
    border-radius: 6px 6px 0 0;
  }
  .el-tabs__item.is-active {
    background-color: #fff;
    border-radius: 6px 0 0 0;
  }
  .el-tabs__nav-wrap::after {
    background-color: #fff;
  }
  .el-tabs__item {
    padding: 0 0;
    width: 130px;
    height: 65px;
    line-height: 65px;
    text-align: center;
    font-size: 15px;
    font-weight: bold;
    color: #4d4d4d;
  }
}

.area_container {
  background-color: #fff;
  min-height: 470px;
  margin-bottom: 20px;
  margin-top: 20px;
  .mapCharts {
    width: 50%;
    padding-top: 17px;
    padding-left: 18px;
  }
  .mapTable {
    width: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .search_table {
    height: 100%;
    padding: 18px 22px;
    span {
      font-size: 13px;
      font-weight: 500;
      line-height: 31px;
      color: #4d4d4d;
    }
  }
}
</style>
