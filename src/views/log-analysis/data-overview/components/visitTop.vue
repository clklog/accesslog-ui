<template>
  <div class="block-main public-hoverItem logCon">
    <div class="block-head">
      <div class="block-title">访问Top10</div>
      <div class="block-head-icon">
        <!-- <img src="@/assets/images/icon.png" alt="" width="10px" /> -->
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
        <el-table-column type="index" label="排名" min-width="20%"  :show-overflow-tooltip="true" />
        <el-table-column
          prop="uri"
          min-width="40%"  :show-overflow-tooltip="true"
          label="页面URL"
        />
        <el-table-column prop="uriCount" label="计数"  min-width="20%"  :show-overflow-tooltip="true"/>
        <el-table-column prop="avgVisitTime" label="平均耗时(ms)" min-width="20%"  :show-overflow-tooltip="true" />
      </el-table>
    </div>
  </div>
</template>

<script>
import { getUriTop10Api } from "@/api/trackingapi/accessLog";
export default {
  data() {
    return {
      tableData: [
        {
          date: "2016-05-02",
          name: "accessLog",
          num: " 1518 ",
          time: "5:12:01",
        },
        {
          date: "2016-05-04",
          name: "ACCESSLOG",
          num: " 1517 ",
          time: "15:12:01",
        },
        {
          date: "2016-05-01",
          name: "项目2",
          num: " 1519 ",
          time: "19:12:01",
        },
        {
          date: "2016-05-03",
          name: "项目3",
          num: " 1516 ",
          time: "17:12:01",
        },
        {
          date: "2016-05-02",
          name: "accessLog",
          num: " 1518 ",
          time: "5:12:01",
        },
        {
          date: "2016-05-04",
          name: "ACCESSLOG",
          num: " 1517 ",
          time: "15:12:01",
        },
        {
          date: "2016-05-01",
          name: "项目2",
          num: " 1519 ",
          time: "19:12:01",
        },
        {
          date: "2016-05-03",
          name: "项目3",
          num: " 1516 ",
          time: "17:12:01",
        },
        {
          date: "2016-05-01",
          name: "项目2",
          num: " 1519 ",
          time: "19:12:01",
        },
        {
          date: "2016-05-03",
          name: "项目3",
          num: " 1516 ",
          time: "17:12:01",
        },
      ],
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
    getUriTop10(commonParams) {
      getUriTop10Api(commonParams).then((res) => {
        if (res.code == 200) {
          this.tableData = res.data;
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
