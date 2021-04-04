<template>
  <div>
    <div>
      <div class="uk-container uk-container-center uk-text-center">
        <div v-if="error.statusCode === 404">
          <div class="uk-article-title uk-text-center">От халепа... Не знайшли сторінку</div>
          <img src="https://ik.imagekit.io/alouh/misc/fogg-page-not-found-1_Pqab0XvDb.png" alt="" width=600 class="uk-margin-top">
        </div>
        <div v-else>
          <div class="uk-article-title uk-text-center">Щось пішло не так...</div>
          <div>
            <img src="https://ik.imagekit.io/alouh/misc/arabica-735_5hAKugT4M0vt.png" alt="" width=600 class="uk-margin-top">
          </div>
        </div>
      </div>
      <div class="uk-margin-top">
        <NuxtLink to="/" class="uk-text-center uk-button uk-button-primary uk-align-center uk-width-1-6">На головну</NuxtLink>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  props: ['error'],
}

</script>

<style>

</style>
