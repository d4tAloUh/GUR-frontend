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
}
</script>

<style scoped>

</style>
