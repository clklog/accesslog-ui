<template>
  <div class="public-table-block public-hoverItem logCon">
    <span class="public-firstHead">在用车/摩转汽</span>
    <div class="warryCon">
      <div class="commonHead">个人</div>
      <div class="apl_body">
        <div
          style="
            display: flex;
            flex-direction: column;
            align-items: center;
            margin-top: 46px;
          "
        >
          <div class="setFont">合同签订数</div>
          <div class="setFont" style="margin-top: 23px">注销完成数</div>
        </div>
        <!-- 第二季 -->
        <div class="setCenter">
          <div class="setFont">在用车额度委托拍卖</div>
          <div class="setBoldFont colItem">
            {{ userCarSign | filterBusinessCount }}
          </div>
          <div class="setFont colItem">
            {{ userCarOff | filterBusinessCount }}
          </div>
        </div>
        <div class="setCenter">
          <div class="setFont">摩转汽</div>
          <div class="setBoldFont colItem">
            {{ motorSing | filterBusinessCount }}
          </div>
          <div class="setFont colItem">0</div>
        </div>
        <div class="setCenter">
          <div class="setFont">摩托车额度委托拍卖</div>
          <div class="setBoldFont colItem">0</div>
          <div class="setFont colItem">0</div>
        </div>
      </div>
    </div>
    <div class="warryCon">
      <div class="commonHead">单位</div>
      <div class="apl_body">
        <div
          style="
            display: flex;
            flex-direction: column;
            align-items: center;
            margin-top: 46px;
          "
        >
          <div class="setFont">合同签订数</div>
          <div class="setFont colItem">注销完成数</div>
        </div>
        <!-- 第二季 -->
        <div class="setCenter">
          <div class="setFont">在用车额度委托拍卖</div>
          <div class="setBoldFont colItem">
            {{ unitUserCarSign | filterBusinessCount }}
          </div>
          <div class="setFont colItem">
            {{ unitUserCarOff | filterBusinessCount }}
          </div>
        </div>

        <div class="setCenter">
          <div class="setFont">摩托车额度委托拍卖</div>
          <div class="setBoldFont colItem">
            {{ unitMotoSing | filterBusinessCount }}
          </div>
          <div class="setFont colItem">
            {{ unitMotoOff | filterBusinessCount }}
          </div>
        </div>
        <div style="width: 39px"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      userCarSign: "",
      userCarOff: "",
      motorSing: "",
      motorOff: "",
      // 单位
      unitUserCarSign: "",
      unitUserCarOff: "",
      unitMotoSing: "",
      unitMotoOff: "",
    };
  },
  mounted() {},

  methods: {
    filterBusinessEvent(list) {
      // console.log(list, "用车东西-----");
      // 个人业务数据
      this.userCarSign = this.$options.filters.filterBusinessList(
        list[0],
        "iuv",
        "iuv.contract",
        "现场",
        "成功"
      );
      this.userCarOff = this.$options.filters.filterBusinessList(
        list[0],
        "iuv",
        "iuv.cancel",
        "现场",
        "成功"
      );
      // console.log(this.userCarSign, this.userCarOff,"this.userCarOff-----");
      this.motorSing = this.$options.filters.filterBusinessList(
        list[0],
        "moto",
        "moto.motoToCar",
        "现场",
        "成功"
      );

      // 單位
      this.unit(list);
    },
    unit(list) {
      this.unitUserCarSign = this.$options.filters.filterBusinessList(
        list[0],
        "iuv",
        "iuv.entContract",
        "现场",
        "成功"
      );
      this.unitUserCaroff = this.$options.filters.filterBusinessList(
        list[0],
        "iuv",
        "iuv.entCancel",
        "现场",
        "成功"
      );
      this.unitMotoSing = this.$options.filters.filterBusinessList(
        list[0],
        "moto",
        "moto.entContract",
        "现场",
        "成功"
      );
      this.unitMotoOff = this.$options.filters.filterBusinessList(
        list[0],
        "moto",
        "moto.entCancel",
        "现场",
        "成功"
      );
    },
  },
};
</script>

<style scoped lang="scss">
.logCon {
  width: calc(60% - 20px);
  min-height: 443px;
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
      padding: 20px 55px;
      min-height: 122px;
      box-sizing: border-box;
      .setCenter {
        display: flex;
        flex-direction: column;
        align-items: center;
      }
      .setPostion {
        margin-top: 29px;
        display: flex;
        flex-direction: column;
        align-items: center;
        // justify-content: center;
      }
      .colItem {
        margin-top: 25px;
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
        // margin: 20px 0;
        font-size: 22px;
        font-weight: 400;
        line-height: 22px;
        color: #2c7be5;
      }
    }
  }
}
</style>
