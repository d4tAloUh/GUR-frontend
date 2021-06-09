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
      // this.initializeMarkers()
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
    // initializeMarkers() {
    //   for (let marker of this.markers) {
    //     new google.maps.Marker({
    //       position: {
    //         lat: marker.position.latitude,
    //         lng: marker.position.longitude,
    //       },
    //       map: this.map,
    //       title: "Marker @" + marker.id,
    //       label: 'order_' + marker.id
    //     });
    //   }
    //   if (this.is_courier) {
    //     let lat = Number(JSON.stringify(this.latitude))
    //     let lng = Number(JSON.stringify(this.longitude))
    //     var marker = new google.maps.Marker({
    //       position: {
    //         lat: lat,
    //         lng: lng
    //       },
    //       map: this.map,
    //       icon: {url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"}
    //     });
    //     this.existing_markers.push(marker)
    //   }
    // },
  },


}
</script>

<style scoped>
.google-map {
  overflow: auto;
  height: 400px;
}
</style>
