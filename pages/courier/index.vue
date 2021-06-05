<template>
  <div>
    <CurrentOrder></CurrentOrder>
    <div v-if="!order_exists">
      <div v-if="!connected">
        <button @click="connectSocket" class="uk-button-default uk-button">Підключитися</button>
      </div>
      <h3>Вільні замовлення</h3>
      <div class="uk-card uk-card-default uk-card-body uk-margin">
        <CourierOrder v-for="order in orders" :key="order.order_id" v-bind:order="order">
        </CourierOrder>
      </div>
    </div>
  </div>
</template>

<script>


import CurrentOrder from "~/components/courier/CurrentOrder";
import auth from "~/middleware/auth";
import setted from "~/middleware/setted";
import CourierOrder from "~/components/courier/CourierOrder";
import {mapGetters} from "vuex";

export default {
  name: "courier_index",
  components: {CurrentOrder, CourierOrder},
  middleware: [auth, setted],
  data: () => ({
    connected: false,
    orders: [],
    websocket: null
  }),
  async fetch() {
    await this.retrieve_orders();
  },
  methods: {
    retrieve_orders: async function () {
      if (!this.order_exists) {
        try {
          this.orders = await this.$axios.$get('/courier/orders');
          await this.connectSocket();
        } catch (err) {
          if (!err.response) {
            this.$toast.error("Помилка мережі", {
              toastClassName: ['uk-margin-top']
            })
            console.error(err)
          } else {
            this.$toast.error("Сталася помилка, коли отримували вільні замовлення", {
              toastClassName: ['uk-margin-top']
            })
            console.error(err.response)
          }
        }
      }
    },
    async on_disconnect() {
      this.connected = false
    },
    async on_connect() {
      this.connected = true
    },
    async connectSocket() {
      if (this.order_exists) {
        const ws_scheme = window.location.protocol === "https:" ? "wss" : "ws";
        this.websocket = new WebSocket(ws_scheme + '://' + window.location.hostname + ":8000/socket/courier");
        this.websocket.onopen = this.on_connect
        this.websocket.onclose = this.on_disconnect
      }
    },
  },
  computed: {
    ...mapGetters({
      order_exists: 'courier/order_exists',
      token: 'authorization/getAccessToken',
    })
  }

}
</script>

<style scoped>

</style>
