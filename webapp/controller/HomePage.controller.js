sap.ui.define([
	"sap/ui/core/mvc/Controller", 'sap/m/MessageToast',
], function (Controller, MessageToast) {
	"use strict";

	return Controller.extend("com.incture.cherrywork.GuestManagmentSystem.controller.HomePage", {
		onInit: function () {
			this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			this.oRouter.attachRoutePatternMatched(function (oEvent) {
				if (oEvent.getParameter("name") === "GuestDetailsForm") {
					// alert("Main View");
				}
			});
		},
		onCheckIn: function () {
			// Login Frangent Code
			var oFragmentName = "com.incture.cherrywork.GuestManagmentSystem.fragment.LoginDialoag";
			var ofragId = "LoginFragment";
		//	if (!this.LoginDialogFragment) {
				this.LoginDialogFragment = this.createNewFragment(ofragId, oFragmentName);
				this.getView().addDependent(this.LoginDialogFragment);
		//	}

			this.LoginDialogFragment.open();
		}, //onCheckIn End

		onCheckOut: function () {
			//bind(this); 
			// CheckOut Fragment
			var oFragmentName = "com.incture.cherrywork.GuestManagmentSystem.fragment.CheckOut";
			var ofragId = "CheckOutFrag";
			if (!this.CheckOutDialogFragment) {
				this.CheckOutDialogFragment = this.createNewFragment(ofragId, oFragmentName);
				this.getView().addDependent(this.CheckOutDialogFragment);
			}

			this.CheckOutDialogFragment.open();

		}, //onCheckOut End

		createNewFragment: function (sFragmentID, sFragmentName) {
			//Fragment Creaaion
			var oFragment = sap.ui.xmlfragment(sFragmentID, sFragmentName, this);
			return oFragment;
		}, //createNewFragment End

		onSubmitCheckOut: function () {
			var pnumber = sap.ui.core.Fragment.byId("CheckOutFrag", "checkOut").getValue();
			var valid = true;

			if (pnumber === "") {
				MessageToast.show("CheckOut Field cant be empty");
				return false;
				valid = false;
			}
			if(valid == true){
				this.CheckOutPostData();
			}

		}, // onSubmitCheckOut End
		onLogIn: function () {
			var valid = true;
			var userName = sap.ui.core.Fragment.byId("LoginFragment", "Username").getValue();
			var password = sap.ui.core.Fragment.byId("LoginFragment", "Password").getValue();

			//Password Validation
			if (password === "") {
				MessageToast.show("password cant be empty");
				return false;
				valid = false;
			}
			//User Name Validation
			if (userName === "") {
				MessageToast.show("Email cant be empty");
				return false;
				valid = false;
			}
			if (valid == true) {
				this.LogInPostData();
			}

		},
		LogInPostData: function () {
			// Sending Data to backend LoadData Function
			var userName = sap.ui.core.Fragment.byId("LoginFragment", "Username").getValue();
			var password = sap.ui.core.Fragment.byId("LoginFragment", "Password").getValue();

			var oPostData = {
				"name": userName,
				"password": password,
			};
			var oHeader = {
				"Content-Type": "application/json;charset=utf-8"
			};
			var oVisitorGetDataModel = new sap.ui.model.json.JSONModel();
			this.getView().setModel(oVisitorGetDataModel, "oVisitorGetDataModel");
			oVisitorGetDataModel.loadData("/postService/LoginGet", JSON.stringify(oPostData), true, "POST", false, false, oHeader);
			oVisitorGetDataModel.attachRequestCompleted(function (oEvent) {

				var checkStatus = oEvent.mParameters.errorobject.responseText;

				if (checkStatus == "success") {
						this.LoginDialogFragment.close();
						this.LoginDialogFragment.destroy();
					this.oRouter.navTo("GuestDetailsForm");
					MessageToast.show("Successfully Login");
				} else {
					MessageToast.show("Username Password Not Matched ");
				}

			}.bind(this));
			oVisitorGetDataModel.attachRequestFailed(function (oEvent) {
				//            alert("Error");
			});

		}, //postData End
		
		CheckOutPostData: function () {
			// Sending Data to backend LoadData Function
				var pnumber = sap.ui.core.Fragment.byId("CheckOutFrag", "checkOut").getValue();
		

			var oPostData = {
				"phoneNumber": pnumber,
			};
			var oHeader = {
				"Content-Type": "application/json;charset=utf-8"
			};
			var oVisitorGetDataModel = new sap.ui.model.json.JSONModel();
			this.getView().setModel(oVisitorGetDataModel, "oVisitorGetDataModel");
			oVisitorGetDataModel.loadData("/postService/check", JSON.stringify(oPostData), true, "POST", false, false, oHeader);
			oVisitorGetDataModel.attachRequestCompleted(function (oEvent) {

				var checkStatus = oEvent.mParameters.errorobject.responseText;

				if (checkStatus == "added") {
					MessageToast.show("Successfully CheckOut");
					sap.ui.core.Fragment.byId("CheckOutFrag", "checkOut").setValue("");
					this.CheckOutDialogFragment.close();
				} else {
					MessageToast.show("Request Faield");
				}

			}.bind(this));
			oVisitorGetDataModel.attachRequestFailed(function (oEvent) {
				//            alert("Error");
			});

		}, //postData End

	});
});