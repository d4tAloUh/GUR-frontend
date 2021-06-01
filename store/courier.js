export const state = () => ({
  order: null,
})

export const mutations = {
  set_order(state, order) {
    state.order = order
  },
}

export const getters = {
  order_id: (state) => {
    return state.order.order_id
  },
}

export const actions = {
  do_set_order_id({commit}, order) {
    commit('set_order', order)
  },
}
