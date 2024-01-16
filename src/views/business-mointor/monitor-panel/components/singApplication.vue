<template>
  <div class="public-table-block public-hoverItem logCon">
    <span class="public-firstHead">个人参拍申请</span>
    <div class="singAuction">
      <div class="warryApplication">
        <div class="applicaNum">
          <div class="appli_th">申请数</div>
          <div class="apl_body">
            <div
              style="
                margin-top: 40px;
                margin-right: 30px;
                display: flex;
                flex-direction: column;
                align-items: center;
              "
            >
              <div class="setFont">{{ toDate[0] }}</div>
              <div class="setBoldFont">
                {{ currentPeriod.count ? currentPeriod.count : 0 }}
              </div>
              <div class="setFont">
                {{ toDate[1] }}
                <div class="setSecondFont">
                  {{ lastPeriod.count ? lastPeriod.count : 0 }}
                </div>
              </div>
            </div>
            <!-- table -->
            <!-- <div style="width: 50%; height: 194px"> -->
            <div style="width: 50%">
              <div class="block-index-form">
                <el-table
                  class="public-radius"
                  :data="tableData"
                  :header-cell-style="{
                    background: '#fff ',
                    textAlign: 'center',
                  }"
                  :cell-style="{ textAlign: 'center' }"
                >
                  <el-table-column prop="location" label=""> </el-table-column>
                  <el-table-column prop="current" :label="toDate[0]">
                  </el-table-column>
                  <el-table-column prop="last" :label="toDate[1]">
                  </el-table-column>
                </el-table>
              </div>
            </div>
            <!-- echarts -->
            <div style="width: 40%">
              <div id="appliEchart"></div>
            </div>
          </div>
        </div>
      </div>
      <div style="width: 40%">
        <div class="examineNum">
          <div class="appli_th">审核数</div>
          <div style="display: flex; margin: 46px 26px 32px">
            <div>
              <div class="setFont">接收审核数</div>
              <div class="setFont" style="margin-top: 15px">{{ toDate[0] }}</div>
              <div class="setBoldFont" style="margin: 15px 0">
                {{ currentExamine.count ? currentExamine.count : 0 }}
              </div>
              <div class="setFont">
                {{ toDate[1] }}
                <div class="setSecondFont">
                  {{ lastExamine.count ? lastExamine.count : 0 }}
                </div>
              </div>
            </div>
            <div style="margin: 67px 50px 0 31px">
              <div class="setFont">
                接收白名单
                <div class="setSecondFont">
                  {{ whitelist | filterBusinessCount }}
                </div>
              </div>
              <div class="setFont" style="margin-top: 15px">
                接收黑名单
                <div class="setSecondFont">
                  {{ blacklist | filterBusinessCount }}
                </div>
              </div>
            </div>
            <div style="width: 60%">
              <div id="barStatu" class="barStatu"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import echarts from "echarts";
import { copyObj } from "@/utils/copy";
export default {
  data() {
    return {
      funList: [
        { name: "现场", value: 10 },
        { name: "APP", value: 20 },
        { name: "网站", value: 30 },
        { name: "现场撤销", value: 40 },
      ],
      tableData: [
        {
          location: "现场",
          current: 0,
          last: 0,
        },
        {
          location: "网站",
          current: 0,
          last: 0,
        },
        {
          location: "APP",
          current: 0,
          last: 0,
        },
        {
          location: "现场撤销",
          current: 0,
          last: 0,
        },
        {
          location: "网站撤销",
          current: 0,
          last: 0,
        },
        {
          location: "APP撤销",
          current: 0,
          last: 0,
        },
      ],
      clearList: [
        {
          location: "现场",
          current: 0,
          last: 0,
        },
        {
          location: "网站",
          current: 0,
          last: 0,
        },
        {
          location: "APP",
          current: 0,
          last: 0,
        },
        {
          location: "现场撤销",
          current: 0,
          last: 0,
        },
        {
          location: "网站撤销",
          current: 0,
          last: 0,
        },
        {
          location: "APP撤销",
          current: 0,
          last: 0,
        },
      ],
      ybarData: [1025, 1500],
      xbarData: ["今日", "昨日"],
      toDay: "",
      lastDay: "",
      currentPeriod: "",
      lastPeriod: "",

      currentPeriodList: [],
      lastPeriodList: [],
      singApplicationList: [], //参拍申请注册
      examineList: [], //审核数据
      currentExamine: "",
      lastExamine: "",
      blacklist: "",
      whitelist: "",
      //
      onlineList: [],
      outLineList: [],
      // 参拍申请注销
      offApplicationList: [],
      offCurrent :'',
      offLast:'',
      toDate:["今日","昨日"]
    };
  },
  mounted() {
    // this.funApiEcharts();
    // this.barStatuEcharts();
    this.nowDate(this.checkDate);
  },
  computed: {
    checkDate() {
      return this.$store.getters.checkDate;
    },
  },
  watch: {
    checkDate: {
      handler(newValue, oldValue) {
        this.nowDate(newValue);
      },
      deep: true,
    },
  },
  methods: {
    filterBusinessEvent(list, date) {
      if (date) {
        this.toDate = date;
        this.xbarData = date
      }
      
    
      this.singApplicationList = [];
      this.currentPeriodList = list[0];
      this.lastPeriodList = list[1];
      // 参拍申请 - 注册
      this.singApplicationList.push(
        this.$options.filters.filterBusinessList(
          this.currentPeriodList,
          "preCheckin",
          "preCheckin.register",
          "网点",
          "成功"
        )
      );
      this.singApplicationList.push(
        this.$options.filters.filterBusinessList(
          this.lastPeriodList,
          "preCheckin",
          "preCheckin.register",
          "网点",
          "成功"
        )
      );
      this.singApplicationList.map((item, index) => {
        if (index == 0) {
          this.currentPeriod = item;
          if (!item.items) {
            item.items = [];
          }
        } else {
          this.lastPeriod = item;
          if (!item.items) {
            item.items = [];
          }
        }
      });
      this.tableData = copyObj(this.clearList); //初始化数据
      this.funList = this.tableData.slice(0, 3);
      this.currentPeriod.items.map((item) => {
        this.tableData.map((val) => {
          if (item.location == "网点") {
            if (val.location == "现场") {
              val.current = item.count;
            }
            if (val.location == item.location) {
              val.current = item.count;
            }
          }
          if (item.location == "网上登记") {
            if (val.location == "网站") {
              val.current = item.count;
            }
            if (val.location == item.location) {
              val.current = item.count;
            }
          }
          if (item.location == "App") {
            if (val.location == "APP") {
              val.current = item.count;
            }
            if (val.location == item.location) {
              val.current = item.count;
            }
          }

          val.name = val.location;
          val.value = val.current;
        });
      });
      this.lastPeriod.items.map((item) => {
        this.tableData.map((val) => {
          // if (item.location == "网点") {
          //   if (val.location == "现场") {
          //     val.last = item.count;
          //   }
          //   if (val.location == item.location) {
          //     val.last = item.count;
          //   }
          // }
          if (item.location == "网点") {
            if (val.location == "现场") {
              val.last = item.count;
            }
            if (val.location == item.location) {
              val.last = item.count;
            }
          }
          if (item.location == "网上登记") {
            if (val.location == "网站") {
              val.last = item.count;
            }
            if (val.location == item.location) {
              val.last = item.count;
            }
          }
          if (item.location == "App") {
            if (val.location == "APP") {
              val.last = item.count;
            }
            if (val.location == item.location) {
              val.last = item.count;
            }
          }
        });
      });
      this.funApiEcharts(); //pie-chart

       // 参拍申请 - 注销
       this.offApplicationList = []
       this.offApplicationList.push(
        this.$options.filters.filterBusinessList(
          this.currentPeriodList,
          "preCheckin",
          "preCheckin.cancel",
          "网点",
          "成功"
        )
      );
      this.offApplicationList.push(
        this.$options.filters.filterBusinessList(
          this.lastPeriodList,
          "preCheckin",
          "preCheckin.cancel",
          "网点",
          "成功"
        )
      );
      this.offApplicationList.map((item, index) => {
        if (index == 0) {
          this.offCurrent = item;
          if (!item.items) {
            item.items = [];
          }
        } else {
          this.offLast = item;
          if (!item.items) {
            item.items = [];
          }
        }
      });
      this.offCurrent.items.map((item) => {
        this.tableData.map((val) => {
          if (item.location == "网点") {
            if (val.location == "现场撤销") {
              val.current = item.count;
            }
            if (val.location == item.location) {
              val.current = item.count;
            }
          }
          if (item.location == "网上登记") {
            if (val.location == "网站撤销") {
              val.current = item.count;
            }
            if (val.location == item.location) {
              val.current = item.count;
            }
          }
          if (item.location == "App") {
            if (val.location == "APP撤销") {
              val.current = item.count;
            }
            if (val.location == item.location) {
              val.current = item.count;
            }
          }
        });
      });
      this.offLast.items.map((item) => {
        this.tableData.map((val) => {
          if (item.location == "网点") {
            if (val.location == "现场撤销") {
              val.last = item.count;
            }
            if (val.location == item.location) {
              val.last = item.count;
            }
          }
          if (item.location == "网上登记") {
            if (val.location == "网站撤销") {
              val.last = item.count;
            }
            if (val.location == item.location) {
              val.last = item.count;
            }
          }
          if (item.location == "App") {
            if (val.location == "APP撤销") {
              val.last = item.count;
            }
            if (val.location == item.location) {
              val.last = item.count;
            }
          }
        });
      });
      // console.log(this.offApplicationList, " this.offApplicationList");
      // 现场撤销
      // this.onlineList = [];
      // this.outLineList = [];
      // this.onlineList.push(
      //   this.$options.filters.filterBusinessList(
      //     list[0],
      //     "preCheckin",
      //     "preCheckin.cancel",
      //     "现场",
      //     "成功"
      //   )
      // );
      // this.onlineList.push(
      //   this.$options.filters.filterBusinessList(
      //     list[1],
      //     "preCheckin",
      //     "preCheckin.cancel",
      //     "现场",
      //     "成功"
      //   )
      // );

      //模块2 - 审核数事件
      this.examineFilter(list);
      
    },
    examineFilter(list) {
      this.examineList = [];
      this.examineList.push(
        this.$options.filters.filterBusinessList(
          list[0],
          "preCheckin",
          "preCheckin.auditResult",
          "现场",
          "成功"
        )
      );
      this.examineList.push(
        this.$options.filters.filterBusinessList(
          list[1],
          "preCheckin",
          "preCheckin.auditResult",
          "现场",
          "成功"
        )
      );
      this.examineList.map((item, index) => {
        if (index == 0) {
          this.currentExamine = item;
          if (!item.items) {
            item.items = [];
          }
        } else {
          this.lastExamine = item;
          if (!item.items) {
            item.items = [];
          }
        }
      });

      this.whitelist = this.$options.filters.filterBusinessList(
        list[0],
        "preCheckin",
        "preCheckin.whitelist",
        "现场",
        "成功"
      );
      this.blacklist = this.$options.filters.filterBusinessList(
        list[0],
        "preCheckin",
        "preCheckin.blacklist",
        "现场",
        "成功"
      );

      // console.log(this.examineList, " this.examineList");
      // this.ybarData
      let current = this.currentExamine.count || 0;
      let last = this.lastExamine.count || 0;
      this.ybarData = [current, last];
      this.barStatuEcharts();
      // console.log(this.currentExamine, this.lastExamine, " this.examineList");
    },
    nowDate(date) {
      switch (date) {
        case "Day":
          this.toDay = "今日";
          this.lastDay = "昨日";
          break;
        case "Week":
          this.toDay = "本周";
          this.lastDay = "上周";
          break;
        case "Month":
          this.toDay = "本月";
          this.lastDay = "上月";
          break;
      }
    },

    // pie echarts
    funApiEcharts() {
      this.funApis = echarts.init(document.getElementById("appliEchart"));
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
          formatter: "{b}:{c}({d}%)",
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
    // bar charts
    barStatuEcharts() {
      const mulColumnZZTData = {
        tooltip: {
          trigger: "axis",
        },
        legend: {
          right: "0%",
        },
        grid: {
          left: "15%",
          top: "35%",
          bottom: "15%",
        },
        xAxis: {
          data: this.xbarData,
          axisTick: {
            show: false,
            alignWithLabel: true,
          },
          axisLabel: {
            show: true,
            interval: 0,
            rotate: 35,
          },
        },

        dataZoom: [
          {
            type: "inside",
            startValue: 0,
            endValue: 8,
            zoomOnMouseWheel: false,
            moveOnMouseWheel: true,
            moveOnMouseMove: true,
          },
        ],
        yAxis: {
          axisTick: {
            show: false,
            alignWithLabel: true,
          },
        },
        series: [
          {
            type: "bar",
            data: this.ybarData,
            barWidth: 30,
            name: "审核数",
            label: {
              show: true,
              position: "top",
            },
            itemStyle: {
              color: "#2c7be5",
            },
          },
        ],
      };
      const barStatu = echarts.init(document.getElementById("barStatu"));
      barStatu.setOption(mulColumnZZTData);
      window.addEventListener("resize", () => {
        if (barStatu) {
          barStatu.resize();
        }
      });
      //   window.addEventListener("resize", this.handleSize(barStatu));
    },
  },
};
</script>

<style lang="scss" scoped>
.logCon {
  width: 100%;
  min-height: 326px;
  background-color: #fff;
}
#appliEchart {
  width: 100%;
  height: 200px;
}
#barStatu {
  width: 100%;
  height: 161px;
}

.singAuction {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
  //   参拍共用头部
  .appli_th {
    height: 38px;
    // background: rgba(251, 252, 254, 0.39);
    // border-bottom: 1px solid #dee0ec;
    border-bottom: 1px solid #dee0ec;
    background: #f7fafe;
    border-radius: 6px 6px 0px 0px;
    text-align: left;
    padding-left: 25px;
    box-sizing: border-box;
    line-height: 38px;
    font-size: 13px;
    font-weight: 500;
    color: #4d4d4d;
   
  }
  .setFont {
    display: flex;
    white-space: nowrap;
    font-size: 13px;
    font-weight: 400;
    line-height: 14px;
    color: #4d4d4d;
    .setSecondFont {
      font-size: 13px;
      font-weight: 500;
      line-height: 14px;
      color: #4d4d4d;
      margin-left: 5px;
    }
  }
  .setBoldFont {
    margin: 20px 0;
    font-size: 22px;
    font-weight: 400;
    line-height: 22px;
    color: #2c7be5;
  }
  .warryApplication {
    width: calc(60% - 20px);
    .applicaNum {
      width: 100%;
      min-height: 232px;
      border: 1px solid #dee0ec;
      border-radius: 6px;
    }

    .apl_body {
      display: flex;
      padding: 23px 16px 16px;
      min-height: 194px;
      box-sizing: border-box;
    }
  }

  .examineNum {
    width: 100%;
    min-height: 232px;
    border: 1px solid #dee0ec;
    border-radius: 6px;
  }
}
</style>
