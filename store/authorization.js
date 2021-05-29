import Cookies from 'js-cookie'

export const state = () => ({
  access_token: null,
  refresh_token: null,
  user: null,
  retry: false,
})

export const mutations = {
  set_payload(state, {refresh_token, access = null}) {
    if (access) {
      state.access_token = access;
    }
    if (refresh_token && refresh_token !== "null") {
      state.refresh_token = refresh_token;
      Cookies.set('refresh_token', refresh_token)
    }
  },
  logout(state) {
    state.access_token = null
    state.refresh_token = null
    state.user = null
    Cookies.set('refresh_token', null)
    Cookies.set('user', null)
  },
  set_user(state, user) {
    state.user = JSON.parse(JSON.stringify(user))
    Cookies.set('user', state.user)
  },
  retried(state, val) {
    state.retry = val
  },
  set_tel_num(state, tel_num) {
    if (state.user)
      state.user.tel_num = tel_num
    Cookies.set('user', state.user)
  },
  set_user_name(state, name) {
    if (state.user)
      state.user.first_name = name
    Cookies.set('user', state.user)
  }
}
export const getters = {
  isAuthenticated: (state) => {
    return (state.refresh_token !== null) && (state.refresh_token !== 'null')
  },
  isSettedUp: (state) => {
    return (state.user) && state.user.tel_num !== '' && state.user.first_name !== ''
  },
  getUser: state => {
    if (state.user)
      return state.user
  },
  getToken: (state) => {
    return state.refresh_token
  },
  getAccessToken: (state) => {
    return state.access_token
  },
  tried: (state) => {
    return state.retry
  },
  first_name: (state) => {
    if (state.user)
      return state.user.first_name
  },
  tel_num: (state) => {
    if (state.user)
      return state.user.tel_num
  },
  admin: (state) => {
    if (state.user)
      return state.user.admin
  },
  partial_admin: (state) => {
    if (state.user)
      return state.user.partial_admin
  },
}
export const actions = {
  async login({commit, dispatch, reject}, {username, password}) {
    await this.$axios.post(
      '/token',
      {email: username, password}
    ).then(payload => {
      let refresh_token = payload.data.refresh
      let access = payload.data.access
      commit('set_payload', {refresh_token, access})
      commit('retried', false)
    })
  },
  async getUser({commit}) {
    await this.$axios.get(
      '/profile'
    ).then(user => {
      commit('set_user', user.data)
    })

  },
  async refresh({commit, state}) {
    const refresh_token = state.refresh_token
    await this.$axios.post(
      '/token/refresh',
      {'refresh': refresh_token}
    ).then(response => {
      let access = response.data.access
      commit('set_payload', {refresh_token, access})
    })
  },
  retried({commit}) {
    commit('retried')
  },
  async logout({commit}) {
    commit('logout')
  },
  do_set_tel_num({commit}, tel_num) {
    commit('set_tel_num', tel_num)
  },
  do_set_name({commit}, name) {
    commit('set_user_name', name)
  }
}
