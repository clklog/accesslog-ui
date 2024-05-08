<template>
  <div>
    <div class="public-block">
      <div
        class="search_wrappy public-table-block public-hoverItem"
        v-loading="loading"
      >
        <span class="public-firstHead">状态码分析</span>
        <div class="flow-indicator public_indicator" style="margin-top: 10px">
          <div class="flow-item" style="margin: 12px 10px">
            <div class="flow-title">状态码筛选</div>
            <el-checkbox-group
              v-model="statusFilter"
              class="checkBoxStyle"
              @change="handleStatus"
            >
              <el-checkbox
                v-for="(item, index) in statuCodeList"
                :label="item.statu"
                :value="item.statu"
                :key="index"
              ></el-checkbox>
            </el-checkbox-group>
          </div>
        </div>
        <div class="myTableStyle">
          <el-table
            :header-cell-style="{ background: '#f7fafe ', textAlign: 'center' }"
            class="public-radius"
            :cell-style="tableHeaderColor"
            :data="tableList"
            border
            style="margin: 20px 0"
            @row-click="conSelected"
          >
            <!-- host 头部事件 -->
            <el-table-column label="状态码" width="300">
              <el-table-column
                prop="httpHost"
                label="host"
                width="300"
                :show-overflow-tooltip="true"
              >
              </el-table-column>
            </el-table-column>

            <el-table-column
              v-for="(item, index) in tableLabel"
              :key="index"
              :label="item.label"
              :prop="item.prop"
              style="cursor: pointer"
              @click="conSelected(scope, item.prop)"
            ></el-table-column>
          </el-table>
        </div>

        <div
          class="public-Table-minHeight"
          style="min-height: 400px"
          v-if="statuDetailList.length > 0"
        >
          <el-table
            :header-cell-style="{ background: '#f7fafe ', textAlign: 'center' }"
            :cell-style="tableHeaderColor1"
            :data="statuDetailList"
            :cell-class-name="cellClassName"
            @sort-change="sortChange($event)"
            style="width: 100%; margin-top: 12px"
          >
            <!-- <el-table-column label="状态码200	"> -->
            <el-table-column
              :label="propStatu.httpHost + '状态码' + propStatu.property"
            >
              <el-table-column type="index" label="序号">
                <template slot-scope="scope">
                  <span v-text="getIndex(scope.$index)"> </span>
                </template>
              </el-table-column>
              <el-table-column
                prop="uri"
                label="Url"
                width="650"
                :show-overflow-tooltip="true"
              >
              </el-table-column>
              <el-table-column
                prop="pv"
                align="center"
                label="访问次数	"
                sortable="custom"
              >
              </el-table-column>
              <el-table-column
                align="center"
                label="耗时较长次数(>=1秒)"
                sortable="custom"
                prop="slowPv"
              >
                <template slot-scope="scope"> {{ scope.row.slowPv }}</template>
              </el-table-column>
              <el-table-column
                align="center"
                prop="maxVisitTime"
                label="最大耗时(毫秒)"
                sortable="custom"
              >
              </el-table-column>
              <el-table-column
                align="center"
                prop="pvRate"
                label="耗时较长次数(>=1秒)占比"
                sortable="custom"
              >
                <template slot-scope="scope">
                  {{ scope.row.pvRate | percenTable }}
                </template>
              </el-table-column>
              <el-table-column
                align="center"
                prop="avgVisitTime"
                label="平均耗时(毫秒)"
                sortable="custom"
              >
              </el-table-column>
            </el-table-column>
          </el-table>
        </div>
        <div class="block" v-if="statuDetailList.length > 0">
          <el-pagination
            :pager-count="5"
            prev-text
            next-text="下一页"
            :current-page="currentPage"
            :page-sizes="[10, 20, 30, 40]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { copyObj } from "@/utils/copy";

import {
  getStatusListApi,
  getStatusFlowTrendApi,
  // getStatusDetailApi,
} from "@/api/trackingapi/status";
import { getPerformanceDetailApi } from "@/api/trackingapi/performance";
export default {
  data() {
    return {
      filterBarParams: {},
      sortOrder: "desc",
      pageNum: 1,
      pageSize: 10,
      status: "200",

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
      tableLabel: [
        {
          label: "host",
          prop: "name",
        },
        {
          label: "200",
          prop: "200",
        },
        {
          label: "300",
          prop: "300",
        },
        {
          label: "400",
          prop: "400",
        },
      ],
      tableList: [],
      storeTableLabel: [],
      statuCodeList: [],
      commonParams: {
        sortName: "",
        sortOrder: "asc",
        pageNum: 1,
        pageSize: 10,
        status: "",
      },
      statuDetailList: [],
      total: 0,
      currentPage: 1,
      propStatu: {
        property: "",
        httpHost: "",
      },
      newArray: {},
      newApplication: this.$store.getters.applicationCode,
      loading: false,
    };
  },
  computed: {
    applicationCode() {
      return this.$store.getters.applicationCode;
    },
  },
  watch: {
    applicationCode(val, old) {
      //console.log(val, "新值");
      this.newApplication = val;
    },
  },
  mounted() {},
  methods: {
    cellClassName({ row, column, rowIndex, columnIndex }) {
      return "cellName";
    },

    getIndex($index) {
      return (this.currentPage - 1) * this.commonParams.pageSize + $index + 1;
    },
    handleSizeChange(val) {
      this.commonParams.pageSize = val;
      this.conSelected(this.propStatu, this.propStatu);
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.commonParams.pageNum = val;
      this.conSelected(this.propStatu, this.propStatu);
    },
    // 状态码详细数据table
    conSelected(row, prop) {
      if (prop) {
        this.propStatu.property = prop.property;
      }
      if (row) {
        this.propStatu.httpHost = row.httpHost;
      }
      this.loading = true;
      this.commonParams.status = this.propStatu.property;
      this.commonParams.httpHost = this.propStatu.httpHost;
      this.commonParams.applicationCode = this.newApplication;
      getPerformanceDetailApi(this.commonParams).then((res) => {
        if (res.code == 200) {
          this.statuDetailList = res.data.rows;
          this.total = res.data.total;
          this.loading = false;
        } else {
          this.loading = false;
        }
      });
    },
    getStatusFlowTrend(commonParams) {
      this.loading = true;
      getStatusFlowTrendApi(commonParams).then((res) => {
        if (res.code == 200) {
          let statuList = res.data;
          let newList1 = [];
          for (let i = 0; i < statuList.length; i++) {
            for (let j = 0; j < statuList[i].rows.length; j++) {
              let params = {
                httpHost: statuList[i].httpHost,
                [statuList[i].rows[j].status]: statuList[i].rows[j].pv,
              };
              newList1.push(params);
            }
          }
          const mergedArr = newList1.reduce((acc, curr) => {
            const index = acc.findIndex((el) => el.httpHost === curr.httpHost);
            if (index > -1) {
              const key = Object.keys(curr)[0];
              acc[index][key] = curr[key];
            } else {
              acc.push(curr);
            }
            return acc;
          }, []);
          this.tableList = mergedArr;
          this.loading = false;
        } else {
          this.loading = false;
        }
      });
    },
    getStatusData(commonParams) {
      this.statuDetailList = [];
      this.newArray = JSON.parse(JSON.stringify(commonParams));
      this.commonParams = Object.assign(this.commonParams, this.newArray);
      getStatusListApi(commonParams).then((res) => {
        if (res.code == 200) {
          this.statuCodeList = res.data;
          let filteredArray = [];
          filteredArray = this.statuCodeList.filter((number) => {
            const firstDigit = number.toString()[0];
            return firstDigit === "4" || firstDigit === "5";
          });
          if (filteredArray.length > 1) {
            this.statusFilter = filteredArray;
          } else {
            this.statusFilter = res.data;
          }
          if (res.data.length < 6) {
            this.statusFilter = res.data;
          }

          this.statuCodeList = this.statuCodeList.map((item) => {
            return { ["statu"]: item };
          });
          // tabel header
          let newArry = [];
          newArry = this.statuCodeList.map((item) => {
            return {
              ["label"]: item.statu,
              ["prop"]: item.statu,
            };
          });
          let statuStore = JSON.parse(JSON.stringify(newArry));
          this.tableLabel = statuStore;
          this.tableLabel = statuStore.filter((item) =>
            this.statusFilter.includes(item.label)
          );
          this.storeTableLabel = statuStore;
        }
      });
      this.getStatusFlowTrend(commonParams);
    },
    handleStatus(current) {
      const filteredArr = this.storeTableLabel.filter((item) =>
        current.includes(item.label)
      );
      this.tableLabel = filteredArr;
    },
    tableHeaderColor({ row, column, rowIndex, columnIndex }) {
      if (columnIndex == 0) {
        return "text-align:left";
      } else {
        return "text-align:center";
      }
    },
    tableHeaderColor1({ row, column, rowIndex, columnIndex }) {
      if (columnIndex == 1) {
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
        this.conSelected(this.propStatu, this.propStatu);
      } else if (e.order && e.order == "descending") {
        // 升序
        this.commonParams.sortName = e.prop;
        this.commonParams.sortOrder = "desc";
        this.conSelected(this.propStatu, this.propStatu);
      } else {
        this.commonParams.sortName = null;
        this.commonParams.sortOrder = null;
        this.conSelected(this.propStatu, this.propStatu);
      }
    },
  },
};
</script>
<style lang="scss" scoped>
::v-deep {
  @import "~@/styles/components/el-checkbox.scss";
  @import "~@/styles/components/el-pagination.scss";
}
::v-deep .myTableStyle .el-table thead.is-group th {
  background: none;
  padding: 0px;
}
::v-deep .myTableStyle.cellName {
  background: blueviolet !important;
  color: aqua;
}
::v-deep
  .myTableStyle
  .el-table
  thead.is-group
  tr:first-of-type
  th:first-of-type {
  border-bottom: none; /*中间的横线去掉*/
}

::v-deep
  .myTableStyle
  .el-table
  thead.is-group
  tr:first-of-type
  th:first-of-type
  div.cell {
  text-align: right; /*上边文字靠右*/
}

::v-deep
  .myTableStyle
  .el-table
  thead.is-group
  tr:last-of-type
  th:first-of-type
  div.cell {
  text-align: left; /*下边文字靠左*/
}
::v-deep
  .myTableStyle
  .el-table
  thead.is-group
  tr:first-of-type
  th:first-of-type:before {
  content: "";
  position: absolute;
  width: 1px;
  height: 300px; /*斜线的长度*/
  top: 0;
  left: 0;
  background-color: grey;
  opacity: 0.2;
  display: block;
  // transform: rotate(-43deg); /*调整斜线的角度*/
  // transform: rotate(-70deg); /*调整斜线的角度*/
  transform: rotate(-90deg); /*调整斜线的角度*/
  transform: rotate(-70deg); /*调整斜线的角度*/
  -webkit-transform-origin: top;
  transform-origin: top;
}

::v-deep
  .myTableStyle
  .el-table
  thead.is-group
  tr:last-of-type
  th:first-of-type:before {
  content: "";
  position: absolute;
  width: 1px;
  height: 300px; /*斜线的长度*/
  bottom: 0;
  right: 0;
  background-color: grey;
  opacity: 0.2;
  display: block;
  // transform: rotate(-45deg); /*调整斜线的角度*/
  // transform: rotate(-70deg); /*调整斜线的角度*/
  transform: rotate(-45deg); /*调整斜线的角度*/
  transform: rotate(-70deg); /*调整斜线的角度*/
  -webkit-transform-origin: bottom;
  transform-origin: bottom;
}
::v-deep .myTableStyle .el-table--enable-row-transition .el-table__body td {
  cursor: pointer;
}
::v-deep
  .myTableStyle
  .el-table--enable-row-transition
  .el-table__body
  td:hover {
  background-color: rgb(157, 208, 240) !important;
}
::v-deep
  .myTableStyle
  .el-table--enable-row-transition
  .el-table__body
  td:active {
  background-color: rgb(157, 208, 240) !important;
}
::v-deep .myTableStyle .el-table thead.is-group th {
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
