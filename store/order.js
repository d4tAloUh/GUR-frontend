import Cookies from 'js-cookie'

export const state = () => ({
  location: [],
  address : null,
  accepted : false
})

export const mutations = {
  setLocation(state, location) {
    state.location = location
    Cookies.set('location', state.location)
  },
  setAddress(state, address) {
    state.address = address
    Cookies.set('address',  state.address)
  },
  clearLocationAndAddress(state){
    state.address = null
    state.location = []
    Cookies.set('address',  null)
    Cookies.set('location', [])
  },
  setAccepted(state, val) {
    state.accepted = val
  }
}
export const actions = {
  async setLoc({commit}, location) {
    commit('setLocation', location)
  },
  async setAddr({commit}, address) {
    commit('setAddress', address)
  },
  async clear({commit}){
    commit('clearLocationAndAddress')
  },
  async setAccepted({commit}, val) {
    commit('setAccepted', val)
  },
}

export const getters = {
  location: state => {
    return state.location
  },
  address: state => {
    return state.address
  },
  accepted: state => {
    return state.accepted
  }
}
