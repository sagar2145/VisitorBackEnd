sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel"
], function (Controller, JSONModel) {
	"use strict";

	return Controller.extend("com.incture.cherrywork.GuestManagmentSystem.controller.VisitorDetailsReport", {
		onInit: function () {

			var oVisitorGetDataModel = new sap.ui.model.json.JSONModel();
			this.getView().setModel(oVisitorGetDataModel, "oVisitorGetDataModel");
			oVisitorGetDataModel.loadData("/getService/get", null, true);
			oVisitorGetDataModel.attachRequestCompleted(function (oEvent) {
				var myData = oEvent.getSource().getData();
				this.getView().getModel("oVisitorGetDataModel").setProperty("/oVisitorList", myData);

			}.bind(this));
			oVisitorGetDataModel.attachRequestFailed(function (oEvent) {
				// Error section
			});
		}, //onInit End

	});

});