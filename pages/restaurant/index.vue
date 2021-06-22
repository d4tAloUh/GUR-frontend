<template>
  <div>
    <section class="hero is-primary">
      <div class="hero-body">
        <div class="container">
          <h1 class="title uk-text-center">
            Ресторани
          </h1>
        </div>
      </div>
    </section>
    <section
      class="section"
      style="padding: 1rem"
    >
      <div class="container">
        <div>
          <div class="uk-container uk-container-center uk-text-center" v-if="isAuthenticated && !finishedRegistration">
            <h3>Спочатку закінчіть реєстрацію</h3>
            <h4>
              <NuxtLink :to="{ path: '/users/register/next'}" exact>
                Продовжити
              </NuxtLink>
            </h4>

            <img src="https://ik.imagekit.io/alouh/misc/open-doodles-roller-skating_4jrKE0YFQ55K.svg" height="600"
                 width="600">

          </div>
          <div v-else-if="isAuthenticated">
            <KeepAlive>
              <GoogleMap/>
            </KeepAlive>
            <Loading v-if="loading"></Loading>
            <div v-else>
              <template v-for="restaurant in restaurantList" v-if="accepted">
                <KeepAlive>
                  <Restaurant :restaurant=restaurant location_to="restaurant-id"></Restaurant>
                </KeepAlive>
              </template>
              <div class="uk-container uk-container-center uk-text-center"
                   v-if="restaurantList.length === 0 && accepted">
                <img src="https://assets-ouch.icons8.com/preview/19/52de2377-696e-4194-8c63-0a81aef60b4f.png"
                     height="600"
                     width="600">
                <p>Ресторанів не знайдено</p>
              </div>
            </div>
          </div>
          <div class="uk-container uk-container-center uk-text-center" v-else>
            <h3>Спочатку увійдіть у свій аккаунт</h3>
            <img src="https://ik.imagekit.io/alouh/gummy-coffee_4YwHpUtVHhR4.svg" height="600"
                 width="600">
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import GoogleMap from "~/components/misc/GoogleMap";
import {mapGetters} from 'vuex'
import Restaurant from "@/components/restaurant/Restaurant";
import _ from 'lodash'
import onlyClient from "~/middleware/onlyClient";
import Loading from "~/components/misc/LoadingBar";

export default {
  name: "restaurant",
  components: {Restaurant, GoogleMap, Loading},
  middleware: [onlyClient],
  data: () => ({
    restaurantList: [],
    loading: false
  }),
  async mounted() {
    if (this.restaurantList.length === 0)
      await this.getRestaurants();
  },
  methods: {
    getRestaurants: _.debounce(async function () {
      if (this.isAuthenticated && this.location && this.accepted && this.finishedRegistration)
        try {
          this.loading = true
          this.restaurantList = await this.$axios.$get('/restaurants', {
            params: {
              'longitude': this.location[0],
              'latitude': this.location[1]
            }
          });
        } catch (err) {
          if (!err.response) {
            this.$toast.error("Помилка мережі", {
              toastClassName: ['uk-margin-top']
            })
            console.error(err)
          } else {
            console.error(err.response)
          }
        } finally {
          this.loading = false
        }
    }, 2000, {leading: true, trailing: false})
  },
  computed: {
    ...mapGetters({
      isAuthenticated: 'authorization/isAuthenticated',
      finishedRegistration: 'authorization/isSettedUp',
      location: 'order/location',
      address: 'order/address',
      accepted: 'order/accepted'
    })
  },
  watch: {
    async accepted() {
      this.restaurantList = []
      await this.getRestaurants();
    },
    async address() {
      this.restaurantList = []
      await this.getRestaurants();
    },
  }
}
</script>

<style scoped>
.uk-section {
  padding-bottom: 0;
}
</style>
