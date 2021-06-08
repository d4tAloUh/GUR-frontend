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

<style>
html {
  font-family: 'Source Sans Pro',
  -apple-system,
  BlinkMacSystemFont,
  'Segoe UI',
  Roboto,
  'Helvetica Neue',
  Arial,
  sans-serif;
  font-size: 16px;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
}
*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
}
</style>
