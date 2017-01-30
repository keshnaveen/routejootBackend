angular.module('RoutejootWebSite')
	.service('HttpService',function($http, $q, $rootScope, $location){	
		
		this.fetchPOST = function (action, data) {
            var url = $rootScope.baseUrl + action;
            return {
                method: 'POST',
                url: url,
                data: data,
                headers: {
                    'Content-Type': 'application/json'                 
                },
            }
        };
        
        this.fetchGET = function (action, queryString) {
        	if(typeof queryString != 'undefined')
        		var url = $rootScope.baseUrl.trim() + action.trim() + '?' +queryString.trim();
        	else
        		var url = $rootScope.baseUrl.trim() + action.trim();
        	
            return {
                method: 'GET',
                url: url.trim()
            }
        };
        
        this.httpCall = function (arg) {
        	if($location.path() != "/watchRide")
        		$rootScope.isLoading = true;
        	
        	return $q(function(resolve, reject) {
        		$http(arg).then(function (data) {
        			$rootScope.isLoading = false;
                    resolve(data.data);
                },
                function (err) {  
                	debugger;
                	$rootScope.isLoading = false;
                    console.log(err);
                    reject(err);
               });
        	});                       
          };
                
});