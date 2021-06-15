<template>
  <div>
    <GoogleMapLoader
      :mapConfig="mapConfig"
      :apiKey=apiKey
      v-on:passMapToParent="acceptMap"
    />
  </div>
</template>

<script>
import {mapGetters} from "vuex";

export default {
  name: "CourierMap",
  props: ["markers", "apiKey"],
  data: () => ({
    map: null,
    existing_markers: [],
    mapConfig: {
      center: {lat: 50.445151, lng: 30.573871},
      zoom: 13,
      streetViewControl: false
    },
  }),
  mounted() {
    this.initializeMarkers()
  },
  methods: {
    acceptMap(map) {
      this.map = map
      this.initializeMarkers()
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
          label: 'order_' + marker.id
        });
      }
      let lat = Number(JSON.stringify(this.latitude))
      let lng = Number(JSON.stringify(this.longitude))
      var marker = new google.maps.Marker({
        position: {
          lat: lat,
          lng: lng
        },
        map: this.map,
        icon: {url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"}
      });
      this.existing_markers = []
      this.existing_markers.push(marker)
    },
  },
  computed: {
    longitude: {
      get() {
        return this.$store.getters['courier/courier_location'].longitude
      },
    },
    latitude: {
      get() {
        return this.$store.getters['courier/courier_location'].latitude
      },
    },
  },
  watch: {
    longitude() {
      let position = new google.maps.LatLng(this.latitude, this.longitude);
      this.existing_markers[0].setPosition(position)
    },
    latitude() {
      let position = new google.maps.LatLng(this.latitude, this.longitude);
      this.existing_markers[0].setPosition(position)
    },
  }
}
</script>

<style scoped>

</style>
