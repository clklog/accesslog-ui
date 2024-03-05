<template>
  <div class="block-main public-hoverItem logCon">
    <div class="block-head" @click="$router.push('/logAnalysis/performance/timeConsuming')">
      <div class="block-title">耗时Top10</div>
      <div class="block-head-icon" >
        <img src="@/assets/images/icon.png" alt="" width="10px" />
      </div>
    </div>
    <div style="width: 100%">
      <el-table
        :data="timeTopLIst"
        class="public-radius"
        :header-cell-style="{ textAlign: 'center', background: '#f7fafe ' }"
        :cell-style="tableHeaderColor"
        style="width: 100%"
        border
      >
        <el-table-column type="index" label="排名" min-width="20%"  :show-overflow-tooltip="true" />
        <el-table-column
          
          prop="uri"
          min-width="50%"  :show-overflow-tooltip="true"
          label="页面URL"
        />
        <el-table-column prop="maxVisitTime" label="响应时长(ms)" min-width="30%"  :show-overflow-tooltip="true" />
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
      timeTopLIst: [],
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
    getRequestTimeTop10(commonParams) {
      let params = copyObj(commonParams)
      params.pageSize = 10;
      params.pageNum = 1;
      params.sortName = 'maxVisitTime';
      params.sortOrder = 'desc';
      getPerformanceDetailApi(params).then((res) => {
        if (res.code == 200) {
          this.timeTopLIst = res.data.rows;
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.logCon {
  width: calc(30%);
  min-height: 300px;
}
</style>
