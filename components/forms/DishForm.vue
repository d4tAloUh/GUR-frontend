<template>
  <div class="uk-card uk-card-default uk-card-body">
    <fieldset class="uk-fieldset">
      <button class="uk-button uk-button-danger" @click="post_delete" v-if="!to_create">Видалити</button>
      <legend class="uk-legend" v-if="!to_create">Зміна страви <b>{{ dish.name }}</b></legend>
      <legend class="uk-legend" v-else>Створення страви <b>{{ dish.name }}</b></legend>

      <div class="uk-margin">
        <label>Назва страви</label>
        <input type="text" name="name" v-model="dish.name " required class="uk-input"
               v-bind:class="(dish.name.length===0)?'uk-form-danger':'uk-form-success'"/>
      </div>
      <div class="uk-margin">
        <label>Фотографія страви</label>
        <input type="text" name="rest_address" v-model="dish.dish_photo" required class="uk-input"/>
      </div>
      <div class="uk-margin">
        <label>Опис страви</label>
        <input type="text" name="rest_photo" v-model="dish.description" class="uk-input"/>
      </div>
      <div class="uk-margin">
        <label>Ціна (в коп)</label>
        <input type="number" name="open_from" v-model="dish.price" class="uk-input" required min="1"
               v-bind:class="(dish.price===0)?'uk-form-danger':'uk-form-success'"/>
      </div>
      <div class="uk-margin">
        <label>Грамовка</label>
        <input type="number" name="open_to" v-model="dish.gramme" class="uk-input" required min="1"
               v-bind:class="(dish.gramme===0)?'uk-form-danger':'uk-form-success'"/>
      </div>
      <div class="uk-align-right">
        <button to="/admin" class="uk-button uk-button-secondary" @click="$router.back()">Назад</button>
        <button class="uk-button uk-button-success" @click="post_create" v-if="to_create">Створити</button>
        <button class="uk-button uk-button-primary" @click="post_update" v-else>Змінити</button>
      </div>
    </fieldset>
  </div>
</template>

<script>
import _ from 'lodash'

export default {
  name: "DishForm",
  props: {
    dish: {
      type: Object,
      default: () => ({
        name: '',
        dish_photo: '',
        description: '',
        price: 0,
        gramme: 0
      })
    },
    to_create: {
      type: Boolean,
      default: false
    },
    rest_id: {
      type: Number
    }
  },
  methods: {
    post_create: _.debounce(async function () {
      await this.$axios.post('/restaurant-dishes/0', {
        name: this.dish.name,
        dish_photo: this.dish.dish_photo,
        restaurant_id: this.rest_id,
        description: this.dish.description,
        price: this.dish.price,
        gramme: this.dish.gramme
      })
        .then(response => {
          this.$toast.success("Страву було успішно створено", {
            toastClassName: ['uk-margin-top']
          })
          this.$router.back()
        })
        .catch(err => {
          console.log(err)
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

    }, 2000, {leading: true, trailing: false}),
    post_update: _.debounce(async function () {
      await this.$axios.$put('/restaurant-dishes/' + this.dish.dish_id, {
        name: this.dish.name,
        dish_photo: this.dish.dish_photo,
        restaurant_id: this.rest_id,
        description: this.dish.description,
        price: this.dish.price,
        gramme: this.dish.gramme,
        dish_id: this.dish.dish_id
      })
        .then(response => {
          this.$toast.success("Страву було успішно оновлено", {
            toastClassName: ['uk-margin-top']
          })
          this.$router.back()
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
    }, 2000, {leading: true, trailing: false}),
    post_delete: async function () {
      await this.$axios.$delete('/restaurant-dishes/' + this.dish.dish_id, {
        data: {
          'dish_id': this.dish.dish_id
        }
      })
        .then(response => {
          this.$toast.success("Страву було успішно видалено", {
            toastClassName: ['uk-margin-top']
          })
          this.$router.back()
          this.$emit('delete-dish', this.dish.dish_id)
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
}
</script>

<style scoped>
.uk-button-success {
  background-color: #08a442;
  color: #fff;
  border: 1px solid transparent;
}
</style>
