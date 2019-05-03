/* global QUnit*/

sap.ui.define([
	"sap/ui/test/Opa5",
	"com/incture/cherrywork/GuestManagmentSystem/test/integration/pages/Common",
	"sap/ui/test/opaQunit",
	"com/incture/cherrywork/GuestManagmentSystem/test/integration/pages/HomePage",
	"com/incture/cherrywork/GuestManagmentSystem/test/integration/navigationJourney"
], function (Opa5, Common) {
	"use strict";
	Opa5.extendConfig({
		arrangements: new Common(),
		viewNamespace: "com.incture.cherrywork.GuestManagmentSystem.view.",
		autoWait: true
	});
});