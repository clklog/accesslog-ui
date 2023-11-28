<template>
  <div>
    <div class="documentation-container">
      <FilterBar BySegment @setFilterBarParams="setFilterBarParams" />
    </div>
    <div class="public-block">
      <sing-application ref="singApplication"></sing-application>
      <registrationProcess ref="registration"></registrationProcess>
      <div style="display: flex; justify-content: space-between">
        <register style="margin-top: 0" ref="register"></register>
        <useVehicle style="margin-top: 0" ref="useVehicle"></useVehicle>
      </div>
    </div>
  </div>
</template>

<script>
import { FilterBar } from "@/layout/components";
import { copyObj } from "@/utils/copy";
import { getEventListApi } from "@/api/trackingapi/business";
import {
  singApplication,
  registrationProcess,
  register,
  useVehicle,
} from "./components/index";

export default {
  components: {
    FilterBar,
    singApplication,
    registrationProcess,
    register,
    useVehicle,
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
  mounted() {

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
    // commonParams(val) {
    //   this.initEventApi(); //总事件
    // },
    commonParams: {
      handler:function(newValue, oldValue) {
        this.initEventApi();
      },
      deep: true,
    },
  },
  methods: {
    
    initEventApi() {
      console.log( this.commonParams,"4664456");
      let params = {
        applicationCode: "cnb.mgt",
        summaryOption: "StatusLocation",
        startTime: this.commonParams.segmentTimeList[0],
        endTime: this.commonParams.segmentTimeList[1],
      };
      this.actionList = []; //参拍数据
      this.getEventList(params, true);
    },
    getEventList(params, flag) {
      this.businessListData = [];
      getEventListApi(params).then((res) => {
        if (res.code == 200) {
          if (res.data.length > 0) {
            this.businessListData.push(res.data);
          } else {
            this.businessListData.push([{}]);
          }
          this.getYesterday(params, false);
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
            this.$refs.singApplication.filterBusinessEvent(
              this.businessListData
            );
            this.$refs.registration.filterBusinessEvent(this.businessListData);
            this.$refs.register.filterBusinessEvent(this.businessListData);
            this.$refs.useVehicle.filterBusinessEvent(this.businessListData);
          });
        }
      });
    },
    // 筛选业务数据
    // filterBusinessList(busiCode, stepCode, location, status) {
    //   let filterList = [];
    //   this.businessListData.map((item) => {
    //     if (item.busiCode == busiCode && item.stepCode == stepCode) {
    //       if (item.summary) {
    //         item.summary.map((val) => {
    //           if (val.status == status) {
    //             return filterList.push(val);
    //           }
    //         });
    //       }
    //     }
    //   });
    //   return filterList;
    // },
    setFilterBarParams(val) {
      console.log(val,"val----------");
      this.filterBarParams = copyObj(val);
    },
  },
};
</script>

<style lang="scss" scoped>
.block-line {
  box-sizing: border-box;
  margin: 20px 0 20px 0;
  min-height: 300px;
  display: flex;
  justify-content: space-between;
}
.div_block {
  display: flex;
  justify-content: space-between;
}
</style>
