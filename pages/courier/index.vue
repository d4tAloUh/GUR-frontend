<template>
  <div>
    <ToggleButton label-enable-text="Працюю" label-disable-text="Відпочиваю" class="uk-align-center margin-top-button"
                  v-on:change="set_courier_working" v-bind:default-state="courier_working"
    />
    <div class="uk-margin">
      <label>longitude</label>
      <input type="text" name="location" v-model="longitude" class="uk-input"/>
    </div>
    <div class="uk-margin">
      <label>latitude</label>
      <input type="text" name="location" v-model="latitude" class="uk-input"/>
    </div>
    <CurrentOrder v-if="order_exists">
    </CurrentOrder>
    <div v-else>
      <h3>Вільні замовлення</h3>
      <!--      <CourierMap-->
      <!--        :apiKey=google_key-->
      <!--        :markers=markers></CourierMap>-->
      <div class="uk-card uk-card-default uk-card-body uk-margin">
        <CourierOrder v-for="order in available_orders" :key="order.order_id" v-bind:order="order">
        </CourierOrder>
        <div v-if="available_orders.length === 0">
          Наразі немає вільних замовлень, зачекайте, будь ласка
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CurrentOrder from "~/components/courier/CurrentOrder";
import auth from "~/middleware/auth";
import setted from "~/middleware/setted";
import onlyCourier from "~/middleware/onlyCourier";
import CourierOrder from "~/components/courier/CourierOrder";
import {mapActions, mapGetters} from "vuex";
import ToggleButton from "~/components/misc/ToggleButton";
import GoogleMapLoader from "~/components/GoogleMaps/GoogleMapLoader";
import CourierMap from "~/components/GoogleMaps/CourierMap";
import OrderHelper from "~/utils/OrderHelper";

export default {
  name: "courier_index",
  components: {CurrentOrder, CourierOrder, ToggleButton, GoogleMapLoader, CourierMap},
  middleware: [auth, setted, onlyCourier],
  data: () => ({
    connected: false,
    orders: [],
    websocket: null,
    max_distance: 3500,
    interval: null,
  }),
  async fetch() {
    await this.get_active_order()
    await this.retrieve_orders()
    // navigator.geolocation.getCurrentPosition(position => {
    //   this.latitude = position.coords.latitude
    //   this.longitude = position.coords.longitude
    //   })
  },
  async mounted() {
    this.interval = setInterval(this.connectSocket, 2000)
  },
  methods: {
    async get_active_order() {
      try {
        let response = await this.$axios.$get('/courier/orders/current');
        await this.saveOrder(response.order)
      } catch (err) {
        if (!err.response) {
          this.$toast.error("Помилка мережі", {
            toastClassName: ['uk-margin-top']
          })
          console.error(err)
        } else {
          this.$toast.error("Сталася помилка, коли отримували поточне замовлення", {
            toastClassName: ['uk-margin-top']
          })
          console.error(err.response)
        }
      }
    },
    async retrieve_orders() {
      if (!this.order_exists) {
        try {
          this.orders = await this.$axios.$get('/courier/orders/free');
        } catch (err) {
          if (!err.response) {
            this.$toast.error("Помилка мережі", {
              toastClassName: ['uk-margin-top']
            })
            console.error(err)
          } else {
            this.$toast.error("Сталася помилка, коли отримували замовлення", {
              toastClassName: ['uk-margin-top']
            })
            console.error(err.response)
          }
        }
      }
    },
    async on_disconnect() {
      this.connected = false
      this.interval = setInterval(this.connectSocket, 2000)
    },
    async on_message(event) {
      const data = JSON.parse(event.data)
      switch (data.type) {
        case 'event.neworder': {
          this.orders.push(data.content)
          break
        }
        case 'event.ordertaken': {
          await this.filter_out_order(data.content)
          break
        }
      }
    },
    async on_connect() {
      this.connected = true
      this.websocket.send(JSON.stringify(
        {
          command: "connect_to_order_queue",
          token: this.token
        }))
    },
    async connectSocket() {
      if (!this.order_exists && this.courier_working) {
        if (process.browser) {
          this.websocket = new WebSocket('ws://' + this.server_url + "/socket/courier");
          this.websocket.onopen = this.on_connect
          this.websocket.onclose = this.on_disconnect
          this.websocket.onmessage = this.on_message
          clearInterval(this.interval)
        }
      }
    },
    async filter_out_order(order_id) {
      this.orders = this.orders.filter(order_item => order_item.order_id !== order_id)
    },
    haversine_distance: OrderHelper.haversine_distance,
    set_courier_working: function (value) {
      this.$store.dispatch('courier/do_set_courier_working', value)
    },
    ...mapActions({
      saveOrder: 'courier/do_set_order'
    }),
  },
  computed: {
    ...mapGetters({
      order_exists: 'courier/order_exists',
      token: 'authorization/getAccessToken',
      courier_working: 'courier/courier_working'
    }),
    google_key: function () {
      return process.env.google_key
    },
    server_url: function () {
      return process.env.server_url
    },
    markers: function () {
      return this.available_orders.map((order => {
        return {
          id: order.order_id,
          position: order.restaurant.location
        }
      }))
    },
    longitude: {
      get() {
        return this.$store.getters['courier/courier_location'].longitude
      },
      set(value) {
        this.$store.dispatch('courier/do_set_courier_longitude', value)
      }
    },
    latitude: {
      get() {
        return this.$store.getters['courier/courier_location'].latitude
      },
      set(value) {
        this.$store.dispatch('courier/do_set_courier_latitude', value)
      }
    },
    available_orders() {
      let th = this
      return this.orders.filter(function (order) {
          let distance = th.haversine_distance(order.delivery_location, {longitude: th.longitude, latitude: th.latitude})
          return distance < th.max_distance
        }
      )
    },
  },
  watch: {
    async courier_working(new_val) {
      if (!new_val && !this.order_exists) {
        if (this.websocket) {
          this.websocket.close()
        }
        this.connected = false
        this.interval = setInterval(this.connectSocket, 2000)
        this.orders = []
      } else if (!this.order_exists) {
        await this.get_active_order()
        await this.retrieve_orders()
      }
    }
  }
}

</script>

<style scoped>

</style>
