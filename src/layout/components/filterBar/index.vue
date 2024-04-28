<template>
  <div class="documentation-container">
    <div class="checkContent">
      <div style="display: flex; padding-top: 18px">
        <!-- 新增筛选条件 -->
        <div class="check_item public_border_color" v-if="BySegment">
          <span>时间:</span>
          <el-radio-group
            v-model="segmentTime"
            class="checkBoxStyle"
            @change="segmentTimeEvent"
          >
            <el-radio label="Day">今日</el-radio>
            <el-radio label="Week">本周</el-radio>
            <el-radio label="Month">本月</el-radio>
          </el-radio-group>
        </div>
        <!-- 按月 -->
        <div class="check_item" v-if="BySegment">
          <span>按月:</span>
          <el-date-picker
            style="width: 150px"
            v-model="checkMonth"
            type="month"
            @change="checkByMonth"
            placeholder="选择月份"
            value-format="yyyy-MM-dd"
            :picker-options="pickerBeginMonth"
          >
          </el-date-picker>
        </div>
        <!-- 按日 -->
        <div class="check_item" v-if="BySegment">
          <span>按日:</span>
          <el-date-picker
            style="width: 150px"
            v-model="checkDay"
            type="date"
            @change="checkByDay"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"
            :picker-options="pickerBeginDay"
          >
          </el-date-picker>
        </div>

        <div class="check_item public_border_color" v-if="byTimeType">
          <span>时间:</span>
          <el-radio-group
            v-model="timeFlag"
            class="checkBoxStyle"
            @change="handleChange"
          >
            <el-radio label="day">今日</el-radio>
            <el-radio label="previous">昨日</el-radio>
            <el-radio label="week">近7天</el-radio>
            <el-radio label="month">近30天</el-radio>
            <!-- <el-radio label="year"> 日期范围 </el-radio> -->
          </el-radio-group>
        </div>

        <!-- 用户证件号 -->
        <div class="check_item" style="margin-top: 2px" v-if="byNumberId">
          <span style="white-space: nowrap">用户证件号:</span>
          <el-input
            v-model="whoId"
            placeholder="请输入证件号"
            style="width: 340px"
          ></el-input>
          <!-- @blur="numberEvent" -->
        </div>

        <el-date-picker
          v-if="byCalendar"
          class="timnePickCSS"
          style="
            margin-left: 20px;
            width: 250px;
            height: 30px;
            line-height: 30px !important;
          "
          v-model="currentTime"
          ref="tiemPick"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd"
          :picker-options="pickerBeginOption"
          @change="checkDateEvnet"
        >
        </el-date-picker>

        <!-- 对比时间段 -->
        <div style="margin-left: 20px; line-height: 30px" v-if="ByContrast">
          <el-checkbox v-model="checked" @change="checkTimeSlot">{{
            checkLabel
          }}</el-checkbox>
        </div>
        <div v-show="contrastFlag">
          <!-- 日期2 -->
          <el-date-picker
            class="timnePickCSS"
            style="margin-left: 20px; width: 250px; height: 30px"
            v-model="contrastValue"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd"
            :picker-options="pickerBeginOption"
            @change="checkContrast"
          >
          </el-date-picker>
        </div>

        <!-- 100ms时序图 -->
        <el-date-picker
          v-if="ByTimeSlot"
          class="timnePickCSS"
          style="
            margin-left: 20px;
            width: 150px;
            height: 30px;
            line-height: 30px;
            font-size: 12px;
          "
          v-model="timeSlot"
          align="right"
          type="date"
          placeholder="选择日期"
          value-format="yyyy-MM-dd"
          :picker-options="pickerDaySolt"
          @change="checkTimeSlot"
        >
        </el-date-picker>
        <!-- end -->
        <div v-if="BySegment" class="numIdButton" @click="SegmentEvent">
          查询
        </div>

        <div
          v-if="byNumberId || ByGlobal"
          class="numIdButton"
          @click="numberEvent"
        >
          查询
        </div>
        <!-- 100ms时序图 -->
        <div
          v-if="ByTimeSlot"
          style="
            display: flex;
            border: 1px solid #acb2ba;
            border-radius: 4px;
            align-items: center;
            height: 30px;
            margin-left: 20px;
          "
        >
          <el-select
            class="year"
            v-model="timeValue"
            placeholder="请选择时间段"
            size="small"
            style="width: 150px"
            @change="handleTimeValue"
          >
            <el-option
              v-for="item in timeDateList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </div>
        <div
          v-if="ByData"
          style="
            margin-left: 20px;
            height: 32px;
            display: flex;
            align-items: center;
          "
        >
          <el-radio-group
            @change="handleRadioEvent"
            size="mini"
            v-model="timeType"
            style="font-size: 13px; height: 32px"
          >
            <el-radio-button label="hour" :disabled="dayFlag ? true : false"
              >按时</el-radio-button
            >
            <el-radio-button label="day" :disabled="dayFlag ? true : false"
              >按日</el-radio-button
            >
            <el-radio-button label="week" :disabled="weekFlag ? true : false"
              >按周</el-radio-button
            >
            <el-radio-button label="month" :disabled="monthFlag ? true : false"
              >按月</el-radio-button
            >
          </el-radio-group>
        </div>

        <!-- host -->
        <div
          v-if="ByHost"
          style="
            display: flex;
            border: 1px solid #acb2ba;
            border-radius: 4px;
            align-items: center;
            height: 30px;
            margin-left: 20px;
            display: flex;
            align-items: center;
          "
        >
          <div
            style="
              height: 28px;
              line-height: 30px;
              font-size: 12px;
              color: #4d4d4d;
              padding-left: 6px;
            "
          >
            主机:
          </div>
          <el-select
            class="appli_select"
            v-model="hostValue"
            placeholder="请选择应用"
            size="small"
            style="min-width: 110px"
            @change="handleChangeProject"
          >
            <el-option
              v-for="item in hostData"
              :key="item.value"
              :label="item.label"
              :value="item.value"
              :disabled="item.disabled"
            >
            </el-option>
          </el-select>
        </div>

        <div v-if="ByArea" class="areaContent">
          <div class="areaItem">
            <div class="areaHead public_border_color">地域</div>
            <!-- 气泡弹框 -->
            <div class="area_select sing_special_popover">
              <el-popover
                placement="bottom"
                width="510"
                trigger="click"
                v-model="popflag"
              >
                <div style="position: relative">
                  <el-radio-group size="mini" v-model="areaValue">
                    <el-radio
                      style="margin-top: 11px"
                      @change="handleCheckProvince(item)"
                      v-for="(item, index) in provinceData"
                      :key="index"
                      :label="item.provinceName"
                      >{{ item.provinceName }}</el-radio
                    >
                  </el-radio-group>
                  <div class="popCancle" @click="canclePopEvent">X</div>
                </div>
                <div class="areaBox public_font_color" slot="reference">
                  {{ areaValue }}
                  <i v-if="popflag" class="el-icon-arrow-up iconArrow"></i>
                  <i v-else class="el-icon-arrow-down iconArrow"></i>
                </div>
              </el-popover>
            </div>
          </div>
        </div>
      </div>

      <div class="channelSecond">
        <div style="display: flex">
          <div class="check_item public_border_color" v-if="ByChnnel">
            <span>渠道:</span>
            <el-radio-group v-model="channelValue" style="margin-right: 10px">
              <el-radio
                v-for="item in allChaneList"
                :label="item.id"
                :key="item.id"
                >{{ item.label }}</el-radio
              >
            </el-radio-group>
          </div>
          <div class="check_item public_border_color" v-if="ByVisitor">
            <span>访客:</span>
            <el-radio-group v-model="visitorType" class="checkBoxStyle">
              <el-radio label="">全部</el-radio>
              <el-radio label="新访客">新访客</el-radio>
              <el-radio label="老访客">老访客</el-radio>
            </el-radio-group>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { blobDownloads } from "@/utils/localDownloadUtil.js";
import { string } from "clipboard";
import { province } from "@/utils/province";
import { getHostApi } from "@/api/trackingapi/accessLog.js";
import { copyObj } from "@/utils/copy";
export default {
  props: {
    byTimeType: {
      type: Boolean,
      default: false,
    },
    byCalendar: {
      type: Boolean,
      default: false,
    },
    ByHost: {
      type: Boolean,
      default: false,
    },
    BySub: {
      type: Boolean,
      default: false,
    },
    ByChnnel: {
      type: Boolean,
      default: false,
    },
    ByVisitor: {
      type: Boolean,
      default: false,
    },
    ByData: {
      type: Boolean,
      default: false,
    },
    ByArea: {
      type: Boolean,
      default: false,
    },
    BySegment: {
      type: Boolean,
      default: false,
    },
    byNumberId: {
      type: Boolean,
      default: false,
    },
    ByTimeSlot: {
      type: Boolean,
      default: false,
    },
    ByGlobal: {
      type: Boolean,
      default: false,
    },
    ByContrast: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      checked: false,
      checkMonth: "",
      checkDay: "",
      segmentTime: "Day",
      timeDateList: [
        {
          value: "",
          label: "全天",
        },
        {
          value: "01",
          label: "00:00-01:00",
        },

        {
          value: "02",
          label: "01:00-02:00",
        },
        {
          value: "03",
          label: "02:00-03:00",
        },
        {
          value: "04",
          label: "03:00-04:00",
        },
        {
          value: "05",
          label: "04:00-05:00",
        },
        {
          value: "06",
          label: "05:00-06:00",
        },
        {
          value: "07",
          label: "06:00-07:00",
        },
        {
          value: "08",
          label: "07:00-08:00",
        },
        {
          value: "09",
          label: "08:00-09:00",
        },
        {
          value: "10",
          label: "09:00-10:00",
        },
        {
          value: "11",
          label: "10:00-11:00",
        },
        {
          value: "12",
          label: "11:00-12:00",
        },
        {
          value: "13",
          label: "12:00-13:00",
        },
        {
          value: "14",
          label: "13:00-14:00",
        },
        {
          value: "15",
          label: "14:00-15:00",
        },
        {
          value: "16",
          label: "15:00-16:00",
        },
        {
          value: "17",
          label: "16:00-17:00",
        },
        {
          value: "18",
          label: "17:00-18:00",
        },
        {
          value: "19",
          label: "18:00-19:00",
        },
        {
          value: "20",
          label: "19:00-20:00",
        },
        {
          value: "21",
          label: "20:00-21:00",
        },
        {
          value: "22",
          label: "21:00-22:00",
        },
        {
          value: "23",
          label: "22:00-23:00",
        },
        {
          value: "24",
          label: "23:00-24:00",
        },
      ],
      pickerBeginMonth: {
        disabledDate(date) {
          const today = new Date();
          return date.getTime() > today.getTime();
        },
      },
      pickerBeginDay: {
        disabledDate(date) {
          const today = new Date();
          return date.getTime() > today.getTime();
        },
      },
      pickerBeginOption: {
        disabledDate(date) {
          const today = new Date();
          return date.getTime() > today.getTime();
        },
        shortcuts: [
          {
            text: "近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "近六个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 180);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "近一年",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 365);
              picker.$emit("pick", [start, end]);
            },
          },
        ],
      },
      // 100ms时序图
      timeValue: "",
      timeSlot: "",
      pickerDaySolt: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
        shortcuts: [
          {
            text: "今天",
            onClick(picker) {
              picker.$emit("pick", new Date());
            },
          },
          {
            text: "昨天",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24);
              picker.$emit("pick", date);
            },
          },
          {
            text: "一周前",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", date);
            },
          },
        ],
      },

      showBtn: true,
      dateRange: null, //日期范围
      isIndeterminate: false,
      checkAll: false,
      channelList: "",
      currentTime: "",
      allChaneList: [
        { label: "全部", id: "" },
        { label: "安卓", id: "安卓" },
        { label: "苹果", id: "苹果" },
        { label: "网站", id: "网站" },
        { label: "微信小程序", id: "微信小程序" },
      ],
      dateList: "day",
      visitorValue: "新访客",
      dayFlag: true,
      weekFlag: true,
      monthFlag: true,
      checkDateTime: "",
      past7daysStart: "", //最近一周
      timeDifference: "",
      // 接口参数数据
      timeType: this.ByData ? "hour" : "day",
      timeFlag: "day", //暂定天数
      startTime: "",
      endTime: "",
      areaValue: "全部",
      channelValue: "", //渠道
      visitorType: "",
      popflag: false,
      commonData: "",
      hostData: [],
      hostValue: "all",
      segmentTimeList: this.$options.filters.formatToday(), //默认今日日期
      whoId: "", //证件号
      blurFlag: false,
      timeSlotList: [],
      toDate: [],
      checkLabel: "对比时间段", //对比
      contrastValue: "",
      contrastFlag: "",
    };
  },
  mounted() {
    this.handleAdd();
    this.getHostList();
    // 初始值调用
    if (this.$route.path == "/business/monitorPanel") {
      this.$emit("setFilterBarParams", this.commonParams);
    } else if (this.$route.path == "/business/globalTopology") {
      this.$emit("setFilterBarParams", this.commonParams);
    }
  },
  computed: {
    applicationCode() {
      return this.$store.getters.applicationCode;
    },
    channel() {
      if (this.channelValue) {
        return [this.channelValue];
      } else {
        return [];
      }
    },
    httpHost() {
      return this.hostValue;
    },
    province() {
      if (this.areaValue == "全部") {
        return [];
      } else {
        return [this.areaValue];
      }
    },
    provinceData() {
      return province;
    },
    defaultParams() {
      const { startTime, endTime, segmentTimeList, timeSlotList } = this;
      if (this.BySegment) {
        return {
          startTime,
          endTime,
          segmentTimeList,
          timeSlotList,
        };
      } else {
        return {
          startTime,
          endTime,
        };
      }
    },

    commonParams() {
      let obj = {};
      obj = Object.assign(obj, this.defaultParams);
      const {
        province,
        timeType,
        visitorType,
        channel,
        httpHost,
        timeValue,
        timeSlot,
        contrastValue,
      } = this;
      if (this.ByArea) {
        obj = Object.assign(obj, { province });
      }
      if (this.ByData) {
        obj = Object.assign(obj, { timeType });
      }
      if (this.ByHost) {
        obj = Object.assign(obj, { httpHost });
      }
      if (this.ByChnnel) {
        obj = Object.assign(obj, { channel });
      }
      if (this.ByVisitor) {
        obj = Object.assign(obj, { visitorType });
      }
      if (this.ByTimeSlot) {
        obj = Object.assign(obj, { timeValue, timeSlot });
      }
      // 对比的时间
      if (this.ByContrast) {
        obj = Object.assign(obj, { contrastValue });
      }
      return obj;
    },
  },
  watch: {
    commonParams: {
      deep: false,
      immediate: false,
      handler(newVal, oldVal) {
        if (JSON.stringify(newVal) !== JSON.stringify(oldVal)) {
          this.$nextTick(() => {
            if (
              this.$route.path != "/business/railwayTrack" &&
              this.$route.path != "/business/monitorPanel" &&
              this.$route.path != "/business/globalTopology"
            ) {
              this.setTopFilterParams(newVal);
              this.commonData = newVal;
            }
          });
        }
      },
    },
    applicationCode: {
      handler(newValue, oldValue) {
        this.hostValue = "all";
        this.getHostList(newValue);
      },
      deep: true,
    },
  },
  methods: {
    changeByDateValue() {
      if (this.startTime == this.endTime) {
        this.timeType = "hour";
      } else {
        //月 2476800000
        let timeDiff = Date.parse(this.endTime) - Date.parse(this.startTime);
        if (timeDiff > 489600000 && timeDiff != 604800000) {
          this.timeType = "week";
        } else {
          this.timeType = "day";
        }
        // 大于三个月按月标准
        if (timeDiff > 7776000000) {
          this.timeType = "month";
        }
      }
    },
    handleRadioEvent() {
      // this.clearEvent();
    },
    clearEvent() {
      this.checked = false;
      this.contrastFlag = false;
      this.checkLabel = "对比时间段";
      this.contrastValue = "";
    },
    checkTimeSlot(val) {
      switch (val) {
        case true:
          this.checkLabel = "对比";
          this.contrastValue = "";
          break;
        case false:
          this.checkLabel = "对比时间段";
          this.contrastValue = "";
          this.dateFlag = null;
          break;
      }
      this.contrastFlag = val;
    },
    // 对比日期2
    checkContrast(val) {
      this.dateFlag = 2;
      let copyDate = copyObj(this.contrastValue);
      const dateOne =
        Date.parse(this.currentTime[1]) - Date.parse(this.currentTime[0]); // 日期一的时间差值
      const toDate = this.$options.filters.todateFunc(); //当日
      const rangeDate = Date.parse(toDate) - Date.parse(this.contrastValue[0]); //日期二的时间差值

      if (rangeDate >= dateOne) {
        const dateTwoEndtimeStamp = Date.parse(this.contrastValue[0]) + dateOne;
        let automaticDate =
          this.$options.filters.timeStampFunc(dateTwoEndtimeStamp);
        this.contrastValue[1] = automaticDate;
      } else {
        // 没有这个范围进行逆向取值
        const reverseDate = Date.parse(this.contrastValue[0]) - dateOne;
        let automaticDate = this.$options.filters.timeStampFunc(reverseDate);
        this.contrastValue[0] = automaticDate;
        this.contrastValue[1] = copyDate[1];
      }
      console.log(this.contrastValue, "contrastValue----");
    },
    // 增加时间段传值
    segmentTimeEvent(val) {
      switch (val) {
        case "Day":
          this.segmentTimeList = this.$options.filters.formatToday();
          this.toDate = ["今日", "昨日"];
          break;
        case "Week":
          let weekList = this.$options.filters.formatWeek();
          this.segmentTimeList = weekList;
          this.toDate = ["本周", "上周"];
          break;
        case "Month":
          let monthList = this.$options.filters.formatMonth();
          this.segmentTimeList = monthList;
          this.toDate = ["本月", "上月"];
          break;
      }
      this.checkMonth = "";
      this.checkDay = "";
      this.timeSlotList = [];
      // this.$store.dispatch("tracking/setDate", val);
    },
    checkByDay(val) {
      this.segmentTime = "";
      this.checkMonth = "";
      let yesterDay = this.$options.filters.getYesterday(val);
      this.timeSlotList = [val, val, yesterDay, yesterDay];
      this.segmentTimeList = [];
      this.toDate = [val, yesterDay];
    },
    checkByMonth(val) {
      this.segmentTime = "";
      this.checkDay = "";
      let a = this.$options.filters.getLastDayOfMonth(val);
      let b = this.$options.filters.getLastMonthDate(val);
      let c = this.$options.filters.getLastDayOfMonth(b);
      // this.checkMonth = val;
      this.timeSlotList = [val, a, b, c];
      this.segmentTimeList = [];
      let month1 = val.replace(/-01$/, "");
      let month2 = b.replace(/-01$/, "");
      // this.toDate = [val, b];
      this.toDate = [month1, month2];
    },
    SegmentEvent(val) {
      const { timeSlotList, applicationCode, toDate } = this;
      let params = {
        timeSlotList,
        toDate,
      };
      let obj = {};
      obj = Object.assign(params, this.defaultParams);
      this.setTopFilterParams(obj);
      this.$store.dispatch("tracking/setDate", val);
    },
    handleTimeValue(val) {},
    numberEvent(val) {
      let path = this.$route.path;
      if (path == "/business/railwayTrack") {
        const { httpHost, whoId, applicationCode } = this;
        let params = {
          whoId,
          applicationCode,
        };
        let obj = {};
        obj = Object.assign(params, this.defaultParams);
        this.setTopFilterParams(obj);
      } else if (path == "/business/globalTopology") {
        this.setTopFilterParams(this.commonParams);
      }
    },
    handleChangeProject(val) {
      let params = JSON.parse(JSON.stringify(this.commonParams));
      params.applicationCode = this.applicationCode;
      params.httpHost = val;
    },
    getHostList(val) {
      let params;
      if (val) {
        params = {
          // serverName: this.applicationCode ,
          applicationCode: this.applicationCode,
        };
      } else {
        params = {
          // serverName: this.applicationCode ,
          applicationCode: this.applicationCode,
        };
      }
      getHostApi(params).then((res) => {
        if (res.code == 200) {
          const originalArray = res.data;
          this.hostData = originalArray.map((item) => {
            return { ["label"]: item, ["value"]: item };
          });
          // if (originalArray.length > 1) {
          if (originalArray) {
            let params = [
              {
                label: "全部",
                value: "all",
              },
            ];
            this.hostData = [...params, ...this.hostData];
          }
          this.$store.dispatch("tracking/setHost", this.hostData.length);
        }
      });
    },
    btnShowEvent(val) {
      this.popflag = true;
    },
    canclePopEvent() {
      this.popflag = false;
    },

    sliceTypeFile(res) {
      let fileName = res.headers["content-disposition"] || "";
      let index1 = fileName.indexOf("filename=");
      let result = fileName.substring(index1);
      result = decodeURIComponent(decodeURI(result.slice(9)));
      return result;
    },
    setTopFilterParams(val) {
      this.$emit("setFilterBarParams", val);
    },
    // 切换省份
    handleCheckProvince(e) {
      this.areaValue = e.provinceName;
    },

    checkDateEvnet(val) {
      this.clearEvent();
      this.timeFlag = "";
      this.startTime = val[0];
      this.endTime = val[1];
      let endTime = new Date(val[1]).getTime();
      let startTime = new Date(val[0]).getTime();
      let toDay =
        new Date(new Date().toLocaleDateString()).getTime() + 8 * 3600 * 1000;
      let timeStamp = endTime - startTime;
      if (timeStamp == 518400000) {
        this.dateList = "week";
      } else if (timeStamp == 2505600000) {
        this.dateList = "month";
      } else if (timeStamp == 86400000) {
        this.dateList = "previous";
      } else if (!timeStamp && startTime == toDay && endTime == toDay) {
        this.dateList = "day";
      } else {
        this.dateList = "";
      }
      let result = (endTime - startTime) / (3600 * 24 * 1000);
      this.dateTimeCount(result);
      this.changeByDateValue();
    },
    // 日期计算
    dateTimeCount(result) {
      if (6 <= result < 29) {
        this.weekFlag = false;
        this.dayFlag = false;
        this.monthFlag = true;
        switch (this.timeType) {
          case "month":
            this.timeType = "week";
            break;

          default:
            break;
        }
      }
      if (result >= 29) {
        this.monthFlag = false;
        this.weekFlag = false;
        this.dayFlag = false;
      }
      if (result < 6) {
        this.dayFlag = false;
        this.monthFlag = true;
        this.weekFlag = true;
        switch (this.timeType) {
          case "month":
          case "week":
            this.timeType = "day";
            break;

          default:
            break;
        }
      }
    },
    // 日期初始值
    initDate(val) {
      let startTime = val[0].split("-").join("");
      let endTime = val[1].split("-").join("");
      this.startTime = val[0];
      this.endTime = val[1];
      let result = endTime - startTime;
      this.dateTimeCount(result);
    },
    // 默认初始日期
    handleAdd() {
      var date = new Date();
      let dateTime =
        date.getFullYear() +
        "-" +
        (date.getMonth() + 1 < 10
          ? "0" + (date.getMonth() + 1)
          : date.getMonth() + 1) +
        "-" +
        // date.getDate();
        (date.getDate() < 10 ? "0" + date.getDate() : date.getDate());
      this.currentTime = [dateTime, dateTime];
      this.timeSlot = dateTime;
      this.initDate(this.currentTime); //默认日期
    },

    // 单选切换时间
    handleChange(val) {
      this.clearEvent();
      var date = new Date();
      let dateTime =
        date.getFullYear() +
        "-" +
        (date.getMonth() + 1 < 10
          ? "0" + (date.getMonth() + 1)
          : date.getMonth() + 1) +
        "-" +
        // date.getDate();
        (date.getDate() < 10 ? "0" + date.getDate() : date.getDate());
      let toData =
        new Date(new Date().toLocaleDateString()).getTime() + 8 * 3600 * 1000;
      if (val == "day") {
        this.currentTime = [dateTime, dateTime];
        this.dateTimeCount(1);
        this.timeType = "hour";
      } else if (val == "previous") {
        this.timeDifference = toData - 3600 * 24 * 1000;
        this.timestampToTime(this.timeDifference);
        this.currentTime = [this.checkDateTime, this.checkDateTime];
        this.dateTimeCount(1);
        this.timeType = "hour";
      } else if (val == "week") {
        this.timeDifference = toData - 6 * 3600 * 24 * 1000;
        this.timestampToTime(this.timeDifference);
        this.currentTime = [this.checkDateTime, dateTime];
        this.dateTimeCount(6);
        this.timeType = "day";
      } else {
        this.timeDifference = toData - 29 * 3600 * 24 * 1000;
        this.timestampToTime(this.timeDifference);
        this.currentTime = [this.checkDateTime, dateTime];
        this.timeType = "week";
        this.dateTimeCount(29);
      }
      this.startTime = this.currentTime[0];
      this.endTime = this.currentTime[1];
      this.$store.dispatch("tracking/setDate", val);
      this.changeByDateValue();
    },
    // 时间戳转换器
    timestampToTime(timestamp) {
      var date = new Date(timestamp);
      var Y = date.getFullYear() + "-";
      var M =
        (date.getMonth() + 1 < 10
          ? "0" + (date.getMonth() + 1)
          : date.getMonth() + 1) + "-";
      var D =
        (date.getDate() < 10 ? "0" + date.getDate() : date.getDate()) + "";
      this.checkDateTime = Y + M + D;
    },

    handleCheckAllChange(val) {
      this.channelList = val ? this.allChaneList : [];
      this.isIndeterminate = false;
    },
    handleCheckedCitiesChange(value) {
      const checkedCount = value.length;
      if (checkedCount === this.allChaneList.length) {
        this.checkAll = false;
      } else {
        this.checkAll = false;
      }
      this.isIndeterminate =
        checkedCount > 0 && checkedCount < this.channelList.length;
    },
  },
};
</script>
<style lang="scss" scoped>
::v-deep {
  // .el-checkbox {
  //   margin-right: 0 !important;
  //   // min-width: 20px !important;

  // }
  .el-input--medium .el-input__inner {
    height: 30px !important;
    line-height: 30px !important;
  }

  .el-date-editor {
    .el-range-separator {
      display: flex;
      align-items: center;
    }
  }
  .el-date-editor {
    .el-range__icon {
      display: flex;
      align-items: center;
    }
  }
  .el-date-editor {
    .el-range__close-icon {
      display: flex;
      align-items: center;
    }
  }

  @import "~@/styles/components/custom-radio.scss";
  @import "~@/styles/components/custom-select.scss";
  .appli_select .el-input__inner {
    border-radius: 0px;
    border-top-width: 0px;
    border-left-width: 0px;
    border-right-width: 0px;
    border-bottom-width: 1px;
    border-bottom: 1px solid #acb2ba;
    background-color: transparent;
    font-size: 14px;
    transform: scale(0.9);
    height: 30px;
    line-height: 30px;
    border-bottom-width: 0;
    padding-left: 5px;
  }

  // 日历样式start
  .el-range-editor--medium .el-range-input {
    font-size: 13px;
  }
  .el-date-editor .el-range__icon {
    font-size: 13px;
    line-height: 25px;
  }
  .el-range-editor--medium .el-range-separator {
    font-size: 13px;
    line-height: 25px;
  }
}
.numIdButton {
  width: 67px;
  height: 30px;
  margin-left: 20px;
  background: #2c7be5;
  border-radius: 4px;
  font-size: 13px;
  font-weight: 400;
  line-height: 14px;
  color: #ffffff;
  line-height: 30px;
  text-align: center;
  cursor: pointer;
}
.popCancle:hover {
  border: 1px solid #727171;
  border-radius: 4px;
}
.popCancle {
  position: absolute;
  right: 0;
  top: 0;
  cursor: pointer;
  width: 20px;
  height: 20px;
  border-radius: 4px;
  border: 1px #d8e2ef solid;
  line-height: 20px;
  text-align: center;
}
.documentation-container {
  box-sizing: border-box;
  min-height: 66px;
  padding-bottom: 20px;
  width: 100%;
  .checkContent {
    position: fixed;
    width: 100%;
    align-items: center;
    min-height: 66px;
    z-index: 500;
    background-color: #fff;
    border-bottom: 1px #eee solid;
    .areaContent {
      height: 30px;
      margin-left: 15px;
      .area_select {
        position: relative;
        .iconArrow {
          position: absolute;
          font-size: 13px;
          top: 3px;
          right: 5px;
          transform: translate(0, 50%);
        }
      }
      .areaItem {
        display: flex;
        align-items: center;
        .areaHead {
          width: 40px;
          height: 28px;
          line-height: 30px;
          text-align: center;
          font-size: 13px;
          font-weight: 400;
          color: #4d4d4d;
          border-top-left-radius: 5px;
          border-bottom-left-radius: 5px;
        }

        .areaBox {
          position: relative;
          height: 28px !important;
          line-height: 30px;
          font-size: 12px;
          font-weight: 400;
          border: 1px solid #d8e2ef;
          border-left: 0px;
          border-top-right-radius: 5px;
          border-bottom-right-radius: 5px;
          padding: 0 8px;
          padding-right: 20px;
          box-sizing: border-box;
          cursor: pointer;
        }
      }
    }
    .check_item {
      background-color: #ffffff;
      margin-left: 20px;
      height: 30px;
      border-radius: 4px;
      display: flex;
      align-items: center;
      span {
        font-size: 13px;
        font-weight: 400;
        line-height: 13px;
        color: #4d4d4d;
        padding: 0 10px;
      }
      .checkBoxStyle {
        padding-right: 10px;
      }
    }
    .btnEvent {
      cursor: pointer;
      width: 65px;
      height: 28px;
      color: #194580;
      font-weight: 600px;
      border: 1px solid #d8e2ef;
      border-radius: 4px;
      font-size: 12px;
      line-height: 28px;
      text-align: center;
    }
    .SetSpace {
      margin-right: 9px;
    }
    .channelSecond {
      width: 100%;
      display: flex;
      padding: 0px 0 18px 0;
      align-items: center;
      position: relative;
    }
  }
}
</style>
