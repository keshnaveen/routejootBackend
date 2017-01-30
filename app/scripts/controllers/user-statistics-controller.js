angular.module('RoutejootWebSite')
  .controller('userStatisticsCtrl', function ($scope, $compile, $rootScope, HttpService, $q, $interval, $location, DialogService, $timeout){
	   Chart.defaults.global.defaultFontColor = '#fffff';  
	   $scope.windowResized = function(){
		   
	   }
	   $scope.isAttrValid = false;
	   //page constraints
	   $scope.isDaySplitCompleted = false;
	   $scope.isHalfYearAnalysisCompleted = false;
	   $scope.isDaySessionChartCompleted = false;
	   $scope.isDistanceAnalysisChartCompleted = false;
	   $scope.isOverallSummaryCompleted = false;
	   $scope.isGarageAnalysisCompleted = false;
	   
	   //view constraints
	   $scope.isDayModeDataAvalible = false;
	   $scope.isNightModeDataAvalible = false;
	   $scope.isOverallRideSummaryAvalable = false;
	   
	   if(typeof $location.search().user_id != 'undefined' && typeof $location.search().unit != 'undefined'){
		   $scope.userId = $location.search().user_id;
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
	   
   	   $scope.lessThenString = '< '+$rootScope.ConvertKmsToMls(100)+' '+$scope.unitString;
   	   $scope.hundredToFiveHundredString = $rootScope.ConvertKmsToMls(100)+' - '+$rootScope.ConvertKmsToMls(500)+' '+$scope.unitString;
   	   $scope.FiveHundredToThousandString = $rootScope.ConvertKmsToMls(500)+' - '+$rootScope.ConvertKmsToMls(1000)+' '+$scope.unitString;
   	   $scope.greatherThenThousandString = '> '+$rootScope.ConvertKmsToMls(1000)+' '+$scope.unitString;
	   
	   // if Attribute is given
	   if($scope.isAttrValid){		  		    		    
		   /*BEGIN code for Ride overall Summary*/
		   var d = new Date();	
		   $scope.thisYear = d.getFullYear();
		   
		   var rideOverallSummaryHttpRequest = HttpService.fetchGET($rootScope.thisYearAndoverallRideSummary,"user_id="+$scope.userId+"&year="+d.getFullYear());
		   HttpService.httpCall(rideOverallSummaryHttpRequest)
		   .then(function(rideOverallSummaryResponse){
			   if(rideOverallSummaryResponse.result != 0){
					 reportError(rideOverallSummaryResponse.result)
			   }
			   var rideSummaryData = rideOverallSummaryResponse.data;	
			   $scope.thisYearDistance = (rideSummaryData.thisYear == undefined) ? 0 : $rootScope.ConvertKmsToMls(rideSummaryData.thisYear.total_distance);
			   $scope.overallYearDistance = $rootScope.ConvertKmsToMls(rideSummaryData.overall.total_distance);
			   $scope.thisYearAvgSpeed = (rideSummaryData.thisYear == undefined) ? 0 :$rootScope.ConvertKmsToMls(rideSummaryData.thisYear.avg_speed);
			   $scope.overallAvgSpeed = $rootScope.ConvertKmsToMls(rideSummaryData.overall.avg_speed);
			   $scope.thisYearMaxSpeed = (rideSummaryData.thisYear == undefined) ? 0 :$rootScope.ConvertKmsToMls(rideSummaryData.thisYear.max_speed);
			   $scope.overallMaxSpeed = $rootScope.ConvertKmsToMls(rideSummaryData.overall.max_speed);
			   $scope.thisYearRideCount = (rideSummaryData.thisYear == undefined) ? 0 :rideSummaryData.thisYear.ride_count;
			   $scope.overallRideCount = rideSummaryData.overall.ride_count;
			   $scope.thisYearRideTime = (rideSummaryData.thisYear == undefined) ? 0 :$scope.secondsToHm(rideSummaryData.thisYear.ride_time);
			   $scope.overallRideTime = $scope.secondsToHm(rideSummaryData.overall.ride_time);
			   $scope.thisYearLongestRide = (rideSummaryData.thisYear == undefined) ? 0 :$rootScope.ConvertKmsToMls(rideSummaryData.thisYear.longest_ride_distance);
			   $scope.overallLongestRide = $rootScope.ConvertKmsToMls(rideSummaryData.overall.longest_ride_distance);
			   	  
			   $scope.isOverallRideSummaryAvalable = true;
			   $scope.isOverallSummaryCompleted = true;
		   })
		   /*END code for Ride overall Summary*/
		   
		   /*BEGIN code for Day Split UI*/	   
		   var dayModeHttpRequest = HttpService.fetchGET($rootScope.UserRideDaySplitUrl,"user_id="+$scope.userId);
		   HttpService.httpCall(dayModeHttpRequest)
		   .then(function(dayModeResponse){
			   if(dayModeResponse.result != 0){
				   reportError(dayModeResponse.result)
			   }
			   var dayModeData = dayModeResponse.data;
			   
			   dayModeData.forEach(function(value){
				   switch(value.day_mode){
					   case $rootScope.DayMode.DAWN:
						   {
							    $scope.dawnAvgSpeed = $rootScope.ConvertKmsToMls(value.avg_speed);
						 		$scope.dawnMaxSpeed = $rootScope.ConvertKmsToMls(value.max_speed);
						 		$scope.dawnDistance = $rootScope.ConvertKmsToMls(value.distance);
						 		$scope.isDayModeDataAvalible = true;	
						 		break;
						   }
					   case $rootScope.DayMode.DUSK:
					 	   {						   		
						 		$scope.duskAvgSpeed = $rootScope.ConvertKmsToMls(value.avg_speed);
						 		$scope.duskMaxSpeed = $rootScope.ConvertKmsToMls(value.max_speed);
						 		$scope.duskDistance = $rootScope.ConvertKmsToMls(value.distance);
						 		$scope.isNightModeDataAvalible = true;	
						 		break;
					 	   }
				   }  
			   });
			   $scope.isDaySplitCompleted = true;
		   });
		   /*END code for Day Split UI*/  
		   
		   /*BEGIN code for Half Year Analysis*/
		    var d = new Date();
		    var ISOdate = d.toISOString();
		    var monthArr = [];
		    		        
		    /*BEGIN code for Half Year Analysis Chart*/
		   	$scope.halfYearAnalysisLabels = ['','','','','',''];
		   	$scope.halfYearAnalysisSeries = ['Distance ('+$scope.unitString+')'];  
		   	$scope.halfYearAnalysisDataset = [{ fill: false }];
		   	$scope.halfYearAnalysisOptions = {
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
			            text: 'Half Year Analysis',
			            fontColor: '#ffffff'
			        },
   				    legend:{
						  display: true,
						  position:'bottom',
						  labels:{fontColor: '#ffffff'}
						}
			};
		    $scope.halfYearAnalysisData = [];
		    var analysisData = [];
		   	/*END code for Half Year Analysis Chart*/
		    
		    for(i=5;i>=0;i--){
		    	var tempDate = new Date();
		    	var dt = new Date( (new Date(tempDate.getFullYear(), d.getMonth()-i+1 ,1))-1 );
		    	$scope.halfYearAnalysisLabels[i] = $rootScope.Months[dt.getMonth().toString()] + "\n"+dt.getFullYear().toString().substr(2,2);
		    	monthArr[i] = dt.getMonth() + 1;
		    }
		    $scope.halfYearAnalysisLabels.reverse();
		    monthArr.reverse();		    
		    	    
		    var halfYearAnalysisHttpRequest = HttpService.fetchGET($rootScope.HalfYearRideStatistics,"user_id="+$scope.userId+'&current_date='+ISOdate);
		    HttpService.httpCall(halfYearAnalysisHttpRequest)
		    .then(function(halfYearAnalysisResponse){
		    	if(halfYearAnalysisResponse.result != 0){
					 reportError(halfYearAnalysisResponse.result)
				}
				var halfYearAnalysisData = halfYearAnalysisResponse.data;
				
				halfYearAnalysisData.forEach(function(value){				
					analysisData[monthArr.indexOf(value.month)] = $rootScope.ConvertKmsToMls(value.total_distance);
				});
				$scope.halfYearAnalysisData = [analysisData];
				
				$scope.isHalfYearAnalysisCompleted = true;
		    })
		   /*END code for Half Year Analysis*/
	   };
	   
	   /*BEGIN code for Distance Analysis*/
	   $scope.distancewiseRideDataset = [{ fill: false }];
	   $scope.distancewiseRideOptions = {
			   segmentShowStroke: false,
			   animateRotate: true,
			   animateScale: false,
			   percentageInnerCutout: 50,
			   scales: {
						fontColor: '#ffffff',
				},
				title: {
		            display: true,
		            text: 'Ride Count By Distance',
		            fontColor: '#ffffff'
		        },
				legend:{
					 display: true,
					 position:'right',
					 labels:{fontColor: '#ffffff'}
					}
		        };
	   
	   var distancewiseRideCountHttpRequest = HttpService.fetchGET($rootScope.distancewiseRideCount,"user_id="+$scope.userId);
	   HttpService.httpCall(distancewiseRideCountHttpRequest)
	    .then(function(distancewiseRideCountResponse){
	    	if(distancewiseRideCountResponse.result != 0){
				 reportError(distancewiseRideCountResponse.result)
			}
			var distancewiseRideCountData = distancewiseRideCountResponse.data;
			
			 $scope.distancewiseRidelabels = [$scope.lessThenString, $scope.hundredToFiveHundredString, $scope.FiveHundredToThousandString, $scope.greatherThenThousandString];
			 $scope.distancewiseRideData = [parseInt($rootScope.ConvertKmsToMls(distancewiseRideCountData.less_then_hundred)), parseInt($rootScope.ConvertKmsToMls(distancewiseRideCountData.hundred_to_five_hundred)), parseInt($rootScope.ConvertKmsToMls(distancewiseRideCountData.five_hundred_to_thousand)), parseInt($rootScope.ConvertKmsToMls(distancewiseRideCountData.gt_thousand))];
						 
			 $scope.isDistanceAnalysisChartCompleted = true;
	    })
	   /*END code for Distance Analysis*/
	   
	   /*BEGIN code for Day Session Analysis*/
	   /*BEGIN code for Day Session Chart*/
	   $scope.daySessionAnalysisLabels = ["Morning", "Afternoon", "Evening", "Night"];
	   $scope.daySessionAnalysisSeries = ['Distance ('+$scope.unitString+')'];
	   
	   $scope.daySessionAnalysisDataset = [{ fill: false }, { fill: false }];
	   $scope.daySessionAnalysisOptions = {
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
							            text: 'Distance By Day Split',
							            fontColor: '#ffffff'
							        },
				   				    legend:{
			   						  display: true,
			   						  position:'bottom',
			   						  labels:{fontColor: '#ffffff'}
		   							}
	   							};
	   /*END code for Day Session Chart*/
	   var daySessionAnalysisHttpRequest = HttpService.fetchGET($rootScope.getUserRideSessions,"user_id="+$scope.userId);
	   HttpService.httpCall(daySessionAnalysisHttpRequest)
	   .then(function(daySessionAnalysisResponse){
		   if(daySessionAnalysisResponse.result != 0){
				 reportError(daySessionAnalysisResponse.result)
		   }
		   var daySessionAnalysisData = daySessionAnalysisResponse.data;
		   
		   var distanceSplit = [];
		   
		   daySessionAnalysisData.forEach(function(value){
			   switch(value.day_split)
			   {
				   		case $rootScope.DaySplit.MORNING :
				   			{			   			  
				   				distanceSplit[0] = $rootScope.ConvertKmsToMls(value.distance);
				   				break;
				   			}								
				   		case $rootScope.DaySplit.AFTERNOON :
					   		{				   			   
				   				distanceSplit[1] = $rootScope.ConvertKmsToMls(value.distance);
				   				break;
				   			}
				   		case $rootScope.DaySplit.EVENING :
					   		{
				   				distanceSplit[2] = $rootScope.ConvertKmsToMls(value.distance);
				   				break;
				   			}
				   		case $rootScope.DaySplit.NIGHT :
					   		{
				   				distanceSplit[3] = $rootScope.ConvertKmsToMls(value.distance);
				   				break;
				   			}
					   	default : break;
			   }
		   })
		   $scope.daySessionAnalysisData = [distanceSplit];
		   $scope.isDaySessionChartCompleted = true;
	   })
	   /*END code for Day Session Analysis*/
	   
	   /*BEGIN code for Garage Analysis*/
	   $scope.garageAnalysisLabels = [];
	   $scope.garageAnalysisSeries = ['Distance ('+$scope.unitString+')'];
	   $scope.garageAnalysisData = [];
	   $scope.garageAnalysisDataset = [];
	   $scope.garageAnalysisOptions = {
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
							            text: 'Distance By Vehicle',
							            fontColor: '#ffffff'
							        },
				   				    legend:{
			   						  display: true,
			   						  position:'bottom',
			   						  labels:{fontColor: '#ffffff'}
		   							}
	   							};
	   
	   var garageAnalysisHttpRequest = HttpService.fetchGET($rootScope.garageAnalysisByUser,"user_id="+$scope.userId);
	   HttpService.httpCall(garageAnalysisHttpRequest)
	   .then(function(garageAnalysisResponse){
		   if(garageAnalysisResponse.result != 0){
				 reportError(garageAnalysisResponse.result)
		   }
		   var garageAnalysisData = garageAnalysisResponse.data;
		   
		   var vehDistance = [];
		   garageAnalysisData.forEach(function(vehicle){
			   $scope.garageAnalysisLabels.push(vehicle.vehicle_brand);
			   $scope.garageAnalysisDataset.push({ fill: false });
			   vehDistance.push(parseInt($rootScope.ConvertKmsToMls(vehicle.distance)));
		   });
	   	   $scope.garageAnalysisData =[vehDistance];
	   	   
	   	   $scope.isGarageAnalysisCompleted = true;
	   })
	   /*END code for Garage Analysis*/
	   	   
	   $scope.secondsToHm = function(d) {
		   d = Number(d);		  	   
		   var h = Math.floor(d / 3600);
		   var days = Math.floor(h /24);
		   if(days > 0){
			   hours = days*24;
			   h-=hours;
		   }
		   var m = Math.floor(d % 3600 / 60);
		   var s = Math.floor(d % 3600 % 60);
		   var res = ((h > 0 ? h + "h " + (m < 10 ? "0" : "") : "") + m +"m" ); 
		   if(days>0)
			   return days+'d '+res;
		   else
			   return res;
	   };	
	   
	   $scope.isPageCompletedInterval = $interval(function(){
		   if($scope.isDaySplitCompleted && $scope.isHalfYearAnalysisCompleted && $scope.isDaySessionChartCompleted && $scope.isOverallSummaryCompleted && $scope.isGarageAnalysisCompleted){
			   $interval.cancel($scope.isPageCompletedInterval);
			   $rootScope.hideMainLoader();
		   }
	   },10);	  	     
});

//error handler
function reportError(error){
	   debugger;
	   console.log(error);
	   $rootScope.hideMainLoader();
}