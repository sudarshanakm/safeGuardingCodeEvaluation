"use strict";

const util = require("../utils/util");


module.exports = function (mongoose, utils, config, constants) {

    var Employees = mongoose.model('Employees');
    var authenticationCtrl = {};
    // let Admins = require("SuperAdmins");
    // let Users = require("Users");

    authenticationCtrl.login = async function (req, res) {
        try {
            if (!req.headers.username) {
                return utils.sendCustomError(req, res, "PARAM_MISSING", "NO_PARAMS");
            } else {
                var queryObj = {};
                queryObj.emailId = req.headers.username;
                let data = await Employees.getDataByQuery(queryObj);
                data = data[0];
                if (!data) {
                    return utils.sendCustomError(req, res, "INVALID", "INV_USERNAME");
                }
                else {
                    if (data.password === utils.encryptPassword(req.headers.password)) {
                        let upsertObj = {};
                        upsertObj.token = await utils.generateBearerToken();
                        upsertObj.tokenExpiry = await utils.generateExpiryTime();
                        await Employees.updateData(queryObj, upsertObj);
                        return utils.sendResponse(req, res, upsertObj, "SUCCESS", "SUCCESS");
                    }
                    else {
                        return utils.sendCustomError(req, res, "INVALID", "WRONG_PASSWORD");
                    }
                }
            }

        } catch (error) {
            console.log(error);
            return utils.sendDBCallbackErrs(req, res, error, null);
        }

    };

    authenticationCtrl.logout = async function (req, res) {
        try {
            if (req.user) {
                var queryObj = {
                    _id: req.user._id
                };
                var updateObj = {
                    token: "",
                    tokenExpiry : ""
                };
                let data = await Employees.updateData(queryObj, updateObj);
                return utils.sendResponse(req, res, data, "SUCCESS", "SUCCESS");
            }
            else {
                return utils.sendAuthError(req, res, "NOT_AUTHORIZED", "NOT_AUTHORIZED");
            }

        } catch (error) {
            console.log(error);
            return utils.sendDBCallbackErrs(req, res, error, null);
        }

    };

    authenticationCtrl.changePassword = async function (req, res) {
        try {
            if (req.user) {
                if (!req.headers.newpassword || !req.headers.reenterpassword) {
                    return utils.sendCustomError(req, res, "PARAM_MISSING", "NO_PARAMS");
                }
                else {
                    if (req.headers.newpassword === req.headers.reenterpassword) {
                        var queryObj = {
                            _id: req.user._id
                        };
                        var updateObj = {
                            password: await utils.encryptPassword(req.headers.newpassword)
                        };
                        let data = await Employees.updateData(queryObj, updateObj);
                        return utils.sendResponse(req, res, data, "SUCCESS", "SUCCESS");
                    }
                    else {
                        return utils.sendCustomError(req, res, "INVALID", "PASSWORD_MISSMATCH");
                    }
                }
            }
            else {
                return utils.sendAuthError(req, res, "NOT_AUTHORIZED", "NOT_AUTHORIZED");
            }

        } catch (error) {
            console.log(error);
            return utils.sendDBCallbackErrs(req, res, error, null);
        }

    };

    authenticationCtrl.resetPassword = async function (req, res) {
        try {
            if (!req.query.token) {
                return utils.sendAuthError(req, res, "NOT_AUTHORIZED", "NOT_AUTHORIZED");
            }
            else {
                let queryObj = {
                    passwordResetToken: req.query.token
                }
                let userData = await Employees.getDataByQuery(queryObj);
                userData = userData[0];
                if (!userData || userData.passwordResetTokenExpiry < Date.now()) {
                    return utils.sendCustomError(req, res, "INVALID", "PASSWORD_RESET_TOKEN_EXPIRED");
                }
                else {
                    if (!req.headers.newpassword || !req.headers.reenterpassword) {
                        return utils.sendCustomError(req, res, "PARAM_MISSING", "NO_PARAMS");
                    }
                    else {
                        if (req.headers.newpassword === req.headers.reenterpassword) {
                            queryObj = {
                                _id: userData._id
                            };
                            var updateObj = {
                                password: await utils.encryptPassword(req.headers.newpassword),
                                passwordResetToken: "",
                                passwordResetTokenExpiry: ""
                            };
                            let data = await Employees.updateData(queryObj, updateObj);
                            return utils.sendResponse(req, res, data, "SUCCESS", "SUCCESS");
                        }
                        else {
                            return utils.sendCustomError(req, res, "INVALID", "PASSWORD_MISSMATCH");
                        }
                    }
                }
            }
        }
        catch (error) {
            console.log(error);
            return utils.sendDBCallbackErrs(req, res, error, null);
        }

    };

    authenticationCtrl.forgotPassword = async function (req, res) {
        try {
            if (!req.headers.username) {
                return utils.sendCustomError(req, res, "PARAM_MISSING", "NO_PARAMS");
            }
            else {
                let queryObj = {
                    emailId: req.headers.username
                };
                let userData = await Employees.getDataByQuery(queryObj);
                userData = userData[0];
                if (!userData) {
                    return utils.sendCustomError(req, res, "INVALID", "INV_USERNAME");
                }
                else {
                    let updateObj = {
                        passwordResetToken: await utils.generateBearerToken(),
                        passwordResetTokenExpiry: await utils.generatePasswordResetTokenExpiryTime()
                    };
                    await Employees.updateData(queryObj, updateObj);
                    let data = await utils.sendResetPasswordMail(userData.name, req.headers.username, updateObj.passwordResetToken);
                    return utils.sendResponse(req, res, data, "SUCCESS", "SUCCESS");
                }
            }
        }
        catch (error) {
            console.log(error);
            return utils.sendDBCallbackErrs(req, res, error, null);
        }

    };


    return authenticationCtrl;
};



//********************************************** */
