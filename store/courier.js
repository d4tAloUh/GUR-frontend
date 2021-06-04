export const state = () => ({
  order: null,
  courier_working: false,
})

export const mutations = {
  set_order(state, order) {
    state.order = order
  },
  set_courier_working(state, working) {
    state.courier_working = working
  },
}

export const getters = {
  order_id: (state) => {
    return state.order.order_id
  },
  order_exists: (state) => {
    return !!state.order
  },
  courier_working: (state) => {
    return state.courier_working
  },
}

export const actions = {
  do_set_order({commit}, order) {
    commit('set_order', order)
  },
  do_set_courier_working({commit}, working) {
    commit('set_courier_working', working)
  },
}
