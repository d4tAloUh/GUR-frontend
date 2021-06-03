<template>
  <div>
    <CurrentOrder></CurrentOrder>
    <div class="uk-card uk-card-default uk-card-body uk-margin">
      <template v-for="order in orders">
        <div class="uk-card uk-card-default uk-margin" :key="order.order_id">
          <div class="uk-card-body">
            <h3>Замовлення № {{ order.order_id }}</h3>
            <div class="uk-width-expand">
              <p class="uk-text-meta uk-margin-remove-top">
                {{ order.created_tm }}
              </p>
            </div>
            <div>Сума: {{ decimalPrice(order.summary) }}₴</div>
            <div>Адреса доставки: {{ order.delivery_address }}</div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script>


import CurrentOrder from "~/components/courier/CurrentOrder";
import auth from "~/middleware/auth";
import setted from "~/middleware/setted";

export default {
  name: "courier_index",
  components: {CurrentOrder},
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
  },
  computed:{
    decimalPrice: function () {
      return price => `${Number(price) / 100}`;
    }
  }
}
</script>

<style scoped>

</style>
