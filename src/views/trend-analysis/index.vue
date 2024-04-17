<template>
  <div>
    <div class="documentation-container">
      <FilterBar
        byTimeType
        byCalendar
        ByHost
        ByData
        ByContrast
        @setFilterBarParams="setFilterBarParams"
      />
    </div>
    <div class="public-block">
      <!-- <div class="block-main public-hoverItem logCon">
        <div class="block-head">
          <div class="block-title">概览</div>
        </div>
        <div class="bid-list-page">
          <originView ref="originView" byFlowView></originView>
          <div class="bid-list-record">
            <div class="bid-list-item w158">
              <p>{{ overList.pv || "--" }}</p>
            </div>

            <div class="bid-list-item w158">
              <p>{{ overList.uv || "--" }}</p>
            </div>

            <div class="bid-list-item w158">
              <p>{{ overList.ipCount || "--" }}</p>
            </div>

            <div class="bid-list-item w158">
              <p>
                {{
                  overList.avgVisitTime ? overList.avgVisitTime + "ms" : "--"
                }}
              </p>
            </div>

            <div class="bid-list-item w158">
              <p>{{ overList.bodySentBytes | conver }}</p>
            </div>
          </div>
        </div>
      </div> -->
      <trend-echart ref="trendEchart"></trend-echart>
    </div>
  </div>
</template>

<script>
import originView from "@/components/origin-view";
import { trendEchart } from "./components/index";
import { FilterBar } from "@/layout/components";
import { copyObj } from "@/utils/copy";
export default {
  components: {
    FilterBar,
    originView,
    trendEchart,
  },
  data() {
    return {
      filterBarParams: {},
      sortOrder: "desc",
      pageNum: 1,
      pageSize: 10,
      status: "200",
      statuCodeList: [],
      total: 0,
      currentPage: 1,
      current: {
        sortName: null,
        sortOrder: null,
      },
      statusFilter: [],
      statusShowList: [],
      hostList: [],
      allDataList: [],
      overList: {},
    };
  },
  computed: {
    applicationCode() {
      return this.$store.getters.applicationCode;
    },
    commonParams() {
      const { applicationCode, pageNum, pageSize, status } = this;
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
    handleCheckPointer() {},
    initApi(params) {
      this.$nextTick(() => {
        this.$refs.trendEchart.trendApiEvent(params);
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
