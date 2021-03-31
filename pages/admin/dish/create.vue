<template>
  <div>
    <DishForm :to_create="true" :rest_id="rest_id" />
  </div>
</template>

<script>
import DishForm from "~/components/forms/DishForm";

export default {
  name: "admin-dish-create",
  components: {DishForm},
  computed:{
    rest_id: function (){
      return this.$route.params.rest_id
    }
  }
}
</script>

<style scoped>

</style>
