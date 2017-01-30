var mapinitlized = false;
function initMap(){
	mapinitlized = true;
}

angular.module('RoutejootWebSite')
  .controller('googleMapsCtrl', function ($scope, $compile, $rootScope, HttpService, $q, $interval,  $window){	 
	  	    
	  $rootScope.ResizeControl = function(controlDiv, map){
		// Set CSS for the control border.
	        var controlUI = document.createElement('div');
	        controlUI.style.backgroundImage = 'url('+$rootScope.iconUrl+'refreshgps.png'+')';
	        controlUI.style.height = '40px';
	        controlUI.style.width = '40px';
	        controlUI.style.backgroundSize = 'contain';
	        controlUI.style.backgroundRepeat = 'no-repeat';
	        controlUI.style.border = '2px solid #fff';
	        controlUI.style.textAlign = 'center';
	        controlUI.style.zIndex = '999';
	        controlUI.style.borderRadius = '90px';
	        controlUI.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
	        controlUI.style.cursor = 'pointer';
	        controlUI.style.marginRight = '3px';
	        controlUI.title = 'Click to recenter the map';
	        controlDiv.appendChild(controlUI);

	        // Set CSS for the control interior.
	        var controlText = document.createElement('div');
	        controlText.style.color = 'rgb(25,25,25)';
	        controlText.style.fontSize = '16px';
	        controlText.style.lineHeight = '38px';
	        controlText.style.paddingLeft = '5px';
	        controlText.style.paddingRight = '5px';
	        controlUI.appendChild(controlText);

	        // Setup the click event listeners: simply set the map to Chicago.
	        controlUI.addEventListener('click', function() {
	        	if($rootScope.rideData.ride_status != 1){
	        		  var bounds = new google.maps.LatLngBounds();
		        	  bounds.extend(new google.maps.LatLng($rootScope.rideData.last_location.coordinates[1],  $rootScope.rideData.last_location.coordinates[0]));  
				      $rootScope.map.fitBounds(bounds);
				      $rootScope.map.setZoom($rootScope.map.getZoom());
	        	}
	        	else{
	        		  var bounds = new google.maps.LatLngBounds();
	        		  bounds.extend($rootScope.srcMarker.position);
	        		  bounds.extend($rootScope.destMarker.position);
					  $rootScope.map.fitBounds(bounds);
					  $rootScope.map.setZoom($rootScope.map.getZoom());
	        	}
	        });
	  }
	  
	  $rootScope.geocoder = new google.maps.Geocoder();
	  $rootScope.limitIntervell = 10;
	  $rootScope.IntervellCount = 0;
	  $rootScope.Broadcasted = false;
	  	  
	  var inter = $interval(function(){
		  $rootScope.IntervellCount++;
		  if(mapinitlized)
		  {
			  cancleIntervel(inter);			  		  
			  if($rootScope.Broadcasted == false){
				  $rootScope.Broadcasted = true;
				  $rootScope.InitMap(document.getElementById('googleMap'));
				  google.maps.event.addListener($rootScope.map, 'zoom_changed', function () {
					  if($rootScope.map.getZoom() > 15) 
					    	$rootScope.map.setZoom(15);			      
				  });
				  $rootScope.ResizeDiv = document.createElement('div');
				  var centerControl = new $rootScope.ResizeControl($rootScope.ResizeDiv, $rootScope.map);
				  $rootScope.ResizeDiv.index = 1;
				  $rootScope.map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push($rootScope.ResizeDiv);				  
				  $rootScope.$broadcast('googleMapsEnabled');
			  }				  
		  }
		  if(mapinitlized == false && $rootScope.IntervellCount>=$rootScope.limitIntervell)
			  $window.location.reload();
	  },1000); 
	  
	  $rootScope.initMobileMap = function(){
		  var inter = $interval(function(){
			  $rootScope.IntervellCount++;
			  if(mapinitlized)
			  {
				  cancleIntervel(inter);			  
				  if($rootScope.Broadcasted == false){	  
					  $rootScope.Broadcasted = true;
					  if($scope.windowWidth < 959){
						  $rootScope.InitMap(document.getElementById('mobileGoogleMap'));
					  }	
					  $rootScope.$broadcast('googleMapsEnabled');
				  }				  
			  }
			  if(mapinitlized == false && $rootScope.IntervellCount>=$rootScope.limitIntervell)
				  $window.location.reload();
		  },1000); 
	  }
	  
	  $rootScope.InitMap = function(elem){
		  $rootScope.map = new google.maps.Map(elem), {
			  center: {lat: 44.540, lng: -78.546},
		      zoom: 10,
			  mapTypeControl: false,
			  mapTypeId: google.maps.MapTypeId.ROADMAP,
			  zoomControl: false,
			  scaleControl: false,
			  streetViewControl: false,
			  fullscreenControl: false 
		  }
	  };
	  
	  $rootScope.GCMmarkPlace = function(lat,lng){
			return new google.maps.Marker({
			    position: new google.maps.LatLng(lat,lng),
			    map: $rootScope.map
			});
	  };
	  
	  $rootScope.GCMsetPath = function(encodedPath){
		  var polyline = getPath(encodedPath);
		  polyline.setMap($rootScope.map);
	  };
	  
	  $rootScope.getLocation = function(lat,lng){
		  var latlng = new google.maps.LatLng(lat, lng);
		  $rootScope.geocoder.geocode({'latLng': latlng},function(results, status){
			  if (status == google.maps.GeocoderStatus.OK) {
				  var add= results[0].formatted_address ;
                  var  value=add.split(",");

                  count=value.length;
                  country=value[count-1];
                  state=value[count-2];
                  city=value[count-3];             
			  }
			  else{
			 }
		  });
	  };
	  
	  function cancleIntervel(intervel){
		  $interval.cancel(intervel);
	  }
	  
	  
	  function getPath(encodedPath){
		  var decodedPath = google.maps.geometry.encoding.decodePath(encodedPath);
		  
		  var bounds = new google.maps.LatLngBounds();
		  decodedPath.forEach(function(latLng) {
			    bounds.extend(latLng);
		  });
		  $rootScope.map.fitBounds(bounds);
		  $rootScope.map.setZoom($rootScope.map.getZoom());
		  
		  return new google.maps.Polyline({
	          path: google.maps.geometry.encoding.decodePath(encodedPath),
	          geodesic: true,
	          strokeColor: '#008000',
	          strokeOpacity: 1.0,
	          strokeWeight: 3
	        });  
	  }  
  })