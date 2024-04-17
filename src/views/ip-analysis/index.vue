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
      <ip-echart ref="ipEchart"></ip-echart>
      <ip-table ref="ipTable"></ip-table>
    </div>
  </div>
</template>

<script>
import originView from "@/components/origin-view";
import { FilterBar } from "@/layout/components";
import { copyObj } from "@/utils/copy";
import { ipEchart, ipTable } from "./components/index";
export default {
  components: {
    FilterBar,
    originView,
    ipEchart,
    ipTable,
  },
  data() {
    return {
      filterBarParams: {},
      overList: {},
    };
  },
  computed: {
    applicationCode() {
      return this.$store.getters.applicationCode;
    },
    commonParams() {
      const { applicationCode, } = this;
      return Object.assign({ applicationCode }, this.filterBarParams);
    },
  },
  watch: {
    commonParams(val) {
      this.initApi(val);
    },
  },
  mounted() {},
  methods: {
    initApi(params) {
      this.$nextTick(() => {
        this.$refs.ipEchart.ipApiEvent(params);
        this.$refs.ipTable.ipApiEvent(params);
      });
    },
    setFilterBarParams(val) {
      this.filterBarParams = copyObj(val);
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep {
  @import "~@/styles/components/el-checkbox.scss";
  @import "~@/styles/components/el-pagination.scss";
}
.block-line {
  box-sizing: border-box;
  margin: 20px 0 20px 0;
  min-height: 500px;
  display: flex;
  justify-content: space-between;
}
.bid-list-record {
  display: flex;
  margin-bottom: 11px;
  .bid-list-item1 {
    width: 26%;
    justify-content: flex-start;
    height: 30px;
    display: flex;
    align-items: center;
  }
  .bid-list-item {
    //   width: 12.5%;
    width: 26%;
    justify-content: center;
    height: 30px;
    display: flex;
    align-items: center;
  }
  .declineIcon {
    width: 9px;
    height: 11.24px;
    margin-left: 7px;
  }
  .riseImg {
    width: 9px;
    height: 11.24px;
    margin-left: 7px;
  }
  .w157 {
    font-size: 13px;
    font-weight: 400;
    line-height: 14px;
    color: #4d4d4d;
  }
  .w158 {
    font-size: 16px;
    font-weight: bold;
    color: #2c7be5;
    line-height: 17px;
  }
}
</style>
