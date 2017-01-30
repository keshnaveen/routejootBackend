angular.module('RoutejootWebSite')
	   .service('ToastService', function($mdToast){
		   this.showSuccessToast = function(message){
			   var toast = $mdToast.simple()
			      .textContent(message)
			      .theme("success-toast")
			      .action('UNDO')
			      .highlightAction(true)
			      .highlightClass('md-accent')
			      .position('top right')
			      .hideDelay(3000)

			    $mdToast.show(toast).then(function(response) {
			      if ( response == 'ok' ) {
			    	  
			      }
			    });
		   }
	   })
	   .service('DialogService', function($mdDialog){
			  this.showAlert = function(title, message) {
				    $mdDialog.show(
				      $mdDialog.alert()
				        .parent(angular.element(document.querySelector('body')))
				        .clickOutsideToClose(false)
				        .title(title)
				        .textContent(message)
				        .ariaLabel('Rj Dialog')
				        .ok('OK')
				    );
				  };
	   }).directive('ngMouseWheelUp', function() {
		   var progress=0,lastCurrentValue=-1;
	        return function(scope, element, attrs) {
	            element.bind("DOMMouseScroll mousewheel onmousewheel", function(event) {	
	                        // cross-browser wheel delta
	                        var event = window.event || event; // old IE support	                    
	                        if(event.type != 'mousewheel')
	                        	var delta = Math.max(-1, Math.min(1, (event.wheelDelta || -event.detail)));
	                        else
	                        	var delta = Math.max(-1, Math.min(1, (-event.originalEvent.deltaY || -event.detail)));
	                        
	                        var currentWidth = angular.element('.scrollmenu').scrollLeft();
	                        scope.$apply(function(){
	                        	if(currentWidth > progress)
	                        		progress = currentWidth;
	                        	progress+=40*delta;
	                        	if(currentWidth!=0 && lastCurrentValue == currentWidth && delta > 0){
	                        		progress = lastCurrentValue;  
	                        		currentWidth = lastCurrentValue;
	                        	}
	                        	lastCurrentValue = currentWidth;	                      	
	                        	if(progress < 0)
	                        		progress = 0;	                        	
	                        	angular.element('.scrollmenu').scrollLeft(progress);
                        	});                        
	                    
	                        // for IE
                            event.returnValue = false;
                            // for Chrome and Firefox
                            if(event.preventDefault)  {
                                event.preventDefault();
                            }
	            });
	        };
	})
	.directive('resize', function ($window, $rootScope, $interval) {
	    return function (scope, element) {	    	
	        var w = angular.element($window);
	        scope.getWindowDimensions = function () {
	            return {
	                'h': w.height(),
	                'w': w.width()
	            };
	        };
	        scope.$watch(scope.getWindowDimensions, function (newValue, oldValue) {
	        	scope.loadInterval = $interval(function(){
	        		if(!$rootScope.isMainLoading){
	        			if(typeof scope.loadInterval != 'undefined')
	        				$interval.cancel(scope.loadInterval);
	        			scope.windowHeight = newValue.h;
			            scope.windowWidth = newValue.w;
			            scope.windowResized();
	        		}
	        		else
	        		{
	        			scope.windowHeight = newValue.h;
			            scope.windowWidth = newValue.w;
			            scope.windowResized();
	        		}
				 },200); 	     		        	           
	            
	            scope.style = function () {
	                return {	                	
	                    'height': (newValue.h - 100) + 'px',
	                    'width': (newValue.w - 100) + 'px'
	                };
	            };

	        }, true);

	        w.bind('resize', function () {
	            scope.$apply();
	        });
	    }
	})