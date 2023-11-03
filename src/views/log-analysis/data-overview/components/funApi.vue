<template>
  <div class="block-main public-hoverItem logCon">
    <div class="block-head">
      <div class="block-title">请求方法</div>
      <div class="block-head-icon">
        <img src="@/assets/images/icon.png" alt="" width="10px" />
      </div>
    </div>
    <div id="funApiEchart"></div>
  </div>
</template>

<script>
import { getRequestMethodApi } from "@/api/trackingapi/accessLog";
import echarts from "echarts";
export default {
  data() {
    return {
      funApis: null,
      funList: [],
    };
  },
  mounted() {},
  methods: {
    getRequestMethod(commonParams) {
      getRequestMethodApi(commonParams).then((res) => {
        if (res.code == 200) {
          this.funList = res.data;
          this.funList.map((item) => {
            item.value = item.pvRate;
            item.name = item.requestMethod;
          });
          this.funApiEcharts();
        }
      });
    },
    funApiEcharts() {
      this.funApis = echarts.init(document.getElementById("funApiEchart"));
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
          // formatter: "{a} <br/> {c} ({d}%)",
          formatter: (params) => {
            let htmlStr;
            htmlStr = `
              <div style="padding:10px;">
                <div style='font-size:14px;'>请求方式： ${params.data.requestMethod}</div>
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
          left: "center",
        },
        grid: {
          left: "40%",
          right: "30%",
          bottom: "10%",
        },
        series: [
          {
            type: "pie",
            radius: ["40%", "53%"],
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
                padding: [30, -5],
                position: "outside",
                // formatter: "({d}%)",
                formatter: (params) => {
                  // return  params.name  + "\n"+  params.data.pv +"\n"+  '(' +params.percent  + '%' + ')'
                  return params.name + "\n" + "(" + params.percent + "%" + ")";
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
            emphasis: {
              label: {
                show: true,
                fontSize: "30",
                fontWeight: "bold",
              },
            },
            data: this.funList,
          },
        ],
      });
      window.addEventListener("resize", () => {
        if (this.funApis) {
          this.funApis.resize();
        }
      });
    },
  },
  beforeDestroy() {
    if (!this.funApis) {
      return;
    }
    this.funApis.dispose();
    this.funApis = null;
  },
};
</script>

<style lang="scss" scoped>
.logCon {
  width: calc(23% - 15px);
  #funApiEchart {
    width: 100%;
    height: 400px;
  }
}
</style>
