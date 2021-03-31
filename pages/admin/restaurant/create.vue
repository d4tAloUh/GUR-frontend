<template>
    <RestaurantForm :to_create="true" />
</template>

<script>
import RestaurantForm from "~/components/forms/RestaurantForm";

export default {
  name: "admin-create-restaurant",
  components: {RestaurantForm},
}
</script>

<style scoped>

</style>
