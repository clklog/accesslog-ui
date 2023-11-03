<template>
  <div>
    <div class="documentation-container">
      <FilterBar ByChnnel ByVisitor ByHost @setFilterBarParams="setFilterBarParams" />
    </div>
    <div class="public-block">
      <head-overview ref="headOverview"></head-overview>
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
          overList.accesslogFlowDetailList.length > 1 && hostLength > 2
        "
      >
        <log-index ref="logIndex"></log-index>
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
    hostLength :0,
  },
  data() {
    return {
      filterBarParams: {},
      sortOrder: "desc",
      overList: [],
    };
  },

  computed: {
    httpHost() {
      return this.$store.getters.httpHost;
    },
    projectName() {
      return this.$store.getters.projectName;
    },
    commonParams() {
      const { projectName, sortOrder } = this;
      // return Object.assign({ projectName, sortOrder }, this.filterBarParams);
      return Object.assign({ projectName }, this.filterBarParams);
    },
  },
  watch: {
    commonParams(val) {
      // this.getOverview();
      this.getServerOverview();
    },
    httpHost: {
      handler(newValue, oldValue) {
        this.hostLength = newValue;
      },
      deep: true,
    },
  },
  methods: {
    logEvent() {},
    getOverview() {
      getOverviewApi(this.commonParams).then((res) => {
        if (res.code == 200) {
          this.$nextTick(() => {
            this.$refs.originView.originEvent(res.data);
          });
        }
      });
    },
    getServerOverview() {
      this.hostLength = this.httpHost;
      getServerOverviewApi(this.commonParams).then((res) => {
        if (res.code == 200) {
          this.overList = res.data;
          this.$nextTick(() => {
            if (this.$refs.logIndex) {
              this.$refs.logIndex.logEvent(
                res.data.accesslogFlowDetailList || []
              );
            }
            this.$refs.headOverview.overviewEvent(
              res.data.totalAccesslogFlowDetail,
              this.commonParams
            );
            // this.$refs.dataTrend.getFlowTrendEvent(this.commonParams)
          });
        }
      });
      this.$nextTick(() => {
        this.$refs.dataTrend.getFlowTrendEvent(this.commonParams);
        this.$refs.timeTop.getRequestTimeTop10(this.commonParams);
        this.$refs.visitTop.getUriTop10(this.commonParams);
        this.$refs.visitSource.getReferrerTop10(this.commonParams);
        this.$refs.Status.getStatus(this.commonParams);
        this.$refs.ipTop.getIpTop10(this.commonParams);
        this.$refs.apiUi.getUa(this.commonParams);
        this.$refs.funApi.getRequestMethod(this.commonParams);
        this.$refs.ipDistribution.getIpByProvince(this.commonParams);
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
