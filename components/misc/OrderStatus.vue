<template>
  <div>
    <p v-if="isFinished">
      <span uk-icon="icon: check" class="delivered" /> Доставлено
    </p>
    <p v-else-if="isCanceled">
      <span uk-icon="icon: close" class="canceled" /> Скасовано
    </p>
    <p v-else-if="isBeingDelivered">
      <span uk-icon="icon: bolt" class="delivering" /> В доставці
    </p>
    <p v-else>
      <span uk-icon="icon: info" class="preparing" /> В обробці
    </p>

    <table class="uk-table uk-table-divider">
      <thead>
      <tr>
        <th>Час</th>
        <th>Статус</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="status in usable_statuses">
        <td>{{ status.timestamp }}</td>
        <td>{{ statusName(status) }}</td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: "OrderStatus",
  props: {
    statuses: Array,
  },
  data: function () {
    return {
      usable_statuses: this.statuses
    }
  },
  methods: {
    statusName: function (status) {
      if (status.status === 'O')
        return "Відкритий"
      else if (status.status === 'C')
        return "Скасований"
      else if (status.status === 'F')
        return "Доставлено"
      else if (status.status === 'D')
        return "В доставці"
      else if (status.status === 'P')
        return "В обробці"
    }
  },
  computed: {
    isCreated: function () {
      const status = this.usable_statuses.find(s => s.status === 'P')
      return !!status;
    },
    isBeingDelivered: function () {
      const status = this.usable_statuses.find(s => s.status === 'D')
      return !!status;
    },
    isCanceled: function () {
      const status = this.usable_statuses.find(s => s.status === 'C')
      return !!status;
    },
    isFinished: function () {
      const status = this.usable_statuses.find(s => s.status === 'F')
      return !!status;
    },

  }
}
</script>

<style scoped>
.delivered{
  color: green;
}
.canceled{
  color:red;
}
.delivering{
  color: #94942b;
}
.preparing{
  color: blue;
}
</style>
