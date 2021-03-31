<template>
  <div>
    <DishForm :to_create="true" :rest_id="rest_id" />
  </div>
</template>

<script>
import DishForm from "~/components/forms/DishForm";
import admin from "~/middleware/admin";
import auth from "~/middleware/auth";

export default {
  name: "admin-dish-create-id",
  components: {DishForm},
  middleware: [admin, auth],
  computed:{
    rest_id: function (){
      return Number(this.$route.params.id)
    }
  }
}
</script>

<style scoped>

</style>
