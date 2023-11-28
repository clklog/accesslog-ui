<template>
  <div>
    <div class="documentation-container">
      <FilterBar
        byCalendar
        byNumberId
        @setFilterBarParams="setFilterBarParams"
      />
    </div>
    <div class="public-block">
      <div class="public-table-block public-hoverItem logCon">
        <span class="public-firstHead">链路追踪</span>
        <div v-if="sessionList.length > 0">
          <userEchart ref="userEchart"></userEchart>
          <railTable ref="railTable"></railTable>
        </div>
        <div
          v-else
          style="
            display: flex;
            justify-content: center;
            align-items: center;
           margin-top:150px;
          "
        >
          {{ initWord }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { FilterBar } from "@/layout/components";
import { copyObj } from "@/utils/copy";
import { userEchart, railTable } from "./components/index";
import {
  getSessionListApi,
  getSessionListByWhoIdApi,
} from "@/api/trackingapi/business";

export default {
  components: {
    FilterBar,
    userEchart,
    railTable,
  },
  data() {
    return {
      filterBarParams: {},
      sortOrder: "desc",
      overList: [],
      hostLength: 0,
      sessionList: [],
      initWord: "请输入用户证件号，选择查询时间段进行数据查询",
    };
  },

  computed: {
    httpHost() {
      return this.$store.getters.httpHost;
    },
    applicationCode() {
      return this.$store.getters.applicationCode;
    },
    commonParams() {
      const { applicationCode, sortOrder } = this;
      // return Object.assign({ applicationCode }, this.filterBarParams);
      return this.filterBarParams;
    },
  },
  mounted() {
    // this.$message.error("暂未查到该用户相关业务办理信息");
  },
  watch: {
    // commonParams(val) {
    //   // 310108197406015212
    //   // 31010619611113281x
    //   // console.log(val, "传递参数");
    //   // this.initParamsEvent(val);
    // },
    // httpHost: {
    //   handler(newValue, oldValue) {
    //     this.hostLength = newValue;
    //   },
    //   deep: true,
    // },
  },
  methods: {
    initParamsEvent(val) {
      this.$nextTick(() => {
        if (!val.whoId) {
          return this.$message.error("请输入证件号");
        }
        // this.$refs.userEchart.sessionListEvent(val);
        this.sessionListEvents(val);
      });
    },
    sessionListEvents(val) {
      val.applicationCode = "cnb.mgt";
      getSessionListByWhoIdApi(val).then((res) => {
        if (res.code == 200) {
          this.sessionList = res.data.filter((item) => {
            return item.eventStatus === "成功";
          });

          if (this.sessionList.length == 0) {
            this.initWord = "暂未查到该用户相关业务办理信息";
          } else {
            this.$nextTick(() => {
              this.$refs.railTable.sessionListEvent(this.sessionList);
              this.$refs.userEchart.sessionListEvent(val);
            });
          }
        }
      });
    },
    setFilterBarParams(val) {
      this.filterBarParams = copyObj(val);
      // 310108197406015212
      // 31010619611113281x
      this.initParamsEvent(val);
    },
  },
};
</script>

<style lang="scss" scoped>
.logCon {
  // min-height: 1271px;
  min-height: 960px;
  background: rgba(255, 255, 255);
  box-sizing: border-box;
}
.div_block {
  display: flex;
  justify-content: space-between;
}
</style>
