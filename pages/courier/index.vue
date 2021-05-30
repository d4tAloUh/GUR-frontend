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

export default {
  name: "courier_index",
  middleware: [auth, setted],
  data: () => ({
    dishes: [],
    order: null,
    location: {
      latitude: 1,
      longitude: 2
    }
  }),
  async mounted() {
    await this.connectSocket();
  },
  methods : {
    async connectSocket() {
      const ws_scheme = window.location.protocol === "https:" ? "wss" : "ws";
      this.websocket = new WebSocket(ws_scheme + '://' + window.location.hostname + ":8000/courier/location");
      this.websocket.onopen = this.connect
      this.websocket.onmessage = this.recieve
    },
    async send_update() {
      const data = {
        location: this.location,
        order_id: this.$route.params.id,
        token: this.token,
        command: "update_location"
      }
      this.websocket.send(JSON.stringify(data))
    }
  }
}
</script>

<style scoped>

</style>
