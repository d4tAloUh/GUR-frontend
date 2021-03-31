<template>
  <div>
    <p v-if="isFinished">
      <span class="uk-label uk-label-success"><span uk-icon="icon: check" /> Доставлено</span>
    </p>
    <p v-else-if="isCanceled">
      <span class="uk-label uk-label-danger"><span uk-icon="icon: close" /> Скасовано</span>
    </p>
    <p v-else-if="isBeingDelivered">
      <span class="uk-label"><span uk-icon="icon: bolt" /> В доставці</span>
    </p>
    <p v-else>
      <span class="uk-label uk-label-warning"><span uk-icon="icon: info" /> В обробці</span>
    </p>
  </div>
</template>

<script>
export default {
  name: "OrderStatusTitle",
  props: {
    status: String,
  },
  data: function () {
    return {
      current_status: this.status
    }
  },
  computed: {
    isCreated: function () {
      return this.current_status === 'P';
    },
    isBeingDelivered: function () {
      return this.current_status === 'D';
    },
    isCanceled: function () {
      return this.current_status === 'C';
    },
    isFinished: function () {
      return this.current_status === 'F';
    },
  }
}
</script>

<style scoped>
  .uk-label{
    padding: 3px 10px;
  }
  .uk-icon{
    position: relative;
    top: -2px;
  }
</style>
