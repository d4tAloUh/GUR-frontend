<template>
  <div uk-grid>
    <div class="uk-width-1-2@l uk-text-center uk-align-center">
      <div class="uk-card uk-card-default uk-card-body uk-margin ">
        <img src="https://ik.imagekit.io/alouh/misc/pixeltrue-time-management-1_QGP0gBFdiIGn.svg"
             class="uk-align-center" height="250" width="250" alt=""/>
        <form @submit.prevent="send_update" class="uk-form-horizontal">
          <fieldset class="uk-fieldset">
            <legend class="uk-legend uk-text-center">Завершення реєстрації</legend>
            <div class="uk-margin">
              <label class="uk-form-label uk-text-bold" for="first_name">Ваше ім'я</label>
              <div class="uk-form-controls">
                <input class="uk-input" id="first_name" type="text" placeholder="Ігор.." v-model="first_name"
                       required maxlength="70">
              </div>
            </div>
            <div class="uk-margin">
              <label class="uk-form-label uk-text-bold" for="tel_num">Ваш номер телефону</label>
              <div class="uk-form-controls">
                <input class="uk-input" id="tel_num" type="tel" placeholder="380.." v-model="tel_num"
                       required maxlength="12">
              </div>
            </div>
          </fieldset>
          <button class="uk-button uk-button-default uk-align-right green" type="submit">Відправити</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import auth from "@/middleware/auth";
import _ from 'lodash'
import onlyCourier from "~/middleware/onlyCourier";
import ResErrorHandler from "@/utils/ResErrorHandler";

export default {
  name: "next",
  middleware: [auth, onlyCourier],
  data: () => ({
    phone_regex: null
  }),
  created() {
    this.phone_regex = new RegExp('^(380)([0-9]{9})$')
  },
  methods: {
    send_update: _.debounce(async function () {
      try {
        if (this.first_name.trim().length < 3){
          this.$toast.warning("Введіть корректне ім'я", {
            toastClassName: ['uk-margin-top']
          })
          return
        }
        if (!this.phone_regex.test(this.tel_num)) {
          this.$toast.warning("Введіть корректний номер телефону 380..", {
            toastClassName: ['uk-margin-top']
          })
          return
        }
        let response = await this.$axios.$put('/courier -profile', {
          "first_name": this.first_name.trim(),
          "tel_num": this.tel_num.trim()
        });
        this.tel_num = response.tel_num
        this.first_name = response.first_name
        this.$toast.success("Ви успішно зарєструвалися.", {
          toastClassName: ['uk-margin-top']
        })
        await this.$router.push('/courier')
      } catch (err) {
        if (!err.response)
          this.$toast.warning("Помилка мережі.", {
            toastClassName: ['uk-margin-top']
          })
        else{
          this.$toast.warning(ResErrorHandler.checkFormErrors(err) || "Сталася помилка. Інформація не була додана.", {
            toastClassName: ['uk-margin-top']
          })
        }
      }
    },2000,{leading:true, trailing:false})
  },
  computed: {
    first_name: {
      get() {
        return this.$store.getters['authorization/first_name']
      },
      set(value) {
        this.$store.dispatch('authorization/do_set_name', value)
      }
    },
    tel_num: {
      get() {
        return this.$store.getters['authorization/tel_num']
      },
      set(value) {
        this.$store.dispatch('authorization/do_set_tel_num', value)
      }
    }
  }
}
</script>

<style scoped>

</style>
