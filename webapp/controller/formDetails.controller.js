sap.ui.define([
	"sap/ui/core/mvc/Controller",
	'sap/m/MessageToast',
	'sap/ui/model/json/JSONModel'
], function (Controller, MessageToast, JSONModel) {
	"use strict";

	return Controller.extend("com.incture.cherrywork.GuestManagmentSystem.controller.formDetails", {

		onInit: function () {
			var oModel = new JSONModel({
				data: {}
			});
			this.getView().setModel(oModel);

			this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			this.oRouter.attachRoutePatternMatched(function (oEvent) {
				if (oEvent.getParameter("name") === "RouteHomePage") {
					// alert("Main View");
				}
			});

		}, //onInit End

		handleLiveChange: function (oEvent) {
			var sValue = oEvent.getParameter("value");
			this.byId("getValue").setText(sValue);
		}, //handleLiveChange End

		onSubmitForm: function () {
			// Form Validation
			var valid = true; //  
			var name = this.getView().byId("name").getValue();
			this.numericRegularExpression = /([0-9])/;

			// Name Field Validation
			if (name === "") {
				MessageToast.show("Name can not be empty");
				return false;
				valid = false;
			}
			if (!isNaN(name)) {
				MessageToast.show("Name can not have a number");
				return false;
				valid = false;
			}
			if (this.numericRegularExpression.test(name)) {
				MessageToast.show("Alphanumeric Name is not allowed");
				return false;
				valid = false;
			}

			// Email Field Validation
			var email = this.getView().byId("email").getValue();
			if (email === "") {
				MessageToast.show("Email cant be empty");
				return false;
				valid = false;
			} else if (/^[a-zA-Z0-9]+$/.test(email)) {
				MessageToast.show("Email should have @ character");
				return false;
				valid = false;
			} else if (/^([a-zA-Z0-9@]{2,5})$/.test(email)) {
				MessageToast.show("Email should have 2 char after @ symbol");
				return false;
				valid = false;
			} else if (/^([a-zA-Z0-9_\@]+)$/.test(email)) {
				MessageToast.show("Email should have . symbol");
				return false;
				valid = false;
			}
			// Email Regular Expression
			var emailRegularExpression =
				/^(([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5}){1,25})+([;.](([a-zA-Z0-9_\-\.]+)@{[a-zA-Z0-9_\-\.]+0\.([a-zA-Z]{2,5}){1,25})+)*$/;
			if (emailRegularExpression.test(email) === false) {
				MessageToast.show("Email should have 2 char after . symbol");
				return false;
				valid = false;
			}
			// Phone Number Validation
			var pnumber = this.getView().byId("pnumber").getValue();
			if (pnumber === "") {
				MessageToast.show("phone no. cann't be empty");
				return false;
				valid = false;
			}
			var numericRegularExpression = /^[0][1-9]\d{9}$|^[1-9]\d{9}$/;
			if (numericRegularExpression.test(pnumber) === false) {
				MessageToast.show("phone number should have only 10 digits");
				return false;
				valid = false;
			}

			// Host Name Validation
			var hostname = this.getView().byId("hostName").getSelectedKey();
			if (hostname === "") {
				MessageToast.show("Hostname cann't be empty");
				return false;
				valid = false;
			}

			// Checking All Validation are True or not
			if (valid == true) {

				this.postData();
			}
		}, //onSubmitForm End

		postData: function () {
			// Sending Data to backend LoadData Function
			var name = this.getView().byId("name").getValue();
			var email = this.getView().byId("email").getValue();
			var pno = this.getView().byId("pnumber").getValue();
			var purpose = this.getView().byId("purpose").getSelectedKey();
			var hostname = this.getView().byId("hostName").getSelectedKey();

			var oPostData = {
				"name": name,
				"email": email,
				"phoneNumber": pno,
				"purpose": purpose,
				"hostName": hostname
			};
			var oHeader = {
				"Content-Type": "application/json;charset=utf-8"
			};
			var oVisitorGetDataModel = new sap.ui.model.json.JSONModel();
			this.getView().setModel(oVisitorGetDataModel, "oVisitorGetDataModel");

			oVisitorGetDataModel.loadData("/postService/visit", JSON.stringify(oPostData), true, "POST", false, false, oHeader);
			oVisitorGetDataModel.attachRequestCompleted(function (oEvent) {
				// Success Message Fragment
				var checkStatus = oEvent.mParameters.errorobject.responseText;

				if (checkStatus == 'added') {
					var oFragmentName = "com.incture.cherrywork.GuestManagmentSystem.fragment.SuccessMessage";
					var ofragId = "SuccessMessage";
					if (!this.successMsgFragment) {
						this.successMsgFragment = this.createFragment(ofragId, oFragmentName);
						this.getView().addDependent(this.successMsgFragment);
					}
					this.successMsgFragment.open();
					setTimeout(function () {
						this.successMsgFragment.close();
						this.oRouter.navTo("RouteHomePage").refreshPage();
					}.bind(this), 3000);
					this.getView().byId("name").setValue("");
					this.getView().byId("email").setValue("");
					this.getView().byId("pnumber").setValue("");
					MessageToast.show("Successfully CheckIn");
				} else {
					MessageToast.show("CheckIn Faield");
				}
			}.bind(this));
			oVisitorGetDataModel.attachRequestFailed(function (oEvent) {
				// Error section
			});
		}, //postData End

		createFragment: function (sFragmentID, sFragmentName) {
			// Fragment Creation
			var oFragment = sap.ui.xmlfragment(sFragmentID, sFragmentName, this);
			return oFragment;
		}, //createFragment End
		onBackToHomePage: function () {
			this.oRouter.navTo("RouteHomePage");
		}, //onBackToHomePage End
		onGoToReportPage: function () {
				this.oRouter.navTo("VisitorDetailsReport");
			} //onBackToHomePage End

	});

});