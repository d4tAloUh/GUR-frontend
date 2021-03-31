<template>
  <div class="uk-card uk-card-default uk-card-body uk-margin">
    <client-only>
      <div id="confirmation-modal" uk-modal class="address-confirmation">
        <div class="uk-modal-dialog">
          <button class="uk-modal-close-default" type="button" uk-close></button>
          <div class="uk-modal-body">
            <p>Ваша адреса: {{ predicted_address }} ?</p>
          </div>
          <div class="uk-modal-footer uk-text-right">
            <button class="uk-button uk-button-default" type="button" @click="remove_predicted">Ні</button>
            <button class="uk-button uk-button-primary" type="button" @click="set_predicted">Так</button>
          </div>
        </div>
      </div>
    </client-only>
    <h2>Ваше замовлення:</h2>
    <div v-if="price > 0">
      <table class="uk-table uk-table-striped uk-table-small uk-table-responsive">
        <thead>
        <tr>
          <th>Назва</th>
          <th>Ціна (шт.)</th>
          <th>Кількість</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="dish in selectedDishes">
          <td class="uk-width-1-2">{{ dish.name }}</td>
          <td class="uk-table-shrink">{{ decimalPrice(dish.price) }}₴</td>
          <td class="uk-table-shrink">{{ dish.quantity }}</td>
          <td>
            <a class="uk-margin-left"><span class="uk-badge" @click="addToCart(dish)">+</span></a>
            <a><span class="uk-badge" style="background: #ff9d03;" @click="removeFromCart(dish)">-</span></a>
          </td>
          <td>
            <a><span class="uk-badge" style="background: #f0506e;" @click="deleteFromCart(dish)">Видалити</span></a>
          </td>
        </tr>
        <tr>
          <td>Сума:</td>
          <td>{{ decimalPrice(price) }}₴</td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
        </tbody>
      </table>
      <form class="uk-form-stacked" @submit.prevent="sendCart">
        <div class="uk-margin-bottom">
          <label class="uk-form-label" for="location">Ваша локація</label>
          <div class="uk-inline uk-width-1-2@s">
            <input type="text" class="uk-input" placeholder="Введіть вашу локацію" v-model="address" required
                   id="location">
            <button class="uk-form-icon uk-form-icon-flip" uk-icon="icon: search" type="button"
                    @click="lookupCoordinates"></button>
          </div>
        </div>
        <div class="uk-margin-bottom uk-width-1-2@s">
          <label class="uk-form-label" for="details">Побажання тощо</label>
          <textarea type="" class="uk-textarea" rows="5" placeholder="..." id="details" v-model=order_details
                    uk-textarea>
          </textarea>
        </div>
        <button type="submit" class="uk-button uk-button-primary" name="button">Створити замовення</button>
      </form>
    </div>
    <div v-else>
      Ваш кошик порожній
    </div>

  </div>
</template>

<script>
import Cart from "@/components/cart/Cart";
import {mapActions, mapGetters} from "vuex";
import auth from "@/middleware/auth";
import Uikit from 'uikit'
import setted from "@/middleware/setted";


export default {
  name: "create",
  middleware: [auth, setted],
  data: () => ({
    address: '',
    predicted_address: '',
    predicted_location: [],
    order_details: '',
    accepted: true,
  }),
  async beforeMount() {
    let address_before = JSON.parse(JSON.stringify(this.$store.getters['order/address']))
    if (address_before !== null && address_before!= 'null')
      this.address = address_before
    await this.$store.dispatch('cart/syncWithServer')
  },
  components: {Cart},
  methods: {
    async addToCart(item) {
      this.$store.dispatch('cart/addItem', item)
        .catch(err => console.error(err))
    },
    ...mapActions({
      removeFromCart: 'cart/removeItem',
      deleteFromCart: 'cart/deleteItem',
    }),
    sendCart: async function () {
      if (this.order_location.length !== 0 && this.address.length !== 0) {
        if (!this.accepted) {
          this.$toast.info("Спочатку підтвердіть адресу доставки", {
            toastClassName: ['uk-margin-top']
          })
        } else {
          await this.$axios.$put('/orders', {
            "order_id": this.order_id,
            "order_details": this.order_details,
            "longitude": this.order_location[0],
            "latitude": this.order_location[1],
            "delivery_address": this.address
          })
            .then(res => {
              this.$store.dispatch('cart/finishOrder')
              this.$store.dispatch('cart/setOrder', 0)
              this.$store.dispatch('order/clear')
              this.$store.dispatch('order/setAccepted',false)
              this.$toast.success("Дякуємо за замовлення", {
                toastClassName: ['uk-margin-top']
              })
            })
            .catch(err => {
              if (!err.response){
                this.$toast.error("Помилка мережі", {
                  toastClassName: ['uk-margin-top']
                })
                console.error(err)
              }
              else{
                this.$toast.error(err.response.data.error || "Сталася помилка", {
                  toastClassName: ['uk-margin-top']
                })
                console.error(err.response)
              }
            })
        }
      } else {
        this.$toast.info("Спочатку введіть та підтвердіть адресу доставки", {
          toastClassName: ['uk-margin-top']
        })
      }
    },
    lookupCoordinates: function () {
      let vm = this
      this.$axios.get('https://maps.googleapis.com/maps/api/geocode/json?address=' + this.address + ', Kyiv&region=ua&language=uk&key=' + this.google_key)
        .then(function (response) {
          if (response.data.status === "OK" && response.data.results.length > 0) {
            vm.predicted_address = response.data.results[0].formatted_address
            vm.predicted_location = [response.data.results[0].geometry.location.lng,
              response.data.results[0].geometry.location.lat]
            Uikit.modal('.address-confirmation').toggle()
          } else {
            this.$toast.error("Не було знайдено такої адреси", {
              toastClassName: ['uk-margin-top']
            })
          }
        })
        .catch(function (err) {
        })
    },
    set_predicted: async function () {
      this.address = JSON.parse(JSON.stringify(this.predicted_address))
      await this.$store.dispatch('order/setLoc', this.predicted_location)
      await this.$store.dispatch('order/setAddr', this.predicted_address)
      this.accepted = true
      Uikit.modal('.address-confirmation').toggle()
    },
    remove_predicted: async function () {
      this.predicted_address = ''
      this.predicted_location = ''
      this.accepted = false
      Uikit.modal('.address-confirmation').toggle()
    }
  },
  computed: {
    ...mapGetters({
      selectedDishes: 'cart/items',
      price: 'cart/price',
      order_id: 'cart/order_id',
      order_location: 'order/location',
      delivery_address: 'order/address',
    }),

    decimalPrice: function () {
      return price => `${Number(price) / 100}`;
    },
    google_key : function (){
      return process.env.google_key
    }
  },
  watch: {
    address: function (val) {
      if (val !== this.$store.getters['order/address']) {
        this.accepted = false
      }
    }
  }


}
</script>

<style scoped>

</style>
