<template>
  <div class="tableRail">
    <el-table
      ref="myTable"
      :data="sessionList"
      style="width: 100%; margin-bottom: 20px"
      :row-key="getRowKey"
      border
      :header-cell-style="{ textAlign: 'center', background: '#f7fafe ' }"
    >
      <el-table-column prop="logTime" label="时间" min-width="30%">
        <template slot-scope="scope">
          <div style="display: flex">
            <div
              @click="expendRow(scope.$index, scope.row)"
              style="
                cursor: pointer;
                width: 20px;
                height: 20px;
                text-align: center;
                font-size: 16px;
                line-height: 18px;
                margin-right: 5px;
              "
              v-if="!scope.row.expend"
            >
              >
            </div>
            <div
              @click="expendRow(scope.$index, scope.row)"
              style="
                cursor: pointer;
                transform: rotate(90deg);
                width: 20px;
                height: 20px;
                text-align: center;
                line-height: 16px;
                font-size: 16px;
                margin-right: 7px;
              "
              class="down"
              v-if="scope.row.expend"
            >
              >
            </div>
            <div></div>
            {{ scope.row.logTime }}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="address" label="来源" min-width="70%">
        <template slot-scope="scope">
          <div v-if="!scope.row.expend">
            <div style="display: flex;flex-wrap: wrap;">
              <div v-for="(val, key) in scope.row" :key="key">
                <div
                  style="display: flex;white-space: nowrap; margin-right: 18px;"
                  v-if="key != 'id' && key != 'expend'"
                >
                  {{ key }} : {{ val ? val : '" "' }}
                </div>
              </div>
            </div>
          </div>

          <div v-if="scope.row.expend">
            <div v-for="(val, key) in scope.row" :key="key">
              <div style="display: flex" v-if="key != 'id' && key != 'expend'">
                {{ key }} : {{ val ? val : '" "' }}
              </div>
            </div>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      iconFlag: true,
      sessionList: [],
    };
  },
  methods: {
    getRowKey(row) {
      return row.id;
    },
    // 31010619611113281x
    expendRow(idx, row) {
      row.expend = !row.expend;
      this.$refs.myTable.toggleRowExpansion(row, row.expend);
    },
    sessionListEvent(val) {
      val.map((item, index) => {
        item.id = index + 1;
        item.expend = false;
      });
      this.sessionList = JSON.parse(JSON.stringify(val));
    },
  },
};
</script>

<style scoped lang="scss">
.tableRail {
  margin-top: 71px;
}
</style>
