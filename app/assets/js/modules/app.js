var app= angular.module('Eshop',['ngRoute']);
app.config(['$routeProvider','$locationProvider',function($routeProvider,$locationProvider){
		//$locationProvider.html5Mode(true);
		$routeProvider.
		when('/',{
			templateUrl:'views/home.html',
			controller:'Maincontroller'
		})
		.when('/category/:category_url',{
			templateUrl:'views/category.html',
			controller:'CategoryController'
		})
		.when('/category/:category_url/:subcat_url',{
			templateUrl:'views/category.html',
			controller:'SubcategoryController'
		})
		.when('/product/:product_id',{
			templateUrl:'views/product.html',
			controller:'ProductController'
		})
		.when('/login',{
			templateUrl:'views/login.html',
			controller:'LoginController'
		})
		.when('/signup',{
			templateUrl:'views/signup.html',
			controller:'SignupController'
		})
		.when('/cart',{
			templateUrl:'views/cart.html',
			controller:'CartController'
		})
		.when('/checkout',{
			templateUrl:'views/checkout.html',
			controller:'checkoutController'
		})
		
		
		
}])

app.run(['$http','$rootScope','ApiService', function($http,$rootScope, ApiService) {
	$rootScope.title={"site1":"Room","site2": "Cart"};

	$rootScope.categories = [];
	
	ApiService.getCategory().then(function(response) {
		//console.log(response);
		$rootScope.categories = response.data;
	})
	
}])
app.controller('Maincontroller',['$scope','$rootScope','ApiService', function($scope,$rootScope, ApiService){
	
		$scope.product = [];
		ApiService.getAllProduct().then(function(response) {
		//console.log(response);
		$scope.product = response.data;
	})
		
		
		
		
}]);

app.controller('CategoryController',['$scope','$rootScope', '$routeParams','ApiService',function($scope,$rootScope,$routeParams, ApiService){
		
		
		$scope.category_url = $routeParams.category_url;
		
		$scope.product = [];

		$scope.category = {};

		

		for (var cat in $rootScope.categories) {

			if ($rootScope.categories[cat].category_url == $scope.category_url) {
				console.log("Category 1", $rootScope.categories[cat])
				$scope.category = $rootScope.categories[cat];
			};
		};

		console.log("Category", $scope.category)
		ApiService.getProductByCategoryId($scope.category.category_id);
		
		
}]);


app.controller('SubcategoryController',['$scope','$rootScope', '$routeParams',function($scope,$rootScope,$routeParams){
		$scope.category_url = $routeParams.category_url;
		$scope.subcat_url = $routeParams.subcat_url;
		

		$scope.product = [];

		$scope.category = {};
		$scope.subcategory = {};

		for (var cat in $rootScope.data.menu) {

			if ($rootScope.data.menu[cat].category_url == $scope.category_url) {
				$scope.category = $rootScope.data.menu[cat];
			};
		};

		if ($scope.subcat_url) {

			for (var cat in $scope.category.subcategory) {

			if ($scope.category.subcategory[cat].subcategory_url == $scope.subcat_url) {
				$scope.subcategory = $scope.category.subcategory[cat];
			};
		};
		};

		for (var p in $rootScope.data.product) {

			if ($rootScope.data.product[p].category_id == $scope.category.category_id){

			 if ($rootScope.data.product[p].subcategory_id == $scope.subcategory.subcategory_id) {
			  	$scope.product.push($rootScope.data.product[p]);
			  };	
		}

	}
		
}]);


app.controller('ProductController',['$scope','$rootScope','$routeParams','CartService',function($scope,$rootScope,$routeParams, CartService){
		$scope.product_id = $routeParams.product_id;




		for (var p in $rootScope.data.product) {

			 if ($rootScope.data.product[p].product_id == $scope.product_id) {
			 	
			  	$scope.product = $rootScope.data.product[p];
			  	$scope.slides = $rootScope.data.product[p].slides;
			  	
			  };	
		}

        /**
         * ---------------------------------this is program for carousel -------------------------------
         */
	

		var count=0;
		$scope.currentimage = $scope.slides[0];
		var length=$scope.slides.length;

		/**
		 * @param  {[index number]}
		 * @return {[void]}
		 */
		$scope.setcurrentimage = function(index){
			$scope.currentimage = $scope.slides[index];
			count=index;
			console.log(count);			
		}
		/**
		 * @return {Function}
		 */
		$scope.next = function() {
			if (count < length - 1) {
				$scope.currentimage = $scope.slides[count + 1];
				count++;
				console.log(count);
			} else {
				count = 0;
				$scope.currentimage = $scope.slides[count];
			}

		}
		/**
		 * @return {[type]}
		 */
		$scope.prev = function() {
			if (count < length - 1 && count != 0) {
				$scope.currentimage = $scope.slides[count - 1];
				count--;
			} else {
				count = 4;
				$scope.currentimage = $scope.slides[count];
				count--;
			}
		}
		/**
		 * [addToCart description]
		 * @param {[type]} product [description]
		 * @param {[type]} qty     [description]
		 */
		$scope.addToCart = function  (product, qty) {
			var item = {
				product_id : product.product_id,
				url : product.url,
				name :product.name,
				price : product.discountprice,
				qty :  parseInt(qty),
				total_price : (parseInt(qty) * parseInt(product.discountprice))
			}
		
			CartService.addToCart(item);
			
		}
		
		
		
}]);

app.controller('CartController',['$scope','$rootScope','CartService',function($scope,$rootScope, CartService){
	

	$scope.cart = CartService.cart;
	/**
	 * [deleteItem description]
	 * @param  {[type]} id [description]
	 * @return {[type]}    [description]
	 */
	$scope.deleteItem = function(id) {
		console.log(id);
		CartService.removeItem(id);
	}

}]);

app.factory('CartService', function () {
	/**
	 * [exitProduct description]
	 * @param  {[type]} product [description]
	 * @return {[type]}         [description]
	 */
	function exitProduct(product_id){
			//console.log(product);
			for(var k in cart.cart.items){
				if (product_id == cart.cart.items[k].product_id) {
					return k;
				}				
			}
			return	-1;
	}
	
	var cart = {

		cart: {
			items: [],
			count: 0,
			total_cart_price: 0
		},	
		/**
		 * @param {[type]}
		 */
		addToCart: function(product) {
			
			
			var foundAt = exitProduct(product.product_id);

			/**
			 * [if description]
			 * @param  {[type]} foundAt [here we are taking -1 because array start with index 0]
			 * @return {[type]}         [description]
			 */
			if (foundAt == -1) {
				this.cart.items.push(product);
			}else{
				this.cart.items[foundAt].qty += parseInt(product.qty);
				this.cart.items[foundAt].total_price = this.cart.items[foundAt].qty * this.cart.items[foundAt].price;
			}

		
			
			this.cart.count += product.qty;
			this.cart.total_cart_price += parseInt(product.total_price);

			console.log(this.cart);
		},
		removeItem : function(id) {
			var foundAt = exitProduct(id);
			var item = this.cart.items[foundAt];

			
			this.cart.count -= item.qty;
			this.cart.total_cart_price -= parseInt(item.total_price);
			this.cart.items.splice(foundAt, 1);
		}

	}

	return cart;
	
})



app.controller('checkoutController',['$scope','$rootScope','CartService',function($scope,$rootScope, CartService){

	$scope.cart = CartService.cart;
	console.log($scope.cart);
}]);

app.directive('productTile', function() {
	var directive = {
		restrict: 'E',
		templateUrl : 'views/producttile.html',
		scope : {
			product :"="
		}
	}
	return directive;
})

app.service('ApiService',['$http', function($http){
	this.getCategory =function(){
		return $http({ method:"GET", url:"/category"});
	}
	this.getAllProduct = function(){
		return $http({ method:"GET", url:"/product"});
	}
	this.getProductByCategoryId = function(catid) {
		console.log({id: catid})
		return $http({ method:"GET", url:"/productByCat", params :{'category_id': catid}});
	}
}])