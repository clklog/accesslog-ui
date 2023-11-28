<template>
  <div>
    <div v-if="byFlowView || byChannel">
      <div class="bid-list-header">
        <!-- <div class="header-name w156" v-if="!byChannel"  style="width:200px;"></div> -->

        <div class="header-name w156">
          访问量(PV)
          <!-- <div class="parentPosition">
            <el-popover
              placement="bottom-start"
              width="200"
              trigger="hover"
              class="popImg"
            >
              <div style="padding: 5px; font-size: 12px">
                选定时间段内用户访问应用的页面总次数。
                <div class="setFontTop">
                  用户每打开一个页面被记录一次，同一页面打开多次浏览量值累计计算。
                </div>
              </div>
              <img
                slot="reference"
                class="icon-question"
                src="@/assets/images/question.png"
                alt=""
              />
            </el-popover>
          </div> -->
        </div>

        <div class="header-name w156">
          用户数(UV)
          <!-- <div class="parentPosition">
            <el-popover
              placement="bottom-start"
              width="200"
              trigger="hover"
              class="popImg"
            >
              <div style="padding: 5px; font-size: 12px">
                选定时间段内访问应用的独立访客数。
                <div class="setFontTop">
                  访客数以Cookie或设备ID为依据，选定时间段内同一访客多次访问应用只计算为一个访客。
                </div>
              </div>
              <img
                slot="reference"
                class="icon-question"
                src="@/assets/images/question.png"
                alt=""
              />
            </el-popover>
          </div> -->
        </div>
        <div class="header-name w156">
          IP数
          <!-- <div class="parentPosition">
            <el-popover
              placement="bottom-start"
              width="200"
              trigger="hover"
              class="popImg"
            >
              <div style="padding: 5px; font-size: 12px">
                选定时间段内访问应用的独立访客数。
                <div class="setFontTop">
                  访客数以Cookie或设备ID为依据，选定时间段内同一访客多次访问应用只计算为一个访客。
                </div>
              </div>
              <img
                slot="reference"
                class="icon-question"
                src="@/assets/images/question.png"
                alt=""
              />
            </el-popover>
          </div> -->
        </div>

        <div class="header-name w156">
          平均响应时间
          <!-- <div class="parentPosition">
            <el-popover
              placement="bottom-start"
              width="200"
              trigger="hover"
              class="popImg"
            >
              <div style="padding: 5px; font-size: 12px">
                平均访问时长 = 访问总时长 / 访问次数 。
                <div class="setFontTop">
                  访客每次访问的总时长为打开第一个页面到退出或关闭最后一个页面的总时长。
                </div>
              </div>
              <img
                slot="reference"
                class="icon-question"
                src="@/assets/images/question.png"
                alt=""
              />
            </el-popover>
          </div> -->
        </div>

        <!-- <div class="header-name w156">
          流入流量
          <div class="parentPosition">
            <el-popover
              placement="bottom-start"
              width="200"
              trigger="hover"
              class="popImg"
            >
              <div style="padding: 5px; font-size: 12px">
                只浏览一个页面的访问次数占总访问次数的百分比。
              </div>
              <img
                slot="reference"
                class="icon-question"
                src="@/assets/images/question.png"
                alt=""
              />
            </el-popover>
          </div>
        </div> -->

        <div class="header-name w156">
          流出流量
          <!-- <div class="parentPosition">
            <el-popover
              placement="bottom-start"
              width="200"
              trigger="hover"
              class="popImg"
            >
              <div style="padding: 5px; font-size: 12px">
                只浏览一个页面就离开或关闭应用的访问次数占总访问次数的百分比。
              </div>
              <img
                slot="reference"
                class="icon-question"
                src="@/assets/images/question.png"
                alt=""
              />
            </el-popover>
          </div> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { percentage, averageRules } from "@/utils/percent";
import { formatTime } from "@/utils/format";
export default {
  name: "originName",
  props: {
    byChannel: {
      type: Boolean,
      default: false,
    },
    byFlowView: {
      type: Boolean,
      default: false,
    },
    byAreaAnaly: {
      type: Boolean,
      default: false,
    },
    byVisit: {
      type: Boolean,
      default: false,
    },
    byVisitedPage: {
      type: Boolean,
      default: false,
    },
    byLogAnalysis: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      originData: null,
    };
  },
  methods: {
    averageRulesEvent(num) {
      return averageRules(num);
    },
    formatTimeFun(val) {
      val = Math.floor(val);
      return formatTime(val);
    },
    originEvent(val) {
      this.originData = val;
    },
    percentageFun(val) {
      return percentage(val);
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep.setFontTop {
  margin-top: 5px;
}
.parentPosition {
  position: relative;
  .popImg {
    position: absolute;
    left: 0;
    transform: translate(0, -50%); //左右上下
  }
}

.bid-list-header {
  padding-bottom: 10px;
  // padding-top: 15px;
  display: flex;
  .header-name {
    width: 26%;
    justify-content: center;
    height: 30px;
    display: flex;
    align-items: center;
  }

  .w156 {
    font-size: 15px;
    font-weight: 400;
    line-height: 16px;
    color: #4d4d4d;
  }
  img {
    width: 11.44px;
    height: 11.44px;
    margin-left: 12px;
    cursor: pointer;
  }
}
.bid-list-record {
  display: flex;
  .bid-list-item {
    width: 14%;
    justify-content: center;
    height: 30px;
    display: flex;
    align-items: center;
  }
  .w157 {
    font-size: 12px;
    font-weight: 400;
    line-height: 14px;
    color: #4d4d4d;
  }
  .w158 {
    font-size: 16px;
    font-weight: bold;
    color: #2c7be5;
    line-height: 17px;
  }
}
</style>
