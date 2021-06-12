<template>
  <div>
    <div class="uk-margin-bottom">
    <NuxtLink to="/admin" class="uk-button uk-button-secondary">Назад</NuxtLink>
    </div>
    <RestaurantForm :restaurant="restaurant"/>
    <div class="uk-margin-top">
      <NuxtLink :to="{ name: 'admin-dish-create-id', params: {id:rest_id}}" tag="a"
                class="uk-button uk-button-success uk-align-right" >Додати страву
      </NuxtLink>
    </div>

    <table class="uk-table uk-table-striped" v-if="dishes.length !== 0">
      <thead>
      <tr>
        <th>Назва</th>
        <th>Ціна</th>
        <th>Грами</th>
        <th>Опис Страви</th>
      </tr>
      </thead>
      <tbody>
      <template v-for="dish in dishes">
        <DishTableComponent :dish="dish" @delete-dish="filter_out_dishes"/>
      </template>
      </tbody>
    </table>

  </div>
</template>

<script>
import RestaurantForm from "~/components/forms/RestaurantForm";
import DishTableComponent from "~/components/forms/DishTableComponent";
import admin from "~/middleware/admin";
import auth from "~/middleware/auth";

export default {
  name: "admin-restaurant",
  components: {RestaurantForm, DishTableComponent},
  data: () => ({
    dishes: [],
    restaurant: Object,
  }),
  middleware: [admin, auth],
  activated() {
    if (!this.$store.getters['authorization/admin'] && !this.$store.getters['authorization/partial_admin']) {
      return error({ statusCode: 404, message: '' })
    }
  },
  async created() {
    this.restaurant = this.restaurant_passed
    await this.getDishes();
  },
  methods: {
    async getDishes() {
      try {
        let response = await this.$axios.$get('/restaurant-dishes/' + this.$route.params.id);
        this.dishes = response.dishes
        if (!this.restaurant)
          this.restaurant = response.restaurant
      } catch (err) {
        if (!err.response) {
          this.$toast.error("Помилка мережі", {
            toastClassName: ['uk-margin-top']
          })
          console.error(err)
        } else {
          if (Number(err.response.status) === 404) {
            this.$router.back()
            this.$toast.error("Такого ресторану не існує", {
              toastClassName: ['uk-margin-top']
            })
          } else {
            this.$toast.error("Сталася помилка, коли отримували страви", {
              toastClassName: ['uk-margin-top']
            })
          }
          console.error(err.response.data)
        }
      }
    },
    filter_out_dishes: function (dish_id) {
      this.dishes = this.dishes.filter((dish) => {
        return dish.dish_id !== dish_id
      })
    }
  },
  computed: {
    rest_id: function () {
      return Number(this.$route.params.id)
    },
    restaurant_passed: {
      get() {
        return this.$route.params.restaurant
      },
      set(value) {
        this.$route.params.restaurant = value
      }
    },
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
