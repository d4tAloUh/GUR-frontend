<template>
  <div>
    <NuxtLink tag="a" class="uk-button uk-button-primary uk-margin" to="/profile" exact><span
      uk-icon="arrow-left"></span> назад
    </NuxtLink>
    <div v-if="order">
      <UserOrderMap v-if="is_in_delivery"
                    :apiKey=google_key
                    :user_location="{lat: order.delivery_location.latitude,
                  lng: order.delivery_location.longitude }"
                    :courier_location="order.location ? {lat: order.location.latitude,
                  lng: order.location.longitude }: null"></UserOrderMap>
      <h2 class="uk-text-center">Замовлення № {{ this.$route.params.id }}</h2>
      <div v-if="!connected">
        Disconnected
        <button class="uk-button uk-button-primary" @click="connectSocket">Connect socket</button>
      </div>
      <div uk-grid>
        <div class="uk-width-1-2@l">
          <div class="uk-card uk-card-default uk-card-body uk-margin">
            <h3>Деталі замовлення</h3>
            <div class="uk-width-expand">
              <p class="uk-text-meta uk-margin-remove-top">
                {{ order.created_tm }}
              </p>
            </div>
            <div>
              <OrderStatus v-bind:statuses=order.order_status></OrderStatus>
            </div>
            <div>
              <p>Ресторан:
                <NuxtLink :to="{ name: 'restaurant-id', params: { id: order.restaurant.rest_id }}" tag="a"
                >{{ order.restaurant.name }}
                </NuxtLink>
              </p>
            </div>
            <div>
              <p>Доставка від: {{ order.restaurant.rest_address }}</p>
            </div>
            <div>
              <p>Доставка до: {{ order.delivery_address }}</p>
            </div>
            <div v-if="order.order_details">
              <p>Коментар: {{ order.order_details }}</p>
            </div>
            <button class="uk-button uk-align-left uk-button-primary" v-on:click="recreate_order">Створити замовлення з
              цього
            </button>
          </div>
        </div>
        <div class="uk-width-expand">

          <div class="uk-card uk-card-default uk-card-body uk-margin">
            <img src="https://ik.imagekit.io/alouh/misc/pixeltrue-healthy-eating_CT0cPtIR_qfU.svg"
                 class="uk-align-center" height="250" width="250" alt=""/>
            <h3 class="uk-text-center">Страви:</h3>
            <table class="uk-table uk-table-striped uk-table-small uk-table-responsive">
              <thead>
              <tr>
                <th>Назва</th>
                <th>Ціна (шт.)</th>
                <th>Кількість</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="dish in dishes">
                <td class="uk-width-1-2">{{ dish.name }}</td>
                <td class="uk-table-shrink">{{ decimalPrice(dish.price) }}₴</td>
                <td class="uk-table-shrink">{{ dish.quantity }}</td>
              </tr>
              <tr>
                <td class="uk-width-1-2">Сума</td>
                <td class="uk-table-shrink">{{ decimalPrice(order.summary) }}₴</td>
                <td></td>
              </tr>
              </tbody>
            </table>

          </div>
        </div>
      </div>
    </div>
    <div v-else>
      <div class="uk-text-center">
        <div>Зачекайте будь-ласка</div>
        <Loading/>
      </div>
    </div>
  </div>
</template>

<script>
import auth from "~/middleware/auth";
import Loading from "~/components/misc/LoadingBar";
import OrderStatus from "~/components/misc/OrderStatus";
import setted from "~/middleware/setted";
import onlyClient from "~/middleware/onlyClient";
import OrderHelper from "~/utils/OrderHelper";
import UserOrderMap from "~/components/GoogleMaps/UserOrderMap";
import {mapActions} from "vuex";


export default {
  name: "Order_detail",
  components: {Loading, OrderStatus, UserOrderMap},
  middleware: [auth, setted, onlyClient],
  data: () => ({
    connected: false,
    dishes: [],
    order: null,
    interval: null
  }),
  async mounted(){
    await this.getDetails();
    window.addEventListener('beforeunload', () => {
      this.disconnect_socket()
    })
  },
  deactivated() {
    this.disconnect_socket()
  },
  beforeDestroy() {
    this.disconnect_socket()
  },
  methods: {
    disconnect_socket(){
      try {
        this.websocket.onclose = function () {
        }; // disable onclose handler first
        clearInterval(this.interval)
        this.websocket.close();
      }
      catch (e){}
    },
    decimalPrice: OrderHelper.decimalPrice,
    async getDetails() {
      try {
        let response = await this.$axios.$get('/user-orders/' + this.$route.params.id);
        this.dishes = response.dishes
        this.order = response.order
        await this.connectSocket();
      } catch (err) {
        if (!err.response) {
          this.$toast.error("Помилка мережі", {
            toastClassName: ['uk-margin-top']
          })
          console.error(err)
        } else {
          if (Number(err.response.status) === 404) {
            this.$toast.error("Такого замовлення не існує", {
              toastClassName: ['uk-margin-top']
            })
            await this.$router.push('/profile')
          } else {
            await this.$router.push('/profile')

            this.$toast.error("Сталася помилка", {
              toastClassName: ['uk-margin-top']
            })
            console.error(err.response.data)
          }
        }
      }
    },
    async connectSocket() {
      if (!this.connected) {
        this.websocket = new WebSocket('ws://' + this.server_url + "/socket/user");
        this.websocket.onopen = this.on_connect
        this.websocket.onmessage = this.on_message
        this.websocket.onclose = this.on_disconnect
        clearInterval(this.interval)
      }
    },
    async on_connect(event) {
      this.websocket.send(JSON.stringify(
        {
          command: "connect_to_order_client",
          order_id: this.$route.params.id,
          token: this.token
        }))
      this.connected = true
    },
    async on_message(event) {
      const data = JSON.parse(event.data)
      switch (data.type) {
        case "event.location": {
          this.order.location = data.content
          break
        }
        case "event.orderstatus": {
          this.order.order_status.push(JSON.parse(data.content))
          break
        }
      }
    },
    async on_disconnect(event) {
      this.interval = setInterval(this.connectSocket, 2000)
      this.connected = false
    },
    async recreate_order() {
      try {
        const response = await this.$axios.$post("/orders/recreate/" + this.order.order_id);
        await this.set_order(response.order.order_id)
        await this.set_dishes(response.dishes)
        await this.set_rest_id(response.restaurant)
        await this.$router.push("/users/orders/create")
      } catch (err) {
        if (!err.response) {
          this.$toast.error("Помилка мережі", {
            toastClassName: ['uk-margin-top']
          })
          console.error(err)
        } else {
          this.$toast.error(err.response.data.error || "Сталася помилка, коли створювали подбіне замовлення", {
            toastClassName: ['uk-margin-top']
          })
          console.error(err.response)
        }
      }
    },
    ...mapActions({
      set_order: 'cart/setOrder',
      set_rest_id: 'cart/setRest',
      set_dishes: 'cart/doSetItems'
    }),
  },
  computed: {
    token: {
      get() {
        return this.$store.getters['authorization/getAccessToken']
      }
    },
    server_url: function () {
      return process.env.server_url
    },
    google_key: function () {
      return process.env.google_key
    },
    is_in_delivery() {
      let finished = this.order.order_status.find(s => s.status === 'F') || this.order.order_status.find(s => s.status === 'C')
      return this.order.order_status.find(s => s.status === 'D') && !finished && this.order.location
    }
  }
}
</script>

<style scoped>

</style>
