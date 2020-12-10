"use strict";

module.exports = function (mongoose) {
    var Schema = mongoose.Schema;

    var EmployeeSchema = new Schema({
        employeeCode: {
            type: String,
            required: true,
            unique: true
        },
        name: {
            type: String,
            required: true

        },
        emailId: {
            type: String,
            required: true
        },
        password: {
            type: String
        },
        __v: {
            type: Number,
            select: false
        },
        employeeType: [{
            type: String,
            enum: ["superAdmin", "admin", "user"]
        }],
        passwordResetToken: {
            type: String
        },
        passwordResetTokenExpiry: {
            type: Date
        },
        token: {
            type: String
        },
        tokenExpiry: {
            type: Date
        }
    }, { timestamps: true });

    EmployeeSchema = require('../../utils/db_queries')(EmployeeSchema);
    return mongoose.model('Employees', EmployeeSchema);
};
