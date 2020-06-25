(function (module) {
    mifosX.controllers = _.extend(module, {
        SharesTransferController: function ($q,scope, resourceFactory, location, routeParams, dateFilter) {

            scope.action = routeParams.action || "redeemshares";
            scope.accountId = routeParams.accountId;
            scope.shareAccountId = routeParams.accountId;
            scope.formData = {};
            scope.restrictDate = new Date();
            // Transaction UI Related
            scope.isTransaction = false;
            scope.transactionAmountField = false;
            scope.showPaymentDetails = false;
            scope.paymentTypes = [];

            resourceFactory.sharesAccount.get({shareAccountId: routeParams.accountId}, function (data) {
                        scope.shareaccountdetails = data;
                        scope.formData.unitPrice = data.currentMarketPrice ;
				var totalPurchasedShares = 0;
				var totalRedeemShares = 0;
			 for (var i = 0; i < data.purchasedShares.length; i++) {
					if(data.purchasedShares[i].type.value == 'Purchase'){
                  		  		totalPurchasedShares = totalPurchasedShares+data.purchasedShares[i].numberOfShares;
					}else if(data.purchasedShares[i].type.value == 'Redeem'){
						totalRedeemShares = totalRedeemShares+data.purchasedShares[i].numberOfShares;
					}
              		 	 }
			scope.formData.requestedShares = totalPurchasedShares-totalRedeemShares;	
                    }) ;
		    scope.title = 'label.button.transfershares';
                    scope.labelName = 'label.input.requesteddate';
                    scope.modelName = 'requestedDate';
                    scope.showDateField = true;
                    scope.showNoteField = false;
                    scope.requestedShares = true ;
                    scope.taskPermissionName = 'APPROVE_SHAREACCOUNT';

            scope.cancel = function () {
                location.path('/viewshareaccount/' + routeParams.accountId);
            };

		scope.clientOptions = function(value) {
				let deferred = $q.defer();
				resourceFactory.clientResource.getAllClientsWithoutLimit({
					displayName: value, orderBy: 'displayName', officeId: scope.officeId,
					sortOrder: 'ASC', orphansOnly: false
				}, function(data) {
					let resultArray = data.pageItems;
					let arrLength = resultArray.length;
					if (arrLength > 7) {
						arrLength = arrLength - 7;
						resultArray.splice(7, arrLength);
					}
					deferred.resolve(resultArray);
				});
				return deferred.promise;
			};

	   scope.changeClient = function(client) {
				scope.toClientId = client.id;
				scope.changeEvent();
			};

	   scope.changeEvent = function() {
				
			   resourceFactory.clientAccountResource.get({clientId: scope.toClientId}, function (data) {
				scope.clientAccounts = data;
				scope.sharetransfertoaccount = scope.clientAccounts.shareAccounts[0].id;
			    });

			};

	  scope.clientTypeAheadDisplay = function(client) {
				if (client == null || client == undefined)
					return;
				if (client.id == '' || client.id == undefined) {
					return '';
				}
				var label = client.accountNo + "-" + client.displayName;
				return label;
			};

	 resourceFactory.officeResource.getAllOffices(function(data) {
				scope.offices = data;
				 scope.officeId = scope.offices[0].id;
			});

            scope.submit = function () {
                var params = {command: scope.action};
		   params.shareAccountId = scope.accountId;

 		    this.formData.locale = scope.optlang.code;
                    this.formData.dateFormat = scope.df;
		

                    this.formData.requestedDate = dateFilter(this.formData.requestedDate, scope.df);
                    
                    	resourceFactory.sharesAccount.save(params, this.formData, function (data) {
                        //location.path('/viewshareaccount/' + data.resourceId);
                    });
			
			 var paramsSharesTransferToAccount = {command: "applyadditionalshares"};
                    	paramsSharesTransferToAccount.shareAccountId = scope.sharetransfertoaccount;

                   	resourceFactory.sharesAccount.save(paramsSharesTransferToAccount, this.formData, function (data) {
                        location.path('/viewshareaccount/' + data.resourceId);
                    });
                
            };
        }
    });
    mifosX.ng.application.controller('SharesTransferController', ['$q','$scope', 'ResourceFactory', '$location', '$routeParams', 'dateFilter', mifosX.controllers.SharesTransferController]).run(function ($log) {
        $log.info("SharesTransferController initialized");
    });
}(mifosX.controllers || {}));
