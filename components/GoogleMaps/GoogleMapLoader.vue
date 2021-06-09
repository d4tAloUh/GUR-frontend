<template>
  <div>
    <div class="google-map" ref="googleMap"></div>
    {{ mainMarker }}
  </div>
</template>

<script>
import {Loader} from '@googlemaps/js-api-loader';
import {mapGetters} from "vuex";
import {parse, stringify} from 'flatted';

export default {
  name: "GoogleMapLoader",
  props: {
    mapConfig: Object,
    apiKey: String,
    markers: [],
  },
  data: () => ({
    loader: null,
    map: null,
    mainMarker: null
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
        console.log(marker)
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
      // if (this.is_courier) {
      //   // let lat = Number(JSON.stringify(this.latitude))
      //   let lat = 50.460569
      //   // let lng = Number(JSON.stringify(this.longitude))
      //   let lng = 30.591311
      //   let marker = new google.maps.Marker({
      //     position: {
      //       lat: lat,
      //       lng: lng
      //     },
      //     map: this.map,
      //     label: 'You',
      //     title: 'you'
      //   });
        // this.mainMarker= parse(stringify(marker))
      // }
    },
  },
  computed: {
    ...mapGetters({
      is_courier: 'authorization/isCourier'
    }),
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
  // watch: {
    // longitude() {
    //   console.log("courier location changed")
    // },
    // latitude() {
    //   console.log("courier location changed")
    // },
  // }
}
</script>

<style scoped>
.google-map {
  overflow: auto;
  height: 400px;
}
</style>
