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
          <button class="uk-button uk-align-right uk-button-primary" v-on:click="">Створити замовлення з цього</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import OrderStatusTitle from "~/components/misc/OrderStatusTitle";

export default {
  name: "OrderComponent",
  props: ["order"],
  components: {OrderStatusTitle},
  computed:{
    decimalPrice: function () {
      return price => `${Number(price) / 100}`;
    }
  }

}
</script>

<style scoped>

</style>
