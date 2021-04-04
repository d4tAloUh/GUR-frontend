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
  activated() {
    if (!this.$store.getters['authorization/admin'] && !this.$store.getters['authorization/partial_admin']) {
      return error({ statusCode: 404, message: '' })
    }
  },
  computed:{
    rest_id: function (){
      return Number(this.$route.params.id)
    }
  }
}
</script>

<style scoped>

</style>
