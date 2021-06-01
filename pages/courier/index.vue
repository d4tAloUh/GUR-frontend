<template>
  <div>
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
</template>

<script>
import auth from "~/middleware/auth";
import setted from "~/middleware/setted";
import {mapActions,mapGetters} from "vuex";


export default {
  name: "courier_index",
  middleware: [auth, setted],
  data: () => ({
    location: {
      latitude: 1,
      longitude: 2
    }
  }),
  async beforeMount() {
    try {
      let response = await this.$axios.$get('/courier/orders/current');
      await this.saveOrder(response.order)
    } catch (e) {
      console.log(e)
    }
  },
  async mounted() {

    await this.connectSocket();
  },
  methods: {
    async connectSocket() {
      const ws_scheme = window.location.protocol === "https:" ? "wss" : "ws";
      this.websocket = new WebSocket(ws_scheme + '://' + window.location.hostname + ":8000/courier/location");
      this.websocket.onopen = this.connect
      this.websocket.onclose = this.on_disconnect
    },
    async send_update() {
      if (this.order_id){
        const data = {
          location: this.location,
          order_id: this.order_id,
          token: this.token,
          command: "update_location"
        }
        this.websocket.send(JSON.stringify(data))
      }
      else {
        this.$toast.info("Ви нічого наразі не доставляєте", {
          toastClassName: ['uk-margin-top']
        })
      }
    },
    async on_disconnect(){
      console.log("Disconnected")
    },
    ...mapActions({
      saveOrder: 'courier/do_set_order'
    }),
  },
  computed: {
    ...mapGetters({
      order_id: 'courier/order_id',
      token: 'authorization/getAccessToken'
    })
  }
}
</script>

<style scoped>

</style>
