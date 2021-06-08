<template>
  <div>
    <div class="google-map" ref="googleMap"></div>
  </div>
</template>

<script>
import {Loader} from '@googlemaps/js-api-loader';

export default {
  name: "GoogleMapLoader",
  props: {
    mapConfig: Object,
    apiKey: String,
    markers: []
  },
  data: () => ({
    loader: null,
    map: null
  }),
  async mounted() {
    this.loader = new Loader({
      apiKey: this.apiKey,
      version: "weekly",
      nonce: "caffe67d7b989af3a1c7f4a1a6c79bd9fb2b4eb0",
      language: 'ua'
    })
    this.loader.load().then(() => {
      this.initializeMap()
      this.initializeMarkers()
    })

  },

  methods: {
    initializeMap() {
      const mapRef = this.$refs.googleMap
      this.map = new google.maps.Map(
        mapRef, this.mapConfig
      )
    },
    initializeMarkers() {
      for (let marker of this.markers) {
        new google.maps.Marker({
          position: {
            lat: marker.position.latitude,
            lng: marker.position.longitude,
          },
          map: this.map,
          title: "Marker @" + marker.id,
        });
      }

    }
  }

}
</script>

<style scoped>
.google-map {
  overflow: auto;
  height: 400px;
}
</style>
