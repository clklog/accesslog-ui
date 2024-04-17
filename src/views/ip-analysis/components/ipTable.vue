<template>
  <div>
    <div
      class="block-main public-hoverItem logCon"
      style="min-height: 500px; margin-top: 20px"
    >
      <div class="block-head">
        <div class="block-title">IP分析</div>
      </div>
      <el-table
        class="public-radius"
        :header-cell-style="{ textAlign: 'center', background: '#f7fafe ' }"
        :cell-style="{ textAlign: 'center' }"
        :data="ipTableList"
        border
        @sort-change="sortChange($event)"
        style="width: 100%"
      >
        <el-table-column label="序号" type="index" width="80" align="center">
          <template slot-scope="scope">
            <span v-text="getIndex(scope.$index)"> </span>
          </template>
        </el-table-column>

        <el-table-column prop="ip" label="IP">
          <template slot-scope="{ row }">
            {{ row.ip }}
          </template>
        </el-table-column>
        <el-table-column
          prop="province"
          :label="isAreaType"
          width="200"
          sortable="custom"
        >
          <template slot-scope="{ row }">
            <div
              style="display: flex; justify-content: center; position: relative"
            >
              <div v-if="apiSortName == 'province'" style="text-align: center">
                {{ row.province }}
              </div>
              <div v-else style="text-align: center">{{ row.country }}</div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="pv" label="浏览量" sortable="custom">
          <template slot-scope="{ row }">
            {{ row.pv }}
          </template>
        </el-table-column>
        <!-- <el-table-column
          prop="avgVisitTime"
          label="平均访问时长"
          sortable="custom"
        >
          <template slot-scope="{ row }">
            {{ row.avgVisitTime | formatTimeTable }}
          </template>
        </el-table-column> -->
      </el-table>
      <div class="block">
        <el-pagination
          next-text="下一页"
          :current-page="pageNum"
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
</template>

<script>
import { getIpListApi } from "@/api/trackingapi/accessLog";
import { copyObj } from "@/utils/copy";
export default {
  data() {
    return {
      isAreaType: "地域",
      commonParams: {},
      ipTableList: [],
      pageSize: 10,
      total: 0,
      pageNum: 1,
      current: {
        sortName: "",
        sortOrder: "desc",
      },
      apiSortName: "province",
    };
  },
  mounted() {
    this.$bus.$on("$IpEvent", (val) => {
      if (val == "province") {
        this.apiSortName = "province";
        this.isAreaType = "地域";
      } else {
        this.apiSortName = "country";
        this.isAreaType = "国家";
      }
      this.getIpListApiEvent();
    });
  },
  beforeDestroy() {
    this.$bus.$off(["$IpEvent"]);
  },
  methods: {
    sortChange(e) {
      if (e.order && e.order == "ascending") {
        // 降序
        this.current.sortName = e.prop;
        this.current.sortOrder = "asc";
      } else if (e.order && e.order == "descending") {
        // 升序
        this.current.sortName = e.prop;
        this.current.sortOrder = "desc";
      } else {
        this.current.sortName = null;
        this.current.sortOrder = null;
      }
      console.log(e.prop, "e.pro---");
      if (e.prop == "province") {
        if (e.order) {
          if (this.isAreaType == "地域") {
            this.current.sortName = "province";
          } else {
            this.current.sortName = "country";
          }
        } else {
          this.current.sortName = null;
        }
      }
      this.getIpListApiEvent();
    },
    getIndex($index) {
      return (this.pageNum - 1) * this.pageSize + $index + 1;
    },
    ipApiEvent(params) {
      this.commonParams = copyObj(params);
      this.getIpListApiEvent();
    },
    getIpListApiEvent() {
      this.commonParams.pageSize = this.pageSize;
      this.commonParams.pageNum = this.pageNum;
      this.commonParams.sortName = this.current.sortName;
      this.commonParams.sortOrder = this.current.sortOrder;
      this.commonParams.province = this.province;
      getIpListApi(this.commonParams).then((res) => {
        if (res.code == 200) {
          this.ipTableList = res.data.rows;
          this.total = res.data.total;
        }
      });
    },
    handleSizeChange(val) {
      this.pageNum = 1;
      this.pageSize = val;
      this.getIpListApiEvent();
    },
    handleCurrentChange(val) {
      this.pageNum = val;
      this.getIpListApiEvent();
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep {
  @import "~@/styles/components/el-pagination.scss";
}
</style>
