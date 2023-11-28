<template>
  <div class="tableRail">
    <el-table
      :data="sessionList"
      style="width: 100%; margin-bottom: 20px"
      border
      :header-cell-style="{ textAlign: 'center', background: '#f7fafe ' }"
    >
      <el-table-column prop="logTime" label="时间" min-width="30%">
      </el-table-column>
      <el-table-column prop="address" label="来源" min-width="70%">
        <template slot-scope="scope">
          {{ scope.row }}
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { getSessionListByWhoIdApi } from "@/api/trackingapi/business";
export default {
  data() {
    return {
      sessionList: [],
    };
  },
  methods: {
    sessionListEvent(val) {
      this.sessionList = val;
    },
    // sessionListEvent(val) {
    //   val.applicationCode = "cnb.mgt";
    //   getSessionListByWhoIdApi(val).then((res) => {
    //     if (res.code == 200) {
    //       this.sessionList = res.data.filter((item) => {
    //         return item.eventStatus === "成功";
    //       });
    //     }
    //   });
    // },
  },
};
</script>

<style scoped lang="scss">
.tableRail {
  margin-top: 71px;
}
</style>
