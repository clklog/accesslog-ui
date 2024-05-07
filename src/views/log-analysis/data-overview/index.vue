<template>
  <div>
    <div class="documentation-container">
      <FilterBar
        byTimeType
        byCalendar
        ByHost
        @setFilterBarParams="setFilterBarParams"
      />
    </div>
    <div class="public-block">
      <head-overview ref="headOverview" v-loading="loading"></head-overview>
      <!-- host饼状图 -->
      <div class="block-line">
        <data-trend ref="dataTrend"></data-trend>
        <ip-distribution ref="ipDistribution"></ip-distribution>
      </div>
      <div class="div_block" style="margin-top: 20px">
        <time-top ref="timeTop"></time-top>
        <visit-top ref="visitTop"></visit-top>
        <IPVisitTop ref="ipTop"></IPVisitTop>
      </div>

      <div class="div_block" style="margin-top: 20px">
        <api-ui ref="apiUi"></api-ui>
        <statu ref="Status"></statu>
        <visit-source ref="visitSource"></visit-source>
        <fun-api ref="funApi"></fun-api>
      </div>
      <div
        class="block-line"
        v-if="
          overList.accesslogFlowDetailList &&
          overList.accesslogFlowDetailList.length > 1 &&
          hostLength > 2
        "
      >
        <log-index ref="logIndex" @visitDataEvent="visitDataEvent"></log-index>
      </div>
    </div>
  </div>
</template>

<script>
import originView from "@/components/origin-view";
import { FilterBar } from "@/layout/components";
import { copyObj } from "@/utils/copy";
import { percentage } from "@/utils/percent";
import {
  // getHostOverviewApi,
  getServerOverviewApi,
  getOverviewApi,
} from "@/api/trackingapi/accessLog";
import {
  headOverview,
  logIndex,
  dataTrend,
  ipDistribution,
  IPVisitTop,
  timeTop,
  statu,
  apiUi,
  funApi,
  visitTop,
  visitSource,
} from "./components/index";
export default {
  components: {
    FilterBar,
    headOverview,
    originView,
    logIndex,
    dataTrend,
    ipDistribution,
    IPVisitTop,
    timeTop,
    statu,
    apiUi,
    funApi,
    visitTop,
    visitSource,
  },
  data() {
    return {
      filterBarParams: {},
      sortOrder: "desc",
      overList: [],
      hostLength: 0,
      loading: false,
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
      return Object.assign({ applicationCode }, this.filterBarParams);
    },
  },
  watch: {
    commonParams(val) {
      this.getServerOverview();
    },
    httpHost: {
      handler(newValue, oldValue) {
        this.hostLength = newValue;
        this.logEchartsEvent();
      },
      deep: true,
    },
  },
  methods: {
    visitDataEvent() {
      this.getServerOverViewEvent();
    },
    getOverview() {
      getOverviewApi(this.commonParams).then((res) => {
        if (res.code == 200) {
          this.$nextTick(() => {
            this.$refs.originView.originEvent(res.data);
          });
        }
      });
    },
    async getServerOverview() {
      //this.$store.getters.indexCanClick = false;
      console.log("this.$store.getters.indexCanClick", this.$store.getters.indexCanClick);
      this.$store.dispatch("app/setIndexCanClick", false);
      console.log("this.$store.getters.indexCanClick", this.$store.getters.indexCanClick);
      this.loading = true;
      this.hostLength = this.httpHost;
      console.log("================");
      await this.getServerOverViewEvent();
      // this.$nextTick(() => {
      //   this.$refs.dataTrend.getFlowTrendEvent(this.commonParams);
      //   this.$refs.timeTop.getRequestTimeTop10(this.commonParams);
      //   this.$refs.visitTop.getUriTop10(this.commonParams);
      //   this.$refs.visitSource.getReferrerTop10(this.commonParams);
      //   this.$refs.Status.getStatus(this.commonParams);
      //   this.$refs.ipTop.getIpTop10(this.commonParams);
      //   this.$refs.apiUi.getUa(this.commonParams);
      //   this.$refs.funApi.getRequestMethod(this.commonParams);
      //   this.$refs.ipDistribution.getIpByProvince(this.commonParams);
      // });
      console.log("1");
      await this.$refs.dataTrend.getFlowTrendEvent(this.commonParams);
      console.log("2");
      await this.$refs.ipDistribution.getIpByProvince(this.commonParams);
      console.log("3");
      await this.$refs.timeTop.getRequestTimeTop10(this.commonParams);
      console.log("4");
      await this.$refs.visitTop.getUriTop10(this.commonParams);
      console.log("5");
      await this.$refs.ipTop.getIpTop10(this.commonParams);
      console.log("6");
      await this.$refs.apiUi.getUa(this.commonParams);
      console.log("7");
      await this.$refs.Status.getStatus(this.commonParams);
      console.log("8");
      await this.$refs.visitSource.getReferrerTop10(this.commonParams);
      console.log("9");
      await this.$refs.funApi.getRequestMethod(this.commonParams);
      this.$store.dispatch("app/setIndexCanClick", true);
      console.log("this.$store.getters.indexCanClick", this.$store.getters.indexCanClick);
    },
    async getServerOverViewEvent() {
      await getServerOverviewApi(this.commonParams).then((res) => {
        if (res.code == 200) {
          this.overList = res.data;
          this.logEchartsEvent();
          this.$nextTick(() => {
            this.$refs.headOverview.overviewEvent(
              res.data.totalAccesslogFlowDetail,
              this.commonParams
            );
          });
          this.loading = false;
        } else {
          this.loading = false;
        }
      });
    },
    logEchartsEvent() {
      this.$nextTick(() => {
        if (this.$refs.logIndex) {
          this.$refs.logIndex.logEvent(this.overList.accesslogFlowDetailList);
        }
      });
    },
    setFilterBarParams(val) {
      this.filterBarParams = copyObj(val);
    },
  },
};
</script>

<style lang="scss" scoped>
.block-line {
  box-sizing: border-box;
  margin: 20px 0 20px 0;
  min-height: 300px;
  display: flex;
  justify-content: space-between;
}
.div_block {
  display: flex;
  justify-content: space-between;
}
</style>
