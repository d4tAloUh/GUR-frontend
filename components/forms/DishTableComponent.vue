<template>
  <tr>
    <td>{{ dish.name }}</td>
    <td>{{ dish.price }}</td>
    <td>{{ dish.gramme }}</td>
    <td>{{ dish.description }}</td>
    <td class="uk-float-right">
      <button class="uk-button uk-button-danger" @click="post_delete">Видалити</button>
      <NuxtLink :to="{ name: 'admin-dish-id', params: { id: dish.dish_id, dish}}" tag="a"
                class="uk-button uk-button-primary">Змінити

      </NuxtLink>
    </td>
  </tr>
</template>

<script>
import _ from "lodash";

export default {
  name: "DishTableComponent",
  props: {
    dish: {
      type: Object,
      default: () => ({
        name: '',
        photo: '',
        description: '',
        price: 0,
        gramme: 0,
        dish_id: 0
      })
    },
  },
  methods: {
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

  }
}
</script>

<style scoped>

</style>
