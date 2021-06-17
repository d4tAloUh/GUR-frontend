<template>
  <div class="uk-card uk-card-default uk-grid-collapse uk-child-width-1-2@m uk-margin"
       v-bind:key="restaurant.rest_id" uk-grid>
    <div class="uk-cover-container">
      <img :src=restaurant.rest_photo alt="" class="uk-align-center" height="250" width="250"/>
    </div>
    <div>
      <div class="uk-card-body">
        <h3 class="uk-card-title">{{ restaurant.name }}</h3>
        <p>Адреса: {{ restaurant.rest_address }}</p>
        <div class="uk-margin-bottom">
          <div v-if="restaurant.open_from">Від: {{ restaurant.open_from }}</div>
          <div v-if="restaurant.open_to">До: {{ restaurant.open_to }}</div>
          <div v-else>Працює цілодобово</div>
        </div>
        <NuxtLink :to="{ name: location_to, params: { id: restaurant.rest_id, restaurant}}" tag="a"
                  class="uk-button uk-button-primary" v-if="restaurant.is_open || as_admin">Переглянути страви
        </NuxtLink>
        <div v-else>Ресторан зачинений</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Restaurant",
  props: ['restaurant','location_to', 'as_admin']
}
</script>

<style scoped>

</style>
