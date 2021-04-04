<template>
  <RestaurantForm :to_create="true" />
</template>

<script>
import RestaurantForm from "~/components/forms/RestaurantForm";
import admin from "~/middleware/admin";
import auth from "~/middleware/auth";

export default {
  name: "admin-create-restaurant",
  components: {RestaurantForm},
  middleware: [admin, auth],
  activated() {
    if (!this.$store.getters['authorization/admin']) {
      return error({ statusCode: 404, message: '' })
    }
  },
}
</script>

<style scoped>

</style>
