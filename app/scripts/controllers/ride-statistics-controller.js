angular.module('RoutejootWebSite')
  .controller('rideStatisticsCtrl', function ($scope, $compile, $rootScope, HttpService, $q, $interval, $location, DialogService, $timeout){
	   Chart.defaults.global.defaultFontColor = '#fffff';
	   
	   $scope.windowResized = function(){
		   angular.element(document.querySelector("#maxSpeed")).highcharts().reflow(); 
		   angular.element(document.querySelector("#avgSpeed")).highcharts().reflow(); 	
	   }
	   $scope.isAttrValid = false;
	   
	   //page constants
	   $scope.isDayModeCompleted = false;
	   $scope.isDaySplitChartCompleted = false;
	   $scope.isSpeedAndElevationChartCompleted = false;
	   $scope.isAvgMaxSpeedChartCompleted = false;
	   
	   //view constants
	   $scope.isDayModeDataAvalible = false;
	   $scope.isNightModeDataAvalible = false;	  
	   
	   if(typeof $location.search().ride_id != 'undefined' && typeof $location.search().unit != 'undefined'){
		   $scope.rideId = $location.search().ride_id;
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
	   
	// BEGIN User Max and Avg speed chart
	   var gaugeOptions = {
			   chart: {
		            type: 'solidgauge',
		            backgroundColor: '#333237',
		            polar: true,
		            spacingBottom: 0,
		            spacingTop: 40,
		            spacingLeft: 0,
		            spacingRight: 0,

		            // Explicitly tell the width and height of a chart
		            width: 150,
		            height: 150
		        },

		        title: null,

		        pane: {
		            size: '100%',
		            startAngle: -90,
		            endAngle: 90,
		            background: {
		                backgroundColor: '#FFFFFF',
		                innerRadius: '60%',
		                outerRadius: '100%',
		                shape: 'arc'
		            }
		        },

		        tooltip: {
		            enabled: false
		        },

		        // the value axis
		        yAxis: {
		            stops: [
		                [0.1, '#55BF3B'], // green
		                [0.5, '#DDDF0D'], // yellow
		                [0.9, '#DF5353'] // red
		            ],
		            lineWidth: 0,
		            minorTickInterval: null,
		            tickAmount: 0,
		            title: {
		                y: 60
		            },
		            labels: {
		                y: 16,	                
		            },
		            style:{
	                	fontFamily:"Agency-FB"
	                }
		        },

		        plotOptions: {
		        	series:{
		        		animation:{
		        			duration: 3000
		        		}
		        	},
		            solidgauge: {
		                dataLabels: {
		                    y: -30,
		                    borderWidth: 0,
		                    useHTML: true,
		                    color:'#ffffff'
		                }
		            }
		        }
	   }
	   // END User Max and Avg speed chart
	   
	   // if Attribute is given
	   if($scope.isAttrValid){		
		   var rideDataHttpRequest = HttpService.fetchGET($rootScope.getRideById,"ride_id="+$scope.rideId);
		   HttpService.httpCall(rideDataHttpRequest)
		   .then(function(rideDataResponse){
			  if(rideDataResponse.result != 0){
				 reportError(rideDataResponse.result)
			  }
			  var rideData = rideDataResponse.data;
			  /*BEGIN code for Ride Max And Avg Speed Chart*/			  
			   $scope.maxSpeed = parseInt($rootScope.ConvertKmsToMls(rideData.max_speed));
			   $scope.avgSpeed = parseInt($rootScope.ConvertKmsToMls(rideData.avg_speed));
			   $scope.rideDistance = $rootScope.ConvertKmsToMls(rideData.distance);
			   $scope.totalTime = $scope.secondsToHm(rideData.total_duration);
			   $scope.onRideTime = $scope.secondsToHm(rideData.time_elapsed);
			   $scope.idealTime = $scope.secondsToHm(rideData.standby_duration);
			   
			   $scope.maxSpeedConstant = parseInt($rootScope.ConvertKmsToMls(400));
			   $scope.avgSpeedConstant = parseInt($rootScope.ConvertKmsToMls(400));
			   
			   // BEGIN User Max and Avg speed chart
			   Highcharts.chart('maxSpeed', Highcharts.merge(gaugeOptions, {
					// the value axis
				        yAxis: {
				            stops: [
				                [0.1, '#55BF3B'], // green
				                [0.5, '#DDDF0D'], // yellow
				                [0.9, '#DF5353'] // red
				            ],
				            lineWidth: 0,
				            minorTickInterval: null,
				            tickAmount: 2,
				            title: {
				                y: -70
				            },
				            labels: {
				                y: 16
				            }
				        },
				        yAxis: {
				            min: 0,
				            max: $scope.maxSpeedConstant,
				            title: {
				                text: 'Max Speed',
				                style: {
						            color: '#BCBCBC',
						            fontFamily:"OpenSans-Regular",
						            fontSize:10
						         }
				            }
				        },

				        credits: {
				            enabled: false
				        },

				        series: [{
				            name: 'Max Speed',
				            data: [$scope.maxSpeed],
				            dataLabels: {
				                format: '<div style="text-align:center;top:20px;"><span class="rjGaugeNumberText" style="margin-left:10px">{y}</span><br/>' +
				                       '<span style="font-size:10px;font-family:OpenSans-Regular;color:#BCBCBC;margin-left:8px">'+$scope.speedUnitString+'</span></div>',
				                style:{
				                	top:70
				                }
				            },
				            tooltip: {
				                valueSuffix: ' '+$scope.speedUnitString
				            }
				        }]
				   }));
			   
			   Highcharts.chart('avgSpeed', Highcharts.merge(gaugeOptions, {
				// the value axis
			        yAxis: {
			            stops: [
			                [0.1, '#55BF3B'], // green
			                [0.5, '#DDDF0D'], // yellow
			                [0.9, '#DF5353'] // red
			            ],
			            lineWidth: 0,
			            minorTickInterval: null,
			            tickAmount: 2,
			            title: {
			                y: -70
			            },
			            labels: {
			                y: 16
			            }
			        },
			        yAxis: {
			            min: 0,
			            max: $scope.avgSpeedConstant,
			            title: {
			                text: 'Avg Speed',
			                style: {
			                	color: '#BCBCBC',
					            fontFamily:"OpenSans-Regular",
					            fontSize:10
					         }
			            }
			        },

			        credits: {
			            enabled: false
			        },

			        series: [{
			            name: 'Avg Speed',
			            data: [$scope.avgSpeed],
			            dataLabels: {
			                format: '<div style="text-align:center"><span class="rjGaugeNumberText">{y}</span><br/>' +
			                       '<span style="font-size:10px;font-family:OpenSans-Regular;color:#BCBCBC">'+$scope.speedUnitString+'</span></div>'
			            },
			            tooltip: {
			                valueSuffix: ' '+$scope.speedUnitString
			            }
			        }]
			   }));
			   $scope.isAvgMaxSpeedChartCompleted = true;
			// END User Max and Avg speed chart
			/*END code for Ride Max And Avg Speed Chart*/
		   })
		   
		   /*BEGIN code for Day Split UI*/
		   var dayModeHttpRequest = HttpService.fetchGET($rootScope.DaySplitUrl,"ride_id="+$scope.rideId);
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
					 		$scope.dawnDistance = $rootScope.ConvertKmsToMls(value.distance);
					 		$scope.dawnAvgSpeed = $rootScope.ConvertKmsToMls(value.avg_speed);
					 		$scope.dawnMaxSpeed = $rootScope.ConvertKmsToMls(value.max_speed);
					 		$scope.isDayModeDataAvalible = true;	
					 		break;
					 	}
				 	case $rootScope.DayMode.DUSK:
				 		{
					 		$scope.duskDistance = $rootScope.ConvertKmsToMls(value.distance);
					 		$scope.duskAvgSpeed = $rootScope.ConvertKmsToMls(value.avg_speed);
					 		$scope.duskMaxSpeed = $rootScope.ConvertKmsToMls(value.max_speed);
					 		$scope.isNightModeDataAvalible = true;	
					 		break;
				 		}
				 } 
			  });
			  $scope.isDayModeCompleted = true;
		   });
		   /*END code for Day Split UI*/
		   
		   /*BEGIN Code for Day split Graph*/	   
		   $scope.daySplitLabels = ["Morning", "Afternoon", "Evening", "Night"];
		   $scope.daySplitSeries = ['Max Speed ('+$scope.speedUnitString+')','Avg Speed ('+$scope.speedUnitString+')'];
		   
		 //  $scope.daySplitDataset = [{ fill: false, borderWidth: 0 }, { fill: false,borderWidth: 0 }];
		   $scope.daySplitDataset = [{ fill: false }, { fill: false }];
		   $scope.daySplitOptions = {
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
								            text: 'Speed By Day Split',
								            fontColor: '#ffffff'
								        },
					   				    legend:{
				   						  display: true,
				   						  position:'bottom',
				   						  labels:{fontColor: '#ffffff'}
			   							}
		   							};
		   
		   var daySplitHttpRequest = HttpService.fetchGET($rootScope.DaySplitwiseRideDetailsUrl,"ride_id="+$scope.rideId);
		   HttpService.httpCall(daySplitHttpRequest)
		   .then(function(daySplitResponse){
			   if(daySplitResponse.result != 0){
				   reportError(daySplitResponse.result)
			   }
			   var daySplitData = daySplitResponse.data;
			   var avgSpeedData = [0,0,0,0], maxSpeedData = [0,0,0,0];
			   	
			   daySplitData.forEach(function(value){
					   switch(value.day_split){
					   		case $rootScope.DaySplit.MORNING :
					   			{
					   			    avgSpeedData[0] = $rootScope.ConvertKmsToMls(value.avg_speed);
					   			    maxSpeedData[0] = $rootScope.ConvertKmsToMls(value.max_speed);
					   				break;
					   			}								
					   		case $rootScope.DaySplit.AFTERNOON :
						   		{
					   			    avgSpeedData[1] = $rootScope.ConvertKmsToMls(value.avg_speed);
					   			    maxSpeedData[1] = $rootScope.ConvertKmsToMls(value.max_speed);
					   				break;
					   			}
					   		case $rootScope.DaySplit.EVENING :
						   		{
					   			    avgSpeedData[2] = $rootScope.ConvertKmsToMls(value.avg_speed);
					   			    maxSpeedData[2] = $rootScope.ConvertKmsToMls(value.max_speed);
					   				break;
					   			}
					   		case $rootScope.DaySplit.NIGHT :
						   		{
					   			    avgSpeedData[3] = $rootScope.ConvertKmsToMls(value.avg_speed);
					   			    maxSpeedData[3] = $rootScope.ConvertKmsToMls(value.max_speed);
					   				break;
					   			}
						   	default : break;
					   }
			   });
			   $scope.daySplitData = [maxSpeedData, avgSpeedData];
			   $scope.isDaySplitChartCompleted = true;
		   });		      
		   /*END Code for Day split Graph*/
		   
		   var rideSplitCountHttpRequest = HttpService.fetchGET($rootScope.RideSplitCountUrl,"ride_id="+$scope.rideId);
		   HttpService.httpCall(rideSplitCountHttpRequest)
		   .then(function(rideSplitCountResp){
			   if(rideSplitCountResp.result != 0){
				   reportError(rideSplitCountResp.result)
			   }
			      
			   var rideSplitCount = rideSplitCountResp.data.ride_split_count, valueCount = 0,split = parseInt((rideSplitCountResp.data.ride_split_count/10).toFixed(0));
			   if(split<=0)split=1;
			   
			   var splitCount = 0, splitNextCount = split;
			   
			   /*Begin code for speed analysis Graph*/
			   $scope.speedAnalysisDataset = [
				   		{ 
				   	        borderWidth: 1,
				   	        type: 'bar',
				   			fill: true 
				   		}, 
				   		{ 
					        borderWidth: 3,
					        type: 'line',
				   			fill: true 
				   		}
				   ];
			   $scope.speedAnalysisOptions = {
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
								            text: 'Speed By Distance'
								        },
					   				    legend:{
				   						  display: true,
				   						  position:'bottom',
				   						  labels:{fontColor: '#ffffff'}
			   							},
				   						yAxes: [{
					   			           ticks: {
					   		                   min: 1,
					   		                   max: 2,
					   		                   stepSize: 50
					   		               }
				   			            }]
			   					};
			   
			   $scope.speedAnalysisLabels = [];
			   $scope.speedAnalysisSeries = ['Max Speed ('+$scope.speedUnitString+')', 'Avg Speed ('+$scope.speedUnitString+')'];
			   $scope.speedAnalysisData = [];
			   
			   var maxSpeed = [], avgSpeed = [];
			   /*END code for speed analysis Graph*/
			   
			   /*BEGIN code for Elevation analysis Graph*/
			   $scope.elevationDataset = [{ fill: true }];
			   $scope.elevationOptions = {
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
									            text: 'Avg Elevation By Distance'
									        },
						   				    legend:{
					   						  display: true,
					   						  position:'bottom',
					   						  labels:{fontColor: '#ffffff'}
				   							}
			   							};
			   
			   $scope.elevationLabels = [];
			   $scope.elevationSeries = ['Elevation Avg (Mts)'];
			   $scope.elevationData = [];
			   
			   var eleAvg = [];
			   /*END code for Elevation analysis Graph*/
			   
			   for(var i=0; i<10; i++){
				   if(splitCount <= rideSplitCountResp.data.ride_split_count){						   
					   var httprequest = $rootScope.baseUrl+$rootScope.DistancewiseRideSplitUrl+'?ride_id='+$scope.rideId+'&from_distance='+splitCount+'&to_distance='+splitNextCount;
					  		
					   splitCount = splitNextCount;
					   splitNextCount+=split;	
					   
					   $.ajax({
					        type: "GET",
					        url: httprequest,
					        async: false,
					        success : function(response) {
					            if(response.result != 0)
					            	reportError(daySplitResponse.result);
					            else{
					            	if(splitCount <= rideSplitCountResp.data.ride_split_count){
					            		maxSpeed[i] = $rootScope.ConvertKmsToMls(response.data.max_speed);
						            	avgSpeed[i] = $rootScope.ConvertKmsToMls(response.data.avg_speed);
						            	eleAvg[i] = (response.data.elevation_max+response.data.elevation_min)/2;
					            	}					            					  
					            }
					        },
					        fail:function(error){reportError(error);}
					    });					  
					   
					   if(splitCount <= rideSplitCountResp.data.ride_split_count){
						   $scope.speedAnalysisLabels[i] = $rootScope.ConvertKmsToMls(splitCount).toString();
						   $scope.elevationLabels[i] = $rootScope.ConvertKmsToMls(splitCount).toString();
					   }
				   }
			   }			   			   			 
			   
			   if($rootScope.ConvertValueToKm($scope.speedAnalysisLabels[$scope.speedAnalysisLabels.length-1]) < $rootScope.ConvertValueToKm(rideSplitCountResp.data.ride_split_count))
			   {					   
				   var httprequest = $rootScope.baseUrl+$rootScope.DistancewiseRideSplitUrl+'?ride_id='+$scope.rideId+'&from_distance='+$rootScope.ConvertValueToKm($scope.speedAnalysisLabels[$scope.speedAnalysisLabels.length-1])+'&to_distance='+$rootScope.ConvertValueToKm(rideSplitCountResp.data.ride_split_count);
				   
				   $scope.speedAnalysisLabels[$scope.speedAnalysisLabels.length] = $rootScope.ConvertKmsToMls(rideSplitCountResp.data.ride_split_count).toString();
				   $scope.elevationLabels[$scope.elevationLabels.length] = $rootScope.ConvertKmsToMls(rideSplitCountResp.data.ride_split_count).toString();
				   
				   $.ajax({
				        type: "GET",
				        url: httprequest,
				        async: false,
				        success : function(response) {
				            if(response.result != 0)
				            	reportError(daySplitResponse.result);
				            else{
				            	maxSpeed[maxSpeed.length] = $rootScope.ConvertKmsToMls(response.data.max_speed);
				            	avgSpeed[avgSpeed.length] = $rootScope.ConvertKmsToMls(response.data.avg_speed);
				            	eleAvg[eleAvg.length] = (response.data.elevation_max+response.data.elevation_min)/2;				  
				            }
				        },
				        fail:function(error){reportError(error);}
				    });
			   }
			   
			   $scope.speedAnalysisData = [maxSpeed, avgSpeed];
			   $scope.elevationData = [eleAvg];
			   $scope.isSpeedAndElevationChartCompleted = true;
		   });		   		   		  		   		   		   		   		   		   
	   }
	   
	   $scope.isPageCompletedInterval = $interval(function(){
		   if($scope.isDayModeCompleted && $scope.isDaySplitChartCompleted && $scope.isSpeedAndElevationChartCompleted && $scope.isAvgMaxSpeedChartCompleted){
			   $interval.cancel($scope.isPageCompletedInterval);
			   $rootScope.hideMainLoader();
		   }
	   },10);
	   	   
	   $scope.secondsToHm = function(d) {
		   d = Number(d);
		   var h = Math.floor(d / 3600);
		   var m = Math.floor(d % 3600 / 60);
		   var s = Math.floor(d % 3600 % 60);
		   return ((h > 0 ? h + "h " + (m < 10 ? "0" : "") : "") + m +"m" ); 
	   };	
	   
	   // error handler
	   function reportError(error){
		   debugger;
		   console.log(error);
		   $rootScope.hideMainLoader();
	   }
  })