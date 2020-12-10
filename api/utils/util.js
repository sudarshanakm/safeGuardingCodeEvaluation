
"use strict";
var _ = require("lodash");
var constants = require("./../configs/constants.js");
var config = require("./../configs/config.js");
var randomPasswordGenerator = require('otp-generator');
const { v4: uuidv4 } = require('uuid');
var CryptoJS = require("crypto-js");
var fs = require("fs");
const { count } = require("console");
const CODE = constants.code;
const MSG = constants.text;
var servicePath = config.root + "/services/";
var services = {};
fs.readdirSync(servicePath).forEach(function (file) {
    // logger.info("Loading services : " + file);
    services[file] = require(servicePath + file);
});
module.exports = {


    //generic format function for sending error response
    notifyError: function (req, res, httpStatus, code, message, extraMsg) {
        console.log("-----httpStatus", httpStatus, '----code', code, '----message', message.errors, '---extraMsg', extraMsg)
        //setting http status code for response      
        httpStatus = (typeof httpStatus === "undefined") ? 400 : CODE[httpStatus];

        if (!code) {
            code = "ERR";
        }

        if (!message) {
            message = "ERR";
        }
        var errorMsg = MSG[message];
        if (extraMsg) {
            errorMsg = extraMsg + " : " + errorMsg;
        }
        // if (message.errors && message.errors.userType) {
        //     message = message.errors.userType.message
        // }
        // if (message.errors && message.errors.name) {
        //     message = message.errors.name.message;
        // }
        if (message.errors) {
            message = message.message
        }
        res.status(httpStatus)
            .json({
                meta: {
                    code: CODE[code],
                    message: message,
                    timestamp: new Date().toISOString()
                }
            });
    },

    sendCustomError: function (req, res, code, message) {
        //setting http status code for response      
        //
        // httpStatus = (typeof httpStatus === "undefined") ? 400 : CODE[httpStatus];

        // if (!code) {
        //     code = CODE.ERR;
        // }

        // if (!message) {
        //     message = MSG.ERR;
        // }

        res.status(CODE[code])
            .json({
                meta: {
                    code: CODE[code],
                    message: MSG[message],
                    timestamp: new Date().toISOString()
                }
            });
    },


    sendAuthError: function (req, res, code, message) {
        //setting http status code for response      
        //
        // httpStatus = (typeof httpStatus === "undefined") ? 400 : CODE[httpStatus];

        // if (!code) {
        //     code = CODE.ERR;
        // }

        // if (!message) {
        //     message = MSG.ERR;
        // }

        res.status(CODE[code])
            .json({
                meta: {
                    code: CODE[code],
                    message: MSG[message],
                    timestamp: new Date().toISOString()
                }
            });
    },
    //generic format function for sending Success response
    sendResponse: function (req, res, data, code, message, count) {
        // code = (typeof code === "undefined") ? "SUCCESS" : code;
        // httpStatus = (typeof httpStatus === "undefined") ? 200 : CODE[httpStatus];

        var skip;
        var limit;
        res.status(CODE[code]).json({
            meta: {
                code: CODE[code],
                message: MSG[message],
                timestamp: new Date().toISOString()
            },
            pagination: {
                skip: skip,
                limit: limit,
                totalCount: count
            },
            data: data
        });
    },


    sendDBError: function (req, res, err) {
        // console.log("-----err code--------", err.code, err.errmsg)

        if (err && err.code === 11000) {
            return module.exports.sendCustomError(req, res, "CONFLICT", "DB_DUPLICATE", "DB_DUPLICATE");
        } else {
            return module.exports.notifyError(req, res, "HTTP_ERR", "DB_ERR", err);
        }
    },

    sendDBCallbackErrs: function (req, res, err, data) {
        if (err) {
            return module.exports.sendDBError(req, res, err);
        } else {

            if (!data) {
                data = {};
            }
            return module.exports.sendResponse(req, res, "SUCCESS", data, "NO_RECORDS", "NO_RECORDS");
        }
    },


    dbCallbackHandler: function (req, res, data, err) {
        if (!err && data) {
            return module.exports.sendResponse(req, res, "SUCCESS", data);
        } else {
            return module.exports.sendDBCallbackErrs(req, res, err, data);
        }
    },

    encryptPassword: function (password) {
        var cipherText = CryptoJS.HmacSHA1(password, config.passwordSecret).toString();
        return cipherText;
    },

    decryptPassword: function (password) {
        // var bytes  = CryptoJS.AES.decrypt(password, config.passwordSecret);
        // var originalText = bytes.toString(CryptoJS.enc.Utf8);
        var originalText = CryptoJS.HmacSHA1(password, config.passwordSecret).toString();
        console.log(originalText);
        return originalText;
    },

    generateExpiryTime: function () {
        var currentDate = new Date();
        // console.log(currentDate);
        // console.log(currentDate.getMinutes())
        var tokenExpiry = new Date(currentDate.setMinutes(currentDate.getMinutes() + config.tokenExpiry));
        // currentDate.setd
        // console.log(tokenExpiry);
        return tokenExpiry;

    },

    generateBearerToken: function () {
        return uuidv4();
    },

    generateRandomPassword: function () {
        var randomPassword = randomPasswordGenerator.generate(6, { upperCase: true, specialChars: false, alphabets: true });
        return randomPassword;
    },

    generatePasswordResetTokenExpiryTime: function () {
        var currentDate = new Date();
        // console.log(currentDate);
        // console.log(currentDate.getMinutes())
        var tokenExpiry = new Date(currentDate.setMinutes(currentDate.getMinutes() + config.passwordResetTokenExpiry));
        // currentDate.setd
        // console.log(tokenExpiry);
        return tokenExpiry;
    },

    sendResetPasswordMail: async function (name, email, token) {
        try {
            let data = await services.email.sendResetPasswordMail(name, email, token);
        } catch (error) {
            console.log(error);
            return utils.sendDBCallbackErrs(req, res, error, null);
        }
    },

    sendQuestionnaireMail: async function (name, email, mailBody) {
        try {
            let data = await services.email.sendQuestionnaireMail(name, email, mailBody);
        } catch (error) {
            console.log(error);
            return utils.sendDBCallbackErrs(req, res, error, null);
        }
    } 



};
