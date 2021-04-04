export default ({store, redirect}) => {
  if (!store.getters['authorization/isSettedUp']){
    store.dispatch('authorization/getUser')
    if (!store.getters['authorization/isSettedUp'])
      return redirect('/users/register/next')
  }
}
