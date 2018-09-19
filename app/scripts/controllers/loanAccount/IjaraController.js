(function (module) {
    mifosX.controllers = _.extend(module, {
        IjaraController: function (scope, routeParams, resourceFactory, location, dateFilter, uiConfigService, WizardHandler) {
            scope.previewRepayment = false;
            scope.clientId = routeParams.clientId;
            scope.groupId = routeParams.groupId;
            scope.restrictDate = new Date();
            scope.formData = {};
            scope.chargeFormData = {}; //For charges
            scope.collateralFormData = {}; //For collaterals
            scope.inparams = {resourceType: 'template', activeOnly: 'true'};
            scope.date = {};
            scope.formDat = {};
            scope.datatables = [];
            scope.noOfTabs = 1;
            scope.step = '-';
            scope.formData.datatables = [];
            scope.formDat.datatables = [];
            scope.tf = "HH:mm";
            scope.loanApp = "LoanApp";
            scope.customSteps = [];
            scope.tempDataTables = [];

            scope.date.first = new Date();

            if (scope.clientId) {
                scope.inparams.clientId = scope.clientId;
                scope.formData.clientId = scope.clientId;
            }


            if (scope.groupId) {
                scope.inparams.groupId = scope.groupId;
                scope.formData.groupId = scope.groupId;
            }

            if (scope.clientId && scope.groupId) {
                scope.inparams.templateType = 'jlg';
            }
            else if (scope.groupId) {
                scope.inparams.templateType = 'group';
            }
            else if (scope.clientId) {
                scope.inparams.templateType = 'individual';
            }

            scope.inparams.staffInSelectedOfficeOnly = true;

            resourceFactory.loanResource.get(scope.inparams, function (data) {
              scope.products = data.productOptions;
                scope.datatables = data.datatables;
                   
                if (data.clientName) {
                    scope.clientName = data.clientName;
                }
                if (data.group) {
                    scope.groupName = data.group.name;
                }
                scope.handleDatatables(scope.datatables);
            });
            //scope.formData.productId = scope.products[3];
            scope.loanProductChange = function (loanProductId) {
                _.isUndefined(scope.datatables) ? scope.tempDataTables = [] : scope.tempDataTables = scope.datatables;
                WizardHandler.wizard().removeSteps(1, scope.tempDataTables.length);
                scope.inparams.productId = loanProductId;
                // scope.datatables = [];
                resourceFactory.loanResource.get(scope.inparams, function (data) {
                   scope.loanaccountinfo = data;
                    scope.previewClientLoanAccInfo();
                    scope.datatables = data.datatables;
                    scope.handleDatatables(scope.datatables);
                });

                resourceFactory.loanResource.get({resourceType: 'template', templateType: 'collateral', productId: loanProductId, fields: 'id,loanCollateralOptions'}, function (data) {
                    scope.collateralOptions = data.loanCollateralOptions || [];
                });
            }



            uiConfigService.appendConfigToScope(scope);

            //return input type
            scope.fieldType = function (type) {
                var fieldType = "";
                if (type) {
                    if (type == 'CODELOOKUP' || type == 'CODEVALUE') {
                        fieldType = 'SELECT';
                    } else if (type == 'DATE') {
                        fieldType = 'DATE';
                    } else if (type == 'DATETIME') {
                        fieldType = 'DATETIME';
                    } else if (type == 'BOOLEAN') {
                        fieldType = 'BOOLEAN';
                    } else {
                        fieldType = 'TEXT';
                    }
                }
                return fieldType;
            };

			
			
            scope.cancel = function () {
                if (scope.groupId) {
                    location.path('/viewgroup/' + scope.groupId);
                } else if (scope.clientId) {
                    location.path('/viewclient/' + scope.clientId);
                }
            }
            


        }
    });
    mifosX.ng.application.controller('IjaraController', ['$scope', '$routeParams', 'ResourceFactory', '$location', 'dateFilter', 'UIConfigService', 'WizardHandler', mifosX.controllers.IjaraController]).run(function ($log) {
        $log.info("IjaraController initialized");
    });
}(mifosX.controllers || {}));
