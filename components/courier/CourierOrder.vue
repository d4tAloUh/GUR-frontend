<template>
  <div class="uk-card uk-card-default uk-margin">
    <div class="uk-card-body">
      <h3>Замовлення № {{ order.order_id }}</h3>
      <div class="uk-width-expand">
        <p class="uk-text-meta uk-margin-remove-top">
          {{ order.created_tm }}
        </p>
      </div>
      <div>Сума: {{ decimalPrice(order.summary) }}₴</div>
      <div>Адреса ресторану: {{ order.restaurant.rest_address }}</div>
      <div>Адреса доставки: {{ order.delivery_address }}</div>
      <div>
        <a v-if="!showDetails" v-on:click="toggleDetails">Показати деталі</a>
        <a v-else v-on:click="toggleDetails">Приховати деталі</a>
      </div>
      <div v-if="showDetails">
        <div>Ресторан: {{ order.restaurant.name }}</div>
        <div>Відстань до ресторану: ~{{ haversine_distance(order.restaurant.location, {longitude, latitude}) }} км</div>
        <div>Відстань від замовлення до ресторану:
          ~{{ haversine_distance(order.delivery_location, order.restaurant.location) }} км
        </div>
      </div>
      <button class="uk-button uk-button-primary uk-margin-top" @click="acceptOrder(order.order_id)">Взяти замовлення</button>
    </div>
  </div>
</template>

<script>
import {mapActions, mapGetters} from "vuex";
import OrderHelper from "~/utils/OrderHelper";

export default {
  name: "CourierOrder",
  props: ["order"],
  data: () => ({
    showDetails: false,
  }),
  computed: {
    ...mapGetters({
      courier_location: 'courier/courier_location'
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
  methods: {
    decimalPrice: OrderHelper.decimalPrice,
    ...mapActions({
      saveOrder: 'courier/do_set_order'
    }),
    toggleDetails() {
      this.showDetails = !this.showDetails
    },
    haversine_distance: OrderHelper.haversine_distance,
    acceptOrder: async function (order_id) {
      try {
        const response = await this.$axios.$put('/courier/orders/free/' + order_id, {
          courier_location: this.courier_location
        });
        await this.saveOrder(response)
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
    }
  }
}
</script>

<style scoped>

</style>
