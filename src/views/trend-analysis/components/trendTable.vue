<template>
  <div>
    <div
      class="block-main public-hoverItem logCon"
      style="min-height: 500px; margin-top: 20px"
    >
      <div class="block-head">
        <div class="block-title">趋势分析</div>
      </div>
      <div v-if="!contrastValue">
        <el-table
          class="public-radius"
          :header-cell-style="{ textAlign: 'center', background: '#f7fafe ' }"
          :cell-style="{ textAlign: 'center' }"
          :data="
            trendTableList.slice((pageNum - 1) * pageSize, pageNum * pageSize)
          "
          border
          @sort-change="sortChange($event)"
          style="width: 100%"
        >
          <el-table-column label="日期" sortable="custom" prop="statTime">
            <template slot-scope="scope">
              <div style="display: flex; justify-content: center">
                {{ scope.row.statTime }}
                <div v-if="scope.row.statTime">
                  {{ commonParams.timeType == "hour" ? "时" : "" }}
                </div>
              </div>
            </template>
          </el-table-column>
          <!-- <el-table-column prop="date" label="流量基础指标" width="150"> -->
          <el-table-column prop="uv" label="用户数(UV)" sortable="custom">
            <template slot-scope="{ row }">
              {{ row.uv }}
            </template>
          </el-table-column>
          <el-table-column prop="pv" label="访问量(PV)" sortable="custom">
            <template slot-scope="{ row }">
              {{ row.pv }}
            </template>
          </el-table-column>
          <el-table-column
            prop="bodySentBytes"
            label="流出流量"
            sortable="custom"
          >
            <template slot-scope="{ row }">
              {{ row.bodySentBytes | conver }}
            </template>
          </el-table-column>
          <!-- </el-table-column> -->
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
      <div v-if="contrastValue">
        <el-table
          class="public-radius"
          :header-cell-style="{ textAlign: 'center', background: '#f7fafe ' }"
          :cell-style="{ textAlign: 'center' }"
          :data="
            trendTableList.slice((pageNum - 1) * pageSize, pageNum * pageSize)
          "
          border
          @sort-change="sortChange($event)"
          style="width: 100%"
        >
          <el-table-column label="日期" prop="statTime">
            <template slot-scope="scope" style="text-align: left">
              <div v-if="commonParams.timeType == 'hour' && commonParams.startTime == commonParams.endTime">
                <div class="setSpace">
                  <div style="display: flex">
                    {{ commonParams.startTime }}
                    <div style="margin-left: 10px; display: flex">
                      {{ scope.row.children.statTime }}
                      {{ commonParams.timeType == "hour" ? "时" : "" }}
                    </div>
                  </div>
                </div>
                <div class="setSpace">
                  <div style="display: flex">
                    {{ contrastValue[0] }}
                    <div style="margin-left: 10px; display: flex">
                      {{ scope.row.children.statTime }}
                      {{ commonParams.timeType == "hour" ? "时" : "" }}
                    </div>
                  </div>
                </div>
                <div
                  class="setSpace"
                  style="margin-bottom: 0; text-align: left"
                >
                  变化率
                </div>
              </div>
              <div v-else>
                <div v-if="commonParams.timeType == 'hour'">
                  <div class="setSpace">
                    <div style="display: flex">
                      {{ commonParams.startTime }} ~ {{ commonParams.endTime }}
                      <div style="margin-left: 10px; display: flex">
                        {{ scope.row.children.statTime }}
                        {{ commonParams.timeType == "hour" ? "时" : "" }}
                      </div>
                    </div>
                  </div>
                  <div class="setSpace">
                  <div style="display: flex">
                    {{ contrastValue[0] }} ~ {{ contrastValue[1] }}
                    <div style="margin-left: 10px; display: flex">
                      {{ scope.row.children.statTime }}
                      {{ commonParams.timeType == "hour" ? "时" : "" }}
                    </div>
                  </div>
                </div>
                </div>
                <div v-else>
                  <div class="setSpace">
                    <div style="display: flex">
                      <div style=" display: flex">
                        {{ scope.row.statTime }}
                      </div>
                    </div>
                  </div>
                  <div class="setSpace" style="text-align: left;">
                    {{ scope.row.children.statTime || 0 }}
                  </div>
                </div>

                <div class="setSpace" style="margin-bottom: 0;text-align: left;">变化率</div>
              </div>
            </template>
          </el-table-column>

          <el-table-column prop="uv" label="用户数(UV)">
            <template slot-scope="scope">
              <div class="setBody setTr">{{ scope.row.uv || 0 }}</div>
              <div class="setBody">{{ scope.row.children.uv || 0 }}</div>
              <div class="setBody">
                {{ changeRateEvent(scope.row.uv, scope.row.children.uv) }}%
              </div>
            </template>
          </el-table-column>

          <el-table-column label="访问量(PV)">
            <template slot-scope="scope">
              <div class="setBody setTr">{{ scope.row.pv || 0 }}</div>
              <div class="setBody">{{ scope.row.children.pv || 0 }}</div>
              <div class="setBody">
                {{ changeRateEvent(scope.row.pv, scope.row.children.pv) }}%
              </div>
            </template>
          </el-table-column>

          <el-table-column prop="bodySentBytes" label="流出流量">
            <template slot-scope="scope">
              <!-- {{ row.bodySentBytes | conver }} -->
              <div class="setBody setTr">
                {{ scope.row.bodySentBytes | conver }}
              </div>
              <div class="setBody">
                {{ scope.row.children.bodySentBytes | conver }}
              </div>
              <div class="setBody">
                {{
                  changeRateEvent(
                    scope.row.bodySentBytes,
                    scope.row.children.bodySentBytes
                  )
                }}%
              </div>
            </template>
          </el-table-column>
          <!-- </el-table-column> -->
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
  </div>
</template>

<script>
import { copyObj } from "@/utils/copy";
export default {
  data() {
    return {
      commonParams: {},
      trendTableList: [],
      pageSize: 30,
      total: 0,
      pageNum: 1,
      current: {
        sortName: "",
        sortOrder: "",
      },
      contrastValue: "",
    };
  },
  methods: {
    changeRateEvent(x, y) {
      if (x || y) {
        let a = ((y - x) / (x || 1)).toFixed(4);
        return (a * 100).toFixed(2);
      } else {
        return 0;
      }
    },
    sortChange(e) {
      if (e.prop == "statTime") {
        if (e.order && e.order == "descending") {
          this.trendTableList.reverse();
        } else {
          this.$emit("refreshApi");
        }
        return;
      }
      if (e.order && e.order == "ascending") {
        // 降序
        this.current.sortName = e.prop;
        this.current.sortOrder = "ascending";
      } else if (e.order && e.order == "descending") {
        // 升序
        this.current.sortName = e.prop;
        this.current.sortOrder = "descending";
      } else {
        this.current.sortName = null;
        this.current.sortOrder = null;
        this.$emit("refreshApi");
      }
      this.ascDscEvent();
    },
    ascDscEvent() {
      let nameAttr = this.current.sortName;
      if (nameAttr && this.current.sortOrder === "ascending") {
        this.trendTableList = this.trendTableList.sort(function (a, b) {
          return a[nameAttr] - b[nameAttr];
        });
      } else if (nameAttr && this.current.sortOrder === "descending") {
        this.trendTableList = this.trendTableList.sort(function (a, b) {
          return b[nameAttr] - a[nameAttr];
        });
      }
    },
    trendApiEvent(val, commonParams, contrastValue) {
      this.contrastValue = contrastValue;
      this.commonParams = commonParams;
      if (contrastValue) {
        // 对比状态下
        this.trendTableList = copyObj(val).reverse();
        this.total = val.length || 0;
      } else {
        
        let toDateTime = this.$options.filters.formatDateToday();
        if (
          commonParams.timeType == "hour" &&
          commonParams.endTime == commonParams.startTime &&
          commonParams.startTime == toDateTime
        ) {
          let currentHout = this.$options.filters.getCurrentHour();
          let newArray = copyObj(val).reverse();
          const index = newArray.findIndex(
            (item) => item.statTime == currentHout
          );
          const result = index !== -1 ? newArray.slice(index) : [];
          this.trendTableList = result;
        } else {
          this.trendTableList = copyObj(val).reverse();
        }
        this.total = val.length || 0;
      }
    },
    handleSizeChange(val) {
      this.pageNum = 1;
      this.pageSize = val;
    },
    handleCurrentChange(val) {
      this.pageNum = val;
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep {
  @import "~@/styles/components/el-pagination.scss";
}
.setSpace {
  margin-bottom: 8px;
  margin-left: 25px;
}
.setBody {
  margin-bottom: 8px;
}
</style>
