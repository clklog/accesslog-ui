<template>
  <div>
    <div class="documentation-container">
      <FilterBar
        BySegment
        byCalendar
        @setFilterBarParams="setFilterBarParams"
      />
    </div>
    <div class="public-block">
      <sing-application ref="singApplication"></sing-application>
      <registrationProcess ref="registration"></registrationProcess>
      <div style="display: flex; justify-content: space-between">
        <register></register>
        <useVehicle></useVehicle>
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
      this.initEventApi(); //总事件
    },
  },
  methods: {
    async initEventApi() {
      await this.initApi();

      setTimeout(() => {
        this.$nextTick(() => {
          this.$refs.singApplication.filterBusinessEvent(this.actionList);
        });
      }, 500);
    },
    initApi() {
      let params = {
        applicationCode: "cnb.mgt",
        summaryOption: "StatusLocation",
        startTime: this.commonParams.segmentTimeList[0],
        endTime: this.commonParams.segmentTimeList[1],
      };
      let outDate = {
        applicationCode: "cnb.mgt",
        summaryOption: "StatusLocation",
        startTime: this.commonParams.segmentTimeList[2],
        endTime: this.commonParams.segmentTimeList[3],
      };
      this.actionList = []; //参拍数据
      this.getEventList(params, true);
      this.getEventList(outDate, false);
    },
    getEventList(params, flag) {
      getEventListApi(params).then((res) => {
        if (res.code == 200) {
          this.businessListData = res.data;
          let applyList =
            this.filterBusinessList(
              "preCheckin",
              "preCheckin.register",
              "现场",
              "成功"
            ) || [];
          // flag == true 为当前日期
          if (flag) {
            // if (applyList.length > 0) {
            //   applyList[0].flag = true;
            // }
            // this.actionList = [...this.actionList, ...applyList];
            // console.log(applyList, "当前-个人参拍申请a");
            if (applyList.length > 0) {
              applyList[0].flag = true;
              this.actionList = [...this.actionList, ...applyList];
            } else {
              this.actionList.push({});
            }
            console.log(applyList, "当前-个人参拍申请a");
          } else {
            if (applyList.length == 0) {
              // this.actionList = [...this.actionList, ];
              this.actionList.push({});
            } else {
              this.actionList = [...this.actionList, ...applyList];
            }
            // this.actionList = [...this.actionList, ...applyList];
            console.log(applyList, "当前-个人参拍申请b");
          }
          // this.$nextTick(() => {
          //   this.$refs.singApplication.filterBusinessEvent(this.actionList);
          // });
          // console.log(this.actionList, "总数参拍申请");
        }
      });
    },
    // 筛选业务数据
    filterBusinessList(busiCode, stepCode, location, status) {
      let filterList = [];
      this.businessListData.map((item) => {
        if (item.busiCode == busiCode && item.stepCode == stepCode) {
          if (item.summary) {
            item.summary.map((val) => {
              if (val.status == status) {
                return filterList.push(val);
              }
            });
          }
        }
      });
      return filterList;
    },
    setFilterBarParams(val) {
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
