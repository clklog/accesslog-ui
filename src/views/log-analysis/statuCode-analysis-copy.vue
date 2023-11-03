<template>
  <div>
    <div class="documentation-container">
      <FilterBar
        ByChnnel
        ByVisitor
        @setFilterBarParams="setFilterBarParams"
      />
    </div>

    <div class="public-block">
      <div class="search_wrappy public-table-block public-hoverItem">
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
                :label="item.status"
                :key="index"
                >{{ item.status }}</el-checkbox
              >
            </el-checkbox-group>
          </div>
        </div>

        <el-table :data="statuCodeList" border stripe style="margin: 20px 0">
          <el-table-column label="状态码" width="150" align="center">
            <el-table-column
              label="应用"
              align="center"
              type="host"
              width="150"
            >
            </el-table-column>
          </el-table-column>
          <el-table-column
            prop="status"
            label="200"
            align="center"
          ></el-table-column>
        </el-table>

        <div class="public-Table-minHeight" style="min-height: 400px">
          <el-table
            class="public-radius"
            :header-cell-style="{ background: '#f7fafe ' }"
            :cell-style="tableHeaderColor"
            :data="statuCodeList"
            border
            @sort-change="sortChange($event)"
            style="width: 100%; margin-top: 12px"
          >
            <el-table-column
              prop="uri"
              label="页面URL"
              width="350"
              :show-overflow-tooltip="true"
            >
            </el-table-column>
            <el-table-column prop="status" label="状态码"> </el-table-column>

            <el-table-column
              prop="ipCount"
              align="center"
              label="访问IP数	"
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
              label="最大耗时(秒)"
              sortable="custom"
            >
            </el-table-column>
            <el-table-column
              align="center"
              prop="ipCountRate"
              label="访问IP数占比"
              sortable="custom"
            >
              <template slot-scope="scope">
                {{ scope.row.visitCountRate }}
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              prop="avgVisitTime"
              label="平均耗时(秒)"
              sortable="custom"
            >
            </el-table-column>
            <el-table-column
              align="center"
              prop="pv"
              label="日志总数"
              sortable="custom"
            >
            </el-table-column>
            <el-table-column
              align="center"
              prop="pvRate"
              label="日志占比"
              sortable="custom"
            >
              <template slot-scope="scope">
                {{ scope.row.pvRate | percentage }}
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              prop="requestLength"
              label="流入流量"
              sortable="custom"
            >
            </el-table-column>
            <el-table-column
              align="center"
              prop="bodyBytesSent"
              label="流出流量"
              sortable="custom"
            >
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import originView from "@/components/origin-view";
import { FilterBar } from "@/layout/components";
import { copyObj } from "@/utils/copy";
import { getStatusApi, getHostApi } from "@/api/trackingapi/accessLog";
export default {
  components: {
    FilterBar,
    originView,
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
      allDataList :[]
    };
  },
  computed: {
    projectName() {
      return this.$store.getters.projectName;
    },
    commonParams() {
      const { projectName, sortOrder, pageNum, pageSize, status } = this;
      return Object.assign({ projectName, sortOrder }, this.filterBarParams);
    },
  },
  watch: {
    commonParams(val) {
    },
  },
  mounted() {
    // this.getHost();
  },
  methods: {
    // 应用链接
    getHost() {
      getHostApi().then((res) => {
        if (res.code == 200) {
          this.hostList = res.data;
          console.log(this.hostList, "hostList-----------");
          for (let i = 0; i < this.hostList.length; i++) {
            this.getStatusData(this.hostList[i])
          }
        }
      });
    },
    handleStatus() {},
    tableHeaderColor({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
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
        this.getStatusData();
      } else if (e.order && e.order == "descending") {
        // 升序
        this.commonParams.sortName = e.prop;
        this.commonParams.sortOrder = "desc";
        this.getStatusData();
      } else {
        this.commonParams.sortName = null;
        this.commonParams.sortOrder = null;
        this.getStatusData();
      }
    },
    getStatusData(val) {
      console.log(val,"val-------");
      let params = copyObj(this.commonParams)
      params.host = val;
      getStatusApi(params).then((res) => {
        if (res.code == 200) {
          this.statuCodeList = res.data;
          this.total = res.data.total;
          this.allDataList.push(res.data)
          console.log(this.allDataList,"allDataList----");
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
