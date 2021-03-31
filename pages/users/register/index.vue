<template>
  <div>

    <div class="uk-child-width-1-2@m uk-grid">
      <div>
        <div class="uk-card uk-card-default uk-card-small uk-card-body">
          <img src="https://assets-ouch.icons8.com/preview/294/e25a0374-0657-45d5-98d9-2408473a744c.png" height="500"
               width="500" class="uk-align-center" alt="">
        </div>
      </div>
      <div>
        <div class="uk-card uk-card-default uk-card-large uk-card-body">

          <form @submit.stop.prevent="handleSubmit">
            <fieldset class="uk-fieldset">

              <legend class="uk-legend">Реєстрація</legend>

              <div class="uk-margin">
                <label class="uk-form-label" for="email-id">Емейл</label>
                <input class="uk-input" id="email-id" v-model="email" type="email" placeholder="">
              </div>

              <div class="uk-margin">
                <label class="uk-form-label" for="pass-id">Пароль</label>
                <input class="uk-input" id="pass-id" v-model="password" type="password">
              </div>

              <div class="uk-margin">
                <button class="uk-button uk-button-primary uk-width-1-1" :disabled="loading" type="submit">Надіслати
                </button>
              </div>

              <div class="uk-margin">
                <p>
                  Вже маєте аккаунт?
                  <NuxtLink :to="{ path: '/users/signin'}" exact>
                    Увійти
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
import _ from "lodash";

export default {
  name: "register",
  data: () => ({
    email: '',
    password: '',
    loading: false,
  }),
  methods: {
    handleSubmit: _.debounce(async function () {
      try {
        this.loading = true;
        this.restaurantList = await this.$axios.$post('/register',
          {
            "email": this.email,
            "password": this.password
          });
        this.loading = false;
        this.$toast.success("Успішна реєстрація, увійдіть у аккаунт", {
          toastClassName: ['uk-margin-top']
        })
        await this.$router.push('/users/signin')
      } catch (err) {
        this.loading = false;
        if (!err.response)
          this.$toast.warning("Помилка мережі", {
            toastClassName: ['uk-margin-top']
          })
        else {
          if (err.response['data'].email) {
            this.$toast.warning("Вже існує користувач з таким емейлом", {
              toastClassName: ['uk-margin-top']
            })
          } else {
            console.error(err.response)
            this.$toast.warning("Сталася помилка", {
              toastClassName: ['uk-margin-top']
            })
          }
        }
      }

    }, 2000, {
      leading: true, trailing: false
    })
  },
}
</script>

<style scoped>
</style>
