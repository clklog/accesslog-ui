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
      <div class="block-line">
        <visit-error ref="visitError"></visit-error>
        <area-error ref="areaError"></area-error>
      </div>
      <div class="div_block" style="margin-top: 20px">
        <four-error ref="fourError"></four-error>
        <five-error ref="fiveError"></five-error>
      </div>
    </div>
  </div>
</template>

<script>
import originView from "@/components/origin-view";
import { FilterBar } from "@/layout/components";
import { copyObj } from "@/utils/copy";
import { percentage } from "@/utils/percent";
import { getExceptionPvApi } from "@/api/trackingapi/abnormal";
// import { getOverviewApi } from "@/api/trackingapi/accessLog";
import {
  visitError,
  areaError,
  fourError,
  fiveError,
} from "./components/index";
export default {
  components: {
    FilterBar,
    visitError,
    areaError,
    fourError,
    fiveError,
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
    applicationCode () {
      return this.$store.getters.applicationCode ;
    },
    commonParams() {
      const { applicationCode , sortOrder } = this;
      return Object.assign({ applicationCode  }, this.filterBarParams);
    },
  },
  watch: {
    commonParams(val) {
      this.initApi();
    },
  },
  methods: {
    initApi() {
      this.$nextTick(() => {
        this.$refs.visitError.getExceptionPv(this.commonParams);
        this.$refs.areaError.getExceptionIp(this.commonParams);
        this.$refs.fourError.getExceptionStatusFour(this.commonParams);
        this.$refs.fiveError.getExceptionStatus(this.commonParams);
      });
    },
    // top10Api() {
    //   getExceptionPvApi(commonParams).then((res) => {
    //     if (res.code == 200) {
    //     //   this.tableData = res.data
    //     //   this.total = res.data.total;

    //       //   echarts
    //       this.xDataList = [];
    //       this.yDataList = [];
    //       this.ipList = res.data.rows.slice(0, 10).reverse();
    //       this.ipList.map((item, index) => {
    //         if (item.ip) {
    //           this.yDataList.push(item.ip);
    //         } else {
    //           this.yDataList.push("");
    //         }
    //         if (item.pv) {
    //           this.xDataList.push(item.pv);
    //         } else {
    //           this.yDataList.push(0);
    //         }
    //       });
    //       this.initEcharts();
    //     }
    //   });
    // },
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
