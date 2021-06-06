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
    })
  },

  methods: {
    ...mapActions({
      saveOrder: 'courier/do_set_order'
    }),
    acceptOrder: async function (order_id) {
      try {
        const response = await this.$axios.$put('/courier/orders', {
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
          this.$toast.error(err.response.data.error || "Сталася помилка, коли отримували вільні замовлення", {
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
