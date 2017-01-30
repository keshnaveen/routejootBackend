angular.module('RoutejootWebSite')
  .controller('rideCtrl', function ($scope, $compile, $rootScope, HttpService, $q, $interval, $location, DialogService,$timeout){  
	  $scope.finalImages=[], rideImageIds=[];
	  
	  $scope.windowResized = function(){
		  if($scope.windowWidth < 960){
			  $scope.isMobile = true;
			  $scope.isclicked = true;
			  $timeout(function(){
				  var headerHeight = angular.element(document.querySelector(".md-stretch-tabs"))[0].offsetHeight;
				  angular.element(document.querySelector(".googleMapMobile")).css('height', $scope.windowHeight-headerHeight + 'px');
			  }, 100);			  		  
		  }
		  else{
			  $scope.isMobile = false;		
			  $scope.isclicked = true;
		  }	  
	  };
	  
	  $scope.isDestinationRide = false;
	  $scope.isImageLoaded = false;
	  $scope.rideDetails = null;
	  $scope.userDetails = null;	  	 
	  
	  $scope.loadRideimage = function(){
		  if($scope.isclicked && $scope.isImageLoaded == false){
			  $scope.isImageLoaded = true;	
			  $scope.total_count=0;
			  if($location.search().ride_id != undefined){
				  var httpData = HttpService.fetchGET("api/getRideImageIds","ride_id="+$location.search().ride_id);
				  HttpService.httpCall(httpData)
				  .then(function(resp){			  
					  if(resp.result === 0 && resp.data != null && resp.data.length > 0){				  
						  rideImageIds = resp.data;
						  rideImageIds.forEach(function(rideImageId){
							  var httpData = HttpService.fetchGET("api/getRideDefinitionImage","ride_image_id="+rideImageId._id);
							  HttpService.httpCall(httpData)
							  .then(function(response){
								  if(response.result === 0 && response.data != null){
									  rideImageId.imageUrl = response.data;
									  rideImageId.slide_number = ++ $scope.total_count;
									  var date = new Date(rideImageId.taken_on);
									  rideImageId.taken_on = date.getDate() + '/' + (date.getMonth() + 1) + '/' +  date.getFullYear();								  
									  $scope.finalImages.push(rideImageId);	
								  }						  
							  })
						  })			  
					  }
				  })
			  }			  
		  }
	  }
	  
	  $scope.setCenter = function(marker){
		  $rootScope.map.setCenter(marker.getPosition())
	  };
	  
	  if($location.search().ride_id != undefined){
		  var httpData = HttpService.fetchGET("api/getOngoingRideDetails","ride_id="+$location.search().ride_id);
		  HttpService.httpCall(httpData)
		  .then(function(resp){
			  if(resp.result === 0 && resp.data != null){
				  $scope.rideDetails = resp.data;
				  var httpData = HttpService.fetchPOST("api/getUserById",{"_id":$scope.rideDetails.user_id});
				  HttpService.httpCall(httpData)
				  .then(function(resp){
					  if(resp.result === 0 && resp.data != null){
						  var data = resp.data;
						  $scope.userDetails = resp.data;
						  $scope.userFullName = data.full_name;
						  $scope.userImage = "data:image/"+data.profile_picture.cont_type+";base64,"+data.profile_picture.cont;
						  $scope.userAge = data.dob;
						  $scope.userGender = data.gender;
					  }
					  else{
						  DialogService.showAlert("User Not Exists","This User Not Exists");
						  $rootScope.hideMainLoader();
					  }					   
				  });			  
			  }
			  else{
				  DialogService.showAlert("Ride Not Exists","This Ride seems to be deleted by the user.");
				  $rootScope.hideMainLoader();
			  }				  
		  });
	  }
	  else{
		  DialogService.showAlert("Sorry!!!","Unknown Error occored.");
		  $rootScope.hideMainLoader();
	  }
  
	  
	  
	  $rootScope.$on("googleMapsEnabled", function(){  
		  if($scope.rideDetails != null){			 
			  var data = $scope.rideDetails;
			  $rootScope.rideData = data;
			  		  			  			  			 			  
			  if(data.ride_status == 1)
				  $scope.appendCompletedRide(data);
			  else
			  {
				  $scope.resultData = data;
				  $scope.appendRide(data);
				  $scope.rideStatus = data.ride_status;	
				  if(data.dest_location.coordinates[0] != 0)
				  {
					  $rootScope.lastlocation = data.last_location;
					  
					  var bounds = new google.maps.LatLngBounds();
					  $scope.destinationMarker = $rootScope.GCMmarkPlace(data.dest_location.coordinates[1], data.dest_location.coordinates[0]);
					  var marker = $rootScope.GCMmarkPlace(data.last_location.coordinates[1], data.last_location.coordinates[0]);
					  $scope.destinationMarker.setIcon($rootScope.iconUrl+'destination_pin.png');
					  var destInfowindow = new google.maps.InfoWindow({
				          content: data.dest_location.place.address
				      });
					  $scope.destinationMarker.addListener('click', function() {
						  destInfowindow.open($rootScope.map, $scope.destinationMarker);
				      });
					  $scope.destinationMarker.setTitle("Destination - "+data.dest_location.place.city);
					  
					 // bounds.extend(new google.maps.LatLng(data.dest_location.coordinates[1], data.dest_location.coordinates[0]));
					  bounds.extend(new google.maps.LatLng(data.last_location.coordinates[1], data.last_location.coordinates[0]));  
					  $rootScope.map.fitBounds(bounds);
					  $rootScope.map.setZoom($rootScope.map.getZoom());
					  $scope.isDestinationRide = true;
						  
					  $scope.calculateETA($scope.resultData);
					  $scope.ETAinterval = $interval(function(){
						  $scope.calculateETA($scope.resultData);
					  },60000); // 1 min
				  }
				  else{
					  var marker = $rootScope.GCMmarkPlace(data.last_location.coordinates[1], data.last_location.coordinates[0]);
					  $scope.setCenter(marker); 
					  $rootScope.map.setZoom(15);
				  }				
				  marker.setIcon($rootScope.iconUrl+'male_rider.png');	
				  
				  if($scope.userDetails != null){
					  marker.setTitle($scope.userDetails.full_name);
					  
					  var Infowindow = new google.maps.InfoWindow({
				          content:'<div id="content"><div id="siteNotice"></div><b id="firstHeading" class="firstHeading">'+$scope.userDetails.full_name+'</b><br/><p>lat : '+data.last_location.coordinates[1]+'</p><p>long : '+data.last_location.coordinates[0]+'</p></div></div>'
				      });
					  marker.addListener('click', function() {
						  Infowindow.open($rootScope.map, marker);
					  });
				  }	 
					  
				  $scope.interval = $interval(function(){
					  var data = HttpService.fetchGET("api/getOngoingRideDetails","ride_id="+$location.search().ride_id);
					  HttpService.httpCall(data)
					  .then(function(resp){
						  if(resp.result === 0 && resp.data != null){
							  $scope.resultData = resp.data;
							  var data = resp.data;
							  $rootScope.rideData = data;
							  
							  if(data.ride_status == 1){
								  marker.setMap(null);
								  if($scope.destinationMarker != null)
									  $scope.destinationMarker.setMap(null);
								  $interval.cancel($scope.interval);
								  if(typeof $scope.ETAinterval != 'undefined')
									  $interval.cancel($scope.ETAinterval);
								  	  $scope.appendCompletedRide(data);
								  }									  
								  else{
									  $rootScope.lastlocation = data.last_location;
									  
									  var latlng = new google.maps.LatLng(data.last_location.coordinates[1], data.last_location.coordinates[0]);
									  marker.setPosition(latlng);
									  if($scope.userDetails.full_name != null){
										  Infowindow = new google.maps.InfoWindow({
									          content:'<div id="content"><div id="siteNotice"></div><b id="firstHeading" class="firstHeading">'+$scope.userDetails.full_name+'</b><br/><p>lat : '+data.last_location.coordinates[1]+'</p><p>long : '+data.last_location.coordinates[0]+'</p></div></div>'
									      });
									  }									  
									  $rootScope.getLocation(data.last_location.coordinates[1], data.last_location.coordinates[0]);
									  $scope.setCenter(marker);
									  $scope.appendRide(data);
								  }								 
							 }
						  else{
							  $interval.cancel($scope.interval);
							  marker.setMap(null);
							  if($scope.destinationMarker != null)
								  $scope.destinationMarker.setMap(null);
							  if(typeof $scope.ETAinterval != 'undefined')
								  $interval.cancel($scope.ETAinterval);
							  $scope.lastRideStatus = 3;
							  $scope.rideStatus = 3;							
							  DialogService.showAlert("Ride Cancelled","This ride had been cancelled by the user."); 
							  $rootScope.hideMainLoader();
						  };							  
						})
					},10000);	  // 10 sec
				  $rootScope.hideMainLoader();
				}
			}
	  });
	  
	  
	  $scope.calculateETA = function(data){
		  var origin = new google.maps.LatLng(data.last_location.coordinates[1], data.last_location.coordinates[0]);
		  var destination = new google.maps.LatLng(data.dest_location.coordinates[1], data.dest_location.coordinates[0]);
		  var service = new google.maps.DistanceMatrixService();		  
		  service.getDistanceMatrix(
			{
				origins: [origin],
				destinations: [destination],
				travelMode: 'DRIVING',
				drivingOptions: {
				    departureTime: new Date(data.last_location),  
				    trafficModel: 'optimistic'
				}
			}, function(response, status){
				if (status == 'OK') {
					$scope.rideETA = response.rows[0].elements[0].duration.text;
					$scope.rideDistancetoCover = response.rows[0].elements[0].distance.text;
				}
			});  
	  };
	  
	  $scope.appendRide = function(data){
		  	$scope.rideTotalTimeTaken = $scope.calculateTime(data.time_elapsed);
		  	$scope.rideLastUpdatedOn = data.last_updated_on;
		  	$scope.lastRideStatus = data.last_ride_status;
		  	$scope.rideDistanceCovered = (typeof data.distance != 'undefined' && data.distance != null) ?  data.distance.toFixed(2) : "Not Avalible";
		  	$scope.batteryLevel = (data.battery_level > 0)? data.battery_level*10+"%" : "N/A";
	  };
	  
	  $scope.appendCompletedRide = function(data){
		  $scope.rideStatus = data.ride_status;
		  $scope.rideEndDate = new Date(data.end_date);
		  $scope.rideDistance = (typeof data.distance != 'undefined' && data.distance != null) ? data.distance.toFixed(2) : "--";
		  $scope.rideMaxSpeed = (typeof data.max_speed != 'undefined' && data.max_speed != null) ? data.max_speed.toFixed(2) : "--:--";
		  $scope.rideAvgSpeed = (typeof data.avg_speed != 'undefined' && data.avg_speed != null) ? data.avg_speed.toFixed(2) : "--:--";
		  $scope.rideTotalTime = (typeof data.total_duration != 'undefined' && data.total_duration != null) ? new Date(1970, 0, 1).setSeconds(data.total_duration) : "--:--";
		  $scope.rideRideTime = (typeof data.standby_duration != 'undefined' && data.standby_duration != null) ? new Date(1970, 0, 1).setSeconds(data.total_duration - data.standby_duration) : "--:--";
		  $scope.rideStandbyTime = (typeof data.standby_duration != 'undefined' && data.standby_duration != null) ? new Date(1970, 0, 1).setSeconds(data.standby_duration) : "--:--";
		  
		  $rootScope.srcMarker = $rootScope.GCMmarkPlace(data.src_location.coordinates[1], data.src_location.coordinates[0]); 
		  $rootScope.srcMarker.setIcon($rootScope.iconUrl+'source_pin.png');
		  var srcInfowindow = new google.maps.InfoWindow({
	          content: data.src_location.place.address
	      });
		  
		  $rootScope.srcMarker.addListener('click', function() {
			  srcInfowindow.open($rootScope.map, $rootScope.srcMarker);
	      });
		  
		  $rootScope.srcMarker.setTitle("Source - "+data.src_location.place.city);
		  
		  $rootScope.destMarker = $rootScope.GCMmarkPlace(data.finish_location.coordinates[1], data.finish_location.coordinates[0]);
		  $rootScope.destMarker.setIcon($rootScope.iconUrl+'destination_pin.png');
		  var destInfowindow = new google.maps.InfoWindow({
	          content: data.finish_location.place.address
	      });
		  $rootScope.destMarker.addListener('click', function() {
			  destInfowindow.open($rootScope.map, $rootScope.destMarker);
	      });
		  $rootScope.destMarker.setTitle("Destination - "+data.finish_location.place.city);
		  
		  $rootScope.GCMsetPath(data.travelled_route);
		  $rootScope.hideMainLoader();
	  };
	  
	  $scope.calculateAge = function(birthday) { 
		    var ageDifMs = Date.now() - new Date(birthday);
		    var ageDate = new Date(ageDifMs); 
		    return Math.abs(ageDate.getUTCFullYear() - 1970);
	  };
	  
	  $scope.calculateTime = function(totalSeconds){
		  var hours   = Math.floor(totalSeconds / 3600);
		  var minutes = Math.floor((totalSeconds - (hours * 3600)) / 60);
		  var seconds = totalSeconds - (hours * 3600) - (minutes * 60);

		  // round seconds
		  seconds = Math.round(seconds * 100) / 100

		  var result = (hours < 10 ? "0" + hours : hours);
		      result += ":" + (minutes < 10 ? "0" + minutes : minutes);
		      result += ":" + (seconds  < 10 ? "0" + seconds : seconds);
		  return result;
	};
	
	$rootScope.hideMainLoader();
  });

