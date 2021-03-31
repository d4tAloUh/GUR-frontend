<template>
  <div>
    <DishForm :dish="dish"  />
  </div>
</template>

<script>
import DishForm from "~/components/forms/DishForm";
import admin from "~/middleware/admin";
import auth from "~/middleware/auth";

export default {
  name: "admin-dish-id",
  components:{DishForm},
  middleware: [admin, auth],
  data: () => ({
    dish: Object,
  }),
  activated() {
    if (!this.$store.getters['authorization/admin']) {
      return error({ statusCode: 404, message: '' })
    }
  },
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
