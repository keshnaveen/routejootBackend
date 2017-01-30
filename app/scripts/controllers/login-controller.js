angular.module('RoutejootWebSite')
  .controller('loginCtrl', function ($scope, $compile, $rootScope, HttpService, ToastService,$q){  
	  $scope.windowResized = function(){
		  
	  }
	  
	  $rootScope.hideMainLoader();
	  $scope.loginUser = function(){	
		 var loginArg = HttpService.fetchPOST($rootScope.loginUri, {'email':$scope.email, 'password':$scope.password});
		 HttpService.httpCall(loginArg)
		 .then(function(resp){
			 if(resp.result != $rootScope.ErrorCodes.SUCCESS){
				 if(resp.result == $rootScope.ErrorCodes.USER_NOT_EXISTS)
					 ToastService.showSuccessToast("User name not Exists. Please signUp or Try Again.");
				 if(resp.result == $rootScope.ErrorCodes.PASSWORD_INCORRECT)
					 ToastService.showSuccessToast("Password Incorrect.");
				 if(resp.result == $rootScope.ErrorCodes.REG_NOT_CONFORMED)
					 ToastService.showSuccessToast("Please Conform your email address and Try Again.");
			 }
			 else{
				 
			}
		 })
	  }
  });