<template>
  <div class="block-main public-hoverItem logCon" v-loading="loading">
    <div
      class="block-head"
      @click="$router.push('/logAnalysis/performance/timeConsuming')"
    >
      <div class="block-title">访问Top10</div>
      <div class="block-head-icon">
        <img src="@/assets/images/icon.png" alt="" width="10px" />
      </div>
    </div>
    <div style="width: 100%">
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
          min-width="20%"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          prop="uri"
          min-width="40%"
          :show-overflow-tooltip="true"
          label="页面URL"
        />
        <el-table-column
          prop="pv"
          label="计数"
          min-width="20%"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          prop="avgVisitTime"
          label="平均耗时(ms)"
          min-width="20%"
          :show-overflow-tooltip="true"
        />
      </el-table>
    </div>
  </div>
</template>

<script>
import { getPerformanceDetailApi } from "@/api/trackingapi/performance";
import { copyObj } from "@/utils/copy";
export default {
  data() {
    return {
      tableData: [],
      loading: false,
    };
  },
  mounted() {},
  methods: {
    tableHeaderColor({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 1) {
        return "text-align:left";
      } else {
        return "text-align:center";
      }
    },
    async getUriTop10(commonParams) {
      this.loading = true;
      let params = copyObj(commonParams);
      params.sortName = "pv";
      params.sortOrder = "desc";
      params.pageSize = 10;
      params.pageNum = 1;
      await getPerformanceDetailApi(params).then((res) => {
        if (res.code == 200) {
          this.loading = false;
          this.tableData = res.data.rows;
        } else {
          this.loading = false;
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.logCon {
  width: calc(40% - 40px);
  min-height: 300px;
}
</style>
