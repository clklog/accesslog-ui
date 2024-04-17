<template>
  <div class="navbar">
    <div class="burying_point">
      <div style="display: flex; align-items: center">
        <div class="logoFlag" v-if="showFlag">
          <img class="logo_head" src="@/assets/images/accessLog.jpg" />
        </div>
        <div v-if="applicationFlag">
          <el-select
            v-model="serveValue"
            placeholder="请选择"
            class="custom_select"
            @change="handleChangeProject"
          >
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </div>
      </div>

      <div class="right-menu" v-if="showFlag">
        <div class="dataTime">{{ dateTime }}&nbsp;&nbsp;{{ dateWeek }}</div>
        <img
          src="@/assets/images/avator.png"
          class="user-avatar"
          @click="clickImg"
        />
        <el-dropdown
          class="avatar-container right-menu-item hover-effect"
          trigger="click"
        >
          <div class="avatar-wrapper">
            <i class="el-icon-caret-bottom" />
          </div>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item @click.native="logout">
              <span style="display: block">退出</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import ErrorLog from "@/components/ErrorLog";
import Screenfull from "@/components/Screenfull";
import SizeSelect from "@/components/SizeSelect";
import Search from "@/components/HeaderSearch";
import { getServerApi } from "@/api/trackingapi/accessLog";
import Hamburger from "@/components/Hamburger";
export default {
  components: {
    ErrorLog,
    Screenfull,
    SizeSelect,
    Search,
    Hamburger,
  },
  data() {
    return {
      applicationFlag: true,
      options: [],
      serveValue: null,
      dateTime: "",
      dateWeek: "",
      showFlag: true,
      navbarFlag: false,
    };
  },
  created() {
    this.initDate();
    const _this = this;
    document.addEventListener("visibilitychange", function () {
      if (!document.hidden) {
        _this.initDate();
      }
    });
    this.getServer();
  },

  mounted() {
    this.initHost(this.$route.path);
    this.showFlag = true;
    this.$store.dispatch("app/toggleSideBar", true);
  },
  computed: {
    ...mapGetters(["sidebar", "avatar", "device", "applicationCode "]),
    routeForm() {
      return this.$route.path;
    },
    pagePath() {
      return this.$route.path;
    },
  },
  watch: {
    routeForm(val) {
      this.initHost(val);
    },
  },
  methods: {
    initHost(val) {
      if (
        val == "/business/railwayTrack" ||
        val == "/business/monitorPanel" ||
        val == "/business/globalTopology"
      ) {
        this.applicationFlag = false;
      } else {
        this.applicationFlag = true;
      }
    },
    getServer() {
      getServerApi(this.commonParams).then((res) => {
        if (res.code == 200) {
          const originalArray = res.data;
          this.options = originalArray.map((item) => {
            return { ["label"]: "应用名称：" + item, ["value"]: item };
          });
          if (this.options.length > 0) {
            this.serveValue = this.options[0].value;
          }
          localStorage.setItem("applicationCode", JSON.stringify(this.serveValue));
          this.handleChangeProject(this.serveValue);
        }
      });
    },
    handleChangeProject(val) {
      this.$store.dispatch("tracking/setProject", val);
    },
    initDate() {
      const date = new Date();
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();
      const weekMap = [
        "星期日",
        "星期一",
        "星期二",
        "星期三",
        "星期四",
        "星期五",
        "星期六",
      ];
      this.dateWeek = weekMap[date.getDay()];
      this.dateTime = year + "年" + month + "月" + day + "日";
    },
    toggleSideBar() {
      this.$store.dispatch("app/toggleSideBar", false);
    },
    async logout() {
      await this.$store.dispatch("user/logout");
      this.$router.push(`/login?redirect=${this.$route.fullPath}`);
    },
    clickImg() {},
  },
};
</script>

<style lang="scss" scoped>
.navbar {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  height: 50px;
  overflow: hidden;
  width: 100%;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  z-index: 1002;
  .burying_point {
    display: flex;
    justify-content: space-between;
    height: 50px;
    margin-left: 20px;
    .custom_select {
      width: 180px;
      ::v-deep {
        .el-select .el-input.is-focus .el-input__inner {
          background-color: #fff !important;
        }
        .el-select:hover .el-input__inner {
          border-color: #fff;
        }
        .el-select .el-input.is-focus .el-input__inner {
          border-color: #fff;
        }
        .el-select .el-input__inner:focus {
          border-color: #fff;
        }
        .el-input__inner {
          border: none;
        }
      }
    }
    .logoFlag {
      margin-right: 70px;
      font-size: 15px;
      font-weight: bold;
      line-height: 17px;
      color: #4d4d4d;
      padding-top: 2px;
      display: flex;
       .logo_head {
        height: 44px;
        width: 150px;
        object-fit: contain;
      }
    }
  }
  .breadcrumb-container {
    float: left;
  }

  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }

  .right-menu {
    display: flex;
    align-items: center;
    height: 100%;
    line-height: 50px;
    margin-right: 7px;
    .dataTime {
      font-size: 13px;
      font-weight: 400;
      line-height: 14px;
      color: #656d92;
      margin-right: 29px;
    }
    .user-avatar {
      cursor: pointer;
      width: 40px;
      height: 40px;
      border-radius: 10px;
    }
    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        left: 2px;
        top: -9px;
        position: relative;

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
