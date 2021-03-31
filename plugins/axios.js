// https://nuxtjs.org/api/context/
export default function ({store, $axios, redirect}) {
  const IGNORED_PATHS = ['/token', '/maps']

  $axios.onRequest((config) => {
    if (config.url.includes('/maps.google'))
      return config
    // check if the user is authenticated
    if (store.getters['authorization/getToken']) {
      config.headers.Authorization = 'Bearer ' + store.state.authorization.access_token
    }
    return config
  })

  $axios.onError((error) => {
    return new Promise(async (resolve, reject) => {
      const isIgnored = IGNORED_PATHS.some(path => error.config.url.includes(path))

      const statusCode = error.response ? error.response.status : -1
      if ((statusCode === 401 || statusCode === 403) && !isIgnored) {
        if (error.response.data.code === 'token_not_valid') {
          const refreshToken = store.getters['authorization/getToken']
          if (refreshToken === null && refresh_token !== "null") {
            if (store.getters['authorization/tried']) {
              await store.dispatch('authorization/logout')
              await store.dispatch('order/clear')
              await store.dispatch('cart/finishOrder')
              await store.dispatch('cart/setOrder', 0)
              await store.dispatch('order/setAccepted',false)
              return redirect('/')
            } else {
              await store.dispatch('authorization/retried', true)
              try {
                await store.dispatch('authorization/refresh')
                return $axios(error.config)
              } catch (e) {
                await store.dispatch('authorization/logout')
                await store.dispatch('order/clear')
                await store.dispatch('cart/finishOrder')
                await store.dispatch('cart/setOrder', 0)
                await store.dispatch('order/setAccepted',false)
                return redirect('/')
              }
            }
          }
          // There is no refresh token
          else {
            await store.dispatch('authorization/logout')
            await store.dispatch('order/clear')
            await store.dispatch('cart/finishOrder')
            await store.dispatch('cart/setOrder', 0)
            await store.dispatch('order/setAccepted',false)
            return redirect('/')
          }
        }
      }
      return reject(error)
    })
  })
}
