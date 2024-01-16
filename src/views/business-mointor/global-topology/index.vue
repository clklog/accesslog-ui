<template>
  <div>
    <div class="documentation-container">
      <FilterBar byCalendar ByGlobal @setFilterBarParams="setFilterBarParams" />
    </div>
    <div class="public-block">
      <div class="public-table-block public-hoverItem logCon">
        <span class="public-firstHead">全局拓扑分析</span>
        <globalSystem ref="globalSystem"></globalSystem>
      </div>
    </div>
  </div>
</template>

<script>
import { FilterBar } from "@/layout/components";
import { copyObj } from "@/utils/copy";
import { globalSystem } from "./components/index";
import { getEventListApi,getCountPropEventListApi, } from "@/api/trackingapi/business";

export default {
  components: {
    FilterBar,
    globalSystem,
  },
  data() {
    return {
      filterBarParams: {},
      sortOrder: "desc",
      overList: [],
      hostLength: 0,
      businessListData: [], //业务数据
      actionList: [],
      segmentTime: "",
    };
  },

  computed: {
    httpHost() {
      return this.$store.getters.httpHost;
    },
    applicationCode() {
      return this.$store.getters.applicationCode;
    },
    commonParams() {
      const { applicationCode, sortOrder } = this;
      return Object.assign({ applicationCode }, this.filterBarParams);
    },
  },
  watch: {
    commonParams(val) {
      // this.initEventApi(); //总事件
    },
    httpHost: {
      handler(newValue, oldValue) {
        this.hostLength = newValue;
      },
      deep: true,
    },
  },
  methods: {
    setFilterBarParams(val) {
      this.filterBarParams = copyObj(val);
      // console.log(val,"全局top分析");
      this.initEventApi()
    },
    initEventApi() {
      let params = {
        applicationCode: "cnb.mgt",
        summaryOption: "StatusLocation",
        startTime: this.commonParams.startTime,
        endTime: this.commonParams.endTime,
      };
      this.actionList = []; //参拍数据
      this.getEventList(params, true);
    },
    getEventList(params, flag) {
      this.businessListData = [];
      getEventListApi(params).then((res) => {
        if (res.code == 200) {
          this.businessListData = res.data;
          this.$nextTick(() => {
            this.$refs.globalSystem.filterBusinessEvent(this.businessListData,params);
          });
        }
      });
    },
    getYesterday(params, flag) {
      let outDate = {
        applicationCode: "cnb.mgt",
        summaryOption: "StatusLocation",
        startTime: this.commonParams.segmentTimeList[2],
        endTime: this.commonParams.segmentTimeList[3],
      };
      getEventListApi(outDate).then((res) => {
        if (res.code == 200) {
          if (res.data.length > 0) {
            this.businessListData.push(res.data);
          } else {
            this.businessListData.push([{}]);
          }
          this.$nextTick(() => {
            this.$refs.globalSystem.filterBusinessEvent(this.businessListData);
          });
        }
      });
    },
    
  },
};
</script>

<style lang="scss" scoped>
.logCon {
  min-height: 1271px;
  background: rgba(255, 255, 255);
  box-sizing: border-box;
}
.div_block {
  display: flex;
  justify-content: space-between;
}
</style>
