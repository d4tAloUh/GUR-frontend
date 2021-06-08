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
      <div>Адреса доставки: {{ order.delivery_address }}</div>
      <div>Відстань: {{ haversine_distance(order.delivery_location, {longitude, latitude}) }} м</div>
      <button class="uk-button uk-button-primary" @click="acceptOrder(order.order_id)">Взяти замовлення</button>
    </div>
  </div>
</template>

<script>
import {mapActions, mapGetters} from "vuex";

export default {
  name: "CourierOrder",
  props: ["order"],
  computed: {
    decimalPrice: function () {
      return price => `${Number(price) / 100}`;
    },
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
    ...mapActions({
      saveOrder: 'courier/do_set_order'
    }),
    haversine_distance(location1, location2) {
      const R = 6371e3
      var rlat1 = location1.latitude * (Math.PI / 180);
      var rlat2 = location2.latitude * (Math.PI / 180);
      var difflat = (rlat2 - rlat1) * (Math.PI / 180);
      var difflon = (location2.longitude - location1.longitude) * (Math.PI / 180);

      const a = Math.sin(difflat / 2) * Math.sin(difflat / 2) +
        Math.cos(rlat1) * Math.cos(rlat2) *
        Math.sin(difflon / 2) * Math.sin(difflon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return Number(R * c).toFixed(1);
    },
    acceptOrder: async function (order_id) {
      try {
        const response = await this.$axios.$put('/courier/orders/free', {
          order_id,
          courier_location: this.courier_location
        });
        console.log(response)
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
