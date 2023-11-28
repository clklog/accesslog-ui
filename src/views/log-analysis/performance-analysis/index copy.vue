<template>
  <div>
    <div class="documentation-container">
      <FilterBar  byTimeType
        byCalendar
        ByHost @setFilterBarParams="setFilterBarParams" />
    </div>

    <div class="public-block">
      <num-echarts ref="numEcharts"></num-echarts>
      <performance ref="performance"></performance>
      
    </div>
    <router-view />
  </div>
</template>

<script>
import originView from "@/components/origin-view";
import { FilterBar } from "@/layout/components";
import { numEcharts,performance } from "./components/index";
import { copyObj } from "@/utils/copy";

export default {
  components: {
    FilterBar,
    originView,
    numEcharts,
    performance,
  },
  data() {
    return {
      filterBarParams: {},
      sortOrder: "desc",
      pageNum: 1,
      pageSize: 10,
      status: "200",
      performanceList: [],
      total: 0,
      currentPage: 1,
      current: {
        sortName: null,
        sortOrder: null,
      },
      performFilter: [],
      otherFilter: [],
      otherFlag: true,
      inputOther: "",
      imgFormatList: [],
      otherList: [],
      limits: [],
      paramsCommon: [],
      applicationData: "",
      hostList: [],
      hostChange: "",
    };
  },
  computed: {
    applicationCode () {
      return this.$store.getters.applicationCode ;
    },
    commonParams() {
      const { applicationCode , sortOrder, pageNum, pageSize, status, limits } = this;
      return Object.assign(
        { applicationCode ,  },
        this.filterBarParams
      );
    },
  },
  watch: {
    commonParams(val) {
      // this.getPerformanceDetail();
      this.initApi(val);
    },
  },
  mounted() {
    // this.getHost()
  },
  methods: {
    initApi() {
      this.$nextTick(() => {
        this.$refs.numEcharts.getRequestimeGt100ms(this.commonParams);
        this.$refs.performance.getPerformanceDetail(this.commonParams);
      });
    },
    hostChangeEvent(val) {
      this.hostChange = val;
      this.getPerformanceDetail();
    },
    getIndex($index) {
      return (this.currentPage - 1) * this.pageSize + $index + 1;
    },
    // 其它格式
    inputFilterEvent(val) {
      if (this.inputOther) {
        this.otherFlag = false;
      } else {
        this.otherFlag = true;
      }
    },
    // 主要格式
    performEvent(e) {
      this.imgFormatList = [];
      this.performFilter.map((item) => {
        if (item.indexOf(";") != -1) {
          this.imgFormatList.push(item.split(";"));
        } else {
          this.imgFormatList.push(item);
        }
      });
      this.imgFormatList = this.imgFormatList.flat(Infinity);
      this.getPerformanceDetail();
    },
    // 其他事件多选框
    otherFilterEvent(val) {
      if (val.length > 0) {
        this.otherList = this.$options.filters.emptyString(
          ";",
          this.inputOther
        );
      } else {
        this.otherList = [];
      }
      this.getPerformanceDetail();
    },
    toSearch() {
      this.otherFilter = ["其他"];
      if (this.inputOther) {
        this.otherList = this.$options.filters.emptyString(
          ";",
          this.inputOther
        );
      } else {
        this.otherList = [];
      }
      this.getPerformanceDetail();
    },
    confirmEvent() {
      console.log("确定事件");
    },
    tableHeaderColor({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 1 || columnIndex === 2) {
        return "text-align:left";
      } else {
        return "text-align:center";
      }
    },
    sortChange(e) {
      if (e.order && e.order == "ascending") {
        // 降序
        this.commonParams.sortName = e.prop;
        this.commonParams.sortOrder = "asc";
        this.getPerformanceDetail();
      } else if (e.order && e.order == "descending") {
        // 升序
        this.commonParams.sortName = e.prop;
        this.commonParams.sortOrder = "desc";
        this.getPerformanceDetail();
      } else {
        this.commonParams.sortName = null;
        this.commonParams.sortOrder = null;
        this.getPerformanceDetail();
      }
    },
    searchTable(val) {},

    handleSizeChange(val) {
      this.commonParams.pageSize = val;
      this.getPerformanceDetail();
    },
    handleCurrentChange(val) {
      this.commonParams.pageNum = val;
      this.getPerformanceDetail();
    },
    getPerformanceDetail() {
      this.paramsCommon = copyObj(this.commonParams);
      this.paramsCommon.limits = [...this.imgFormatList, ...this.otherList];
      this.paramsCommon.host = this.hostChange;
      getPerformanceDetailApi(this.paramsCommon).then((res) => {
        if (res.code == 200) {
          this.performanceList = res.data.rows;
          this.total = res.data.total;
        }
      });
    },
    getHost() {
      getHostApi().then((res) => {
        if (res.code == 200) {
          this.hostList = res.data;
          console.log(this.hostList, "hostList-----------");
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
::v-deep {
  @import "~@/styles/components/el-checkbox.scss";
  @import "~@/styles/components/el-pagination.scss";
  .appli_select .el-input__inner {
    border-radius: 0px;
    border-top-width: 0px;
    border-left-width: 0px;
    border-right-width: 0px;
    border-bottom-width: 1px;
    border-bottom: 1px solid #acb2ba;
    background-color: transparent;
    font-size: 12px;
    transform: scale(0.9);
    height: 30px;
    line-height: 30px;
    border-bottom-width: 0;
  }
  .other_select .el-input__inner {
    border-radius: 0px;
    border-top-width: 0px;
    border-left-width: 0px;
    border-right-width: 0px;
    border-bottom-width: 1px;
    border-bottom: 1px solid #acb2ba;
    background-color: transparent;
    font-size: 12px;
    transform: scale(0.9);
    height: 30px;
    line-height: 30px;
  }
  .el-checkbox__input.is-disabled + span.el-checkbox__label {
    color: #194580;
  }
}
.block-line {
  box-sizing: border-box;
  margin: 20px 0 20px 0;
  min-height: 500px;
  display: flex;
  justify-content: space-between;
}
</style>
