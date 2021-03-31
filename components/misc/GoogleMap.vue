<template>
  <div>
    <div id="confirmation-modal" uk-modal>
      <div class="uk-modal-dialog">
        <button class="uk-modal-close-default" type="button" uk-close></button>
        <div class="uk-modal-body">
          <p>Ваша адреса: {{ predicted_address }} ?</p>
        </div>
        <div class="uk-modal-footer uk-text-right">
          <button class="uk-button uk-button-default" type="button" @click="remove_predicted">Ні</button>
          <button class="uk-button uk-button-primary" type="button" @click="set_predicted">Так</button>
        </div>
      </div>
    </div>
    <div>
      <div class="uk-margin uk-text-center">
        <div class="uk-margin-bottom">
          <form class="" @submit.prevent="lookupCoordinates">
            <div class="uk-inline uk-width-1-2@s">
              <input type="text" class="uk-input" placeholder="Введіть вашу локацію" v-model="place" required>
              <button class="uk-form-icon uk-form-icon-flip" uk-icon="icon: search" type="submit"></button>
            </div>
          </form>
        </div>
        <div class="uk-width-1-2@s uk-margin-auto-left uk-margin-auto-right" v-if="accepted_location"
             v-show="accepted_location">
          <iframe style="width: 100%; height: 350px; border:0;"
                  v-bind:src="'https://www.google.com/maps/embed/v1/search?key=' + google_key + '&q=Kyiv+'+ place"
          ></iframe>
        </div>
        <div v-else>
          <h3>Оберіть локацію спочатку</h3>
          <img src="https://ik.imagekit.io/alouh/misc/pixeltrue-icons-seo-ads-on-google-2_oJ6CFLHaE4iBf.svg"
               height="600"
               width="600">
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Uikit from 'uikit'

export default {
  name: "GoogleMap",
  data: () => ({
    place: '',
    predicted_address: '',
    predicted_location: [],
  }),
  beforeMount() {
    if (this.$store.getters['order/address'] && this.$store.getters['order/address'] != 'null') {
      this.place = JSON.parse(JSON.stringify(this.$store.getters['order/address']))
      if (!this.accepted_location)
        this.lookupCoordinates()
    }
  },
  watch: {
    place: function (val) {
      if (val !== this.predicted_address && val !== this.$store.getters['order/address']) {
        this.$store.dispatch("order/setAccepted", false)
      }
    }
  },
  methods: {
    lookupCoordinates: function () {
      let vm = this
      this.$store.dispatch("order/setAccepted", false)
      this.$axios.get('https://maps.googleapis.com/maps/api/geocode/json?address=' + this.place + ', Kyiv&region=ua&language=uk&key=' + this.google_key)
        .then(function (response) {
          if (response.data.status === "OK" && response.data.results.length > 0) {
            vm.predicted_address = response.data.results[0].formatted_address
            vm.predicted_location = [response.data.results[0].geometry.location.lng,
              response.data.results[0].geometry.location.lat]
            Uikit.modal.confirm(`Ваша адреса: ${vm.predicted_address} ?`).then(function () {
              vm.place = JSON.parse(JSON.stringify(vm.predicted_address))
              vm.$store.dispatch('order/setLoc', vm.predicted_location)
              vm.$store.dispatch('order/setAddr', vm.predicted_address)
              vm.$store.dispatch("order/setAccepted", true)
            }, function () {
              vm.predicted_address = ''
              vm.predicted_location = ''
              vm.$store.dispatch("order/setAccepted", false)
            });
            // Uikit.modal('#confirmation-modal').toggle()
          } else {
            vm.$toast.error("Не було знайдено такої адреси", {
              toastClassName: ['uk-margin-top']
            })
          }
        })
        .catch(function (err) {
          console.error(err)
        })
    },
    set_predicted: function () {
      // console.log()
      Uikit.modal('#confirmation-modal').hide()
      this.place = JSON.parse(JSON.stringify(this.predicted_address))
      this.$store.dispatch('order/setLoc', this.predicted_location)
      this.$store.dispatch('order/setAddr', this.predicted_address)
      this.$store.dispatch("order/setAccepted", true)
    },
    remove_predicted: function () {
      Uikit.modal('#confirmation-modal').hide()
      this.predicted_address = ''
      this.predicted_location = ''
      this.$store.dispatch("order/setAccepted", false)
    }
  },
  computed: {
    accepted_location: function () {
      return this.$store.getters['order/accepted']
    },
    google_key : function (){
      return process.env.google_key
    }
  }
}
</script>

<style scoped>

</style>
