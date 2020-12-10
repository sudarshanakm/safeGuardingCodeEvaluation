"use strict";

const express = require("express");

module.exports = function (app, mongoose, utils, config, constants, uploadExcelFile, uploadPptFile) {

    var employeeCtrl = require("../controllers/employee")(mongoose, utils, config, constants);
    var employeeRouter = express.Router();
    var isAuthenticated = require("../auth/bearer").isAuthenticated;

    //get,post,put,delete super admin

    //add superAdmin - post
    employeeRouter.post("/superAdmins", isAuthenticated, employeeCtrl.addSuperAdmin);

    //update superAdmin - put
    employeeRouter.put("/superAdmins/:superAdminId", isAuthenticated, employeeCtrl.updateSuperAdmin);

    //get all super admins - get
    employeeRouter.get("/superAdmins", isAuthenticated, employeeCtrl.getSuperAdmin);

    //delete superAdmin - delete
    employeeRouter.delete("/superAdmins/:superAdminId", isAuthenticated, employeeCtrl.deleteSuperAdmin);





    //get,post,put,delete admin

    //add admin - post
    employeeRouter.post("/admins", isAuthenticated, employeeCtrl.addAdmin);

    //update admin - put
    employeeRouter.put("/admins/:adminId", isAuthenticated, employeeCtrl.updateAdmin);

    //get all admins - get
    employeeRouter.get("/admins", isAuthenticated, employeeCtrl.getAdmin);

    //delete admin - delete
    employeeRouter.delete("/admins/:adminId", isAuthenticated, employeeCtrl.deleteAdmin);

    app.use("/employees", employeeRouter);

};