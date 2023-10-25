<template>
  <div>
    <div class="documentation-container">
      <FilterBar
        ByChnnel
        ByVisitor
        ByData
        @setFilterBarParams="setFilterBarParams"
      />
    </div>
    <div class="public-block">
      <div class="Overview public-hoverItem" style="padding: 20px;">
        <div class="trendAnalysis public-firstHead">概览</div>
        <originView ref="originView" byLogAnalysis></originView>
      </div>
      <div class="block-line">
        <logIndex ref="logIndex"></logIndex>
      </div>
      <div class="block-line">
        <data-trend></data-trend>
        <ipDistribution></ipDistribution>
      </div>
      <div class="div_block" style="margin-top: 20px;">
        <IPTop></IPTop>
        <timeTop></timeTop>
        <statu></statu>
        <apiUi></apiUi>
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
  getHostOverviewApi,
  getOverviewApi,
} from "@/api/trackingapi/accessLog";
import {
  logIndex,
  dataTrend,
  ipDistribution,
  IPTop,
  timeTop,
  statu,
  apiUi,
} from "./components/index";

export default {
  components: {
    FilterBar,
    originView,
    logIndex,
    dataTrend,
    ipDistribution,
    IPTop,
    timeTop,
    statu,
    apiUi,
  },
  data() {
    return {
      filterBarParams: {},
      sortOrder: "desc",
    };
  },
  computed: {
    projectName() {
      return this.$store.getters.projectName;
    },
    commonParams() {
      const { projectName, sortOrder } = this;
      return Object.assign({ projectName, sortOrder }, this.filterBarParams);
    },
  },
  watch: {
    commonParams(val) {
      this.getOverview();
      this.getHostOverview();
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
    getHostOverview() {
      getHostOverviewApi(this.commonParams).then((res) => {
        if (res.code == 200) {
          this.$nextTick(() => {
            this.$refs.logIndex.logEvent(res.data);
          });
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
