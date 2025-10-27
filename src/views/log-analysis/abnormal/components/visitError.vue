<template>
  <div class="block-main public-hoverItem logCon">
    <div class="block-head">
      <div class="block-title">访问量异常</div>
      <!-- <div class="block-head-icon">
        <img src="@/assets/images/icon.png" alt="" width="10px" />
      </div> -->
      <el-radio-group
        size="mini"
        v-model="checkValue"
        @change="changeEchartEvent"
        style="font-size: 13px; height: 30px; padding-left: 20px"
      >
        <el-radio-button label="TOP10">TOP10</el-radio-button>
        <el-radio-button label="全部">全部</el-radio-button>
      </el-radio-group>
    </div>
    <!-- table -->
    <div v-show="checkValue == '全部'">
      <div style="width: 100%; min-height: 405px">
        <el-table
          :data="tableData"
          class="public-radius"
          :header-cell-style="{ textAlign: 'center', background: '#f7fafe ' }"
          style="width: 100%"
          :cell-style="tableHeaderColor"
          border
        >
          <el-table-column type="index" label="序号" width="100px">
            <template slot-scope="scope">
              <span v-text="getIndex(scope.$index)"> </span>
            </template>
          </el-table-column>
          <el-table-column
            prop="ip"
            min-width="40%"
            :show-overflow-tooltip="true"
            label="异常IP"
          />
          <el-table-column
            prop="pv"
            label="访问量"
            min-width="30%"
            :show-overflow-tooltip="true"
          />
        </el-table>
      </div>
      <div class="block">
        <el-pagination
          next-text="下一页"
          :pager-count="5"
          :current-page.sync="currentPage"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
    <!-- echarts -->
    <div v-if="checkValue == 'TOP10'">
      <div id="ipEchart" class="ip_echart"></div>
    </div>
  </div>
</template>

<script>
import echarts from "echarts";
import { getExceptionPvApi } from "@/api/trackingapi/abnormal";
export default {
  data() {
    return {
      checkValue: "TOP10",
      tableData: [],
      pageNum: 1,
      pageSize: 10,
      currentPage: 1,
      total: 0,
      commonParamsOld: "",

      ipEchart: null,
      xDataList: [],
      yDataList: [],
      ipList: [],
    };
  },
  mounted() {},
  methods: {
    changeEchartEvent(val) {
      if (val == 'TOP10') {
        this.initEcharts();
      }
    },
    // echarts图表
    initEcharts() {
      const ipEchartDom = document.getElementById("ipEchart");
      if (!ipEchartDom) {
        console.warn("ipEchart DOM元素不存在，跳过ECharts初始化");
        return;
      }
      this.ipEchart = echarts.init(ipEchartDom);
      const option = {
        tooltip: {
          trigger: "axis",
          axisPointer: { type: "shadow" },
        },
        legend: {
          icon: "roundRect",
          right: "4%",
        },
        grid: {
          left: "20%",
          top: "12%",
          bottom: "10%",
        },
        yAxis: [
          {
            type: "category",
            data: this.yDataList,
            axisLabel: {
              interval: 0,
              rotate: "0",
            },
            axisTick: {
              show: false,
              alignWithLabel: true,
            },
            axisLine: {
              onZero: false,
            },
          },
        ],
        xAxis: [
          {
            type: "value",
            axisTick: {
              show: false,
              alignWithLabel: true,
            },
            axisLabel: {
              interval: 0,
              rotate: "26",
            },
          },
        ],
        series: [
          {
            name: "访问量(PV)",
            type: "bar",
            itemStyle: {
              color: "#2c7be5",
            },

            barWidth: 20,
            label: {
              show: true,
              position: "right",
            },
            data: this.xDataList,
          },
        ],
      };
      this.ipEchart.setOption(option);
      window.addEventListener("resize", () => {
        if (this.ipEchart) {
          this.ipEchart.resize();
        }
      });
    },
    getIndex($index) {
      return (this.currentPage - 1) * this.pageSize + $index + 1;
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.getExceptionPv(this.commonParamsOld);
    },
    handleCurrentChange(val) {
      this.pageNum = val;
      this.getExceptionPv(this.commonParamsOld);
    },
    tableHeaderColor({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 1) {
        return "text-align:center";
      } else {
        return "text-align:center";
      }
    },
    getExceptionPv(commonParams) {
      this.commonParamsOld = commonParams;
      const { pageNum, pageSize } = this;
      commonParams = Object.assign({ pageNum, pageSize }, commonParams);
      getExceptionPvApi(commonParams).then((res) => {
        if (res.code == 200) {
          
          this.tableData = JSON.parse(JSON.stringify(res.data.rows));
          this.total = res.data.total;
         //   echarts
          if (pageNum == 1) {
            this.onePageList = res.data.rows;
            this.xDataList = [];
            this.yDataList = [];
            this.ipList = JSON.parse(JSON.stringify(res.data.rows)).reverse();
            this.ipList.map((item, index) => {
              if (item.ip) {
                this.yDataList.push(item.ip);
              } else {
                this.yDataList.push("");
              }
              if (item.pv) {
                this.xDataList.push(item.pv);
              } else {
                this.yDataList.push(0);
              }
            });
            // this.ipList = 
            this.initEcharts();
          }
        }
      });
    },
  },
  beforeDestroy() {
    if (!this.ipEchart) {
      return;
    }
    this.ipEchart.dispose();
    this.ipEchart = null;
  },
};
</script>

<style lang="scss" scoped>
::v-deep {
  @import "~@/styles/components/el-pagination.scss";
}
.logCon {
  width: calc(50% - 10px);
}
#ipEchart {
  width: 100%;
  height: 400px;
}
</style>
