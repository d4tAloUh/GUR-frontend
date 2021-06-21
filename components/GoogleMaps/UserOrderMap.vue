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
  name: "UserOrderMap",
  props: ["apiKey", "user_location", "courier_location"],
  data: () => ({
    map: null,
    existing_markers: [],
    mapConfig: {
      zoom: 13,
      streetViewControl: false
    },
  }),
  beforeMount() {
    this.mapConfig.center = this.user_location
  },
  methods: {
    acceptMap(map) {
      this.map = map
      this.initializeMarkers()
    },
    initializeMarkers() {
      let bounds = new google.maps.LatLngBounds();
      let lat = Number(JSON.stringify(this.user_location.lat))
      let lng = Number(JSON.stringify(this.user_location.lng))
      const order_marker = new google.maps.Marker({
        position: {
          lat: lat,
          lng: lng
        },
        map: this.map,
        icon: {url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"}
      });
      bounds.extend(order_marker.getPosition())
      this.existing_markers = []
      this.existing_markers.push(order_marker)
      if (this.courier_location) {
        lat = Number(JSON.stringify(this.courier_location.lat))
        lng = Number(JSON.stringify(this.courier_location.lng))
        const courier_marker = new google.maps.Marker({
          position: {
            lat: lat,
            lng: lng
          },
          map: this.map,
          label: {
            color: 'black',
            text: "Кур'єр",
          },
        });
        this.existing_markers.push(courier_marker)
        bounds.extend(courier_marker.getPosition())
      }
      this.map.fitBounds(bounds);
      this.map.setCenter(bounds.getCenter());
    },
  },
  computed: {
    ...mapGetters({
      is_courier: 'authorization/isCourier'
    }),
  },
  watch: {
    center() {
      if (this.map) {
        let position = new google.maps.LatLng(this.user_location.lat, this.user_location.lng);
        this.existing_markers[0].setPosition(position)
      }
    },
    courier_location() {
      if (this.map && this.existing_markers.length === 2) {
        let position = new google.maps.LatLng(this.courier_location.lat, this.courier_location.lng);
        this.existing_markers[1].setPosition(position)
      }
      // else if (this.existing_markers.length === 1 && this.courier_location) {
      //   let lat = Number(JSON.stringify(this.courier_location.lat))
      //   let lng = Number(JSON.stringify(this.courier_location.lng))
      //   const courier_marker = new google.maps.Marker({
      //     position: {
      //       lat: lat,
      //       lng: lng
      //     },
      //     map: this.map,
      //     label: {
      //       color: 'white',
      //       fontWeight: 'bold',
      //       text: "Кур'єр",
      //     },
      //     icon: {
      //       labelOrigin: new google.maps.Point(45, 8),
      //     },
      //   });
      //   this.existing_markers.push(courier_marker)
      // }
    },
  }
}
</script>

<style scoped>
</style>
