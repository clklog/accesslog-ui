const state = {
  // projectName: '货清清'
  projectName: 'hqq',
  httpHost:'',
  checkDate:'month',
}

const mutations = {
  SET_PROJECT: (state, projectName) => {
    state.projectName = projectName
  },
  SET_HOST: (state, httpHost) => {
    state.httpHost = httpHost
  },
  SET_DATE: (state, checkDate) => {
    state.checkDate = checkDate
  }
}

const actions = {
  setProject({ commit }, projectName) {
    commit('SET_PROJECT', projectName)
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
