<template>
  <div class="uk-card uk-card-default uk-card-body">
    <fieldset class="uk-fieldset">
      <div style="overflow: auto">
        <button class="uk-button uk-button-danger uk-float-right " @click="post_delete" v-if="!to_create">Видалити
        </button>
      </div>
      <legend class="uk-legend" v-if="!to_create">Зміна ресторану <b>{{ restaurant.name }}</b></legend>
      <legend class="uk-legend" v-else>Створення ресторану <b>{{ restaurant.name }}</b></legend>
      <form @submit.prevent="form_method">
        <div class="uk-margin">
          <label>Назва ресторану</label>
          <input type="text" name="name" v-model="restaurant.name " required class="uk-input"
                 v-bind:class="(restaurant.name.length===0)?'uk-form-danger':'uk-form-success'"/>
        </div>
        <div class="uk-margin">
          <label>Адреса ресторану</label>
          <input type="text" name="rest_address" v-model="restaurant.rest_address" required class="uk-input"
                 v-bind:class="(restaurant.rest_address.length===0)?'uk-form-danger':'uk-form-success'"/>
        </div>
        <div class="uk-margin">
          <label>Посилання на фото ресторану</label>
          <input type="text" name="rest_photo" v-model="restaurant.rest_photo" class="uk-input"/>
        </div>
        <div class="uk-margin">
          <label>Відкрито з</label>
          <input type="time" name="open_from" v-model="restaurant.open_from" class="uk-input"/>
        </div>
        <div class="uk-margin">
          <label>Відкрито до</label>
          <input type="time" name="open_to" v-model="restaurant.open_to" class="uk-input"/>
        </div>
        <div class="uk-align-right">
          <button class="uk-button uk-button-success" type="submit" v-if="to_create">Створити</button>
          <button class="uk-button uk-button-primary" type="submit" v-else>Змінити</button>
        </div>
      </form>
    </fieldset>
  </div>
</template>

<script>
import _ from 'lodash'
import ResErrorHandler from "~/utils/ResErrorHandler";

export default {
  name: "RestaurantForm",
  props: {
    restaurant: {
      type: Object,
      default: () => ({
        rest_photo: '',
        rest_address: '',
        name: '',
        open_from: '',
        open_to: '',
        rest_id: 0
      })
    },
    to_create: {
      type: Boolean,
      default: false
    },
  },
  data: () => ({
    location: [],
  }),
  methods: {
    post_create: _.debounce(async function () {
      await this.get_location()
      let data = {
        rest_photo: this.restaurant.rest_photo,
        rest_address: this.restaurant.rest_address,
        name: this.restaurant.name,
        location: {
          longitude: this.location[0],
          latitude: this.location[1],
        },
      }
      if (this.restaurant.open_from.length > 0) {
        data.open_from = this.restaurant.open_from
      }
      if (this.restaurant.open_to.length > 0) {
        data.open_to = this.restaurant.open_to
      }
      if (this.location.length > 0)
        await this.$axios.post('/restaurants', data)
          .then(response => {
            this.$toast.success("Ресторан було успішно створено", {
              toastClassName: ['uk-margin-top']
            })
            Object.assign(this.restaurant, response.data)
            this.$router.push("/admin/restaurant/" + this.restaurant.rest_id)
          })
          .catch(err => {
            console.log(err)
            if (!err.response) {
              this.$toast.error("Помилка мережі", {
                toastClassName: ['uk-margin-top']
              })
              console.error(err)
            } else {
              this.$toast.warning(ResErrorHandler.checkFormErrors(err) || "Сталася помилка. Ресторан не було створено.", {
                toastClassName: ['uk-margin-top']
              })
            }
          })

    }, 2000, {leading: true, trailing: false}),
    get_location: async function () {
      let vm = this
      return this.$axios.get('https://maps.googleapis.com/maps/api/geocode/json?address=' + this.restaurant.rest_address + ', Kyiv&region=ua&language=uk&key=' + process.env.google_key)
        .then(function (response) {
          if (response.data.status === "OK" && response.data.results.length > 0) {
            vm.restaurant.rest_address = response.data.results[0].formatted_address
            vm.location = [response.data.results[0].geometry.location.lng,
              response.data.results[0].geometry.location.lat]
            return vm.location
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
    post_update: _.debounce(async function () {
      await this.get_location()
      let data = {
        rest_photo: this.restaurant.rest_photo,
        rest_address: this.restaurant.rest_address,
        name: this.restaurant.name,
        location: {
          longitude: this.location[0],
          latitude: this.location[1],
        },
      }
      if (this.restaurant.open_from && this.restaurant.open_from.length > 0) {
        data.open_from = this.restaurant.open_from
      }
      if (this.restaurant.open_to && this.restaurant.open_to.length > 0) {
        data.open_to = this.restaurant.open_to
      }
      await this.$axios.$put('/restaurants/' + this.restaurant.rest_id, data)
        .then(response => {
          console.log(response)
          this.$toast.success("Інформацію було успішно оновлено", {
            toastClassName: ['uk-margin-top']
          })
        })
        .catch(err => {
          if (!err.response) {
            this.$toast.error("Помилка мережі", {
              toastClassName: ['uk-margin-top']
            })
            console.error(err)
          } else {
            this.$toast.warning(ResErrorHandler.checkFormErrors(err) || "Сталася помилка. Ресторан не було оновлено.", {
              toastClassName: ['uk-margin-top']
            })
            console.error(err.response)
          }
        })
    }, 2000, {leading: true, trailing: false}),
    post_delete: async function () {
      await this.$axios.$delete('/restaurants/' + this.restaurant.rest_id,)
        .then(response => {
          this.$toast.success("Ресторан було успішно видалено", {
            toastClassName: ['uk-margin-top']
          })
          this.$store.dispatch('admin/do_set_deleted_rest_id', this.restaurant.rest_id)
          this.$router.push('/admin')
        })
        .catch(err => {
          if (!err.response) {
            this.$toast.error("Помилка мережі", {
              toastClassName: ['uk-margin-top']
            })
            console.error(err)
          } else {
            this.$toast.error(err.response.data.error || "Сталася помилка", {
              toastClassName: ['uk-margin-top']
            })
            console.error(err.response)
          }
        })
    }
  },
  computed: {
    form_method() {
      return this.to_create ? this.post_create : this.post_update
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
</style>
