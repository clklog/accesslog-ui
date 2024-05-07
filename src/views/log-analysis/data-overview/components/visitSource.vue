<template>
  <div class="block-main public-hoverItem logCon" v-loading="loanding">
    <div class="block-head">
      <div class="block-title">访问来源Top10</div>
      <div class="block-head-icon">
        <!-- <img src="@/assets/images/icon.png" alt="" width="10px" /> -->
      </div>
    </div>
    <div style="width: 100%">
      <el-table
        :data="tableData"
        class="public-radius"
        :header-cell-style="{ textAlign: 'center', background: '#f7fafe ' }"
        :cell-style="tableHeaderColor"
        style="width: 100%"
        border
      >
        <el-table-column
          type="index"
          label="排名"
          min-width="15%"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          prop="httpReferrer"
          min-width="55%"
          :show-overflow-tooltip="true"
          label="来源网站"
        >
        </el-table-column>
        <el-table-column
          prop="pv"
          label="访问量(PV)"
          min-width="15%"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          prop="pvRate"
          label="占比"
          min-width="15%"
          :show-overflow-tooltip="true"
        >
          <template slot-scope="scope">
            {{ scope.row.pvRate | percentage }}
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { getReferrerTop10Api } from "@/api/trackingapi/accessLog";
export default {
  data() {
    return {
      tableData: [],
      loanding: false,
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
    async getReferrerTop10(commonParams) {
      this.loanding = true;
      await getReferrerTop10Api(commonParams).then((res) => {
        if (res.code == 200) {
          this.tableData = res.data;
          this.loanding = false;
        } else {
          this.loanding = false;
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.logCon {
  width: calc(31% - 15px);
  min-height: 300px;
}
</style>
