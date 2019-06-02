
function errorHandling(error, req, res, next){
  console.log('Error message: ', error.message)
  res.status(400).send(error);
}

module.exports = errorHandling;