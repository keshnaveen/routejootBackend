'use strict';
$(document).ready(function(){
	toastr.options = {
			  "closeButton": true,
			  "debug": false,
			  "newestOnTop": true,
			  "progressBar": false,
			  "positionClass": "toast-top-full-width",
			  "preventDuplicates": true,
			  "onclick": null,
			  "showDuration": "300",
			  "hideDuration": "1000",
			  "timeOut": "5000",
			  "extendedTimeOut": "1000",
			  "showEasing": "swing",
			  "hideEasing": "linear",
			  "showMethod": "fadeIn",
			  "hideMethod": "fadeOut"
			}
});

angular.module('RoutejootWebSite', [                             
                             'ngCookies',
                             'ngResource',
                             'ngRoute',
                             'ngSanitize',
                             'ngMaterial',
                             'angular-carousel',
                             'chart.js'
                ])

.config(function($mdThemingProvider) {
  $mdThemingProvider.definePalette('routejootPalette', {
	  '50': '#c5c5c5',
	  '100': '#9e9e9e',
	  '200': '#828282',
	  '300': '#5f5f5f',
	  '400': '#4f4f4f',
	  '500': '#404040',
	  '600': '#313131',
	  '700': '#212121',
	  '800': '#121212',
	  '900': '#030303',
	  'A100': '#c5c5c5',
	  'A200': '#9e9e9e',
	  'A400': '#4f4f4f',
	  'A700': '#212121',
	  'contrastDefaultColor': 'light',
	  'contrastDarkColors': ['50', '100', '200', '300', '400', 'A100']
  });

  $mdThemingProvider.definePalette('routejootAccent', {
	  '50': '#c5c5c5',
	  '100': '#9e9e9e',
	  '200': '#828282',
	  '300': '#5f5f5f',
	  '400': '#4f4f4f',
	  '500': '#404040',
	  '600': '#313131',
	  '700': '#212121',
	  '800': '#121212',
	  '900': '#030303',
	  'A100': '#c5c5c5',
	  'A200': '#9e9e9e',
	  'A400': '#4f4f4f',
	  'A700': '#212121',
	  'contrastDefaultColor': 'light',
	  'contrastDarkColors': ['50', '100', '200', '300', '400', 'A100']
  });

  $mdThemingProvider.definePalette('routejootWarn', {
	  '50': '#c5c5c5',
	  '100': '#9e9e9e',
	  '200': '#828282',
	  '300': '#5f5f5f',
	  '400': '#4f4f4f',
	  '500': '#404040',
	  '600': '#313131',
	  '700': '#212121',
	  '800': '#121212',
	  '900': '#030303',
	  'A100': '#c5c5c5',
	  'A200': '#9e9e9e',
	  'A400': '#4f4f4f',
	  'A700': '#212121',
	  'contrastDefaultColor': 'light',
	  'contrastDarkColors': ['50', '100', '200', '300', '400', 'A100']
  });

  $mdThemingProvider.theme('default')
    .primaryPalette('routejootPalette')
    .accentPalette('routejootAccent')
    .warnPalette('routejootWarn')
})
.config(function ($routeProvider) {
    $routeProvider
      .when('/login',{
    	  templateUrl: 'views/login.html',
          controller: 'loginCtrl',
          controllerAs: 'login',
          title:'Login'
      })
      .when('/watchRide',{
    	  templateUrl: 'views/ride.html',
    	  controller: 'rideCtrl',
          controllerAs: 'ride',
          title:'Ride'
      })
	  .when('/resetPassword',{
    	  template: '<div></div>',
          controller: 'rjResetPasswordCtrl',
          controllerAs: 'rjResetPassword',
          title:'Reset Password'
      })
      .when('/rideStatistics',{
    	  templateUrl: 'views/ride-statistics.html',
    	  controller: 'rideStatisticsCtrl',
          controllerAs: 'rideStatistics',
          title:'Ride Statistics'
      })
      .when('/userStatistics',{
    	  templateUrl: 'views/user-statistics.html',
    	  controller: 'userStatisticsCtrl',
          controllerAs: 'userStatistics',
          title:'User Rides Statistics'
      })
      .when('/eventStatistics',{
    	  templateUrl: 'views/event-statistics.html',
    	  controller: 'eventStatisticsCtrl',
          controllerAs: 'eventStatistics',
          title:'Event Statistics'
      })
      .when('/legal/termsAndCondition',{
    	  templateUrl: 'views/legal/terms-and-conditions.html',
    	  controller: 'legalCtrl',
          controllerAs: 'legalCtrl',
          title:'Terms And Conditions'
      })
      .otherwise({
    	  redirectTo:'/eventStatistics'
      });
  })
  .run(['$location', '$rootScope', function($location, $rootScope) {
	  $rootScope.isMainLoading = true;
	  $rootScope.hidden = false;
	  $rootScope.baseUrl = app.serviceUrl+"/";
	  $rootScope.iconUrl = app.iconUrl;
	  
	  // Statistics related const
	  $rootScope.DayMode = app.constants.day_mode;
	  $rootScope.DaySplit = app.constants.day_split;
	  $rootScope.ReqUrlUnits = app.constants.req_url_units;
	  $rootScope.KmToMiles = app.constants.km_to_miles;

	  // Login related Url
	  $rootScope.loginUri = "api/authenticateUser";
	  $rootScope.getUserByIdUri = "api/getUserById";
	  $rootScope.getRideByIdUri = "api/getRideById";
	  
	  // Ride Statistics related Url
	  $rootScope.DaySplitUrl = "api/getDaySplitData";
	  $rootScope.DaySplitwiseRideDetailsUrl = "api/getDaySplitwiseRideDetails";
	  $rootScope.RideSplitCountUrl = "api/getRideSplitCount";
	  $rootScope.DistancewiseRideSplitUrl= "api/getDistancewiseRideSplitData";
	  $rootScope.getUserRideSessions = "api/getUserRideSessions";
	  $rootScope.getRideById = "api/getRide";
	  
	  // User Statistics related Url
	  $rootScope.UserRideSummaryUrl = "api/getUserRideSummery";
	  $rootScope.UserRideDaySplitUrl = "api/getUserRideDaySplit";
	  $rootScope.HalfYearRideStatistics = "api/getHalfYearRideStatistics";
	  $rootScope.distancewiseRideCount = "api/getDistancewiseRideCount";
	  $rootScope.thisYearAndoverallRideSummary = "api/getThisYearAndoverallRideSummary";
	  $rootScope.garageAnalysisByUser = "api/getGarageAnalysisByUser";
	  
	  // Event Statistics related Url
	  $rootScope.eventCoridersAndDistance = "api/getEventCoridersAndDistance";
	  $rootScope.DistancewiseRidesSplit = "api/getDistancewiseRidesSplit";
	  
	  $rootScope.ErrorCodes ={
			  SUCCESS:0,
			  USER_NOT_EXISTS:3,
			  PASSWORD_INCORRECT:5,
			  REG_NOT_CONFORMED:6
	  }

	  $rootScope.Months ={
			  0:"Jan",
			  1:"Feb",
			  2:"Mar",
			  3:"Apr",
			  4:"May",
			  5:"Jun",
			  6:"Jul",
			  7:"Aug",
			  8:"Sep",
			  9:"Oct",
			  10:"Nov",
			  11:"Dec"
	  }

	  $rootScope.$on('$routeChangeSuccess', function (event, current, previous) {
		 if (current.hasOwnProperty('$$route')) {
		    $rootScope.title = current.$$route.title;
		 }	 
	  });
	  
	  $rootScope.hideMainLoader = function(){	
		  $rootScope.isMainLoading = false;
		  $rootScope.hidden = true;		  	  	
	  };
	  
	  $rootScope.ConvertKmsToMls = function(kmValue){
		  if($rootScope.unit == $rootScope.ReqUrlUnits.MILES)
			  return Math.floor((kmValue * $rootScope.KmToMiles));
		  else
			  return Math.floor(kmValue);
	  };
	  
	  $rootScope.ConvertValueToKm = function(value){
		  if($rootScope.unit == $rootScope.ReqUrlUnits.MILES)
			  return (value * 1.60934).toFixed(0);
		  else
			  return value;
	  };
	  
	}]);
