<template>
  <div>
    <h2 class="uk-text-center">Адмінська панель</h2>
    <div class="uk-width-1-1">
      <div class="uk-card uk-card-default uk-card-body uk-margin">
        <h3 class="uk-text-center">Ресторани</h3>
        <div>
          <NuxtLink to="/admin/restaurant/create" class="uk-button uk-button-success uk-align-right" v-if="admin">Створити ресторан
          </NuxtLink>
        </div>
        <div v-if="$fetchState.pending">
          <Loading/>
        </div>

        <template v-for="restaurant in restaurants" v-else>
          <KeepAlive>
            <Restaurant :restaurant=restaurant location_to="admin-restaurant-id"></Restaurant>
          </KeepAlive>
        </template>
        <div v-if="restaurants.length === 0">
          <img src="https://ik.imagekit.io/alouh/misc/pixeltrue-space-discovery_oz4baq5bKA5h.svg"
               class="uk-align-center" height="250" width="250" alt=""/>
          <h3 class="uk-align-center uk-text-center">Тут поки нічого немає</h3>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import admin from "~/middleware/admin";
import auth from "~/middleware/auth";
import Loading from "@/components/misc/LoadingBar";
import Restaurant from "~/components/restaurant/Restaurant";

export default {
  name: "admin-index",
  middleware: [auth,admin],
  components: {Restaurant, Loading},
  data: () => ({
    restaurants: []
  }),
  activated() {
    if (!this.$store.getters['authorization/admin'] && !this.$store.getters['authorization/partial_admin']) {
      return error({ statusCode: 404, message: '' })
    }
    // if updated more than 10sec before now
    if (this.$fetchState.timestamp <= Date.now() - 10000) {
      this.$fetch()
    }
  },
  async fetch() {
    await this.retrieve_restaurants();
  },
  methods: {
    retrieve_restaurants: async function () {
      try {
        this.restaurants = await this.$axios.$get('/restaurants');
      } catch (err) {
        if (!err.response) {
          this.$toast.error("Помилка мережі", {
            toastClassName: ['uk-margin-top']
          })
          console.error(err)
        } else {
          this.$toast.error("Сталася помилка, коли отримували список ресторанів", {
            toastClassName: ['uk-margin-top']
          })
          console.error(err.response)
        }

      }
    }
  },
  computed: {
    deleted_rest_id() {
      return this.$store.getters['admin/deleted_rest_id']
    },
    admin() {
      return this.$store.getters['authorization/admin']
    }
  },
  watch: {
    async deleted_rest_id() {
      if (this.deleted_rest_id !== 0){
        this.restaurants = this.restaurants.filter((val) => {
          return val.rest_id !== this.deleted_rest_id
        })
        await this.$store.dispatch('admin/do_set_deleted_rest_id', 0)
      }

    }
  }
}
</script>

<style scoped>
.uk-button-success {
  background-color: #08a442;
  color: #fff;
  border: 1px solid transparent;
}

div {
  overflow: auto;
}
</style>
