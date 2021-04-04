export default ({store, redirect}) => {
  if (!store.getters['authorization/isAuthenticated'])
    return redirect('/users/signin')
}
