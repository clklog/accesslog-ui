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
            <el-button
              style="margin-left: 10px"
              type="text"
              @click="openDialog(row)"
              icon="el-icon-view"
            ></el-button>
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
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      width="1000px"
    >
      <el-table
        class="public-radius"
        :header-cell-style="{ textAlign: 'center', background: '#f7fafe ' }"
        :cell-style="{ textAlign: 'center' }"
        :data="ipDetailTableList"
        border
        @sort-change="sortChangeIp($event)"
        style="width: 100%"
      >
        <el-table-column label="序号" type="index" width="80" align="center">
          <template slot-scope="scope">
            <span v-text="getIndex(scope.$index)"> </span>
          </template>
        </el-table-column>
        <el-table-column
          prop="country"
          label="国家"
          sortable="custom"
          width="80"
        >
          <template slot-scope="{ row }">
            {{ row.country }}
          </template>
        </el-table-column>
        <el-table-column
          prop="province"
          label="省"
          sortable="custom"
          width="80"
        >
          <template slot-scope="{ row }">
            {{ row.province }}
          </template>
        </el-table-column>
        <el-table-column prop="city" label="城市" sortable="custom" width="80">
          <template slot-scope="{ row }">
            {{ row.city }}
          </template>
        </el-table-column>
        <el-table-column prop="httpUserAgent" label="userAgent采样">
          <template slot-scope="{ row }">
            {{ row.httpUserAgent }}
          </template>
        </el-table-column>
        <el-table-column prop="uri" label="url采样">
          <template slot-scope="{ row }">
            {{ row.uri }}
          </template>
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="创建时间"
          sortable="custom"
          width="160"
        >
          <template slot-scope="{ row }">
            {{ row.createTime | formatTime }}
          </template>
        </el-table-column>
      </el-table>
      <div class="block">
        <el-pagination
          next-text="下一页"
          :current-page="pageNumIp"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="pageSizeIp"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalIp"
          @size-change="handleSizeChangeIp"
          @current-change="handleCurrentChangeIp"
        />
      </div>
    </el-dialog>
  </div>
</template>

<script>
import moment from "moment";
import { getIpListApi, getIpDetailListApi } from "@/api/trackingapi/accessLog";
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
      dialogVisible: false,
      dialogTitle: "IP访问详情",
      ipSelect: "",
      ipDetailTableList: [],
      pageSizeIp: 10,
      totalIp: 0,
      pageNumIp: 1,
      currentIp: {
        sortName: "create_time",
        sortOrder: "desc",
      },
      commonParamsIp: {},
    };
  },
  filters: {
    formatTime(value) {
      return moment(value).format("YYYY-MM-DD HH:mm:ss");
    },
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
    openDialog(row) {
      this.dialogVisible = true;
      this.ipSelect = row.ip;
      this.dialogTitle = "IP:" + row.ip + "访问详情";
      this.getIpDetailApiEvent();
    },
    getIpDetailApiEvent() {
      this.commonParamsIp.pageSize = this.pageSizeIp;
      this.commonParamsIp.pageNum = this.pageNumIp;
      this.commonParamsIp.sortName = this.currentIp.sortName;
      this.commonParamsIp.sortOrder = this.currentIp.sortOrder;
      this.commonParamsIp.ip = this.ipSelect;
      this.commonParamsIp.applicationCode = this.commonParams.applicationCode;
      this.commonParamsIp.httpHost = this.commonParams.httpHost;
      this.commonParamsIp.startTime = this.commonParams.startTime;
      this.commonParamsIp.endTime = this.commonParams.endTime;
      //console.log(this.commonParamsIp, "this.commonParamsIp");
      getIpDetailListApi(this.commonParamsIp).then((res) => {
        if (res.code == 200) {
          this.ipDetailTableList = res.data.rows;
          this.totalIp = res.data.total;
        }
      });
    },
    handleSizeChangeIp(val) {
      this.pageNumIp = 1;
      this.pageSizeIp = val;
      this.getIpDetailApiEvent();
    },
    handleCurrentChangeIp(val) {
      this.pageNumIp = val;
      this.getIpDetailApiEvent();
    },
    sortChangeIp(e) {
      if (e.order && e.order == "ascending") {
        // 降序
        this.currentIp.sortName = e.prop;
        this.currentIp.sortOrder = "asc";
      } else if (e.order && e.order == "descending") {
        // 升序
        this.currentIp.sortName = e.prop;
        this.currentIp.sortOrder = "desc";
      } else {
        this.currentIp.sortName = null;
        this.currentIp.sortOrder = null;
      }
      this.getIpDetailApiEvent();
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep {
  @import "~@/styles/components/el-pagination.scss";
}
</style>
