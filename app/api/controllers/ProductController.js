/**
 * ProductController
 *
 * @description :: Server-side logic for managing products
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	getProductById : function(req, res) {
		console.log("getProductById")
		//sails.log(req);
		ProductService.getProdById(req.query, function(response){
			console.log("response", response);
			res.json(response);
		})
	}
};

