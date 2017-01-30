angular.module('RoutejootWebSite')
  .controller('eventStatisticsCtrl', function ($scope, $compile, $rootScope, HttpService, $q, $interval, $location, DialogService, $timeout){
	   Chart.defaults.global.defaultFontColor = '#fffff';
	   $scope.windowResized = function(){
		  
	   }
	   $scope.isAttrValid = false;
	   
	   var rideIds = [], rideMembers=[], ridersName=[], ridersTravelledTime=[], ridersAvgSpeed=[], ridersDistance=[];
	   
	   //page constants
	   $scope.isRideSummaryCompleted = false;
	   	   
	   if(typeof $location.search().event_id != 'undefined' && typeof $location.search().unit != 'undefined'){
		   $scope.eventId = $location.search().event_id;
		   $scope.unit = $location.search().unit;
		   
		   $rootScope.unit = $scope.unit;
		   
		   if($rootScope.unit == $rootScope.ReqUrlUnits.MILES){
			   $scope.unitString = "mi";
			   $scope.speedUnitString = "mi/h";
		   }
		   else{
			   $scope.unitString = "km";
			   $scope.speedUnitString = "km/h";
		   }
		   
		   $scope.isAttrValid = true;
	   }
	   
	   if($scope.isAttrValid){
		   var eventCoridersAndDistanceHttpRequest = HttpService.fetchGET($rootScope.eventCoridersAndDistance,"event_id="+$scope.eventId);
		   HttpService.httpCall(eventCoridersAndDistanceHttpRequest)
		   .then(function(eventCoridersAndDistanceResp){
			   if(eventCoridersAndDistanceResp.result != 0){
				   reportError(eventCoridersAndDistanceResp.result)
			   }
			   
			   var eventSummaryData = eventCoridersAndDistanceResp.data;			   
			   
			   /*BEGIN Code for Event Summary Chart*/
			   $scope.eventSummaryLabels = [];
			   $scope.eventSummarySeries = [];
			   $scope.eventSummaryData = [];
			   $scope.eventSummaryDataset = [];
			   $scope.eventSummaryOptions = {
										   scales: {
													fontColor: '#ffffff',
													yAxes: [{
														 ticks: {
											                    beginAtZero:false
											                }
										            }]
											},
										    title: {
									            display: true,
									            text: 'Avg Speed ( '+$scope.speedUnitString+' )',
									            fontColor: '#ffffff'
									        },
									        legend:{
												 display: true,
												 position:'bottom',											 
												 labels:{
													 		hidden: true,
													 		fontColor: '#ffffff'
												 		}
											}
			   							};
			   /*END Code for Event Summary Chart*/
			   
			   /*BEGIN code for distance wise Event Analysis Chart*/
			   $scope.disatancewiseEventAnalysisLabels = [];
			   $scope.disatancewiseEventAnalysisData = [];
			   $scope.disatancewiseEventAnalysisSeries = ['Distance ( '+$scope.unitString+' )'];
			   $scope.disatancewiseEventAnalysisDataset = [];
			   $scope.disatancewiseEventAnalysisOptions = {
					   scales: {
								fontColor: '#ffffff',
								yAxes: [{
					                ticks: {
					                    beginAtZero:true
					                }
					            }]
						},
					    title: {
				            display: true,
				            fontColor: '#ffffff',
				            text: 'Distance Travelled'
				        },
	   				    legend:{
   						  display: true,
   						  position:'bottom',
   						  labels:{fontColor: '#ffffff'}
							}
						};
			   /*END code for distance wise Event Analysis Chart*/
			   
			   /*BEGIN code for time wise Event Analysis Chart*/
			   $scope.timewiseEventAnalysisLabels = [];
			   $scope.timewiseEventAnalysisData = [];
			   $scope.timewiseEventAnalysisSeries = ['Time Taken ( Hours )'];
			   $scope.timewiseEventAnalysisDataset = [];
			   $scope.timewiseEventAnalysisOptions = {
					   scales: {
								fontColor: '#ffffff',
								yAxes: [{
									ticks: {
					                    beginAtZero:true
					                },
									time: {
					                    unit: 'hour'
					                }					                
					            }]
						},
					    title: {
				            display: true,
				            fontColor: '#ffffff',
				            text: 'Time Taken'
				        },
	   				    legend:{
   						  display: true,
   						  position:'bottom',
   						  labels:{fontColor: '#ffffff'}
							}
						};
			   /*END code for time wise Event Analysis Chart*/
			   
			   /*BEGIN code for avg speed Event Analysis Chart*/
			   $scope.avgSpeedEventAnalysisLabels = [];
			   $scope.avgSpeedEventAnalysisData = [];
			   $scope.avgSpeedEventAnalysisSeries = ['Avg Speed ( '+$scope.speedUnitString+' )'];
			   $scope.avgSpeedEventAnalysisDataset = [];
			   $scope.avgSpeedEventAnalysisOptions = {
					   scales: {
								fontColor: '#ffffff',
								yAxes: [{
									ticks: {
					                    beginAtZero:true
					                }					                
					            }]
						},
					    title: {
				            display: true,
				            fontColor: '#ffffff',
				            text: 'Avg Speed Across The Ride'
				        },
	   				    legend:{
   						  display: true,
   						  position:'bottom',
   						  labels:{fontColor: '#ffffff'}
							}
						};
			   /*END code for avg speed Event Analysis Chart*/
			   
			   var sortRideMembersByDistance = []
			   
			   eventSummaryData.event_riders.forEach(function(event_riders){
				   $scope.eventSummarySeries.push(event_riders.user_name.trim());
				   rideIds.push(event_riders.ride_id);
				   rideMembers.push({ride_id:event_riders.ride_id, avg_speed:[]});
				   
				   var tempName = event_riders.user_name.trim();
				   var arr = tempName.split(' ');
				   
				   sortRideMembersByDistance.push({name:arr[0], 
					   							   ride_distance:parseInt($rootScope.ConvertKmsToMls(event_riders.distance)), 
					   							   travelled_time:$scope.secondsToHm(parseInt(event_riders.travelled_time)),
					   							   avg_speed:parseInt($rootScope.ConvertKmsToMls(event_riders.avg_speed))
					   							  })
				   
				   ridersName.push(arr[0]);
				   
				   $scope.eventSummaryDataset.push({fill: false});
				   $scope.disatancewiseEventAnalysisDataset.push({fill: false});
				   $scope.timewiseEventAnalysisDataset.push({fill: false});
				   $scope.avgSpeedEventAnalysisDataset.push({fill: false});
				   
			   });	   
			   
			   /*BEGIN code for distance wise Event Analysis Chart*/
			   var rideDistanceResult = $scope.sortByElement(sortRideMembersByDistance,"ride_distance"); 
			   $scope.disatancewiseEventAnalysisLabels = rideDistanceResult.names;
			   $scope.disatancewiseEventAnalysisData = [rideDistanceResult.data];		
			   /*END code for distance wise Event Analysis Chart*/
			   
			   /*BEGIN code for time wise Event Analysis Chart*/
			   var timeWiseEventResult = $scope.sortByElement(sortRideMembersByDistance,"travelled_time"); 
			   $scope.timewiseEventAnalysisLabels = timeWiseEventResult.names;
			   $scope.timewiseEventAnalysisData = [timeWiseEventResult.data];		
			   /*END code for time wise Event Analysis Chart*/
			   
			   /*BEGIN code for avg speed Event Analysis Chart*/
			   var avgSpeedResult = $scope.sortByElement(sortRideMembersByDistance,"avg_speed");
			   $scope.avgSpeedEventAnalysisLabels = avgSpeedResult.names;
			   $scope.avgSpeedEventAnalysisData = [avgSpeedResult.data];		
			   /*END code for avg speed Event Analysis Chart*/
			   
			   /*BEGIN code for distance wise Event Analysis Chart*/
			   var split = parseInt(eventSummaryData.distance/10);
			   var splitCount = 0, splitNextCount = split;
			    		  
			   for(var i=0; i<10; i++){
				   $scope.eventSummaryLabels[i] = $rootScope.ConvertKmsToMls(splitCount).toString();
				   var httprequest = $rootScope.baseUrl+$rootScope.DistancewiseRidesSplit;
				   
				   $.ajax({
				        type: "POST",
				        data:{
				        	ride_ids:rideIds,
				        	from_distance:splitCount,
				        	to_distance:splitNextCount
				        },
				        url: httprequest,
				        async: false,
				        success : function(response) {
				            if(response.result != 0)
				            	reportError(response);
				            else{
				            	response.data.forEach(function(ride){
				            		for(j=0;j<rideMembers.length;j++){
				            			if(rideMembers[j].ride_id == ride._id){
				            				rideMembers[j].avg_speed.push(parseInt($rootScope.ConvertKmsToMls(ride.avg_speed)));
				            				break;
				            			}
				            		}
				            	});		  
				            }
				        },
				        fail:function(error){reportError(error);}
				    });
				   splitCount = splitNextCount;
				   splitNextCount+=split;
			   }
			   
			   rideMembers.forEach(function(rideMember){
				   $scope.eventSummaryData.push(rideMember.avg_speed);
			   })
			   
			   $scope.isRideSummaryCompleted = true;
			   /*END code for Event Summary Chart*/			  		   
			   
			})
	   }else{
		   reportError(null);
	   }
	   
	   $scope.isPageCompletedInterval = $interval(function(){
		   if($scope.isRideSummaryCompleted){
			   $interval.cancel($scope.isPageCompletedInterval);
			   $rootScope.hideMainLoader();
		   }
	   },10);
	   
	   $scope.sortByElement = function(distanceArr,element){
		   for(var i=0;i<distanceArr.length-1;i++){
				 for(var j=i+1;j<distanceArr.length;j++){
					if(distanceArr[i][element]<distanceArr[j][element]){
						var temp=distanceArr[j];
						distanceArr[j]=distanceArr[i];
						distanceArr[i]=temp;
					}
				 }		 
		   } 
		   
		   var names=[], data=[];
		   distanceArr.forEach(function(rider){
			   names.push(rider.name);
			   data.push(rider[element]);
		   })
		   return {names:names, data:data};
		}
	   
	   $scope.secondsToHm = function(d) {
		   d = Number(d);
		   var h = Math.floor(d / 3600);
		   var m = Math.floor(d % 3600 / 60);
		   var s = Math.floor(d % 3600 % 60);
		   return parseInt(h);
		  // return ((h > 0 ? h + "h " + (m < 10 ? "0" : "") : "") + m +"m" ); 
	   };
	   
	   // error handler
	   function reportError(error){
		   debugger;
		   console.log(error);
		   $rootScope.hideMainLoader();
	   }
 })