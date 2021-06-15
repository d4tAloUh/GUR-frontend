<template>
  <div>
    <div class="google-map" ref="googleMap"></div>
  </div>
</template>

<script>
import {Loader} from '@googlemaps/js-api-loader';
import {mapGetters} from "vuex";

export default {
  name: "GoogleMapLoader",
  props: {
    mapConfig: Object,
    apiKey: String,
  },
  data: () => ({
    loader: null,
    map: null,
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
    })
  },
  methods: {
    initializeMap() {
      const mapRef = this.$refs.googleMap
      this.map = new google.maps.Map(
        mapRef, this.mapConfig
      )
      this.$emit('passMapToParent', this.map)
    },
  },
}
</script>

<style scoped>
.google-map {
  overflow: auto;
  height: 400px;
}
</style>
