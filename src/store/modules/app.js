import Cookies from 'js-cookie'

const state = {
  sidebar: {
    // opened: Cookies.get('sidebarStatus') ? !!+Cookies.get('sidebarStatus') : true,
    opened: true,
    withoutAnimation: false,
  },
  device: 'desktop',
  size: Cookies.get('size') || 'medium',
  indexCanClick: true,
}

const mutations = {
  TOGGLE_SIDEBAR: (state,openState) => {
    // state.sidebar.opened = !state.sidebar.opened
    // console.log(openState,"openState---");
    state.sidebar.opened = openState;
    state.sidebar.withoutAnimation = false
    if (state.sidebar.opened) {
      Cookies.set('sidebarStatus', 1)
    } else {
      Cookies.set('sidebarStatus', 0)
    }
  },
  CLOSE_SIDEBAR: (state, withoutAnimation) => {
    Cookies.set('sidebarStatus', 0)
    state.sidebar.opened = false; 
    state.sidebar.withoutAnimation = false;
  },
  TOGGLE_DEVICE: (state, device) => {
    state.device = device
  },
  SET_SIZE: (state, size) => {
    state.size = size
    Cookies.set('size', size)
  },
  SET_INDEX_CAN_CLICK: (state, indexCanClick) => {
    state.indexCanClick = indexCanClick
  }
}

const actions = {
  toggleSideBar({ commit },openState) {
    commit('TOGGLE_SIDEBAR',openState)
  },
  closeSideBar({ commit }, { withoutAnimation }) {
    commit('CLOSE_SIDEBAR', withoutAnimation)
  },
  toggleDevice({ commit }, device) {
    commit('TOGGLE_DEVICE', device)
  },
  setSize({ commit }, size) {
    commit('SET_SIZE', size)
  },
  setIndexCanClick({ commit }, indexCanClick) {
    commit('SET_INDEX_CAN_CLICK', indexCanClick)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
