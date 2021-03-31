<template>
  <div>
    <DishForm :dish="dish"  />
  </div>
</template>

<script>
import DishForm from "~/components/forms/DishForm";

export default {
  name: "admin-dish-id",
  components:{DishForm},
  data: () => ({
    dish: Object,
  }),
  async created() {
    this.dish = this.dish_passed
  },
  computed: {
    dish_passed: {
      get() {
        return this.$route.params.dish
      },
      set(value) {
        this.$route.params.dish = value
      }
    },
    decimalPrice: function () {
      return price => `${Number(price) / 100}`;
    },
  }
}
</script>

<style scoped>

</style>
