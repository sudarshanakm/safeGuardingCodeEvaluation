"use strict";

const express = require("express");

module.exports = function (app, mongoose, utils, config, constants, uploadExcelFile, uploadPptFile) {

    var authenticationCtrl = require("../controllers/authentication")(mongoose, utils, config, constants);
    var authenticationRouter = express.Router();
    var isAuthenticated = require("../auth/bearer").isAuthenticated;

    //post for login, post for forgot password, post for change password

    authenticationRouter.post("/login", authenticationCtrl.login);

    authenticationRouter.post("/logout", isAuthenticated, authenticationCtrl.logout);

    authenticationRouter.post("/forgotPassword", authenticationCtrl.forgotPassword);

    authenticationRouter.post("/resetPassword", authenticationCtrl.resetPassword);

    authenticationRouter.post("/changePassword", isAuthenticated, authenticationCtrl.changePassword);

    app.use("/authentication", authenticationRouter);

};