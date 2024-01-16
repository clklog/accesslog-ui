const state = {
  // applicationCode : '货清清'
  applicationCode : 'cnb.mgt',
  httpHost:'',
  checkDate:'Day',
  // checkDate:{
  //   current:'今日',
  //   last:'昨日',
  // },
}

const mutations = {
  SET_PROJECT: (state, applicationCode ) => {
    state.applicationCode  = applicationCode 
  },
  SET_HOST: (state, httpHost) => {
    state.httpHost = httpHost
  },
  SET_DATE: (state, checkDate) => {
    state.checkDate = checkDate
  }
}

const actions = {
  setProject({ commit }, applicationCode ) {
    commit('SET_PROJECT', applicationCode )
  },
  setHost({ commit }, httpHost) {
    commit('SET_HOST', httpHost)
  },
  setDate({ commit }, checkDate) {
    commit('SET_DATE', checkDate)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
