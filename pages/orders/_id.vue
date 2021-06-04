<template>
  <div>
    <NuxtLink tag="a" class="uk-button uk-button-primary uk-margin" to="/profile" exact><span
      uk-icon="arrow-left"></span> назад
    </NuxtLink>
    <div v-if="order">
      <h2 class="uk-text-center">Замовлення № {{ this.$route.params.id }} {{ this.location }}</h2>
      <div v-if="connected">Connected to socket</div>
      <div v-else>
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
              <p>Ресторан: {{ order.restaurant.name }}</p>
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
import auth from "@/middleware/auth";
import Loading from "@/components/misc/LoadingBar";
import OrderStatus from "@/components/misc/OrderStatus";
import setted from "@/middleware/setted";

export default {
  name: "Order_detail",
  components: {Loading, OrderStatus},
  middleware: [auth, setted],
  data: () => ({
    connected: false,
    dishes: [],
    order: null,
    location: {
      latitude: 1,
      longitude: 2
    }
  }),
  async beforeMount() {
    await this.getDetails();
  },
  async mounted() {
    await this.connectSocket();
  },
  methods: {
    async getDetails() {
      try {
        this.loading = true
        let response = await this.$axios.$get('/user-orders-key/' + this.$route.params.id);
        this.loading = false
        this.dishes = response.dishes
        this.order = response.order
      } catch (err) {

        this.loading = false
        if (!err.response) {
          this.$toast.error("Помилка мережі", {
            toastClassName: ['uk-margin-top']
          })
          console.error(err)
        } else {
          if (Number(err.response.status) === 403 || Number(err.response.status) === 404) {
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
      const ws_scheme = window.location.protocol === "https:" ? "wss" : "ws";
      this.websocket = new WebSocket(ws_scheme + '://' + window.location.hostname + ":8000/socket/user");
      this.websocket.onopen = this.on_connect
      this.websocket.onmessage = this.on_message
      this.websocket.onclose = this.on_disconnect
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
      switch (data.type){
        case "event.location":{
          this.location = data.content
        }
      }
      console.log("received", data)
    },
    async on_disconnect(event) {
      console.log("Disconnected", event)
      this.connected = false
    },
  },
  computed: {
    decimalPrice: function () {
      return price => `${Number(price) / 100}`;
    },
    token: {
      get() {
        return this.$store.getters['authorization/getAccessToken']
      }
    }
  }
}
</script>

<style scoped>

</style>
