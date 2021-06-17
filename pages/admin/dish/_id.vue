<template>
  <div>
    <div v-if="$fetchState.pending">
      <Loading />
      <div class="uk-margin-top uk-text-center uk-text-large">Зачекайте будь ласка..</div>
    </div>
    <DishForm :dish="dish" v-else/>
  </div>
</template>

<script>
import DishForm from "~/components/forms/DishForm";
import admin from "~/middleware/admin";
import auth from "~/middleware/auth";
import Loading from "~/components/misc/LoadingBar";

export default {
  name: "admin-dish-id",
  components: { DishForm, Loading },
  middleware: [admin, auth],
  data: () => ({
    dish: Object,
  }),
  activated() {
    if (!this.$store.getters['authorization/admin'] && !this.$store.getters['authorization/partial_admin']) {
      return error({statusCode: 404, message: ''})
    }
  },
  async fetch(){
      this.dish = this.dish_passed
      if (!this.dish_passed) {
        await this.getDish()
      }
  },

  methods: {
    async getDish() {
      try {
        let response = await this.$axios.$get('/restaurant-dishes-exact/' + this.$route.params.id)
        this.dish = response.dish
      } catch (err) {
        if (!err.response) {
          this.$toast.error("Помилка мережі", {
            toastClassName: ['uk-margin-top']
          })
        } else {
          if (Number(err.response.status) === 404) {
            console.log("Status is 404")
            await this.$router.push("/admin")
            this.$toast.error("Такої страви не існує", {
              toastClassName: ['uk-margin-top']
            })
          } else {
            console.log("Status is not 404")
            this.$toast.error("Сталася помилка, коли отримували страву", {
              toastClassName: ['uk-margin-top']
            })
          }
        }
      }
    },
  },
  computed: {
    dish_passed: {
      get() {
        return this.$route.params.dish
      },
      set(value) {
        this.$route.params.dish = value
      }
    },

  }
}
</script>

<style scoped>

</style>
