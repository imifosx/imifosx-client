(function(module) {
	mifosX.controllers = _.extend(module, {
		ServiceChargeJournalEntryController: function(scope, resourceFactory, location, dateFilter) {
			scope.formData = {};
			scope.formData.crAccounts = [{}];
			scope.formData.dbAccounts = [{}];
			scope.first = {};
			scope.errorcreditevent = false;
			scope.errordebitevent = false;
			scope.creditaccounttemplate = false;
			scope.debitaccounttemplate = false;
			scope.restrictDate = new Date();
			scope.showPaymentDetails = false;
			scope.formData.mobilization = 0;
			scope.formData.servicing = 0;
			scope.formData.overheads = 0;
			scope.formData.investment = 0;

			resourceFactory.accountCoaResource.getAllAccountCoas({ manualEntriesAllowed: true, usage: 1, disabled: false }, function(data) {
				scope.glAccounts = data;
			});

			resourceFactory.savingProductResource.get({ resourceType: 'template' }, function(data) {
				let expAccData = data.accountingMappingOptions.expenseAccountOptions || [];
				scope.expenseAccounts = expAccData
			});

			resourceFactory.paymentTypeResource.getAll(function(data) {
				scope.paymentTypes = data;
			});

			resourceFactory.currencyConfigResource.get({ fields: 'selectedCurrencyOptions' }, function(data) {
				scope.currencyOptions = data.selectedCurrencyOptions;
				scope.formData.currencyCode = scope.currencyOptions[0].code;
			});

			resourceFactory.officeResource.getAllOffices(function(data) {
				scope.offices = data;
				scope.formData.officeId = scope.offices[0].id;
			});

			//events for credits
			scope.addCrAccount = function() {
				scope.formData.crAccounts.push({});
			}

			scope.removeCrAccount = function(index) {
				scope.formData.crAccounts.splice(index, 1);
			}

			//events for debits
			scope.addDebitAccount = function() {
				scope.formData.dbAccounts.push({});
			}

			scope.removeDebitAccount = function(index) {
				scope.formData.dbAccounts.splice(index, 1);
			}

			scope.submit = function() {
				var jeTransaction = new Object();
				var reqDate = dateFilter(scope.first.date, scope.df);
				jeTransaction.locale = scope.optlang.code;
				jeTransaction.dateFormat = scope.df;
				jeTransaction.officeId = this.formData.officeId;
				jeTransaction.transactionDate = reqDate;
				jeTransaction.referenceNumber = this.formData.referenceNumber;
				jeTransaction.comments = this.formData.comments;
				jeTransaction.currencyCode = this.formData.currencyCode;
				jeTransaction.paymentTypeId = this.formData.paymentTypeId;
				jeTransaction.accountNumber = this.formData.accountNumber;
				jeTransaction.checkNumber = this.formData.checkNumber;
				jeTransaction.routingCode = this.formData.routingCode;
				jeTransaction.receiptNumber = this.formData.receiptNumber;
				jeTransaction.bankNumber = this.formData.bankNumber;
				jeTransaction.mobilization = this.formData.mobilization;
				jeTransaction.servicing = this.formData.servicing;
				jeTransaction.overheads = this.formData.overheads;
				jeTransaction.investment = this.formData.investment;

				//Construct credits array
				jeTransaction.credits = [];
				for (var i = 0; i < this.formData.crAccounts.length; i++) {
					var temp = new Object();
					if (this.formData.crAccounts[i].select) {
						temp.glAccountId = this.formData.crAccounts[i].select.id;
					}
					temp.amount = this.formData.crAccounts[i].crAmount;
					jeTransaction.credits.push(temp);
				}
				//construct debits array
				jeTransaction.debits = [];
				for (var i = 0; i < this.formData.dbAccounts.length; i++) {
					var temp = new Object();
					if (this.formData.dbAccounts[i].select) {
						temp.glAccountId = this.formData.dbAccounts[i].select.id;
					}
					temp.amount = this.formData.dbAccounts[i].debitAmount;
					jeTransaction.debits.push(temp);
				}

				resourceFactory.serviceChargeJournalEntriesResource.save(jeTransaction, function(data) {
					location.path('/viewtransactions/' + data.transactionId);
				});
			}
		}
	});
	mifosX.ng.application.controller('ServiceChargeJournalEntryController', ['$scope', 'ResourceFactory', '$location', 'dateFilter', mifosX.controllers.ServiceChargeJournalEntryController]).run(function($log) {
		$log.info("ServiceChargeJournalEntryController initialized");
	});
}(mifosX.controllers || {}));
