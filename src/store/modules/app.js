import Cookies from 'js-cookie'

const app = {
  state: {
    sidebar: {
      opened: !+Cookies.get('sidebarStatus')
    },
    language: Cookies.get('language') || 'zh',
  },
  mutations: {
    TOGGLE_SIDEBAR: state => {
      //1隐藏菜单栏，0显示菜单栏
      if (state.sidebar.opened) {
        Cookies.set('sidebarStatus', 1)
      } else {
        Cookies.set('sidebarStatus', 1)
      }
      state.sidebar.opened = !state.sidebar.opened
    },
    SET_LANGUAGE: (state, language) => {
      state.language = language
      Cookies.set('language', language)
    },
    SET_APPCONFIGID: (state, appConfigId) => {
      state.appConfigId = appConfigId
    }
  },
  actions: {
    ToggleSideBar: ({ commit }) => {
      commit('TOGGLE_SIDEBAR')
    },
    setLanguage({ commit }, language) {
      commit('SET_LANGUAGE', language)
    },
    setAppConfigId({ commit }, appConfigId) {
      commit('SET_APPCONFIGID', appConfigId)
    }
  }
}

export default app
