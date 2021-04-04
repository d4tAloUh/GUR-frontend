import Cookies from 'js-cookie'

export const state = () => ({
  items: [],
  order_id: 0,
  rest_id: 0,
})

export const mutations = {
  setItems(state, items) {
    state.items = items
    Cookies.set('cart', state.items)
  },
  setOrder(state, order) {
    state.order_id = order
    Cookies.set('order_id', state.order_id)
  },
  setRestId(state, rest_id) {
    if (state.items.length !== 0)
      state.rest_id = rest_id
    else
      state.rest_id = 0
    Cookies.set('rest_id', state.rest_id)
  },
  increaseQuantity(state, record) {
    record.quantity++
    Cookies.set('cart', state.items)
  },
  addNotExistingItem(state, item) {
    state.items.push({
      quantity: 1,
      ...item
    })
    Cookies.set('cart', state.items)
  },
  reduceQuantity(state, record) {
    record.quantity--
    Cookies.set('cart', state.items)
  },

  delete(state, item) {
    const index = state.items.findIndex(i => i.dish_id === item.dish_id)
    state.items.splice(index, 1)
    Cookies.set('cart', state.items)
  },
  emptyList(state) {
    state.items = []
    state.rest_id = 0
    Cookies.set('cart', state.items)
    Cookies.set('rest_id', state.rest_id)
  }
}

export const actions = {
  async syncWithServer({commit, state}) {
    if (state.order_id === 0) {
      await this.$axios.$get('/orders',)
        .then(res => {
          commit('setOrder', res.order.order_id)
          if (res.dishes !== undefined && res.dishes.length !== 0) {
            commit('setItems', res.dishes)
            commit('setRestId', res.dishes[0].restaurant_id)
          } else
            commit('setItems', [])

        })
        .catch(err => {
          if (!err.status)
            console.error(err)
          else
            console.error(err.response)
        })
    }
  },
  async addItem({commit, state, dispatch}, item) {
    if (item.restaurant_id !== state.rest_id && Number(state.rest_id) !== 0)
      return Promise.reject("Adding dish from other restaurant")
    await dispatch('syncWithServer')

    const record = state.items.find(i => i.dish_id === item.dish_id)
    // This item exists in items
    if (!record) {
      this.$axios.$post('/order-dishes/' + state.order_id + '/' + item.dish_id, {
        'order_id': state.order_id,
        'dish_id': item.dish_id,
        'quantity': 1
      }).then(response => {
        commit('addNotExistingItem', item)
        if (Number(state.rest_id) === 0 || typeof state.rest_id === 'undefined')
          commit('setRestId', item.restaurant_id)
      }).catch(err => {
        // commit('delete', item)
        console.error(err.response)
      })
    } else {
      //Add this item to order
      this.$axios.$put('/order-dishes/' + state.order_id + '/' + item.dish_id, {
        'order_id': state.order_id,
        'dish_id': item.dish_id,
        'quantity': record.quantity
      }).then(response => {
        commit('increaseQuantity', record)
        if (Number(state.rest_id) === 0 || typeof state.rest_id === 'undefined')
          commit('setRestId', item.restaurant_id)
      })
        .catch(err => {
          // commit('reduceQuantity', record)
          console.error(err.response)
        })
    }

  },
  async removeItem({commit, state, dispatch}, item) {
    const record = state.items.find(i => i.dish_id === item.dish_id)
    if (record.quantity > 1) {
      this.$axios.$put('/order-dishes/' + state.order_id + '/' + item.dish_id, {
        'order_id': state.order_id,
        'dish_id': item.dish_id,
        'quantity': record.quantity
      }).then(response => {
        commit('reduceQuantity', record)
      })
        .catch(err => {
          // commit('increaseQuantity', record)
          console.error(err.response)
        })
    } else {
      await dispatch('deleteItem', item)
    }
  },
  async deleteItem({commit, state, dispatch}, item) {

    this.$axios.$delete('/order-dishes/' + state.order_id + '/' + item.dish_id)
      .then(response => {
      commit('delete', item)
    })
      .catch(err => {
        // commit('addNotExistingItem', item)
        console.error(err.response)
      })
  },
  async emptyCart({commit, state}) {
    this.$axios.$delete('/order-dishes/clear/' + state.order_id)
      .then(response => {
        commit('emptyList')
      })
      .catch(err => {
        console.error(err.response)
      })
  },
  async finishOrder({commit, state}) {
    commit('emptyList')
  },
  async setRest({commit}, rest) {
    commit('setRestId', rest)
  },
  async setOrder({commit}, order) {
    commit('setOrder', order)
  },
}

export const getters = {
  items: state => {
    return state.items
  },
  price: state => {
    return state.items.reduce(
      (accumulator, item) => accumulator + item.price * item.quantity,
      0
    )
  },
  numberOfItems: state => {
    return state.items.reduce(
      (accumulator, item) => accumulator + item.quantity,
      0
    )
  },
  rest_id: state => {
    return state.rest_id
  },
  order_id: state => {
    return state.order_id
  },
}
