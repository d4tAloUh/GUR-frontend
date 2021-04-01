export default {
  // Target: https://go.nuxtjs.dev/config-target
  target: 'server',

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'GUR ',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      {charset: 'utf-8'},
      {name: 'viewport', content: 'width=device-width, initial-scale=1'},
      {hid: 'description', name: 'description', content: 'Glovo-Uber-Raketa sample'}
    ],
    link: [
      {rel: 'icon', type: 'image/x-icon', href: '/favicon.ico'}
    ]
  },
  env: {
    google_key: process.env.google_key || 'AIzaSyC5aRn9eeSv9WaTQCucsed0S_-57rETsW0'
  },
  // Global CSS (https://go.nuxtjs.dev/config-css)
  css: [
    "uikit/dist/css/uikit.min.css",
    "uikit/dist/css/uikit.css",
  ],
  // Plugins to run before rendering page (https://go.nuxtjs.dev/config-plugins)
  plugins: [
    {src: '~/plugins/uikit.js', ssr: false},
    '~/plugins/axios.js'
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [],
  ssr: true,
  // Modules (https://go.nuxtjs.dev/config-modules)
  modules: [
    '@nuxtjs/axios',
    "vue-toastification/nuxt",
    '@nuxtjs/proxy'
  ],

  // Build Configuration (https://go.nuxtjs.dev/config-build)
  build: {},
  //https://axios.nuxtjs.org/setup/
  axios: {
    baseURL: process.env.baseURL || 'http://127.0.0.1:8000/api',
    browserBaseURL: process.env.browserBaseURL || 'http://127.0.0.1:8000/api',
    debug: true,
    proxy: true
  },
  proxy: {
    '/api':process.env.baseURL || 'http://127.0.0.1:8000/api'
  },
  loaders:
    {
      vue: {
        transformAssetUrls: {
          img: "data-src",
          div: "data-src"
        }
      }
    },
}
