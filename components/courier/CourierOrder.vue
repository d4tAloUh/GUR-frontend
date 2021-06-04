<template>
  <div class="uk-card uk-card-default uk-margin" >
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
export default {
  name: "CourierOrder",
  props: ["order"],
  computed: {
    decimalPrice: function () {
      return price => `${Number(price) / 100}`;
    }
  }
}
</script>

<style scoped>

</style>
