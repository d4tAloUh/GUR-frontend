<template>

</template>

<script>
import auth from "~/middleware/auth";
import setted from "~/middleware/setted";

export default {
  name: "courier-order-id",
  middleware: [auth, setted],
}
</script>

<style scoped>

</style>
