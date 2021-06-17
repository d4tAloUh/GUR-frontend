import Cookies from 'js-cookie'

export const state = () => ({
  order: null,
  courier_working: false,
  location: {
    latitude: 50.460569,
    longitude: 30.591311
  }
})

export const mutations = {
  set_order(state, order) {
    state.order = order
  },
  set_courier_working(state, working) {
    state.courier_working = working
    Cookies.set('courier_working', state.courier_working)
  },
  set_courier_location(state, location) {
    state.location = location
  },
  set_courier_longitude(state, longitude) {
    state.location.longitude = longitude
  },
  set_courier_latitude(state, latitude) {
    state.location.latitude = latitude
  },
}

export const getters = {
  order_id: (state) => {
    if (state.order)
      return state.order.order_id
  },
  order_exists: (state) => {
    return !!state.order
  },
  order: (state) => {
    return state.order
  },
  courier_working: (state) => {
    return state.courier_working
  },
  courier_location: (state) => {
    return state.location
  },
}

export const actions = {
  do_set_order({commit}, order) {
    commit('set_order', order)
  },
  do_set_courier_working({commit}, working) {
    commit('set_courier_working', working)
  },
  do_set_courier_location({commit}, location) {
    commit('set_courier_location', location)
  },
  do_set_courier_longitude({commit}, location) {
    commit('set_courier_longitude', location)
  },
  do_set_courier_latitude({commit}, location) {
    commit('set_courier_latitude', location)
  },
}
