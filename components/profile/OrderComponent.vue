<template>
  <div class="uk-card uk-card-default uk-margin" :key="order.order_id">
    <div class="uk-card-body">
      <h3>Замовлення № {{ order.order_id }}</h3>
      <div>
        <OrderStatusTitle v-bind:status=order.order_status.status>
        </OrderStatusTitle>
      </div>
      <div class="uk-width-expand">
        <p class="uk-text-meta uk-margin-remove-top">
          {{ order.created_tm }}
        </p>
      </div>
      <div>Сума: {{ decimalPrice(order.summary) }}₴</div>
      <div>Адреса доставки: {{ order.delivery_address }}</div>

      <div class="uk-margin-top">
        <NuxtLink :to="{ name: 'courier-orders-id', params: { id: order.order_id }}" tag="a"
                  class="uk-button uk-button-secondary uk-align-right" v-if="is_courier">Переглянути
        </NuxtLink>
        <div v-else>
          <NuxtLink :to="{ name: 'users-orders-id', params: { id: order.order_id }}" tag="a"
                    class="uk-button uk-button-secondary uk-align-right">Переглянути
          </NuxtLink>
          <button class="uk-button uk-align-right uk-button-primary" v-on:click="recreate_method">Створити замовлення з
            цього
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import OrderStatusTitle from "~/components/misc/OrderStatusTitle";
import {mapActions, mapGetters} from "vuex";
import OrderHelper from "~/utils/OrderHelper";

export default {
  name: "OrderComponent",
  props: ["order"],
  components: {OrderStatusTitle},
  computed: {
    ...mapGetters({
      is_courier: 'authorization/isCourier'
    }),
  },
  methods: {
    decimalPrice: OrderHelper.decimalPrice,
    ...mapActions({
      set_order: 'cart/setOrder',
      set_rest_id: 'cart/setRest',
      set_dishes: 'cart/doSetItems'
    }),
    recreate_method: async function () {
      try {
        const response = await this.$axios.$post("/orders/recreate/" + this.order.order_id);
        await this.set_order(response.order.order_id)
        await this.set_dishes(response.dishes)
        await this.set_rest_id(response.restaurant)
        await this.$router.push("users/orders/create")
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
  }

}
</script>

<style scoped>

</style>
