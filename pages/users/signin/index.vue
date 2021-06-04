<template>
  <div>

    <div class="uk-child-width-1-2@m uk-grid">
      <div>
        <div class="uk-card uk-card-default uk-card-small uk-card-body">
          <img src="https://assets-ouch.icons8.com/preview/457/0b338840-2e33-432e-a547-4d3e5acc960c.png" height="500"
               width="500" class="uk-align-center" alt="">
        </div>
      </div>
      <div>
        <div class="uk-card uk-card-default uk-card-large uk-card-body">

          <form @submit.stop.prevent="handleSubmit">
            <fieldset class="uk-fieldset">

              <legend class="uk-legend">Увійти</legend>
              <div class="uk-align-right">
                <ToggleButton ton label-enable-text="Кур'єр" label-disable-text="Користувач"
                              v-on:change="update_as_courier" v-bind:default-state="as_courier"
                />
              </div>
              <div class="uk-margin">
                <label class="uk-form-label">Емейл</label>
                <input class="uk-input" v-model="username" type="email" placeholder="your.email@gmail.com">
              </div>

              <div class="uk-margin">
                <label class="uk-form-label">Пароль</label>
                <input class="uk-input" v-model="password" type="password">
              </div>

              <div class="uk-margin">
                <button class="uk-button uk-button-primary uk-width-1-1" :disabled="loading"
                        @click="handleSubmit({username,password})">
                  Відправити
                </button>
              </div>

              <div class="uk-margin">
                <p>
                  Не маєте аккаунту?
                  <NuxtLink :to="{ path: '/users/register'}" exact>
                    Реєстрація
                  </NuxtLink>
                </p>
              </div>
            </fieldset>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {mapMutations, mapActions, mapGetters} from 'vuex'
import ToggleButton from "~/components/misc/ToggleButton";

export default {
  name: "signin",
  components: {ToggleButton},
  data: () => ({
    username: '',
    password: '',
    loading: false,
    as_courier: false
  }),
  methods: {
    update_as_courier: function (value) {
      this.as_courier = value
    },
    async handleSubmit({username, password}) {
      try {
        this.loading = true
        await this.login({username, password})
        try {
          await this.getUser(this.as_courier)
          this.loading = false
          this.$toast.success("Ви успішно увійшли в свій аккаунт.", {
            toastClassName: ['uk-margin-top']
          })
          if (!this.finishedRegistration) {
            this.$toast.info("Спочатку необхідно закінчити реєстрацію.", {
              toastClassName: ['uk-margin-top']
            })
            if (this.isCourier) {
              await this.$router.push('/courier/register/next')
            } else {
              await this.$router.push('/users/register/next')
            }
          } else {
            if (this.isCourier) {
              await this.$router.push('/courier/profile')
            } else {
              await this.syncCart()
              await this.$router.push('/restaurant')
            }
          }
        } catch (err) {
          this.loading = false
          await this.logout()
          this.$toast.error(err.response.data || "Сталася помилка.", {
            toastClassName: ['uk-margin-top']
          })
        }
      } catch (err) {
        this.loading = false
        if (!err.response) {
          this.$toast.error("Не отримано відповіді від серверу. Зачекайте, будь ласка.", {
            toastClassName: ['uk-margin-top']
          })
        } else {
          console.error(err.response.data)
          this.$toast.error("Не знайдено такого користувача.", {
            toastClassName: ['uk-margin-top']
          })
        }
      }

    },
    ...mapActions({
      login: 'authorization/login',
      getUser: 'authorization/getUser',
      syncCart: 'cart/syncWithServer',
      logout: 'authorization/logout'
    })
  },
  computed: {
    ...mapGetters({
      currentUser: 'authorization/getUser',
      finishedRegistration: 'authorization/isSettedUp',
      isCourier: 'authorization/isCourier'
    })
  }
}
</script>

<style scoped>

</style>
