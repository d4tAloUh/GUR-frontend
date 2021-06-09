export default ({store,error}) => {
  if (store.getters['authorization/isCourier']) {
    return error({ statusCode: 404, message: 'Вийдіть з аккаунту кур\'єра' })
  }
}
