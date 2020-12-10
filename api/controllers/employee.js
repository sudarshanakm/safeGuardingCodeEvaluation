"use strict";

//addSuperAdmin,updateSuperAdmin,getSuperAdmins,deleteSuperAdmin 

module.exports = function (mongoose, utils, config, constants) {

    var Employees = mongoose.model('Employees');
    var employeeCtrl = {};


    //========================================================>Admin

    //addSuperAdmin - post
    employeeCtrl.addSuperAdmin = async function (req, res) {
        try {
            if (req.user && req.user.employeeType.includes("superAdmin")) {
                var superAdminObj = {};
                if (req.body.name) {
                    superAdminObj.name = req.body.name;
                }
                if (req.body.emailId) {
                    superAdminObj.emailId = req.body.emailId;
                }
                if (req.body.employeeCode) {
                    superAdminObj.employeeCode = req.body.employeeCode;
                }
                superAdminObj.employeeType = ["superAdmin"];
                let randomPassword = await utils.generateRandomPassword();
                superAdminObj.password = await utils.encryptPassword(randomPassword);
                var query = {};
                query.emailId = req.body.emailId;
                let data = await Employees.getDataByQuery(query);
                data = data[0];
                if (data) {
                    return utils.sendCustomError(req, res, "CONFLICT", "USER_EXISTS")
                }
                else {
                    let data = await Employees.addData(superAdminObj);
                    //console.log("________________data", data);
                    return utils.sendResponse(req, res, data, "SUCCESS", "SUCCESS");
                }
            }
            else {
                return utils.sendAuthError(req, res, "NOT_AUTHORIZED", "NOT_AUTHORIZED");
            }

        } catch (error) {
            //console.log("____________Err", error)
            return utils.sendDBCallbackErrs(req, res, error, null);
        }
    };

    //getSuperAdmins
    employeeCtrl.getSuperAdmin = async function (req, res) {
        try {
            if (req.user && req.user.employeeType.includes("superAdmin")) {
                let queryObj = {
                    employeeType: {
                        $in: ["superAdmin"]
                    }
                };
                let data = await Employees.getDataByQuery(queryObj);
                return utils.sendResponse(req, res, data, "SUCCESS", "SUCCESS");
            }
            else {
                return utils.sendAuthError(req, res, "NOT_AUTHORIZED", "NOT_AUTHORIZED");
            }
        } catch (error) {
            return utils.sendDBCallbackErrs(req, res, error, data);
        }

    };

    //updateSuperAdmin
    employeeCtrl.updateSuperAdmin = async function (req, res) {
        try {
            if (req.user && req.user.employeeType.includes("superAdmin")) {
                var superAdminObj = {
                    _id: req.params.superAdminId
                };
                let data = await Employees.getDataByQuery(superAdminObj);
                data = data[0];
                if (!data) {
                    return utils.sendCustomError(req, res, "NOT_FOUND", "USER_NOT_EXISTS")
                }
                else {
                    var updateObj = {};
                    if (req.body.name) {
                        updateObj.name = req.body.name;
                    }
                    if (req.body.employeeCode) {
                        updateObj.employeeCode = req.body.employeeCode;
                    }
                    if (req.body.emailId) {
                        updateObj.emailId = req.body.emailId;
                    }
                    data = await Employees.updateData(superAdminObj, updateObj);
                    return utils.sendResponse(req, res, data, "SUCCESS", "SUCCESS");
                }
            }
            else {
                return utils.sendAuthError(req, res, "NOT_AUTHORIZED", "NOT_AUTHORIZED");
            }
        } catch (error) {
            return utils.sendDBCallbackErrs(req, res, error, data);
        }
    };

    //deleteSuperAdmin
    employeeCtrl.deleteSuperAdmin = async function (req, res) {
        try {
            if (req.user && req.user.employeeType.includes("superAdmin")) {
                var superAdminObj = {
                    _id: req.params.superAdminId
                };
                let data = await Employees.getDataByQuery(superAdminObj);
                data = data[0];
                if (!data) {
                    return utils.sendCustomError(req, res, "NOT_FOUND", "USER_NOT_EXISTS");
                }
                else {
                    data = await Employees.deleteData(superAdminObj);
                    return utils.sendResponse(req, res, data, "SUCCESS", "SUCCESS");
                }
            }
            else {
                return utils.sendCustomError(req, res, "NOT_AUTHORIZED", "NOT_AUTHORIZED");
            }
        } catch (error) {
            return utils.sendDBCallbackErrs(req, res, error);
        }
    };
    

    //========================================================>Admin

    //addAdmin - post
    employeeCtrl.addAdmin = async function (req, res) {
        try {
            if (req.user && req.user.employeeType.every(each => ["admin","superAdmin"].includes(each))){
                var adminObj = {};
                if (req.body.name) {
                    adminObj.name = req.body.name;
                }
                if (req.body.emailId) {
                    adminObj.emailId = req.body.emailId;
                }
                if (req.body.employeeCode) {
                    adminObj.employeeCode = req.body.employeeCode;
                }
                adminObj.employeeType = ["admin"];
                let randomPassword = await utils.generateRandomPassword();
                adminObj.password = await utils.encryptPassword(randomPassword);
                var query = {};
                query.emailId = req.body.emailId;
                let data = await Employees.getDataByQuery(query);
                data = data[0];
                if (data) {
                    return utils.sendCustomError(req, res, "CONFLICT", "USER_EXISTS")
                }
                else {
                    let data = await Employees.addData(adminObj);
                    //console.log("________________data", data);
                    return utils.sendResponse(req, res, data, "SUCCESS", "SUCCESS");
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

    //getAdmin
    employeeCtrl.getAdmin = async function (req, res) {
        try {
            if (req.user && req.user.employeeType.every(each => ["admin","superAdmin"].includes(each))) {
                let queryObj = {
                    employeeType: {
                        $in: ["admin"]
                    }
                };
                let data = await Employees.getDataByQuery(queryObj);
                return utils.sendResponse(req, res, data, "SUCCESS", "SUCCESS");
            }
            else {
                return utils.sendAuthError(req, res, "NOT_AUTHORIZED", "NOT_AUTHORIZED");
            }
        } catch (error) {
            return utils.sendDBCallbackErrs(req, res, error, data);
        }

    };

    //updateAdmin
    employeeCtrl.updateAdmin = async function (req, res) {
        try {
            if (req.user && req.user.employeeType.every(each => ["admin","superAdmin"].includes(each))) {
                var adminObj = {
                    _id: req.params.adminId
                };
                let data = await Employees.getDataByQuery(adminObj);
                data = data[0];
                if (!data) {
                    return utils.sendCustomError(req, res, "NOT_FOUND", "USER_NOT_EXISTS")
                }
                else {
                    var updateObj = {};
                    if (req.body.name) {
                        updateObj.name = req.body.name;
                    }
                    if (req.body.employeeCode) {
                        updateObj.employeeCode = req.body.employeeCode;
                    }
                    if (req.body.emailId) {
                        updateObj.emailId = req.body.emailId;
                    }
                    data = await Employees.updateData(adminObj, updateObj);
                    return utils.sendResponse(req, res, data, "SUCCESS", "SUCCESS");
                }
            }
            else {
                return utils.sendAuthError(req, res, "NOT_AUTHORIZED", "NOT_AUTHORIZED");
            }
        } catch (error) {
            return utils.sendDBCallbackErrs(req, res, error, data);
        }
    };

    //deleteAdmin
    employeeCtrl.deleteAdmin = async function (req, res) {
        try {
            if (req.user && req.user.employeeType.every(each => ["admin","superAdmin"].includes(each))) {
                var adminObj = {
                    _id: req.params.adminId
                };
                let data = await Employees.getDataByQuery(adminObj);
                data = data[0];
                if (!data) {
                    return utils.sendCustomError(req, res, "NOT_FOUND", "USER_NOT_EXISTS");
                }
                else {
                    data = await Employees.deleteData(adminObj);
                    return utils.sendResponse(req, res, data, "SUCCESS", "SUCCESS");
                }
            }
            else {
                return utils.sendCustomError(req, res, "NOT_AUTHORIZED", "NOT_AUTHORIZED");
            }
        } catch (error) {
            return utils.sendDBCallbackErrs(req, res, error);
        }
    };



    return employeeCtrl;
};



//********************************************** */
