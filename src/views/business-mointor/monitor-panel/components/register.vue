<template>
  <div class="public-table-block public-hoverItem logCon">
    <span class="public-firstHead">单位登记办理</span>
    <div class="warryCon">
      <div class="commonHead">办理数</div>
      <div class="apl_body">
        <div style="display: flex; flex-direction: column; align-items: center">
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
        <!-- 第二季 -->

        <div>
          <div class="setFont" style="margin-top: 60px">现场</div>
          <div class="setFont" style="margin-top: 15px">退卡</div>
        </div>
        <!-- 第三层 -->

        <div class="setPostion">
          <div class="setFont">{{ toDate[0] }}</div>
          <div class="setFont" style="margin-top: 15px">
            {{ currentPeriod | filterBusinessCount }}
          </div>
          <div class="setFont" style="margin-top: 15px">
            {{ currentCard | filterBusinessCount }}
          </div>
        </div>

        <div class="setPostion">
          <div class="setFont">{{ toDate[1] }}</div>
          <div class="setFont" style="margin-top: 15px">
            {{ lastPeriod | filterBusinessCount }}
          </div>
          <div class="setFont" style="margin-top: 15px">
            {{ lastCard | filterBusinessCount }}
          </div>
        </div>
      </div>
    </div>

    <div class="warryCon">
      <div class="commonHead">成交结算</div>
      <div class="apl_body">
        <div style="display: flex; flex-direction: column; align-items: center">
          <div class="setFont">{{ toDate[0] }}</div>
          <div class="setBoldFont">{{ currentSuccess | filterBusinessCount }}</div>
          <div class="setFont">
            {{ toDate[1] }}
            <div class="setSecondFont">{{ lastSuccess | filterBusinessCount }}</div>
          </div>
        </div>
        <!-- 第二季 -->

        <div
          style="
            margin: 38px;
            display: flex;
            flex-direction: column;
            align-items: center;
          "
        >
          <div class="setFont">电子缴款书下载</div>
          <div class="setFont" style="margin-top: 15px">额度单领取</div>
        </div>
        <!-- 第三层 -->

        <div class="setPostion" style="margin-top: 23px">
          <div class="setFont" style="margin-top: 15px">{{ emilList.count ? emilList.count : 0 }}</div>
          <div class="setFont" style="margin-top: 15px">{{ limtList.count ? limtList.count : 0 }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      toDay: "",
      lastDay: "",
      registrationList: [],

      currentPeriod: "",
      lastPeriod: "",
      cardReturnList: [], 
      currentCard: "",
      lastCard: "",
      successSellList:[],
      currentSuccess:'',
      lastSuccess:'',
      emilList: {},
      limtList: {},
      toDate:["今日","昨日"],
    };
  },
  mounted() {
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
    filterBusinessEvent(list,date) {
      if (date) {
        this.toDate = date;
      }
     
      this.registrationList = [];
      // 现场
      this.registrationList.push(
        this.$options.filters.filterBusinessList(
          list[0],
          "entBidCard",
          "entBidCard.send",
          "现场",
          "成功"
        )
      );
      this.registrationList.push(
        this.$options.filters.filterBusinessList(
          list[1],
          "entBidCard",
          "entBidCard.send",
          "现场",
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
      // console.log( this.registrationList," this.registrationList");
      // 退卡业务数据
      this.cardReturnList = [];
      this.cardReturnList.push(
        this.$options.filters.filterBusinessList(
          list[0],
          "entBidCard",
          "entBidCard.back",
          "现场",
          "成功"
        )
      );
      this.cardReturnList.push(
        this.$options.filters.filterBusinessList(
          list[1],
          "entBidCard",
          "entBidCard.back",
          "现场",
          "成功"
        )
      );
      this.cardReturnList.map((item, index) => {
        if (index == 0) {
          this.currentCard = item;
          if (!item.items) {
            item.items = [];
          }
        } else {
          this.lastCard = item;
          if (!item.items) {
            item.items = [];
          }
        }
      });
      // 成交结算

      // 额度 电子
      this.successSellList = []
      this.successSellList.push(
        this.$options.filters.filterBusinessList(
          list[0],
          "entBidCard",
          "entBidCard.deal",
          "现场",
          "成功"
        )
      );
      this.successSellList.push(
        this.$options.filters.filterBusinessList(
          list[1],
          "entBidCard",
          "entBidCard.deal",
          "现场",
          "成功"
        )
      );
      this.successSellList.map((item, index) => {
        if (index == 0) {
          this.currentSuccess = item;
          if (!item.items) {
            item.items = [];
          }
        } else {
          this.lastSuccess = item;
          if (!item.items) {
            item.items = [];
          }
        }
      });
      this.emilList = {};
      this.limtList = {};
      this.emilList = this.$options.filters.filterBusinessList(
        list[0],
        "entBidCard",
        "entBidCard.issueEbill",
        "现场",
        "成功"
      );
      this.limtList = this.$options.filters.filterBusinessList(
        list[0],
        "entBidCard",
        "entBidCard.deal",
        "现场",
        "成功"
      );
      // this.emilList.push(
      //   this.$options.filters.filterBusinessList(
      //     list[0],
      //     "entBidCard",
      //     "entBidCard.issueEbill",
      //     "现场",
      //     "成功"
      //   )
      // );
      // this.limtList.push(
      //   this.$options.filters.filterBusinessList(
      //     list[0],
      //     "entBidCard",
      //     "entBidCard.deal",
      //     "现场",
      //     "成功"
      //   )
      // );
      // console.log(this.emilList,this.limtList,"额度");
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
  },
};
</script>

<style scoped lang="scss">
.logCon {
  width: 40%;
  min-height: 443px;
  box-sizing: border-box;
  .warryCon {
    box-sizing: border-box;
    margin-top: 25px;
    min-height: 164px;
    border: 1px solid #dee0ec;
    border-radius: 6px;

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

    .apl_body {
      display: flex;
      justify-content: space-between;
      padding: 20px 31px;
      min-height: 122px;
      box-sizing: border-box;
      .setPostion {
        margin-top: 29px;
        display: flex;
        flex-direction: column;
        align-items: center;
        // justify-content: center;
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
        margin: 30px 0;
        font-size: 22px;
        font-weight: 400;
        line-height: 22px;
        color: #2c7be5;
      }
    }
  }
}
</style>
