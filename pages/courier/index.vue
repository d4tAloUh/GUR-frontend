<template>
  <div>
    <CurrentOrder></CurrentOrder>
    <div class="uk-card uk-card-default uk-card-body uk-margin">
      <CourierOrder v-for="order in orders" :key="order.order_id" v-bind:order="order">
      </CourierOrder>
    </div>
  </div>
</template>

<script>


import CurrentOrder from "~/components/courier/CurrentOrder";
import auth from "~/middleware/auth";
import setted from "~/middleware/setted";
import CourierOrder from "~/components/courier/CourierOrder";

export default {
  name: "courier_index",
  components: {CurrentOrder, CourierOrder},
  middleware: [auth, setted],
  data: () => ({
    orders: [],
    websocket: null
  }),
  async fetch() {
    await this.retrieve_orders();
  },
  methods: {
    retrieve_orders: async function () {
      try {
        this.orders = await this.$axios.$get('/courier/orders');
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
    },
    acceptOrder: async function (order_id) {
      try {
        const response = await this.$axios.$put('/courier/orders', {
          order_id,
          'courier_location': {
            latitude: 1,
            longitude: 2
          }
        });
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

}
</script>

<style scoped>

</style>
