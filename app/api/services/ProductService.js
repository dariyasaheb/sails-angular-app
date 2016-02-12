module.exports = {
	getProdById : function ( filter, next) {
		Product.find(filter).exec(function(err,response){
			sails.log(response);
			next(err || response);
		})
	}
}