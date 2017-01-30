angular.module('RoutejootWebSite')
	   .controller('rjResetPasswordCtrl', function ($scope, $compile, $rootScope,$window){
		 $window.location.href = app.currentUrl+'/app/views/reset-password.html';
	   })
