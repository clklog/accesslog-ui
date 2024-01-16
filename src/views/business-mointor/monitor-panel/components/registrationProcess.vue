<template>
  <div class="public-table-block public-hoverItem logCon">
    <span class="public-firstHead">个人登记办理</span>
    <div
      style="display: flex; justify-content: space-between; margin-top: 20px"
    >
      <div class="leftProcess">
        <div class="commonHead">办理数</div>
        <div>
          <div class="apl_body">
            <div
              style="
                margin-top: 40px;
                margin-right: 30px;
                margin-left: 50px;
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
            <div style="width: 50%; margin-left: 100px">
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
          </div>
        </div>
        <!-- 第二层 -->
        <div class="process_Two">
          <div class="leftPie">
            <div id="processEchart"></div>
          </div>
          <div class="rightBar">
            <div id="handleEchart"></div>
          </div>
        </div>
      </div>

      <!-- 右侧 -->
      <div class="rightDeal">
        <div class="commonHead">成交结算</div>
        <div class="apl_body">
          <div
            style="
              margin: 37px 24px 0;
              display: flex;
              flex-direction: column;
              align-items: center;
            "
          >
            <div class="setFont">支付</div>
            <div class="setFont" style="margin-top: 15px">{{ toDate[0] }}</div>
            <div class="setBoldFont" style="margin: 15px 0">
              {{ currentSuccess.count ? currentSuccess.count : 0 }}
            </div>
            <div class="setFont">
              {{ toDate[1] }}
              <div class="setSecondFont">
                {{ periodSuccess.count ? periodSuccess.count : 0 }}
              </div>
            </div>
          </div>
          <!-- table -->
          <div style="width: 60%; margin-left: 20px">
            <div class="block-index-form">
              <el-table
                class="public-radius"
                :data="tableData2"
                :header-cell-style="{
                  background: '#fff ',
                  textAlign: 'center',
                }"
                :cell-style="{ textAlign: 'center' }"
              >
                <el-table-column prop="location" label=""> </el-table-column>
                <el-table-column prop="current" :label="toDate[0]" >
                </el-table-column>
                <el-table-column prop="last" :label="toDate[1]">
                </el-table-column>
              </el-table>
            </div>
          </div>

          <div style="margin: 53px 50px 0 50px">
            <div class="setFont">
              EMS发送数
              <div class="setSecondFont">{{ emsValue.count || 0 }}</div>
            </div>
            <div class="setFont" style="margin-top: 15px">
              电子缴款书
              <div class="setSecondFont">{{ emailValue.count || 0 }}</div>
            </div>
          </div>
        </div>
        <div
          style="
            width: 100%;
            display: flex;
            justify-content: center;
            margin-bottom: 32px;
          "
        >
          <div id="successEcharts" class="successEcharts"></div>
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
      toDate:["今日","昨日"],
      tableData: [
        {
          location: "现场",
          current: 0,
          last: 0,
        },

        {
          location: "APP",
          current: 0,
          last: 0,
        },
        {
          location: "激活",
          current: 0,
          last: 0,
        },
        {
          location: "现场退卡",
          current: 0,
          last: 0,
        },
        {
          location: "APP退卡",
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
          location: "APP",
          current: 0,
          last: 0,
        },
        {
          location: "激活",
          current: 0,
          last: 0,
        },
        {
          location: "现场退卡",
          current: 0,
          last: 0,
        },
        {
          location: "APP退卡",
          current: 0,
          last: 0,
        },
      ],
      tableData2: [
        {
          location: "线下",
          current: 0,
          last: 0,
        },
        {
          location: "线上",
          current: 0,
          last: 0,
        },
        {
          location: "金融服务",
          current: 0,
          last: 0,
        },
      ],
      clearList2: [
        {
          location: "线下",
          current: 0,
          last: 0,
        },
        {
          location: "线上",
          current: 0,
          last: 0,
        },
        {
          location: "金融服务",
          current: 0,
          last: 0,
        },
      ],
      funList: [
        { name: "现场", value: 10 },
        { name: "APP", value: 20 },
        { name: "网站", value: 30 },
        { name: "现场撤销", value: 40 },
      ],
      sceneYxis: [],
      appYxis: [],
      ybarData: [1025, 1500],
      xbarData: ["今日", "昨日"],
      toDay: "",
      lastDay: "",
      registrationList: [],

      currentPeriod: "",
      lastPeriod: "",

      currentPeriodList: [],
      lastPeriodList: [],
      singApplicationList: [], //参拍数据
      dateList: ["今日", "昨日"],

      // 成交结算
      currentSuccess: "",
      periodSuccess: "",
      dealSetList: [],
      emsValue: {
        count: 0,
      },
      emailValue: {
        count: 0,
      },
      barList: [], //bar chart
      online: {
        item: [],
      },
      outLine: {
        item: [],
      },

      // 激活h 退卡
      activeCardList: [],
      currentActive: "",
      lastActive: "",
      backCardList: [],
      currentBack: "",
      lastBack: "",
    };
  },
  mounted() {
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
    filterBusinessEvent(list,date) {
      if (date) {
      this.toDate = date;
       this.xbarData = date;
       this.dateList = date;
      }
      
      this.registrationList = [];
      // 个人拍卖登记.办理
      this.registrationList.push(
        this.$options.filters.filterBusinessList(
          list[0],
          "bidCard",
          "bidCard.send",
          "网点",
          "成功"
        )
      );
      this.registrationList.push(
        this.$options.filters.filterBusinessList(
          list[1],
          "bidCard",
          "bidCard.send",
          "网点",
          "成功"
        )
      );
      this.registrationList.map((item, index) => {
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
      let scene = [];
      this.currentPeriod.items.map((item) => {
        this.tableData.map((val) => {
          if (item.location == "网点") {
            if (val.location == "现场") {
              val.current = item.count;
              scene.push(val.current);
            }
            if (val.location == item.location) {
              val.current = item.count;
            }
          }
          // if (item.location == "网上登记") {
          //   if (val.location == "网站") {
          //     val.current = item.count;
          //   }
          //   if (val.location == item.location) {
          //     val.current = item.count;
          //   }
          // }
          if (item.location == "服务") {
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
          //     scene.push(val.last);
          //   }
          //   if (val.location == item.location) {
          //     val.last = item.count;
          //   }
          // }
          if (item.location == "网点") {
            if (val.location == "现场") {
              val.last = item.count;
              // scene.push(val.last);
            }
            if (val.location == item.location) {
              val.last = item.count;
            }
          }
          if (item.location == "服务") {
            if (val.location == "APP") {
              val.last = item.count;
            }
            if (val.location == item.location) {
              val.last = item.count;
            }
          }
          // if (item.location == "网上登记") {
          //   if (val.location == "网站") {
          //     val.last = item.count;
          //   }
          //   if (val.location == item.location) {
          //     val.last = item.count;
          //   }
          // }
          
        });
      });
      // this.dateList = [this.toDay, this.lastDay];

      //  个人拍卖登记.退卡 || 激活

      this.activeCardList = [];
      this.backCardList = [];
      this.backCardList.push(
        this.$options.filters.filterBusinessList(
          list[0],
          "bidCard",
          "bidCard.back",
          "网点",
          "成功"
        )
      );
      this.backCardList.push(
        this.$options.filters.filterBusinessList(
          list[1],
          "bidCard",
          "bidCard.back",
          "网点",
          "成功"
        )
      );
      this.backCardList.map((item, index) => {
        if (index == 0) {
          this.currentBack = item;
          if (!item.items) {
            item.items = [];
          }
        } else {
          this.lastBack = item;
          if (!item.items) {
            item.items = [];
          }
        }
      });
      this.currentBack.items.map((item) => {
        this.tableData.map((val) => {
          if (item.location == "网点") {
            if (val.location == "现场退卡") {
              val.current = item.count;
              scene.push(val.current);
            }
          }
          if (item.location == "服务") {
            if (val.location == "APP退卡") {
              val.current = item.count;
              scene.push(val.current);
            }
            if (val.location == item.location) {
              val.current = item.count;
            }
          }
        });
      });
      
      this.lastBack.items.map((item) => {
        this.tableData.map((val) => {
          if (item.location == "网点") {
            if (val.location == "现场退卡") {
              val.last = item.count;
              // scene.push(val.last);
            }
          }
          if (item.location == "服务") {
            if (val.location == "APP退卡") {
              val.last = item.count;
              // scene.push(val.last);
            }
            if (val.location == item.location) {
              val.last = item.count;
            }
          }
        });
      });

      this.activeCardList.push(
        this.$options.filters.filterBusinessList(
          list[0],
          "bidCard",
          "bidCard.active",
          "激活",
          "成功"
        )
      );
      this.activeCardList.push(
        this.$options.filters.filterBusinessList(
          list[1],
          "bidCard",
          "bidCard.active",
          "激活",
          "成功"
        )
      );
   
    //   this.activeCardList = [{
    //     count:456,
    //     items:[
    //       {
    //         count:456,
    //         location:"激活"
    //       }
    //     ]
    //   },
    //   {
    //     count:456,
    //     items:[
    //       {
    //         count:123,
    //         location:"激活"
    //       }
    //     ]
    //   },
      
    // ]
    // 个人登记办理-激活
      this.activeCardList.map((item, index) => {
       
        if (index == 0) {
          if (item.items) {
            item.items.map(a =>{
              this.tableData.map(b=>{
                if (b.location == "激活") {
                  b.current = a.count;
                }
              })
            })
          }
        }
        
        if(index == 1){
          if (item.items) {
            item.items.map(a =>{
              this.tableData.map(b=>{
                if (b.location == "激活") {
                  b.last = a.count;
                }
              })
            })
          }
        }
      });

      // end---

      //个人登记办理饼状图
      this.funList = this.tableData.slice(0, 2);
      this.sceneYxis = [this.funList[0].current, this.funList[0].last];
      this.appYxis = [this.funList[1].current, this.funList[1].last];
      this.funApiEcharts();

      // 暂定bar echarts
      this.barList = scene;
      this.barStatuEcharts();
      // 成交结算
      this.dealSerApi(list);
    },
    dealSerApi(list) {
      this.dealSetList = [];
      this.dealSetList.push(
        this.$options.filters.filterBusinessList(
          list[0],
          "bidCard",
          "bidCard.deal",
          "现场",
          "成功"
        )
      );
      this.dealSetList.push(
        this.$options.filters.filterBusinessList(
          list[1],
          "bidCard",
          "bidCard.deal",
          "现场",
          "成功"
        )
      );
      this.dealSetList.map((item, index) => {
        if (index == 0) {
          this.currentSuccess = item;
          if (!item.items) {
            item.items = [];
          }
        } else {
          this.periodSuccess = item;
          if (!item.items) {
            item.items = [];
          }
        }
      });

      this.tableData2 = copyObj(this.clearList2); //初始化数据
      this.currentSuccess.items.map((item) => {
        this.tableData2.map((val) => {
          if (item.location == "网点") {
            if (val.location == "线下") {
              val.current = item.count;
            }
          }
          if (item.location == "网上支付") {
            if (val.location == "线上") {
              val.current = item.count;
            }
          }

          if (val.location == item.location) {
            val.current = item.count;
          }
          val.name = val.location;
          val.value = val.current;
        });
      });
      this.periodSuccess.items.map((item) => {
        this.tableData2.map((val) => {
          if (item.location == "网上支付") {
            if (val.location == "线上") {
              val.last = item.count;
            }
          }
          if (item.location == "网点") {
            if (val.location == "线下") {
              val.last = item.count;
            }
          }
          if (val.location == item.location) {
            val.last = item.count;
          }
        });
      });
      // console.log(this.tableData2, " this.tableData2");
      this.online = {
        item: [],
      };
      this.outLine = {
        item: [],
      };
      this.tableData2.map((item) => {
        if (item.name == "线下") {
          this.outLine.name = item.name;
          this.outLine.item.push(item.current);
        }
        if (item.name == "线上") {
          this.online.name = item.name;
          this.online.item.push(item.current);
        }
      });
      this.successEchartsEvent(); //环形图

      // 交货书
      this.emsValue = this.$options.filters.filterBusinessList(
        list[0],
        "bidCard",
        "bidCard.post",
        "",
        "成功"
      );
      this.emailValue = this.$options.filters.filterBusinessList(
        list[0],
        "bidCard",
        "bidCard.issueEbill",
        "",
        "成功"
      );
    },
    funApiEcharts() {
      this.funApis = echarts.init(document.getElementById("processEchart"));
      const COLORS = [
        "#2c7be5",
        "#80bdef",
        "#c4ebad",
        "#85dec8",
        "#fff2ce",
        "#ffde84",
      ];
      this.funApis.setOption({
        angleAxis: {
          axisTick: {
            show: false,
            alignWithLabel: true,
          },
        },
        radiusAxis: {
          type: "category",
          // data: ["今日", "昨日"],
          data: this.dateList,
          z: 10,
        },

        tooltip: {
          trigger: "item",
          formatter: "{a}:{c}",
        },
        grid: {
          top: "20%",
        },
        polar: {},
        series: [
          {
            type: "bar",
            data: this.sceneYxis,
            coordinateSystem: "polar",
            color: "#2c7be5",
            name: "现场",
            stack: "a",
            emphasis: {
              focus: "series",
            },
          },
          {
            type: "bar",
            data: this.appYxis,
            color: "#80bdef",
            coordinateSystem: "polar",
            name: "APP",
            stack: "a",
            emphasis: {
              focus: "series",
            },
          },
        ],
        legend: {
          show: true,
          orient: "line-through",
          y: "top",
          right: "0%",
          show: true,
        },
      });
      window.addEventListener("resize", () => {
        if (this.funApis) {
          this.funApis.resize();
        }
      });
    },

    barStatuEcharts() {
      const option = {
        title: {
          //   text: "World Population",
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
        },
        legend: {
          right: "3%",
        },
        grid: {
          left: "10%",
          right: "10%",
          bottom: "15%",
          //   containLabel: true,
        },
        xAxis: {
          axisTick: {
            show: false,
            alignWithLabel: true,
          },
          axisLabel: {
            show: true,
            interval: 0,
            rotate: 35,
          },
          type: "value",
          boundaryGap: [0, 0.01],
        },
        yAxis: {
          axisTick: {
            show: false,
            alignWithLabel: true,
          },
          type: "category",
          // data: ["今日", "昨日"],
          data: this.dateList,
        },
        series: [
          {
            label: {
              show: true,
              position: "right",
            },
            name: "现场",
            type: "bar",
            // data: this.barList,
            data: this.sceneYxis,
            color: "#2c7be5",
          },
          {
            label: {
              show: true,
              position: "right",
            },
            name: "APP",
            color: "#80bdef",
            type: "bar",
            data: this.appYxis,
          },
        ],
      };
      const barStatu = echarts.init(document.getElementById("handleEchart"));
      barStatu.setOption(option);
      window.addEventListener("resize", () => {
        if (barStatu) {
          barStatu.resize();
        }
      });
      //   window.addEventListener("resize", this.handleSize(barStatu));
    },

    successEchartsEvent() {
      this.funApis = echarts.init(document.getElementById("successEcharts"));
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
          // bottom: "0%",
          // left: "center",
          orient: "line-through",
          y: "center",
          right: "0%",
          show: true,
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
            // data: this.funList,
            data: this.tableData2,
          },
        ],
      });
      window.addEventListener("resize", () => {
        if (this.funApis) {
          this.funApis.resize();
        }
      });
    },
    // successEchartsEvent() {
    //   this.funApis = echarts.init(document.getElementById("successEcharts"));
    //   const COLORS = [
    //     "#2c7be5",
    //     "#80bdef",
    //     "#c4ebad",
    //     "#85dec8",
    //     "#fff2ce",
    //     "#ffde84",
    //   ];
    //   this.funApis.setOption({
    //     angleAxis: {
    //       // type: "category",
    //       // data: ["1000", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    //       axisTick: {
    //         show: false,
    //         alignWithLabel: true,
    //       },
    //     },
    //     tooltip: {
    //       trigger: "item",
    //       formatter: "{a}:{c}",
    //     },
    //     radiusAxis: {
    //       axisTick: {
    //         show: false,
    //         alignWithLabel: true,
    //       },
    //     },
    //     polar: {},
    //     series: [
    //       {
    //         color: "#2c7be5",
    //         type: "bar",
    //         // data: [1, 2, 3, 4, 3, 5, 1],
    //         data: this.online.item,
    //         coordinateSystem: "polar",
    //         name: this.online.name,
    //         stack: "a",
    //         emphasis: {
    //           focus: "series",
    //         },
    //       },
    //       {
    //         color: "#c4ebad",

    //         type: "bar",
    //         // data: [2, 4, 6, 1, 3, 2, 1],
    //         data: this.outLine.item,
    //         coordinateSystem: "polar",
    //         // name: "WEB",
    //         name: this.online.name,
    //         stack: "a",
    //         emphasis: {
    //           focus: "series",
    //         },
    //       },
    //       {
    //         color: "#85dec8",
    //         type: "bar",
    //         data: [1, 2, 3, 4, 1, 2, 5],
    //         coordinateSystem: "polar",
    //         name: "现场",
    //         stack: "a",
    //         emphasis: {
    //           focus: "series",
    //         },
    //       },
    //     ],
    //     legend: {
    //       orient: "line-through",
    //       y: "center",
    //       right: "0%",
    //       show: true,
    //       // data: ["APP", "WEB", "现场"],
    //     },
    //   });
    //   window.addEventListener("resize", () => {
    //     if (this.funApis) {
    //       this.funApis.resize();
    //     }
    //   });
    // },
  },
};
</script>

<style lang="scss" scoped>
.logCon {
  width: 100%;
  min-height: 479px;
  background-color: #fff;
  .commonHead {
    height: 42px;
    line-height: 42px;
    // background: rgba(251, 252, 254, 0.39);

    padding-left: 25px;
    box-sizing: border-box;
    // border-bottom: 1px solid #dee0ec;
    border-bottom: 1px solid #dee0ec;
    background: #f7fafe;
    border-radius: 6px 6px 0px 0px;
    font-size: 13px;
    font-weight: 500;
    color: #4d4d4d;
  }
  #processEchart {
    width: 100%;
    height: 200px;
  }
  #handleEchart {
    width: 100%;
    height: 200px;
  }
  .apl_body {
    display: flex;
    padding: 23px 16px 16px;
    min-height: 194px;
    box-sizing: border-box;
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
  }

  .leftProcess {
    width: calc(50% - 10px);
    min-height: 385px;
    border: 1px solid #dee0ec;
    border-radius: 6px;

    .process_Two {
      width: 100%;
      display: flex;
      margin-bottom: 36px;
      margin-top: 20px;
      .leftPie {
        width: 40%;
      }
      .rightBar {
        width: 60%;
      }
    }
  }
  .rightDeal {
    width: calc(50% - 10px);
    min-height: 385px;
    border: 1px solid #dee0ec;
    border-radius: 6px;
    .successEcharts {
      width: 60%;
      height: 300px;
    }
  }
}
.pieStatu {
  width: 100%;
  height: 450px;
}
.barStatu {
  width: 100%;
  height: 450px;
}
</style>
