<template>
  <div>
    <GoogleMapLoader
      :mapConfig="mapConfig"
      :apiKey=google_key
      :markers = markers
    />

  </div>
</template>

<script>
import GoogleMapLoader from "~/components/GoogleMaps/GoogleMapLoader";

export default {
  name: "CourierMap",
  components: {GoogleMapLoader},
  data: () => ({
    markers: [{
      id: 1,
      position: {latitude: 50.443967, longitude: 30.536444}
    }]
  }),
  computed: {
    google_key: function () {
      return process.env.google_key
    },
    mapConfig: function () {
      return {
        center: {lat: 50.443967, lng: 30.536444},
        zoom: 15
      }
    }
  }
}
</script>

<style scoped>

</style>
