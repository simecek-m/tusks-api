
function errorHandling(error, req, res, next){
	res.status(400).send(error);
}

module.exports = errorHandling;