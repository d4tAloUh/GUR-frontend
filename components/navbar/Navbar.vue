<template>
  <client-only>
    <nav class="uk-navbar-container" uk-navbar>
      <div class="uk-navbar-left">

        <ul class="uk-navbar-nav">
          <li class="uk-active">
            <NuxtLink tag="a" class="navbar-brand" to="/" exact>GUR</NuxtLink>
          </li>
          <li v-if="isCourier">
            <NuxtLink tag="a" class="navbar-brand" to="/courier/" exact>Замовлення</NuxtLink>
          </li>
          <li v-else>
            <NuxtLink tag="a" class="navbar-brand" to="/restaurant" exact>Ресторани</NuxtLink>
          </li>
        </ul>

      </div>
      <div class="uk-navbar-right">
        <ul class="uk-navbar-nav" v-if="isAuthenticated">
          <li v-if="!isCourier">
            <NuxtLink to="/orders/create">
              <div class="uk-align-center margin-top">
                <span uk-icon="cart"></span>
                <span class="uk-badge badge-on-cart">{{ amountOfFood }}</span>
              </div>
            </NuxtLink>
          </li>
          <li v-else>
            <ToggleButton label-enable-text="Працюю" label-disable-text="Відпочиваю" class="uk-align-center margin-top-button"
                          v-on:change="set_courier_working" v-bind:default-state="courier_working"
            />
          </li>

          <li v-if="userIsDefined">
            <NuxtLink v-if="isCourier" tag="a" to="/courier/profile" exact class="uk-link-reset">{{
                user.first_name
              }}
            </NuxtLink>
            <NuxtLink v-else tag="a" to="/profile" exact class="uk-link-reset">{{ user.first_name }}</NuxtLink>
          </li>
          <li v-else>
            <NuxtLink v-if="isCourier" tag="a" to="/courier/profile" exact class="uk-link-reset">Профіль</NuxtLink>
            <NuxtLink tag="a" to="/profile" exact class="uk-link-reset">Профіль</NuxtLink>
          </li>
          <li><a class="uk-link-reset" @click.prevent="logout">Вийти</a></li>

        </ul>
        <ul class="uk-navbar-nav" v-else>
          <li>
            <NuxtLink tag="a" to="/users/register" exact>Реєстрація</NuxtLink>
          </li>
          <li>
            <NuxtLink tag="a" to="/users/signin" exact>Увійти</NuxtLink>
          </li>
        </ul>
      </div>
    </nav>
  </client-only>
</template>

<script>
import {mapGetters} from 'vuex'
import ToggleButton from "~/components/misc/ToggleButton";

export default {
  name: "Navbar",
  components: {ToggleButton},
  computed: {
    ...mapGetters({
      isAuthenticated: 'authorization/isAuthenticated',
      user: 'authorization/getUser',
      amountOfFood: 'cart/numberOfItems',
      isCourier: 'authorization/isCourier'
    }),
    userIsDefined: function () {
      return (typeof this.user !== 'undefined') && this.user && this.user.first_name && (this.user.first_name !== '')
    },
    courier_working: function() {
      return  this.$store.getters['courier/courier_working']
    },
  },
  methods: {
    logout: function () {
      this.$store.dispatch('order/clear')
      this.$store.dispatch('cart/setOrder', 0)
      this.$store.dispatch('cart/finishOrder')
      this.$store.dispatch('authorization/logout')
      this.$store.dispatch('order/setAccepted', false)

      this.$toast.info("Ви вийшли зі свого аккаунту", {
        toastClassName: ['uk-margin-top']
      })
      this.$router.push('/')
    },
    set_courier_working: function(value) {
      this.$store.dispatch('courier/do_set_courier_working', value)
    }
  },

}
</script>

<style scoped>
.badge-on-cart {
  margin-left: -10px;
  margin-top: -30px;
}

.margin-top {
  margin-top: 20px;
}
.margin-top-button{
  margin-top: 29px;
}
</style>
