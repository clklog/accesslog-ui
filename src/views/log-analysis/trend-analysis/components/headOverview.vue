<template>
  <div class="block-main public-hoverItem logCon">
    <div class="block-head">
      <div class="block-title">概览</div>
    </div>
    <div class="bid-list-page">
      <originView ref="originView" byFlowView></originView>
      <div class="bid-list-record">
        <!-- <div class="bid-list-item1 w157" style="width:200px;">
          <p v-if="timeType == 'day'">今日</p>
          <p v-if="timeType == 'previous'">昨日</p>
          <p v-if="timeType == 'week'">本周</p>
          <p v-if="timeType == 'month'">本月</p>
        </div> -->
        <div class="bid-list-item w158">
          <p>{{ overList.pv || "--" }}</p>
        </div>

        <div class="bid-list-item w158">
          <p>{{ overList.uv || "--" }}</p>
        </div>

        <div class="bid-list-item w158">
          <p>{{ overList.avgVisitTime ? overList.avgVisitTime + "ms" : '--'  }}</p>
        </div>
        <!-- <div class="bid-list-item w158">
          <p>{{ overList.slowPv | conver }}</p>
        </div> -->

        <div class="bid-list-item w158">
          <p>{{ overList.bodySentBytes | conver }}</p>
        </div>
      </div>
      <!-- 昨日 -->
      <!-- <div class="bid-list-record">
        <div class="bid-list-item1 w157">
          <p v-if="timeType == 'day'">昨日</p>
          <p v-if="timeType == 'week'">上周</p>
          <p v-if="timeType == 'month'">上月</p>
          <p v-if="timeType == 'year'">去年</p>
        </div>
        <div class="bid-list-item w157">
          <p>{{ previous.pv || "--" }}</p>
        </div>

        <div class="bid-list-item w157">
          <p>{{ previous.uv || "--" }}</p>
        </div>

        <div class="bid-list-item w157">
          <p>{{ formatTimeFun(previous.avgVisitTime) || "--" }}</p>
        </div>
        <div class="bid-list-item w157">
          <p>
            {{ percentageFun(previous.from) || "--" }}
          </p>
        </div>
        <div class="bid-list-item w157">
          <p>
            {{ percentageFun(previous.bounceRate) || "--" }}
          </p>
        </div>
      </div> -->

      <!-- 变化率 -->
      <!-- <div class="bid-list-record">
        <div class="bid-list-item1 w157">
          <p>变化率</p>
        </div>
        <div class="bid-list-item w157">
          <p>{{ currentPrediction.pv || "--" }}</p>
          <img
            v-if="currentPrediction.pv"
            class="riseImg"
            :src="
              handleCompare(previous.pv, currentPrediction.pv)
                ? require('@/assets/images/decline.png')
                : require('@/assets/images/rise.png')
            "
          />
        </div>

        <div class="bid-list-item w157">
          <p>{{ currentPrediction.uv || "--" }}</p>
          <img
            v-if="currentPrediction.uv"
            class="riseImg"
            :src="
              handleCompare(previous.uv, currentPrediction.uv)
                ? require('@/assets/images/decline.png')
                : require('@/assets/images/rise.png')
            "
          />
        </div>

        <div class="bid-list-item w157">
          <p>{{ formatTimeFun(currentPrediction.avgVisitTime) || "--" }}</p>
          <img
            v-if="currentPrediction.avgVisitTime"
            class="riseImg"
            :src="
              handleCompare(
                previous.avgVisitTime,
                currentPrediction.avgVisitTime
              )
                ? require('@/assets/images/decline.png')
                : require('@/assets/images/rise.png')
            "
          />
        </div>

        <div class="bid-list-item w157">
          <p>
            {{ percentageFun(currentPrediction.from) || "--" }}
          </p>
          <img
            v-if="currentPrediction.from"
            class="riseImg"
            :src="
              handleCompare(previous.from, currentPrediction.from)
                ? require('@/assets/images/decline.png')
                : require('@/assets/images/rise.png')
            "
          />
        </div>

        <div class="bid-list-item w157">
          <p>
            {{ percentageFun(currentPrediction.bounceRate) || "--" }}
          </p>
          <img
            v-if="currentPrediction.bounceRate"
            class="riseImg"
            :src="
              handleCompare(previous.bounceRate, currentPrediction.bounceRate)
                ? require('@/assets/images/decline.png')
                : require('@/assets/images/rise.png')
            "
          />
        </div>
      </div> -->
    </div>
  </div>
</template>

<script>
import originView from "@/components/origin-view/index";
import { percentage, averageRules } from "@/utils/percent";
import { formatTime } from "@/utils/format";
export default {
  components: { originView },
  data() {
    return {
      iconShow: true,
      flowData: null, //流量概览
      timeType: "day",
      overList: {},
    };
  },
  computed: {
    params() {
      return Object.assign({}, this.commonParams);
    },
    previous() {
      return this.flowData && this.flowData.previous
        ? this.flowData.previous
        : {};
    },
    current() {
      return this.flowData && this.flowData.current
        ? this.flowData.current
        : {};
    },
    currentPrediction() {
      return this.flowData && this.flowData.currentPrediction
        ? this.flowData.currentPrediction
        : {};
    },
    samePeriod() {
      return this.flowData && this.flowData.samePeriod
        ? this.flowData.samePeriod
        : {};
    },
    checkDate(){
      return this.$store.getters.checkDate;
    }
  },
  watch: {
    // checkDate: {
    //   handler(newValue, oldValue) {
    //    console.log(newValue,"newvalue-----");
    //   },
    //   deep: true,
    // },
  },
  methods: {
    overviewEvent(val, date) {
      this.overList = val;
      this.initDate(date);
    },
    initDate(date) {
      // let nowDay = this.getNowDay();
      // if (date.startTime == date.endTime && date.endTime == nowDay) {
      //   // 今日
      //   console.log("111");
      //   this.timeType = "day";
      // } else {
      //   const date1 = new Date(date.startTime);
      //   const date2 = new Date(date.endTime);
      //   const diffTime = Math.abs(date2 - date1) + 1;
      //   const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      //   console.log(diffDays,"diffDays");
      //   if (diffDays == 30) {
      //     this.timeType = "month";
      //   } else if (diffDays == 7) {
      //     this.timeType = "week";
      //   } else {
      //     this.timeType = "yesterday";
      //   }
      // }
      this.timeType = this.checkDate
    },
    getNowDay() {
      let date = new Date();
      let year = date.getFullYear(); //获取当前年份
      let month = date.getMonth() + 1; //获取当前月份，需要加 1，因为月份从 0 开始计数
      let day = date.getDate(); //获取当前天数
      return year + "-" + month + "-" + day;
    },
    handleCompare(x, y) {
      // if (y) {
      return x > y ? true : false;
      // }
      // return;
    },
    averageRulesEvent(num) {
      return averageRules(num);
    },
    formatTimeFun(val) {
      if (val) {
        return formatTime(Math.floor(val));
      }
      return "--";
    },
    percentageFun(val) {
      return percentage(val);
    },
    getFlow() {
      this.timeType = this.timeTypeFlag;
      getFlowApi(this.params).then((res) => {
        this.flowData = res.data;
      });
    },
    huanbi(c, p) {
      if (c && p) {
        return (((c - p) / p) * 100).toFixed(2);
      }
      return "--";
    },
    tongbi(c, s) {
      if (c && s) {
        return (((c - s) / s) * 100).toFixed(2);
      }
      return "--";
    },
  },
};
</script>

<style lang="scss" scoped>
.bid-list-page {
  display: flex;
  flex-direction: column;
  .bid-list-header {
    display: flex;
    margin-bottom: 21px;
    .header-name {
      width: 12.5%;
      // width: 10%;
      height: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      .icon-question {
        width: 11.44px;
        height: 11.44px;
        margin-left: 12px;
        cursor: pointer;
        position: absolute;
        transform: translate(0, -50%);
      }
    }
    .w156 {
      font-size: 13px;
      font-weight: 400;
      line-height: 14px;
      color: #4d4d4d;
    }
  }
  .bid-list-record {
    display: flex;
    margin-bottom: 11px;
    .bid-list-item1 {
      width: 26%;
      justify-content: flex-start;
      height: 30px;
      display: flex;
      align-items: center;
    }
    .bid-list-item {
      //   width: 12.5%;
      width: 26%;
      justify-content: center;
      height: 30px;
      display: flex;
      align-items: center;
    }
    .declineIcon {
      width: 9px;
      height: 11.24px;
      margin-left: 7px;
    }
    .riseImg {
      width: 9px;
      height: 11.24px;
      margin-left: 7px;
    }
    .w157 {
      font-size: 13px;
      font-weight: 400;
      line-height: 14px;
      color: #4d4d4d;
    }
    .w158 {
      font-size: 16px;
      font-weight: bold;
      color: #2c7be5;
      line-height: 17px;
    }
  }
}
</style>
