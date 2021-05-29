import cookieparser from 'cookieparser'


export const actions = {
  async nuxtServerInit({dispatch, commit, state}, {req}) {
    let refresh_token = null
    let rest_id = null
    let order_id = null
    let user = null
    let cart = []
    let location = []
    let address = null

    if (req && req.headers && req.headers.cookie) {
      const parsed = cookieparser.parse(req.headers.cookie)
      cart = (parsed.cart !== "undefined") && (parsed.cart !== undefined) && (parsed.cart) && JSON.parse(parsed.cart) || []
      user = (parsed.user) && JSON.parse(parsed.user) || null
      rest_id = (parsed.rest_id) || null
      order_id = (parsed.order_id) || null
      refresh_token = (parsed.refresh_token) || null
      location = (parsed.location) && JSON.parse(parsed.location) || []
      address = (parsed.address) || null
    }

    commit('cart/setItems', cart)
    commit('cart/setOrder', Number(order_id))
    commit('cart/setRestId', Number(rest_id))
    commit('authorization/set_user', user)
    commit('authorization/set_payload', {refresh_token})
    commit('order/setAddress', address)
    commit('order/setLocation', location)

    if (refresh_token && refresh_token !== "null") {
      try {
        await dispatch('authorization/refresh')
      } catch (e) {
        if (e.status) {
          await dispatch('authorization/logout')
          await dispatch('order/clear')
        }
      }
    }
  }
}
