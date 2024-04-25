<template>
  <div>
    <div
      class="block-main public-hoverItem logCon"
      style="min-height: 500px; margin-top: 20px"
    >
      <div class="block-head">
        <div class="block-title">IP分析</div>
      </div>
      <div class="search-area">
        <div class="search-area-form">
          <div class="search-area-form-item">
            IP:
            <el-input
              v-model="ipInput"
              placeholder="请输入IP"
              size="small"
              style="width: 200px"
            ></el-input>
            <el-button
              style="margin-left: 10px"
              size="small"
              type="primary"
              icon="el-icon-search"
              @click="getIpListApiEvent"
              >搜索</el-button
            >
          </div>
        </div>
      </div>
      <el-table
        class="public-radius"
        :header-cell-style="{ textAlign: 'center', background: '#f7fafe ' }"
        :cell-style="{ textAlign: 'center' }"
        :data="ipTableList"
        border
        @sort-change="sortChange($event)"
        style="width: 100%"
        v-loading="loadingIpTableList"
      >
        <el-table-column label="序号" type="index" width="80" align="center">
          <template slot-scope="scope">
            <span v-text="getIndex(scope.$index)"> </span>
          </template>
        </el-table-column>
        <el-table-column prop="ip" label="IP" width="160">
          <template slot-scope="{ row }">
            <div class="custom-ip-cell">
              <span class="ip-text">{{ row.ip }}</span>
              <el-button
                class="align-right"
                style="margin-left: auto"
                type="text"
                @click="openDialog(row)"
                icon="el-icon-view"
              ></el-button>
            </div>
          </template>
        </el-table-column>
        <!-- <el-table-column
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
        </el-table-column> -->
        <el-table-column
          prop="country"
          label="国家"
          sortable="custom"
          width="100"
        >
          <template slot-scope="{ row }">
            {{ row.country }}
          </template>
        </el-table-column>
        <el-table-column
          prop="province"
          label="省"
          sortable="custom"
          width="100"
        >
          <template slot-scope="{ row }">
            {{ row.province }}
          </template>
        </el-table-column>
        <el-table-column prop="city" label="城市" sortable="custom" width="100">
          <template slot-scope="{ row }">
            {{ row.city }}
          </template>
        </el-table-column>
        <el-table-column prop="pv" label="浏览量" sortable="custom" width="100">
          <template slot-scope="{ row }">
            {{ row.pv }}
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
      <div class="flow-indicator public_indicator" style="margin-top: 2px">
        <div class="flow-item" style="font-size: 13px; color: #4d4d4d">
          请选择要排除的文件类型：
        </div>
        <div class="flow-item" style="margin-top: 5px">
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

          <!-- <el-checkbox style="margin-left: 55px;" label="overSecond">超过一秒</el-checkbox> -->
        </div>

        <div class="flow-item" style="font-size: 13px; color: #4d4d4d">
          请选择页面响应时间范围：
        </div>
        <el-checkbox-group
          v-model="overSecond"
          class="checkBoxStyle"
          @change="getIpDetailApiEvent"
          style="margin-top: 5px; margin-bottom: 5px"
        >
          <el-checkbox style="margin-left: 10px" label="overSecond"
            >超过一秒</el-checkbox
          >
        </el-checkbox-group>
      </div>
      <el-table
        class="public-radius"
        :header-cell-style="{ textAlign: 'center', background: '#f7fafe ' }"
        :cell-style="{ textAlign: 'center' }"
        :data="ipDetailTableList"
        border
        @sort-change="sortChangeIp($event)"
        style="width: 100%; margin-top: 20px"
        v-loading="loadingIpDetailTableList"
      >
        <el-table-column label="序号" type="index" width="80" align="center">
          <template slot-scope="scope">
            <span v-text="getIndex(scope.$index)"> </span>
          </template>
        </el-table-column>
        <el-table-column prop="uri" label="页面URL">
          <template slot-scope="{ row }">
            {{ row.uri }}
          </template>
        </el-table-column>
        <el-table-column
          prop="pv"
          label="访问次数"
          sortable="custom"
          width="100"
        >
          <template slot-scope="{ row }">
            {{ row.pv }}
          </template>
        </el-table-column>
        <el-table-column
          prop="slowPv"
          label="耗时较长次数(>=1秒)"
          sortable="custom"
          width="100"
        >
          <template slot-scope="{ row }">
            {{ row.slowPv }}
          </template>
        </el-table-column>
        <el-table-column prop="maxVisitTime" label="最大耗时(毫秒)" width="100">
          <template slot-scope="{ row }">
            {{ row.maxVisitTime }}
          </template>
        </el-table-column>
        <el-table-column
          prop="pvRate"
          label="耗时较长次数(>=1秒)占比"
          width="100"
        >
          <template slot-scope="{ row }">
            {{ row.pvRate }}
          </template>
        </el-table-column>
        <el-table-column
          prop="avgVisitTime"
          label="平均耗时(毫秒)"
          sortable="custom"
          width="100"
        >
          <template slot-scope="{ row }">
            {{ row.avgVisitTime }}
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
      ipInput: "",
      loadingIpTableList: false,
      loadingIpDetailTableList: false,
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
        sortName: "pv",
        sortOrder: "desc",
      },
      commonParamsIp: {},
      performFilter: [],
      inputOther: "",
      otherFilter: [],
      imgFormatList: [],
      otherList: [],
      overSecond: false,
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
      this.loadingIpTableList = true;
      this.commonParams.pageSize = this.pageSize;
      this.commonParams.pageNum = this.pageNum;
      this.commonParams.sortName = this.current.sortName;
      this.commonParams.sortOrder = this.current.sortOrder;
      this.commonParams.province = this.province;
      this.commonParams.ip = this.ipInput;
      getIpListApi(this.commonParams).then((res) => {
        if (res.code == 200) {
          this.ipTableList = res.data.rows;
          this.total = res.data.total;
          this.loadingIpTableList = false;
        } else {
          this.loadingIpTableList = false;
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
      this.dialogTitle = "IP[" + row.ip + "]访问详情";
      this.getIpDetailApiEvent();
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
      this.getPerformanceDetail();
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
      this.getIpDetailApiEvent();
    },
    getIpDetailApiEvent() {
      this.loadingIpDetailTableList = true;
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
      this.commonParamsIp.limits = [...this.imgFormatList, ...this.otherList];
      this.commonParamsIp.isOverOneSecond = this.overSecond;
      getIpDetailListApi(this.commonParamsIp).then((res) => {
        if (res.code == 200) {
          this.ipDetailTableList = res.data.rows;
          this.totalIp = res.data.total;
          this.loadingIpDetailTableList = false;
        } else {
          this.loadingIpDetailTableList = false;
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
  @import "~@/styles/components/el-checkbox.scss";
  @import "~@/styles/components/el-pagination.scss";

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
}

.custom-ip-cell {
  display: flex;
  align-items: center; /* 可选，保持IP和按钮在同一垂直线上 */

  .ip-text {
    text-align: left;
  }

  .align-right {
    margin-left: auto;
  }
}

.search-area {
  display: flex;
  align-items: center;
  border: 1px solid #d8e2ef;
  border-radius: 6px;
  box-sizing: border-box;
  margin-bottom: 20px;
  .search-area-form {
    padding: 10px;

    .search-area-form-item {
      font-size: 14px;
    }
  }
}
</style>
