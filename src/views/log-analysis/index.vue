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
      <div class="Overview public-hoverItem">
        <div class="trendAnalysis public-firstHead">流量概览</div>
        <originView ref="originView" byLogAnalysis></originView>
      </div>

      <div class="block-line">
        <logIndex ref="logIndex"></logIndex>
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
import { logIndex } from "./components/index";
export default {
  components: {
    FilterBar,
    originView,
    logIndex,
  },
  data() {
    return {
      filterBarParams: {},
      sortOrder: "desc",
    };
  },
  computed: {
    project() {
      return this.$store.getters.project;
    },
    commonParams() {
      const { project, sortOrder } = this;
      return Object.assign({ project, sortOrder }, this.filterBarParams);
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
  min-height: 500px;
  display: flex;
  justify-content: space-between;
}
</style>
