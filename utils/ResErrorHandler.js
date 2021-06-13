class ResErrorHandler {
  checkUserFormErrors(err) {
    console.error(err.response);

    if (err.response['data'].email) {
      return err.response['data'].email[0];
    }
    if (err.response['data'].password) {
      return err.response['data'].password[0];
    }
    else {
      return "Сталася помилка.";
    }
  }

  checkNextFormErrors(err) {
    console.error(err.response);

    if (err.response['data'].first_name) {
      return err.response['data'].first_name[0];
    }
    if (err.response['data'].tel_num) {
      return err.response['data'].tel_num[0];
    }
    else {
      return "Сталася помилка.";
    }
  }

  checkUserUpdateFormErrors(err) {
    console.error(err.response);

    if (err.response['data'].first_name) {
      return err.response['data'].first_name[0];
    }
    if (err.response['data'].tel_num) {
      return err.response['data'].tel_num[0];
    }
    else {
      return "Сталася помилка під час оновлення профілю.";
    }
  }

  checkDishFormErrors(err) {
    console.error(err.response);

    if (err.response['data'].name) {
      return err.response['data'].name[0];
    }
    if (err.response['data'].price) {
      return err.response['data'].price[0];
    }
    if (err.response['data'].gramme) {
      return err.response['data'].gramme[0];
    }
    else {
      return "Сталася помилка.";
    }
  }

  checkRestaurantFormErrors(err) {
    console.error(err.response);

    if (err.response['data'].name) {
      return err.response['data'].name[0];
    }
    if (err.response['data'].rest_address) {
      return err.response['data'].rest_address[0];
    }
    if (err.response['data'].location) {
      return err.response['data'].location[0];
    }
    else {
      return "Сталася помилка.";
    }
  }
}

module.exports = new ResErrorHandler()
