class ResErrorHandler {
  checkError(err) {
    console.error(err.response);

    if (err.response['data'].email) {
      return err.response['data'].email[0];
    }
    if (err.response['data'].password[0]) {
      return err.response['data'].password[0];
    }
    else {
      return "Сталася помилка.";
    }
  }
}

module.exports = new ResErrorHandler()
