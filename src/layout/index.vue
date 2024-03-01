<template>
  <div :class="classObj" class="app-wrapper">
    <div
      v-if="device === 'mobile' && sidebar.opened"
      class="drawer-bg"
      @click="handleClickOutside"
    />
    <template v-if="showFlag">
      <sidebar class="sidebar-container" style="top: 50px" />
      <div class="main-container" style="top: 50px">
        <navbar />
        <app-main />
        <right-panel v-if="showSettings">
          <settings />
        </right-panel>
      </div>
    </template>

    <!-- demo -->
    <template v-if="!showFlag">
      <sidebar
        class="sidebar-container"
        :style="navbarFlag ? 'top:50px;' : ''"
      />
      <div class="main-container" :style="navbarFlag ? 'top:50px;' : ''">
        <navbar v-if="navbarFlag" />
        <app-main />
        <right-panel v-if="showSettings">
          <settings />
        </right-panel>
      </div>
    </template>

    <!-- 浮动logo -->
    <div class="logoConItem" v-if="showFlag">
      <div class="logoName">POWERED BY</div>
      <div>ZCUNSOFT</div>
    </div>
  </div>
</template>

<script>
import RightPanel from "@/components/RightPanel";
import { AppMain, Navbar, Settings, Sidebar, TagsView } from "./components";
import ResizeMixin from "./mixin/ResizeHandler";
import { mapState } from "vuex";

export default {
  name: "Layout",
  data() {
    return {
      showFlag: false,
      navbarFlag: true,
    };
  },
  components: {
    AppMain,
    Navbar,
    RightPanel,
    Settings,
    Sidebar,
    TagsView,
  },
  created() {
    this.initNavBar();
  },

  mounted() {},
  mixins: [ResizeMixin],
  computed: {
    ...mapState({
      sidebar: (state) => state.app.sidebar,
      device: (state) => state.app.device,
      showSettings: (state) => state.settings.showSettings,
      needTagsView: (state) => state.settings.tagsView,
      fixedHeader: (state) => state.settings.fixedHeader,
    }),
    pagePath() {
      return this.$route.path;
    },
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === "mobile",
      };
    },
  },
  watch: {
    pagePath: {
      handler(newValue, oldValue) {
        this.initNavBar(newValue);
      },
      deep: true,
    },
  },
  methods: {
    initNavBar(val) {
      val = this.$route.path;
      if (
        val != "/business/railwayTrack" &&
        val != "/business/monitorPanel" &&
        val != "/business/globalTopology"
      ) {
        this.navbarFlag = true;
      } else {
        this.navbarFlag = false;
      }
    },
    handleClickOutside() {
      this.$store.dispatch("app/closeSideBar", { withoutAnimation: false });
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";
@import "~@/styles/variables.scss";
.logoConItem {
  position: fixed;
  left: 16px;
  bottom: 5px;
  display: flex;
  z-index: 2000;
  .logoImg {
    height: 16px;
    object-fit: cover;
  }
  .logoName {
    padding-right: 5px;
    font-size: 12px;
    color: #909399;
    line-height: 22px;
  }
}
.app-wrapper {
  @include clearfix;
  position: relative;
  height: 100%;
  width: 100%;

  &.mobile.openSidebar {
    position: fixed;
    top: 0;
  }
}

.drawer-bg {
  background: #000;
  opacity: 0.3;
  width: 100%;
  top: 0;
  height: 100%;
  position: absolute;
  z-index: 999;
}

.fixed-header {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 9;
  width: calc(100% - #{$sideBarWidth});
  transition: width 0.28s;
}

.hideSidebar .fixed-header {
  width: calc(100% - 54px);
}

.mobile .fixed-header {
  width: 100%;
}
</style>
