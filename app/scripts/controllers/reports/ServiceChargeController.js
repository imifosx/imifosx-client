(function (module) {
    mifosX.controllers = _.extend(module, {
        ServiceChargeController: function (scope, resourceFactory, location, dateFilter, route, http, API_VERSION, $rootScope, localStorageService, $timeout) {
            scope.offices = [];
            scope.date = {};
            scope.restrictDate = new Date();
            scope.formData = {};
            scope.mixtaxonomyArray = [];

			scope.month = [{
			id: '1',
			name: 'Jan'
			}, {
			id: '2',
			name: 'Feb'
			}, {
			id: '3',
			name: 'Mar'
			}, {
			id: '4',
			name: 'Apr'
			}, {
			id: '5',
			name: 'May'
			}, {
			id: '6',
			name: 'Jun'
			}, {
			id: '7',
			name: 'Jul'
			}, {
			id: '8',
			name: 'Aug'
			}, {
			id: '9',
			name: 'Sep'
			}, {
			id: '10',
			name: 'Oct'
			}, {
			id: '11',
			name: 'Nov'
			}, {
			id: '12',
			name: 'Dec'
			}];	
			scope.getselectval = function () {
			scope.selectedmonthvalues= 'Name: ' + scope.monthselitem.name + ' Id: ' + scope.monthselitem.id;
				scope.monthno=scope.monthselitem.name;
			}
			
				
			
			scope.year = [{
			id: '1',
			name: new Date().getFullYear()-5
			}, {
			id: '2',
			name: new Date().getFullYear()-4
			}, {
			id: '3',
			name: new Date().getFullYear()-3
			}, {
			id: '4',
			name: new Date().getFullYear()-2
			}, {
			id: '5',
			name: new Date().getFullYear()-1
			}, {
			id: '6',
			name: new Date().getFullYear()
			}];
			scope.getselectvalyear = function () {
			scope.selectedyearvalues= 'Name: ' + scope.yearselitem.name + ' Id: ' + scope.yearselitem.id;
			scope.yearno= scope.yearselitem.name;
			}
			
			scope.applyIsVisible = false;
			scope.clearIsVisible = false;
			
			scope.run = function () {
						   var clearMainDiv = angular.element( document.querySelector( '#mainDiv' ) );
							 clearMainDiv.empty();
								http({
								method: 'GET',
								url: $rootScope.hostUrl + API_VERSION + '/servicecharge/getQuarterJournalEntries?'+'tenantIdentifier='+ $rootScope.tenantIdentifier +'&pretty=true&table=true&quarter='+scope.monthno+'&year='+scope.yearno
							})
								.success(function (data) {						
									var element1 = angular.element(data.html);
									 $("#mainDiv").append(element1);
									 scope.applyIsVisible = scope.applyIsVisible = true;
									 scope.clearIsVisible = scope.clearIsVisible = true;
								});
			}

			scope.apply = function () {
				http({
								method: 'GET',
								url: $rootScope.hostUrl + API_VERSION + ''
							})
								.success(function (data) {						
									var element1 = angular.element(data.html);
									 $("#mainDiv").append(element1);
								});
				alert("No URL");
			}
			
			scope.clear = function () {
				var clearMainDiv = angular.element( document.querySelector( '#mainDiv' ) );
			    clearMainDiv.empty();
				scope.applyIsVisible = scope.applyIsVisible = false;
				scope.clearIsVisible = scope.clearIsVisible = false;
			}
			
      if (localStorageService.getFromLocalStorage('XbrlReportSaveSuccess') == 'true') {
                scope.savesuccess = true;
                localStorageService.removeFromLocalStorage('XbrlReportSaveSuccess');
                scope.XbrlSuccess = true;
                $timeout(function () {
                    scope.XbrlSuccess = false;
                }, 3000);

            }
	
        
	}
    });
    mifosX.ng.application.controller('ServiceChargeController', ['$scope', 'ResourceFactory', '$location', 'dateFilter', '$route', '$http', 'API_VERSION', '$rootScope',
            'localStorageService', '$timeout', mifosX.controllers.ServiceChargeController]).run(function ($log) {
            $log.info("ServiceChargeController initialized");
        });
}(mifosX.controllers || {}));

