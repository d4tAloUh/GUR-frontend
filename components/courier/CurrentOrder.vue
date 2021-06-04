<template>
<div>
  <div>Working now: {{courier_working}}</div>

  <div v-if="connected">
    <div>Order id is {{order_id}}</div>
    <div class="uk-margin">
      <label>longitude</label>
      <input type="text" name="location" v-model="location.longitude" class="uk-input"/>
    </div>
    <div class="uk-margin">
      <label>latitude</label>
      <input type="text" name="location" v-model="location.latitude" class="uk-input"/>
    </div>
    <button class="uk-button uk-button-danger" @click="send_update">onovyti</button>
  </div>
  <div v-else>
    Connecting to order
    <button class="uk-button uk-button-primary" @click="connectSocket">Connect socket</button>
  </div>
</div>
</template>

<script>
import auth from "~/middleware/auth";
import setted from "~/middleware/setted";
import {mapActions, mapGetters} from "vuex";
export default {
  name: "CurrentOrder",
  middleware: [auth, setted],
  data: () => ({
    connected: false,
    location: {
      latitude: 1,
      longitude: 2
    }
  }),
  async beforeMount() {
    try {
      let response = await this.$axios.$get('/courier/orders/current');
      await this.saveOrder(response.order)
      await this.connectSocket();
    } catch (e) {
      console.log(e)
    }
  },
  methods: {
    async connectSocket() {
      if (this.order_exists){
        const ws_scheme = window.location.protocol === "https:" ? "wss" : "ws";
        this.websocket = new WebSocket(ws_scheme + '://' + window.location.hostname + ":8000/socket/courier");
        this.websocket.onopen = this.on_connect
        this.websocket.onclose = this.on_disconnect
      }
    },
    async send_update() {
      console.log(this.order_id)
      if (this.order_id) {
        const data = {
          location: this.location,
          order_id: this.order_id,
          token: this.token,
          command: "update_location"
        }
        this.websocket.send(JSON.stringify(data))
      } else {
        this.$toast.info("Ви нічого наразі не доставляєте", {
          toastClassName: ['uk-margin-top']
        })
      }
    },
    async on_disconnect() {
      console.log("Disconnected")
      this.connected = false
    },
    async on_connect() {
      console.log("Connected")
      this.connected = true
    },
    ...mapActions({
      saveOrder: 'courier/do_set_order'
    }),
  },
  computed: {
    ...mapGetters({
      order_id: 'courier/order_id',
      token: 'authorization/getAccessToken',
      courier_working :'courier/courier_working',
      order_exists: 'courier/order_exists'
    })
  }
}
</script>

<style scoped>

</style>
