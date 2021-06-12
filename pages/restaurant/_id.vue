<template>
  <div>
    <NuxtLink tag="a" class="uk-button uk-button-primary uk-margin" to="/restaurant" exact><span
      uk-icon="arrow-left"></span> назад
    </NuxtLink>
    <div v-if="$fetchState.pending">
      <Loading />
    </div>
    <div v-else-if="open">
      <div v-if="sameRestaurant">
        <client-only>
          <keep-alive>
            <div uk-grid v-if="!dishesAreEmpty">
              <div class="uk-width-1-3@m">
                <div v-for="dish in dishes" class="uk-margin">
                  <div class="uk-card uk-card-default padding-top">
                    <div class="uk-card-media-top image-container">
                      <img :src=dish.dish_photo alt="Картинка зі смачною їжею" class="card-image"/>
                    </div>
                    <div class="uk-card-body">
                      <h3 class="uk-card-title">{{ dish.name }} <span class="uk-badge">{{
                          decimalPrice(dish.price)
                        }}₴</span>
                      </h3>
                      <p>{{ dish.description }}</p>
                      <p>{{ dish.gramme }} g</p>
                    </div>
                    <div class="uk-card-footer">
                      <button class="uk-button uk-button-primary" @click="addToCart(dish)">Додати</button>
                    </div>
                  </div>
                </div>
              </div>
<!--              <div class="uk-width-expand@m" v-if="!dishesAreEmpty">-->
              <div class="uk-width-expand@m" >
                <Cart/>
              </div>
            </div>
            <div class="uk-container uk-container-center uk-text-center" v-else>
              <img src="https://ik.imagekit.io/alouh/misc/no_food_a94JE48EgCSs.png" height="800" alt="page"
                   width="800">
              <p>Тут поки нічого немає</p>
            </div>
          </keep-alive>
        </client-only>
      </div>
      <div v-else>
        <div>
          Ви зараз маєте замовлення у іншому ресторані
          <NuxtLink :to="{ name: 'restaurant-id', params: { id: currentRestId }}" tag="a">Повернутись до ресторану
          </NuxtLink>
        </div>
          <div>Або <a @click="clearCart"> видалити </a> попереднє замовлення</div>
      </div>
    </div>
    <div v-else>
      Цей ресторан наразі зачинений
    </div>
  </div>

</template>


<script>
import Cart from "~/components/cart/Cart";
import {mapActions, mapGetters} from 'vuex'
import auth from "@/middleware/auth";
import Loading from "@/components/misc/LoadingBar";
import onlyClient from "~/middleware/onlyClient";
import OrderHelper from "~/utils/OrderHelper";

export default {
  name: "rest_id",
  middleware: [auth, onlyClient],
  components: {Cart, Loading},
  data: () => ({
    dishes: [],
    open: true,
    restaurant: null,
  }),
  async fetch() {
    await this.getDishes();
  },
  methods: {
    async getDishes() {
      try {
        let response = await this.$axios.$get('/restaurant-dishes/' + this.$route.params.id);
        console.log(response)
        this.dishes = response.dishes
        this.restaurant = response.restaurant
        this.open = response.restaurant.is_open
      } catch (err) {
        if (!err.response) {
          this.$toast.error("Помилка мережі", {
            toastClassName: ['uk-margin-top']
          })
          console.error(err)
        } else {
          if (Number(err.response.status) === 404) {
            this.$router.go(-1)
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
    async addToCart(item) {
      this.$store.dispatch('cart/addItem', item)
        .catch(err => console.error(err))
    },
    ...mapActions({
      removeFromCart: 'cart/removeItem',
    }),
    async clearCart() {
      await this.$store.dispatch('cart/emptyCart')
    }
  },
  computed: {
    decimalPrice: OrderHelper.decimalPrice,
    sameRestaurant: function () {
      return (this.$store.getters["cart/rest_id"] === 0) || (Number(this.$route.params.id) === Number(this.$store.getters["cart/rest_id"]))
    },
    ...mapGetters({
      currentRestId: 'cart/rest_id'
    }),
    dishesAreEmpty: function () {
      return this.dishes.length < 1
    }
  }
}
</script>

<style scoped>
.padding-top {
  padding-top: 16px;
}

.image-container {
  height: 184px;
  display: block;
  position: relative;
  width: 100%;
  align-content: center;
}

.card-image {
  position: relative;
  height: auto;
  width: auto;
  max-width: 100%;
  max-height: 100%;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  margin: 0;
}

.uk-card-body {
  padding: 16px 40px;
}
</style>
