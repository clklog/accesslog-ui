<template>
  <div class="block-main public-hoverItem logCon">
    <div class="block-head" @click="$router.push('/logAnalysis/statuCode')">
      <div class="block-title">500错误TOP20</div>
      <div class="block-head-icon">
        <img src="@/assets/images/icon.png" alt="" width="10px" />
      </div>
    </div>
    <div style="width: 100%; min-height: 405px">
      <el-table
        :data="tableData"
        class="public-radius"
        :header-cell-style="{ textAlign: 'center', background: '#f7fafe ' }"
        style="width: 100%"
        :cell-style="tableHeaderColor"
        border
      >
        <el-table-column
          type="index"
          label="排名"
          width="100px"
          :show-overflow-tooltip="true"
        >
          <template slot-scope="scope">
            <span v-text="getIndex(scope.$index)"> </span>
          </template>
        </el-table-column>
        <el-table-column
          prop="uri"
          min-width="40%"
          :show-overflow-tooltip="true"
          label="URL路径"
        />
        <el-table-column
          prop="pv"
          label="计数"
          min-width="20%"
          :show-overflow-tooltip="true"
        />
      </el-table>
    </div>
    <div class="block">
      <el-pagination
        next-text="下一页"
        :pager-count="5"
        :current-page.sync="currentPage"
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
import { getExceptionStatusApi } from "@/api/trackingapi/abnormal";
export default {
  data() {
    return {
      tableData: [],
      pageNum: 1,
      pageSize: 10,
      currentPage: 1,
      total: 0,
      commonParamsOld: "",
      status: "500",
    };
  },
  mounted() {},
  methods: {
    getIndex($index) {
      return (this.currentPage - 1) * this.pageSize + $index + 1;
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.getExceptionStatus(this.commonParamsOld);
    },
    handleCurrentChange(val) {
      this.pageNum = val;
      this.getExceptionStatus(this.commonParamsOld);
    },
    tableHeaderColor({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 1) {
        return "text-align:left";
      } else {
        return "text-align:center";
      }
    },
    getExceptionStatus(commonParams) {
      this.commonParamsOld = commonParams;
      const { pageNum, pageSize, status } = this;
      commonParams = Object.assign({ pageNum, pageSize, status }, commonParams);
      getExceptionStatusApi(commonParams).then((res) => {
        if (res.code == 200) {
          this.tableData = res.data.rows;
          this.total = res.data.total;
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep {
  @import "~@/styles/components/el-pagination.scss";
}
.logCon {
  width: calc(50% - 10px);
  min-height: 300px;
}
</style>
