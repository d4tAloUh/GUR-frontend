import Cookies from 'js-cookie'

export const state = () => ({
  deleted_rest_id: 0,
})

export const mutations = {
  set_deleted_rest_id(state, rest_id) {
    state.deleted_rest_id = rest_id
  },
}
export const getters = {
  deleted_rest_id: (state) => {
    return state.deleted_rest_id
  },
}
export const actions = {
  do_set_deleted_rest_id({commit}, rest_id) {
    commit('set_deleted_rest_id', rest_id)
  },
}
