<template>
  <div>
    <!--外部系统  -->
    <div class="systemTh">
      <div class="public-firstHead outSide">外部系统</div>
      <div
        style="
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-top: 40px;
          margin-bottom: 31px;
        "
      >
        <div class="traffic">交通委</div>
        <div class="application" style="position: relative">
          参拍申请审核/额度库
          <div style="position: absolute; left: 68px">
            <img
              src="@/assets/globalTopo/big.png"
              style="width: 18px; height: 378px; object-fit: cover"
            />
          </div>
          <div style="position: absolute; left: 83px">
            <img
              src="@/assets/globalTopo/bigTop.png"
              style="width: 18px; height: 378px; object-fit: cover"
            />
          </div>
        </div>
      </div>
    </div>
    <!-- 虚线 -->
    <div
      style="width: 100%; height: 1px; border-bottom: 1px dashed #707070"
    ></div>
    <!-- 交通委 - 内部管理 -->
    <div class="apl_body">
      <div
        style="
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          margin-right: 14px;
        "
      >
        <div class="setFont">审核数</div>
        <div class="setFont">黑名单数</div>
        <div class="setFont">白名单数</div>
        <div class="setFont">复议及结果</div>
      </div>
      <div
        style="
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-right: 50px;
        "
      >
        <div class="setFont">{{ auditResult.count || 0 }}</div>
        <div class="setFont">{{ blacklist.count || 0 }}</div>
        <div class="setFont">{{ whiteList.count || 0 }}</div>
        <div class="setFont">{{ reviewResult.count || 0 }}</div>
      </div>
      <div class="setFont" style="display: flex">
        申请数
        <div style="margin-left: 14px">{{ traficSign.count || 0 }}</div>
      </div>
    </div>

    <!-- 外网 -->
    <div class="network">
      <div
        class="public-firstHead"
        style="margin-top: 80px; margin-right: 19px"
      >
        外网
      </div>
      <div style="width: 44%; margin-right: 16px">
        <div class="webLeft">网站</div>
        <div style="position: relative">
          <div class="table" style="overflow-y: auto; width: 100%">
            <table
              border="1"
              width="100%"
              height="30px"
              cellpadding="0"
              cellspacing="0"
              align="center"
            >
              <tr>
                <th>参拍申请</th>
                <th>在线支付</th>
                <th>金融服务</th>
              </tr>
              <tr>
                <!-- style="display: flex;" -->
                <td>
                  <div class="tdStyle">
                    申请数
                    <div class="setPadding">
                      {{ auctionSignList.count ? auctionSignList.count : 0 }}
                    </div>
                  </div>
                </td>
                <td>
                  <div class="tdStyle">
                    支付数
                    <div class="setPadding">
                      {{ onLinePayList.count ? onLinePayList.count : 0 }}
                    </div>
                  </div>
                  <!-- 支付数 {{ onLinePayList.count ? onLinePayList.count : 0 }} -->
                </td>
                <td>
                  <div class="tdStyle">
                    申请数
                    <div class="setPadding">0</div>
                  </div>
                </td>
              </tr>
              <tr>
                <td>
                  <div class="tdStyle">
                    撤销数
                    <div class="setPadding">
                      {{ auctionOffList.count ? auctionOffList.count : 0 }}
                    </div>
                  </div>
                </td>
                <td></td>
                <td></td>
              </tr>
            </table>
          </div>

          <div
            style="
              position: absolute;
              margin-top: 20px;
              display: flex;
              left: 10%;
            "
          >
            <!-- 外网-内部管理系统 -->
            <div style="margin-right: 16px">
              <div class="setFont setSpace">
                申请数 
                <div style="width: 60px; text-align: center;">
                  {{ outSign.count || 0 }}
                </div>
              </div>
              <div class="setFont setSpace">撤销数 
                
                <div style="width: 60px; text-align: center;">
                  {{ outOff.count || 0 }}
                </div>
              </div>
            </div>
            <img src="@/assets/globalTopo/medium.png" class="setImg" />
          </div>
          <!-- <div
            style="
              position: absolute;
              margin-top: 20px;
              display: flex;
              left: 47%;
            "
          >
            <div style="margin-right: 16px">
              <div class="setFont setSpace">
                支付数 {{ outPay.count || 0 }}
              </div>
            </div>
            <img src="@/assets/globalTopo/medium.png" class="setImg" />
          </div> -->
          <!-- <div
            style="
              position: absolute;
              margin-top: 20px;
              display: flex;
              left: 77%;
            "
          >
            <div style="margin-right: 16px">
              <div class="setFont setSpace">申请数&nbsp; {{ outWebSing.count || 0 }}</div>
            </div>
            <img src="@/assets/globalTopo/medium.png" class="setImg" />
          </div> -->
        </div>
      </div>
      <div style="width: 38%">
        <div class="webLeft">APP</div>
        <div style="position: relative">
          <div class="table" style="overflow-y: auto; width: 100%">
            <table
              border="1"
              width="100%"
              cellpadding="0"
              cellspacing="0"
              align="center"
            >
              <tr>
                <th>参拍申请</th>
                <th>登记办理</th>
                <th>金融服务</th>
              </tr>
              <tr>
                <td>
                  <!-- 申请数
                  {{ appSignList.count ? appSignList.count : 0 }} -->
                  <div class="tdStyle">
                    申请数
                    <div class="setPadding">
                      {{ appSignList.count ? appSignList.count : 0 }}
                    </div>
                  </div>
                </td>
                <td>
                  <!-- app发卡数 {{ appSendList.count ? appSendList.count : 0 }} -->
                  <div class="tdStyle">
                    app发卡数
                    <div class="setPadding">
                      {{ appSendList.count ? appSendList.count : 0 }}
                    </div>
                  </div>
                </td>
                <td>
                  <div class="tdStyle">
                    申请数
                    <div class="setPadding">0</div>
                  </div>
                </td>
              </tr>

              <tr>
                <td>
                  <div class="tdStyle">
                    撤销数
                    <div class="setPadding">
                      {{ appOffList.count ? appOffList.count : 0 }}
                    </div>
                  </div>
                </td>
                <td></td>
                <td>
                  <div class="tdStyle">
                    申请结果
                    <div class="setPadding">0</div>
                  </div>
                </td>
              </tr>
            </table>
          </div>
          <div
            style="
              position: absolute;
              margin-top: 20px;
              display: flex;
              left: 10%;
            "
          >
            <div style="margin-right: 16px">
              <div class="setFont setSpace">
                <!-- 申请数&nbsp;{{ outAucSing.count || 0 }} -->
                申请数
                <div style="width: 60px; text-align: center;">
                  {{ outAucSing.count || 0 }}
                </div>
              </div>
              <div class="setFont setSpace">
                撤销数
                <div style="width: 60px; text-align: center;">
                  {{ outAucOff.count || 0 }}
                </div>
              </div>
            </div>
            <img src="@/assets/globalTopo/medium.png" class="setImg" />
          </div>
          <!-- <div
            style="
              position: absolute;
              margin-top: 20px;
              display: flex;
              left: 74%;
            "
          >
            <div style="margin-right: 16px">
              <div class="setFont setSpace">申请数&nbsp;0</div>
            </div>
            <img src="@/assets/globalTopo/medium.png" class="setImg" />
          </div> -->
        </div>
      </div>
    </div>
    <div
      style="
        width: 100%;
        height: 1px;
        border-bottom: 1px dashed #707070;
        margin-top: 73px;
      "
    ></div>

    <!--内部管理系统 -->
    <div class="network">
      <div
        class="public-firstHead"
        style="margin-top: 211px; margin-right: 67px"
      >
        内部管理系统
      </div>
      <div
        style="
          position: relative;
          width: 85%;
          padding-top: 141px;
          box-sizing: border-box;
        "
      >
        <div
          style="
            position: absolute;
            display: flex;
            align-items: center;
            left: 10%;
            top: 0;
          "
        >
          <img src="@/assets/globalTopo/mediumTop.png" class="setImgTop" />
          <div style="margin-left: 18px">
            <div class="setFont" style="margin-bottom: 1px">参拍申请</div>
            <div class="setFont">
              状态同步
              <div style="width: 60px; text-align: center; margin-top: -10px">
                {{ outSyncInner.count || 0 }}
              </div>
            </div>
            <div class="setFont">
              白名单
              <div style="margin-left: 13px; width: 60px; text-align: center">
                {{ whiteListInner.count || 0 }}
              </div>
            </div>
            <div class="setFont" style="margin-bottom: 0px">
              黑名单
              <div style="margin-left: 13px; width: 60px; text-align: center">
                {{ blackListInner.count || 0 }}
              </div>
            </div>
          </div>
        </div>
        <div
          style="
            position: absolute;
            display: flex;
            align-items: center;
            left: 47%;
            top: 0;
          "
        >
          <img src="@/assets/globalTopo/mediumTop.png" class="setImgTop" />
          <div style="margin-left: 18px">
            <div class="setFont setSpace">
              激活数
              <div style="margin-left: 0px; width: 60px; text-align: center">
                {{ activeInner.count || 0 }}
              </div>
            </div>
          </div>
        </div>
        <div
          style="
            position: absolute;
            display: flex;
            align-items: center;
            left: 77%;
            top: 0;
          "
        >
          <img src="@/assets/globalTopo/mediumTop.png" class="setImgTop" />
          <div style="margin-left: 18px">
            <!-- <div class="setFont setSpace">金融服务 &nbsp;45</div>
            <div class="setFont setSpace">申请结果&nbsp;58</div> -->
            <div class="setFont setSpace">
              现场支付
              <div style="margin-left: 0px; width: 60px; text-align: center">
                {{ payInner.count || 0 }}
              </div>
            </div>
          </div>
        </div>
        <div style="">
          <div class="table" style="overflow-y: auto; width: 100%">
            <table
              border="1"
              width="100%"
              cellpadding="0"
              cellspacing="0"
              align="center"
            >
              <tr>
                <th>参拍申请</th>
                <th>登记办理</th>
                <th>支付/金融服务</th>
              </tr>

              <tr>
                <td>
                  <div class="tdStyle">
                    现场申请数
                    <div class="setPadding">
                      {{ senceSignList.count ? senceSignList.count : 0 }}
                    </div>
                  </div>
                </td>
                <td>
                  <div class="tdStyle">
                    现场登记数
                    <div class="setPadding">
                      {{ senceSendList.count ? senceSendList.count : 0 }}
                    </div>
                  </div>
                </td>
                <td>
                  <div class="tdStyle">
                    金融服务现场申请
                    <div class="setPadding">0</div>
                  </div>
                </td>
              </tr>

              <tr>
                <td>
                  <div class="tdStyle">
                    现场撤销数
                    <div class="setPadding">
                      {{ senceOffList.count ? senceOffList.count : 0 }}
                    </div>
                  </div>
                </td>
                <td></td>
                <td>
                  <div class="tdStyle">
                    现场支付
                    <div class="setPadding">
                      {{ sencePayList.count ? sencePayList.count : 0 }}
                    </div>
                  </div>
                </td>
              </tr>

              <tr>
                <td>
                  <div class="tdStyle">
                    审核结果
                    <div class="setPadding">
                      {{ senceResultList.count ? senceResultList.count : 0 }}
                    </div>
                  </div>
                </td>
                <td></td>
                <td></td>
              </tr>
            </table>
          </div>
          <div
            class="public-firstHead"
            style="text-align: center; margin-top: 16px; margin-bottom: 80px"
          >
            管理系统
          </div>
        </div>
      </div>
    </div>
    <!-- 报错日志 -->
    <div class="errorWarry">
      <div class="logError">同步传输报错日志</div>
      <el-input
        type="textarea"
        :autosize="{ minRows: 6, maxRows: 6 }"
        placeholder=""
        style="max-height: 200px"
        v-model="textarea2"
      >
      </el-input>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableData2: [
        {
          date: "线下",
          name: "123",
          address: "32",
        },
        {
          date: "线上",
          name: "23",
          address: "243",
        },
        {
          date: "金融服务",
          name: "223",
          address: "23",
        },
      ],
      textarea2: "",
      auctionSignList: {},
      auctionOffList: {},
      onLinePayList: {},
      // 金融服务申请数暂为0
      appSignList: {},
      appOffList: {},
      appSendList: {},
      // 金融服务申请数暂为0
      // 内部
      senceSignList: {},
      senceOffList: {},
      senceResultList: {},
      senceSendList: {},
      sencePayList: {},
      // 交通委数据-参拍申请审核/额度库
      blacklist: "",
      whiteList: "",
      auditResult: "",
      reviewResult: "",
      traficSign: "",
      // 内部管理系统 - 外网
      outSyncInner: "",
      whiteListInner: "",
      blackListInner: "",
      activeInner: "",
      payInner: "",
      // 外网-内部管理系统
      outSign: "",
      outOff: "",
      outPay: "",
      outWebSing: "",
      outAucSing: "",
      outAucOff: "",
      offFinance: "",
    };
  },
  methods: {
    filterBusinessEvent(list) {
      // 外网 - 网站
      this.auctionSignList = this.$options.filters.filterBusinessListV2(
        list,
        "preCheckin",
        "preCheckin.applyRegister",
        "网上登记",
        "成功"
      );
      this.auctionOffList = this.$options.filters.filterBusinessListV2(
        list,
        "preCheckin",
        "preCheckin.applyCancel",
        "网上登记",
        "成功"
      );
      this.onLinePayList = this.$options.filters.filterBusinessListV2(
        list,
        "bidCard",
        "bidCard.deal",
        "网上支付",
        "成功"
      );
      //  外网 - App
      this.appSignList = this.$options.filters.filterBusinessListV2(
        list,
        "preCheckin",
        "preCheckin.applyRegister",
        "App",
        "成功"
      );
      this.appOffList = this.$options.filters.filterBusinessListV2(
        list,
        "preCheckin",
        "preCheckin.applyCancel",
        "App",
        "成功"
      );
      this.appSendList = this.$options.filters.filterBusinessListV2(
        list,
        "bidCard",
        "bidCard.send",
        "服务",
        "成功"
      );
      // 内部管理系统
      this.management(list);
      // 交通委业务数据-内部管理系统 - 空值
      this.transportation(list);
      //  内部管理系统 - 外网  - 空值
      this.innerList(list);
      // 外网 - 内部管理系统
      this.outInnerList(list);
    },

    management(list) {
      this.senceSignList = this.$options.filters.filterBusinessListV2(
        list,
        "preCheckin",
        "preCheckin.register",
        "网点",
        "成功"
      );
      this.senceOffList = this.$options.filters.filterBusinessListV2(
        list,
        "preCheckin",
        "preCheckin.cancel",
        "网点",
        "成功"
      );

      this.senceResultList = this.$options.filters.filterBusinessListV2(
        list,
        "preCheckin",
        "preCheckin.auditResult",
        "",
        "成功"
      );
      this.senceSendList = this.$options.filters.filterBusinessListV2(
        list,
        "bidCard",
        "bidCard.send",
        "网点",
        "成功"
      );
      this.sencePayList = this.$options.filters.filterBusinessListV2(
        list,
        "bidCard",
        "bidCard.deal",
        "网点",
        "成功"
      );
    },
    transportation(list) {
      // blacklist:'',
      // whiteList:'',
      // auditResult:'',
      // reviewResult:'',
      // traficSign:'',
      this.blacklist = this.$options.filters.filterBusinessListV2(
        list,
        "preCheckin",
        "preCheckin.blacklist",
        "", //''
        "成功"
      );
      this.whiteList = this.$options.filters.filterBusinessListV2(
        list,
        "preCheckin",
        "preCheckin.whitelist",
        "",
        "成功"
      );
      this.auditResult = this.$options.filters.filterBusinessListV2(
        list,
        "preCheckin",
        "preCheckin.auditResult",
        "",
        "成功"
      );
      this.reviewResult = this.$options.filters.filterBusinessListV2(
        list,
        "preCheckin",
        "preCheckin.reviewResult",
        "",
        "成功"
      );
      this.traficSign = this.$options.filters.filterBusinessListV2(
        list,
        "preCheckin",
        "preCheckin.submit",
        "",
        "成功"
      );
      // console.log(this.blacklist,this.whiteList,"交通委");
    },
    innerList(list) {
      // outSyncInner:'',
      // whiteListInner:'',
      // blackListInner:'',
      // activeInner:'',
      // payInner:'',
      this.outSyncInner = this.$options.filters.filterBusinessListV2(
        list,
        "preCheckin",
        "preCheckin.outSync",
        "", //''
        "成功"
      );
      this.blackListInner = this.$options.filters.filterBusinessListV2(
        list,
        "preCheckin",
        "preCheckin.blacklistSync",
        "", //''
        "成功"
      );
      this.whiteListInner = this.$options.filters.filterBusinessListV2(
        list,
        "preCheckin",
        "preCheckin.whitelistSync",
        "", //''
        "成功"
      );
      this.activeInner = this.$options.filters.filterBusinessListV2(
        list,
        "bidCard",
        "bidCard.active",
        "", //''
        "成功"
      );
      this.payInner = this.$options.filters.filterBusinessListV2(
        list,
        "loan",
        "loan.applyPostPay",
        "", //''
        "成功"
      );
    },
    outInnerList(list) {
      // outSign:'',
      // outOff:'',
      // outPay:'',
      // outWebSing:'',
      // outAucSing:'',
      // outAucOff:'',
      // offFinance:'',
      this.outSign = this.$options.filters.filterBusinessListV2(
        list,
        "preCheckin",
        "preCheckin.register",
        "网上登记",
        "成功"
      );
      // console.log(this.outSign,"outSign");
      this.outOff = this.$options.filters.filterBusinessListV2(
        list,
        "preCheckin",
        "preCheckin.cancel",
        "网上登记", //''
        "成功"
      );
      this.outPay = this.$options.filters.filterBusinessListV2(
        list,
        "bidCard",
        "bidCard.deal",
        "网上支付", //''
        "成功"
      );
      this.outWebSing = this.$options.filters.filterBusinessListV2(
        list,
        "",
        "",
        "", //''
        "成功"
      );
      this.outAucSing = this.$options.filters.filterBusinessListV2(
        list,
        "preCheckin",
        "preCheckin.register",
        "App", //''
        "成功"
      );
      this.outAucOff = this.$options.filters.filterBusinessListV2(
        list,
        "preCheckin",
        "preCheckin.cancel",
        "App", //''
        "成功"
      );
    },
  },
};
</script>

<style scoped lang="scss">
.tdStyle {
  display: flex;
  text-align: center;
  justify-content: center;
  .setPadding {
    margin-left: 14px;
  }
}

// tr:nth-child(2n+3){
// 		background-color: rgb(22, 73, 150);
// 	} //不同行换色

table {
  border-radius: 6px;
  // border-color: #dfe6ec;
  border-color: rgba(247, 247, 247, 0.39);
  // opacity: 0.;
}
// td,th{
//   border-color: #f7fafe;
// }
table th {
  font-weight: 500;
  color: #4d4d4d;
  // border-radius: 6px;
}

tr:nth-child(1) {
  background-color: #f7fafe;
  font-size: 13px;
  font-weight: 500;
  line-height: 25px;
  color: #4d4d4d;
}
table tr {
  text-align: center;
  font-size: 13px;
  font-weight: 500;
  line-height: 25px;
  color: #4d4d4d;
} //文本居中
table th {
  height: 40px;
  text-align: center;
}
table td {
  color: #4d4d4d;
  height: 40px;
  text-align: center;
  // display: f;
}

// table tr th {
// background: #eaeaea;
// }
table tr:first-child th:first-child {
  border-top-left-radius: 6px;
  // border-radius: 6px;
}
table tr:first-child th:last-child {
  border-top-right-radius: 6px;
}
table tr:last-child td:first-child {
  border-bottom-left-radius: 6px;
}
table tr:last-child td:last-child {
  border-bottom-right-radius: 6px;
}
::v-deep {
  .el-textarea__inner {
    border-radius: 0px;
    border-top: 0px;
  }
  .el-textarea__inner:focus {
    border: 1px solid #dee0ec;
    border-top: 0px;
  }
}
.systemTh {
  display: flex;
  justify-content: space-between;
  .outSide {
    margin-top: 88px;
  }
  .traffic {
    font-size: 13px;
    font-weight: 500;
    line-height: 16px;
    color: #4d4d4d;
  }
  .application {
    margin-top: 16px;
    width: 160px;
    height: 38px;
    background: rgba(251, 252, 254, 0.39);
    border: 1px solid #dee0ec;
    border-radius: 6px;
    line-height: 38px;
    text-align: center;
    font-size: 13px;
    font-weight: 500;
    color: #4d4d4d;
    cursor: pointer;
  }
}
.setFont {
  display: flex;
  white-space: nowrap;
  font-size: 13px;
  font-weight: 400;
  line-height: 16px;
  color: #4d4d4d;
  margin-bottom: 8px;
  .setSecondFont {
    font-size: 13px;
    font-weight: 500;
    line-height: 14px;
    color: #4d4d4d;
    margin-left: 5px;
  }
}
.setSpace {
  margin-left: 10%;
  margin-bottom: 5px;
}
.setImg {
  width: 18px;
  object-fit: cover;
  margin-top: -20px;
}
.setImgTop {
  width: 18px;
  object-fit: cover;
  // margin-bottom: -20px;
}
.apl_body {
  display: flex;
  margin-top: 22px;
  justify-content: flex-end;
  box-sizing: border-box;

  .setBoldFont {
    margin: 20px 0;
    font-size: 22px;
    font-weight: 400;
    line-height: 22px;
    color: #2c7be5;
  }
}
.network {
  display: flex;
  .webLeft {
    margin-bottom: 19px;
    text-align: center;
    font-size: 13px;
    font-weight: 500;
    line-height: 16px;
    color: #4d4d4d;
  }
}
// .errorWarry .logError{
//   border: 1px solid #f7fafe;
//   background:#f7fafe ;
// }
.errorWarry {
  .logError {
    width: 100%;
    height: 38px;
    text-align: center;
    background: #f7fafe;
    border: 1px solid #dee0ec;
    border-radius: 6px 6px 0px 0px;
    line-height: 38px;
  }
  .errorBody {
    width: 100%;
    height: 175px;
    border: 1px solid #dee0ec;
    border-radius: 0px 0px 6px 6px;
  }
}

// 外网
</style>
