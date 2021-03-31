export default ({store, error}) => {
  if (!store.getters['authorization/admin']) {
    return error({statusCode: 404, message: "Не знайшли сторінку"})
  }
}
