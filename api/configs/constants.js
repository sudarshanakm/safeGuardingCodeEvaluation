
"use strict";

module.exports = {
    code: {
        HTTP_ERR: 400, //  bad request to the server
        CONFLICT: 409,  //if data already exists
        SUCCESS: 200, //get result success
        INVALID: 400, //invalid data
        HTTP_POST_S: 201, //post request succcess
        DB_ERR: 500, //Error in database
        NOT_FOUND: 404, //if data is not present
        NOT_AUTHORIZED: 401, //user is not authorised to access the api
        FORBIDDEN: 403, //forbidden
        NO_RECORDS: 404, //no records found
        BAD_REQUEST: 400, //bad request 
        BAD_PARAMS: 400, //invalid  params
        PARAM_MISSING: 400, // required params are missing

    },
    text: {
        "SUCCESS": "Success",
        "HTTP_SUCCESS": "Success",
        "DB_FAILURE": "Database Failure",
        "DB_ERR": "Error in  Database",
        "DB_DUPLICATE": "DB Duplicate key insertion error.",
        "NO_RECORDS": "No Records Found",
        "BAD_PARAMS": "Invalid params",
        "BAD_REQUEST": "Bad request to server.",
        "PARAM_MISSING": "Required Parameter missing",
        "NO_PARAMS": "Parameter Missing !",
        "NOT_AUTHORIZED": "Not Authorized",
        "INV_USERNAME": "Invalid Username!.",
        "USER_EXISTS" : "Super admin already exists!",
        "USER_NOT_EXISTS" : "Super admin not exists!",
        "PASSWORD_MISSMATCH" : "The password does not match!",
        "WRONG_PASSWORD" : "You entered a wrong password",
        "PASSWORD_RESET_TOKEN_EXPIRED" : "Reset password link is expired!", 
        "TITLE_EXISTS" : "Questionnaire with this title already exists!",
        "QUE_NOT_EXISTS" : "Questionnaire not exits!",
        "PARTICIPANTS_NOT_EXISTS" : "There are no participants selected for this questionnaire!",
        "INVALID_PARTICIPANTS" : "Emails have been sent to all the participants provided except these participants who are not exists in the database!",
        "NOT_AGREED" : "You're not accepted the terms & conditions"
    }
};

