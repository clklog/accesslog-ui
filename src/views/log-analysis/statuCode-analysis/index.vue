<template>
  <div>
    <div class="documentation-container">
      <FilterBar ByChnnel ByVisitor  ByHost @setFilterBarParams="setFilterBarParams" />
    </div>
    <div class="public-block">
      <statu-echarts ref="statuEcharts"></statu-echarts>
    </div>
    <statue-table ref="statueTable"></statue-table>
  </div>
</template>

<script>
import originView from "@/components/origin-view";
import { FilterBar } from "@/layout/components";
import { copyObj } from "@/utils/copy";
import { statuEcharts, statueTable } from "./components/index";
// statuEcharts
export default {
  components: {
    FilterBar,
    originView,
    statuEcharts,
    statueTable,
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
    };
  },
  computed: {
    projectName() {
      return this.$store.getters.projectName;
    },
    commonParams() {
      // const { projectName, sortOrder, pageNum, pageSize, status } = this;
      const { projectName, pageNum, pageSize, status } = this;
      return Object.assign({ projectName,  }, this.filterBarParams);
    },
  },
  watch: {
    commonParams(val) {
      this.initApi();
    },
  },
  mounted() {},
  methods: {
    initApi() {
      this.$nextTick(() => {
        this.$refs.statuEcharts.echartEvent(this.commonParams);
      });
    },
    getStatusData(val) {
      // console.log(val, "val-------");
      let params = copyObj(this.commonParams);
      params.host = val;
      getStatusApi(params).then((res) => {
        if (res.code == 200) {
          this.statuCodeList = res.data;
          this.total = res.data.total;
          this.allDataList.push(res.data);
          console.log(this.allDataList, "allDataList----");
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
}
::v-deep .el-table thead.is-group th {
  background: none;
  padding: 0px;
}

::v-deep .el-table thead.is-group tr:first-of-type th:first-of-type {
  border-bottom: none; /*中间的横线去掉*/
}

::v-deep .el-table thead.is-group tr:first-of-type th:first-of-type div.cell {
  text-align: right; /*上边文字靠右*/
}

::v-deep .el-table thead.is-group tr:last-of-type th:first-of-type div.cell {
  text-align: left; /*下边文字靠左*/
}
::v-deep .el-table thead.is-group tr:first-of-type th:first-of-type:before {
  content: "";
  position: absolute;
  width: 1px;
  height: 100px; /*斜线的长度*/
  top: 0;
  left: 0;
  background-color: grey;
  opacity: 0.2;
  display: block;
  transform: rotate(-43deg); /*调整斜线的角度*/
  transform: rotate(-70deg); /*调整斜线的角度*/
  -webkit-transform-origin: top;
  transform-origin: top;
}

::v-deep .el-table thead.is-group tr:last-of-type th:first-of-type:before {
  content: "";
  position: absolute;
  width: 1px;
  height: 100px; /*斜线的长度*/
  bottom: 0;
  right: 0;
  background-color: grey;
  opacity: 0.2;
  display: block;
  transform: rotate(-45deg); /*调整斜线的角度*/
  transform: rotate(-70deg); /*调整斜线的角度*/
  -webkit-transform-origin: bottom;
  transform-origin: bottom;
}
::v-deep .el-table thead.is-group th {
  height: 27.4px;
}
.block-line {
  box-sizing: border-box;
  margin: 20px 0 20px 0;
  min-height: 500px;
  display: flex;
  justify-content: space-between;
}
</style>
