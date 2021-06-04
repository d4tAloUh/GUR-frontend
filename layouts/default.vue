<template>
  <div>
    <Navbar/>
    <div class="uk-section uk-section-default">
      <div class="uk-container uk-container-large">
        <Nuxt keep-alive :keep-alive-props="{include: ['restaurant','GoogleMap','admin-index']}"  />
      </div>
    </div>
  </div>
</template>

<script>
import Navbar from "~/components/navbar/Navbar";

export default {
  components: {Navbar}
}

</script>

<style scoped src="../assets/css/index.css">
</style>
