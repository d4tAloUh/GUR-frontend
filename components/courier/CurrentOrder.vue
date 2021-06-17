<template>
  <div class="uk-card uk-card-default uk-margin">
    <div v-if="$fetchState.pending">
      <Loading/>
    </div>
    <div v-else class="uk-card-body">
      <h3>Замовлення № {{ order_id }}</h3>
      <div>Сума: {{ decimalPrice(order.summary) }}₴</div>
      <div>Адреса ресторану: {{ order.restaurant.rest_address }}</div>
      <div>Адреса доставки: {{ order.delivery_address }}</div>
      <div>
        <a v-if="isHidden" v-on:click="isHidden = !isHidden">Показати деталі</a>
        <a v-if="!isHidden" v-on:click="isHidden = !isHidden">Приховати деталі</a>
      </div>
      <div v-if="!isHidden">
        <div>Ресторан: {{ order.restaurant.name }}</div>
        <div>Відстань до ресторану: ~{{ haversine_distance(current_order.restaurant.location, {longitude, latitude}) }} км</div>
        <div>Відстань від замовлення до ресторану:
          ~{{ haversine_distance(order.delivery_location, order.restaurant.location) }} км
        </div>
        <div class="uk-margin-top">
          <table class="uk-table uk-table-divider">
            <caption><h5>Страви</h5></caption>
            <thead>
              <tr>
                <th>Назва</th>
                <th>Ціна</th>
                <th>Кількість</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="dish in dishes">
                <td class="uk-width-1-2">{{ dish.name }}</td>
                <td class="uk-table-shrink">{{ decimalPrice(dish.price) }}₴</td>
                <td class="uk-table-shrink">{{ dish.quantity }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div>Примітки: {{ order.order_details }}</div>
      </div>

      <button class="uk-button green uk-margin-top" @click="finish_order">Доставлено</button>
      <button class="uk-button uk-button-danger uk-margin-top" @click="cancel_order">Відмінити замовлення</button>

    </div>
  </div>
</template>

<script>
import auth from "~/middleware/auth";
import setted from "~/middleware/setted";
import {mapActions, mapGetters} from "vuex";
import OrderHelper from "@/utils/OrderHelper";

export default {
  name: "CurrentOrder",
  middleware: [auth, setted],
  data: () => ({
    interval: null,
    isHidden: true,
    order: null,
    dishes: [],
  }),
  async fetch() {
    await this.getDetails()
  },
  mounted() {
    this.interval = setInterval(this.send_update, 5000)
  },
  deactivated() {
    clearInterval(this.interval)
  },
  beforeDestroy() {
    clearInterval(this.interval)
  },
  methods: {
    decimalPrice: OrderHelper.decimalPrice,
    haversine_distance: OrderHelper.haversine_distance,
    async getDetails() {
      try {
        this.loading = true
        let response = await this.$axios.$get('/courier-orders/' + this.order_id);
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
    async send_update() {
      if (this.order_exists) {
        try {
          await this.$axios.$post('/courier/location/' + this.order_id, {
            location: this.location
          });
        } catch (err) {
          if (!err.response) {
            this.$toast.error("Помилка мережі", {
              toastClassName: ['uk-margin-top']
            })
            console.error(err)
          } else {
            this.$toast.error(err.response.data.location && err.response.data.location[0] || err.response.data.error || "Сталася помилка", {
              toastClassName: ['uk-margin-top']
            })
            console.error(err.response)
          }
        }
      } else {
        this.$toast.info("Ви нічого наразі не доставляєте", {
          toastClassName: ['uk-margin-top']
        })
      }
    },
    async finish_order() {
      if (this.order_exists) {
        try {
          await this.$axios.$post('/order-statuses/' + this.order_id, {
            status: "F",
          });
          await this.clear_order("Дякуємо за доставлене замовлення")
        } catch (err) {
          if (!err.response) {
            this.$toast.error("Помилка мережі", {
              toastClassName: ['uk-margin-top']
            })
            console.error(err)
          } else {
            this.$toast.error(err.response.data.error || "Сталася помилка", {
              toastClassName: ['uk-margin-top']
            })
            console.error(err.response)
          }
        }
      } else {
        this.$toast.info("Ви нічого наразі не доставляєте", {
          toastClassName: ['uk-margin-top']
        })
      }
    },
    async cancel_order() {
      if (this.order_exists) {
        try {
          await this.$axios.$post('/order-statuses/' + this.order_id, {
            status: "C"
          });
          await this.clear_order("Замовлення було скасовано")
        } catch (err) {
          if (!err.response) {
            this.$toast.error("Помилка мережі", {
              toastClassName: ['uk-margin-top']
            })
            console.error(err)
          } else {
            this.$toast.error(err.response.data.error || "Сталася помилка", {
              toastClassName: ['uk-margin-top']
            })
            console.error(err.response)
          }
        }
      } else {
        this.$toast.info("Ви нічого наразі не доставляєте", {
          toastClassName: ['uk-margin-top']
        })
      }
    },
    ...mapActions({
      saveOrder: 'courier/do_set_order'
    }),
    async clear_order(content) {
      await this.saveOrder(null)
      clearInterval(this.interval)
      this.$toast.info(content, {
        toastClassName: ['uk-margin-top']
      })
    }
  },
  computed: {
    ...mapGetters({
      order_id: 'courier/order_id',
      order_exists: 'courier/order_exists',
      current_order: 'courier/order',
      courier_working: 'courier/courier_working',
      location: 'courier/courier_location'
    }),
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
  },
}
</script>

<style scoped>
.green {
  background: green;
  color: white;
}
</style>
