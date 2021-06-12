<template>
  <div>
    <h2 class="uk-text-center" v-if="is_courier">Профіль Кур'єра</h2>
    <h2 class="uk-text-center" v-else>Профіль</h2>
    <div uk-grid>
      <div class="uk-width-1-3@l">
        <div class="uk-card uk-card-default uk-card-body uk-margin">
          <div class="uk-align-right">
            <ToggleButton label-enable-text="Змінити" label-disable-text="Змінити"
                          v-on:change="update_profile_method" v-bind:default-state="update_profile"
            />
          </div>
          <img src="https://ik.imagekit.io/alouh/misc/pixeltrue-plan-1_eoum6vKBNWw0.svg"
               class="uk-align-center" height="250" width="250" alt=""/>
          <form @submit.prevent="send_update" class="uk-form-horizontal">
            <fieldset class="uk-fieldset">
              <legend class="uk-legend uk-text-center">Налаштування</legend>
              <div class="uk-margin">
                <label class="uk-form-label uk-text-bold" for="first_name">Ваше ім'я</label>
                <div class="uk-form-controls">
                  <input class="uk-input" id="first_name" type="text" placeholder="Ігор.." v-model="first_name"
                         :disabled=!update_profile required maxlength="70">
                </div>
              </div>
              <div class="uk-margin">
                <label class="uk-form-label uk-text-bold" for="tel_num">Ваш номер телефону</label>
                <div class="uk-form-controls">
                  <input class="uk-input" id="tel_num" type="tel" placeholder="380.." v-model="tel_num"
                         :disabled=!update_profile required maxlength="12">
                </div>
              </div>
            </fieldset>
            <button class="uk-button uk-button-default uk-align-right green" v-if="update_profile">Змінити</button>
          </form>
        </div>

        <div v-if="partial_admin || admin">
          <NuxtLink to="/admin" class="uk-text-center uk-button uk-button-primary uk-align-center uk-width-1-2">Панель
            адміну
          </NuxtLink>
        </div>

      </div>
      <div class="uk-width-expand">
        <div class="uk-card uk-card-default uk-card-body uk-margin">
          <h3 class="uk-text-center">Ваші замовлення</h3>
          <div v-if="$fetchState.pending">
            <Loading/>
          </div>
          <OrderComponent v-else v-for="order in orders" :key="order.order_id" :order="order">

          </OrderComponent>
          <div v-if="orders.length === 0">
            <img src="https://ik.imagekit.io/alouh/misc/pixeltrue-space-discovery_oz4baq5bKA5h.svg"
                 class="uk-align-center" height="250" width="250" alt=""/>
            <h3 class="uk-align-center uk-text-center">Тут поки нічого немає</h3>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import auth from "@/middleware/auth";
import ToggleButton from "@/components/misc/ToggleButton";
import OrderStatusTitle from "~/components/misc/OrderStatusTitle";
import Loading from "@/components/misc/LoadingBar";
import setted from "@/middleware/setted";
import _ from 'lodash'
import {mapGetters} from "vuex";
import OrderComponent from "~/components/profile/OrderComponent";

export default {
  name: "index",
  components: {Loading, ToggleButton, OrderStatusTitle, OrderComponent},
  middleware: [auth, setted],
  data: () => ({
    update_profile: false,
    orders: [],
    websocket: null
  }),
  async fetch() {
    await this.retrieve_orders();
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
    },
    ...mapGetters({
      partial_admin: 'authorization/partial_admin',
      admin: 'authorization/admin',
      is_courier: 'authorization/isCourier'
    }),
  },
  methods: {
    retrieve_orders: async function () {
      try {
        let url = '/user-orders'
        if (this.is_courier) {
          url = '/courier-orders'
        }
        this.orders = await this.$axios.$get(url);
      } catch (err) {
        if (!err.response) {
          this.$toast.error("Помилка мережі", {
            toastClassName: ['uk-margin-top']
          })
          console.error(err)
        } else {
          this.$toast.error("Сталася помилка, коли отримували ваши замовлення", {
            toastClassName: ['uk-margin-top']
          })
          console.error(err.response)
        }
      }
    },
    update_profile_method: function (value) {
      this.update_profile = value
    },
    send_update: _.debounce(async function () {
      try {
        let url = '/user-profile'
        if (this.is_courier) {
          url = '/courier-profile'
        }
        await this.$axios.$put(url, {
          "first_name": this.first_name,
          "tel_num": this.tel_num
        });
        this.$toast.success("Ваш профіль успішно оновлено", {
          toastClassName: ['uk-margin-top']
        })
      } catch (err) {
        if (!err.response) {
          this.$toast.error("Помилка мережі", {
            toastClassName: ['uk-margin-top']
          })
          console.error(err)
        } else {
          this.$toast.error(err.response.data.tel_num[0] || "Сталася помилка, під час оновлення вашого профілю", {
            toastClassName: ['uk-margin-top']
          })
          console.error(err.response)
        }

      } finally {
        this.update_profile = false
      }
    }, 2000, {leading: true, trailing: false})
  },
}
</script>

<style scoped>

.green {
  background: green;
  color: white;
}
</style>
