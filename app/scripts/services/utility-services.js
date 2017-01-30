angular.module('RoutejootWebSite')
	.service('UtilityService',function($document){
		this.showIterativeErrorMessage = function(error){
			angular.element(document.querySelectorAll('.error')).remove();
			angular.forEach(error, function(elem, type){
				var samp = angular.element(document.querySelector('#' + e.$name))
			});
		};
	})