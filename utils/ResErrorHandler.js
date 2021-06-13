class ResErrorHandler {
  checkFormErrors(err){
    console.error(err.response);

    if(err.response['data']){
      for(let prop in err.response['data']){
        try{
          return err.response['data'][prop][0];
        }
        catch (error) {
          return null;
        }
      }
    }

    return null;
  }
}

module.exports = new ResErrorHandler()
