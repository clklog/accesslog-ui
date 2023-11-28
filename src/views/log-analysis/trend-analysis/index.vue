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
      <head-overview ref="headOverview"></head-overview>
      <!-- host饼状图 -->

      <div class="block-line">
        <!-- <data-trend ref="dataTrend"></data-trend>
        <ip-distribution ref="ipDistribution"></ip-distribution> -->
      </div>
    </div>
  </div>
</template>

<script>
import { FilterBar } from "@/layout/components";
import { copyObj } from "@/utils/copy";
// import { headOverview } from "./components/index";
import { headOverview } from "@/views/log-analysis/data-overview/components/index";

export default {
  components: {
    FilterBar,
    headOverview,
  },
  data() {
    return {
      filterBarParams: {},
      sortOrder: "desc",
      overList: [],
      hostLength: 0,
    };
  },

  computed: {
    httpHost() {
      return this.$store.getters.httpHost;
    },
    applicationCode () {
      return this.$store.getters.applicationCode ;
    },
    commonParams() {
      const { applicationCode , sortOrder } = this;
      return Object.assign({ applicationCode  }, this.filterBarParams);
    },
  },
  watch: {
    commonParams(val) {},
    httpHost: {
      handler(newValue, oldValue) {
        this.hostLength = newValue;
      },
      deep: true,
    },
  },
  methods: {
    logEvent() {},

    getServerOverview() {
      this.hostLength = this.httpHost;
      getServerOverviewApi(this.commonParams).then((res) => {
        if (res.code == 200) {
          this.overList = res.data;
          this.$nextTick(() => {
            this.$refs.headOverview.overviewEvent(
              res.data.totalAccesslogFlowDetail,
              this.commonParams
            );
          });
        }
      });
      this.$nextTick(() => {
        //   this.$refs.dataTrend.getFlowTrendEvent(this.commonParams);
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
