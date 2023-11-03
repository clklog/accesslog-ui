<template>
  <div
    class="search_wrappy public-table-block public-hoverItem"
    style="position: relative"
  >
    <span class="public-firstHead">性能分析</span>

    <div class="flow-indicator public_indicator" style="margin-top: 10px">
      <div class="flow-item" style="font-size: 13px; color: #4d4d4d">
        请选择要排除的文件类型：
      </div>

      <div class="flow-item">
        <el-checkbox-group
          v-model="performFilter"
          class="checkBoxStyle"
          @change="performEvent"
        >
          <el-checkbox label=".js">js文件</el-checkbox>
          <el-checkbox label=".css">css文件</el-checkbox>
          <el-checkbox label=".jgp;.png;.gif;.jpeg;.tiff;.tif"
            >图片文件(jgp;png;gif;jpeg;tiff;tif)</el-checkbox
          >
        </el-checkbox-group>
      </div>
      <div class="flow-item setSpace">
        <el-checkbox-group
          v-model="otherFilter"
          class="checkBoxStyle"
          @change="otherFilterEvent"
        >
          <el-checkbox
            :disabled="otherFlag"
            label="其他"
            style="margin-right: 0"
            >其他类型文件</el-checkbox
          >
        </el-checkbox-group>
        <el-input
          class="other_select"
          v-model="inputOther"
          placeholder="请输入文件后缀,多个文件以;分隔"
          style="width: 205px"
          @input="inputFilterEvent()"
          @confirm="confirmEvent()"
          @keyup.enter.native="toSearch()"
          @change="toSearch()"
        ></el-input>
      </div>
    </div>

    <div
      class="public-Table-minHeight"
      style="min-height: 400px"
      v-if="performanceList.length > 0"
    >
      <el-table
        class="public-radius"
        :header-cell-style="{ background: '#f7fafe ', textAlign: 'center' }"
        :cell-style="tableHeaderColor"
        :data="performanceList"
        border
        @sort-change="sortChange($event)"
        style="width: 100%; margin-top: 12px"
      >
        <el-table-column label="序号" type="index" width="80" align="center">
          <template slot-scope="scope">
            <span v-text="getIndex(scope.$index)"> </span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="httpHost"
          width="300"
          :show-overflow-tooltip="true"
          label="httpHost"
        />
        <el-table-column
          prop="uri"
          label="页面URL"
          width="350"
          :show-overflow-tooltip="true"
        >
        </el-table-column>
        <el-table-column
          align="center"
          prop="pv"
          label="访问次数"
          sortable="custom"
        />

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
          prop="pvRate"
          label="占比"
          sortable="custom"
        >
          <template slot-scope="scope">
            {{ scope.row.pvRate | percentage }}
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="avgVisitTime"
          label="平均耗时(秒)"
          sortable="custom"
        >
        </el-table-column>
      </el-table>
    </div>
    <div class="block" v-if="performanceList.length > 0">
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
</template>

<script>
import { copyObj } from "@/utils/copy";
import { getPerformanceDetailApi } from "@/api/trackingapi/performance";
export default {
  data() {
    return {
      filterBarParams: {},

      pageNum: 1,
      pageSize: 10,
      sortName: null,
      sortOrder: "desc",

      status: "200",
      performanceList: [],
      total: 0,
      currentPage: 1,

      performFilter: [],
      otherFilter: [],
      otherFlag: true,
      inputOther: "",
      imgFormatList: [],
      otherList: [],
      limit: [],
      paramsCommon: [],
      applicationData: "",
      hostList: [],
      hostChange: "",
    };
  },
  mounted() {},
  methods: {
    initApi() {
      this.$nextTick(() => {
        this.$refs.numEcharts.getRequestimeGt100ms(this.commonParams);
      });
    },
    hostChangeEvent(val) {
      this.hostChange = val;
      this.getPerformanceDetail(this.commonParams);
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
      this.getPerformanceDetail(this.commonParams);
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
      this.getPerformanceDetail(this.commonParams);
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
      this.getPerformanceDetail(this.commonParams);
    },
    confirmEvent() {
    },
    tableHeaderColor({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 2) {
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

        this.getPerformanceDetail(this.commonParams);
      } else if (e.order && e.order == "descending") {
        this.commonParams.sortName = e.prop;
        this.commonParams.sortOrder = "desc";
        this.getPerformanceDetail(this.commonParams);
      } else {
        this.commonParams.sortName = null;
        this.commonParams.sortOrder = null;

        this.getPerformanceDetail(this.commonParams);
      }
    },
    searchTable(val) {},

    handleSizeChange(val) {
      this.commonParams.pageSize = val;
      this.getPerformanceDetail(this.commonParams);
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.commonParams.pageNum = val;
      this.getPerformanceDetail(this.commonParams);
    },
    // 性能分析文件
    getPerformanceDetail(commonParams) {
      this.commonParams = copyObj(commonParams);

      this.commonParams.limit = [...this.imgFormatList, ...this.otherList];
      const { sortOrder, pageNum, pageSize } = this;
      this.commonParams = Object.assign(
        { pageNum, pageSize, sortOrder },
        this.commonParams
      );
      //   if (!this.commonParams.sortName) {
      //     this.commonParams.sortName = null
      //   }

      getPerformanceDetailApi(this.commonParams).then((res) => {
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
        }
      });
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
