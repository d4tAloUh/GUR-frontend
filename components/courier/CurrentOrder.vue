<template>
  <div>
    <div>Working now: {{ courier_working }}</div>

    <div v-if="order_exists">
      <div>Order id is {{ order_id }}</div>
      <div class="uk-margin">
        <label>longitude</label>
        <input type="text" name="location" v-model="location.longitude" class="uk-input"/>
      </div>
      <div class="uk-margin">
        <label>latitude</label>
        <input type="text" name="location" v-model="location.latitude" class="uk-input"/>
      </div>
      <button class="uk-button uk-button-primary" @click="send_update">Відправити локацію</button>
      <button class="uk-button green" @click="finish_order">Доставлено</button>
      <button class="uk-button uk-button-danger" @click="cancel_order">Відмінити замовлення</button>
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
  methods: {
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
          await this.$axios.$post('/order-statuses/0', {
            status: "F",
            order_id: this.order_id
          });
          await this.clear_order()
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
          await this.$axios.$post('/order-statuses/0', {
            status: "C",
            order_id: this.order_id
          });
          await this.clear_order()
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
    async clear_order() {
      await this.saveOrder(null)
      this.$toast.info("Дякуємо за доставлене замовлення", {
        toastClassName: ['uk-margin-top']
      })
    }
  },
  computed: {
    ...mapGetters({
      order_id: 'courier/order_id',
      order_exists: 'courier/order_exists',
      courier_working: 'courier/courier_working',
    })
  }
}
</script>

<style scoped>
.green {
  background: green;
  color: white;
}
</style>
