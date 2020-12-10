"use strict";

const questionnaire = require("../routes/questionnaire");
const { sendCustomError } = require("../utils/util");
const util = require("../utils/util");


module.exports = function (mongoose, utils, config, constants) {

    let xlsxFile = require('read-excel-file/node');
    let excel = require("exceljs");
    let xlsxFilePath = __dirname + '/../uploads/participantsExcelSheets/';

    let Questionnaires = mongoose.model('Questionnaires');
    let Employees = mongoose.model("Employees");
    let questionnaireCtrl = {};

    questionnaireCtrl.getQuestionnaireById = async function (req, res) {
        try {
            if (req.user) {
                let queryObj = {
                    _id: req.params.questionnaireId
                };
                let data = await Questionnaires.getDataByQuery(queryObj);
                data = data[0];
                if (!data) {
                    return utils.sendCustomError(req, res, "NOT_FOUND", "QUE_NOT_EXISTS");
                }
                else {
                    return utils.sendResponse(req, res, data, "SUCCESS", "SUCCESS");
                }

            }
            else {
                return utils.sendCustomError(req, res, "NOT_AUTHORIZED", "NOT_AUTHORIZED");
            }
        } catch (error) {
            console.log(error);
            return utils.sendDBCallbackErrs(req, res, error, null);
        }
    };


    questionnaireCtrl.getCreatedQuestionnaire = async function (req, res) {
        try {
            if (req.user && req.user.employeeType !== "user") {
                let questionnaireObj = {
                    author: req.user._id
                };
                let data = await Questionnaires.getDataByQuery(questionnaireObj);
                return utils.sendResponse(req, res, data, "SUCCESS", "SUCCESS");
            }
            else {
                return utils.sendCustomError(req, res, "NOT_AUTHORIZED", "NOT_AUTHORIZED");
            }
        } catch (error) {
            console.log(error);
            return utils.sendDBCallbackErrs(req, res, error, null);
        }

    };



    questionnaireCtrl.saveQuestionnaire = async function (req, res) {
        try {
            if (req.user && req.user.employeeType !== "user") {

                let questionnaireObj = {};
                questionnaireObj.content = req.body;
                questionnaireObj.author = req.user._id;

                if (req.body.participantXl) {
                    let participantsEmailFromXl = [];
                    await xlsxFile(xlsxFilePath + req.body.participantXl).then((rows) => {
                        for (let i in rows) {
                            for (let j in rows[i]) {
                                if (i !== "0" && j === "1") {
                                    participantsEmailFromXl.push(rows[i][j]);
                                }
                            }
                        }
                    });
                    // _uniq(participantsEmailFromXl);
                    questionnaireObj.participants = participantsEmailFromXl;
                }

                let data = await Questionnaires.addData(questionnaireObj);

                return utils.sendResponse(req, res, data, "SUCCESS", "SUCCESS");
            }
            else {
                return utils.sendCustomError(req, res, "NOT_AUTHORIZED", "NOT_AUTHORIZED");
            }
        } catch (error) {
            console.log(error);
            return utils.sendDBCallbackErrs(req, res, error, null);
        }
    };

    questionnaireCtrl.updateQuestionnaire = async function (req, res) {
        try {
            if (req.user && req.user.employeeType !== "user") {
                let queryObj = {
                    _id: req.params.questionnaireId
                };
                let data = await Questionnaires.getDataByQuery(queryObj);
                data = data[0];
                if (!data) {
                    return utils.sendCustomError(req, res, "NOT_FOUND", "QUE_NOT_EXISTS");
                }
                else {
                    let questionnaireObj = {};
                    questionnaireObj.content = req.body;

                    if (req.body.participantXl) {
                        let participantsEmailFromXl = [];
                        await xlsxFile(xlsxFilePath + req.body.participantXl).then((rows) => {
                            for (let i in rows) {
                                for (let j in rows[i]) {
                                    if (i !== "0" && j === "1") {
                                        participantsEmailFromXl.push(rows[i][j]);
                                    }
                                }
                            }
                        });
                        //_uniq(participantsEmailFromXl);s
                        questionnaireObj.participants = participantsEmailFromXl;
                    }

                    data = await Questionnaires.updateData(questionnaireObj);

                    return utils.sendResponse(req, res, data, "SUCCESS", "SUCCESS");
                }

            }
            else {
                return utils.sendCustomError(req, res, "NOT_AUTHORIZED", "NOT_AUTHORIZED");
            }
        } catch (error) {
            console.log(error);
            return utils.sendDBCallbackErrs(req, res, error, null);
        }
    };


    questionnaireCtrl.publishQuestionnaire = async function (req, res) {
        try {
            if (req.user && req.user.employeeType !== "user") {
                let queryObj = {
                    _id: req.params.questionnaireId
                };
                let data = await Questionnaires.getDataByQuery(queryObj);
                data = data[0];
                if (!data) {
                    return utils.sendCustomError(req, res, "NOT_FOUND", "QUE_NOT_EXISTS");
                }
                else {
                    if (data.participants) {
                        let emailList = [];
                        let invalidEmails = [];
                        let validParticipants = await Employees.getDataByQuery({
                            emailId: {
                                $in: data.participants
                            }
                        });
                        validParticipants.forEach(each => emailList.push(each.emailId));
                        data.participants.forEach(function (each) {
                            if (!emailList.includes(each)) {
                                invalidEmails.push(each);
                            }
                        })
                        await utils.sendQuestionnaireMail(" ", emailList, data.content.mailBody);
                        await Employees.updateData({
                            emailId: {
                                $in: data.participants
                            }
                        });
                        await Employees.updateData({ emailId: { $in: emailList } });
                        if (invalidEmails[0]) {
                            await Questionnaires.updateData({ _id: req.params.questionnaireId }, { $addToset: { participants: emailList } })
                            return utils.sendResponse(req, res, invalidEmails, "SUCCESS", "INVALID_PARTICIPANTS");
                        }
                        else {
                            return utils.sendResponse(req, res, null, "SUCCESS", "SUCCESS");
                        }
                    }
                    else {
                        return utils.sendCustomError(req, res, "NOT_FOUND", "PARTICIPANTS_NOT_EXISTS");
                    }
                }

            }
            else {
                return utils.sendCustomError(req, res, "NOT_AUTHORIZED", "NOT_AUTHORIZED");
            }
        } catch (error) {
            console.log(error);
            return utils.sendDBCallbackErrs(req, res, error, null);
        }
    };


    questionnaireCtrl.previewQuestionnaire = async function (req, res) {
        try {
            if (req.user && req.user.employeeType !== "user") {
                let queryObj = {
                    _id: req.params.questionnaireId
                };
                let data = await Questionnaires.getDataByQuery(queryObj);
                data = data[0];
                if (!data) {
                    return utils.sendCustomError(req, res, "NOT_FOUND", "QUE_NOT_EXISTS");
                }
                else {
                    return utils.sendResponse(req, res, data, "SUCCESS", "SUCCESS");
                }
            }
            else {
                return utils.sendCustomError(req, res, "NOT_AUTHORIZED", "NOT_AUTHORIZED");
            }
        } catch (error) {
            console.log(error);
            return utils.sendDBCallbackErrs(req, res, error, null);
        }
    };

    questionnaireCtrl.generateReport = async function (req, res) {
        try {
            if (req.user && req.user.employeeType !== "user") {
                let queryObj = {
                    _id: req.params.questionnaireId
                };
                let data = await Questionnaires.getDataByQuery(queryObj);
                data = data[0];
                if (!data) {
                    return utils.sendCustomError(req, res, "NOT_FOUND", "QUE_NOT_EXISTS");
                }
                else {
                    let content = [];
                    content.push(data.content);
                    let workbook = new excel.Workbook();
                    let worksheet = workbook.addWorksheet("Questionnaire");

                    worksheet.columns = [
                        { header: "Title", key: "title", width: 25 },
                        { header: "Description", key: "description", width: 25 },
                        { header: "Button Title", key: "buttonTitle", width: 25 },
                        { header: "Button Text", key: "buttonText", width: 25 },
                        { header: "Check Box Text", key: "checkBoxText", width: 25 },
                        { header: "Start Date", key: "startDate", width: 25 },
                        { header: "End Date", key: "endDate", width: 25 },
                        { header: "Mail Body", key: "mailBody", width: 25 }
                    ];

                    worksheet.addRow(data.content);
                    let generatedReport = await workbook.xlsx.writeFile('report.xlsx');
                    return utils.sendResponse(req, res, null, "SUCCESS", "SUCCESS");
                }
            }
            else {
                return utils.sendCustomError(req, res, "NOT_AUTHORIZED", "NOT_AUTHORIZED");
            }
        } catch (error) {
            console.log(error);
            return utils.sendDBCallbackErrs(req, res, error, null);
        }
    };


    questionnaireCtrl.remindQuestionnaire = async function (req, res) {
        try {
            if (req.user && req.user.employeeType !== "user") {
                let queryObj = {
                    _id: req.params.questionnaireId
                };
                let data = await Questionnaires.getDataByQuery(queryObj);
                data = data[0];
                if (!data) {
                    return utils.sendCustomError(req, res, "NOT_FOUND", "QUE_NOT_EXISTS");
                }
                else {
                    if (data.participants) {
                        let emailList = [];
                        let invalidEmails = [];
                        let validParticipants = await Employees.getDataByQuery({
                            emailId: {
                                $in: data.participants
                            }
                        });
                        validParticipants.forEach(each => emailList.push(each.emailId));
                        data.participants.forEach(function (each) {
                            if (!emailList.includes(each)) {
                                invalidEmails.push(each);
                            }
                        })
                        await utils.sendQuestionnaireMail(" ", emailList, data.content.mailBody);
                        return utils.sendResponse(req, res, null, "SUCCESS", "SUCCESS");

                    }
                    else {
                        return utils.sendCustomError(req, res, "NOT_FOUND", "PARTICIPANTS_NOT_EXISTS");
                    }
                }

            }
            else {
                return utils.sendCustomError(req, res, "NOT_AUTHORIZED", "NOT_AUTHORIZED");
            }
        } catch (error) {
            console.log(error);
            return utils.sendDBCallbackErrs(req, res, error, null);
        }
    };

    questionnaireCtrl.getReceivedQuestionnaire = async function (req, res) {
        try {
            if (req.user) {
                let userEmailId = req.user.emailId;
                console.log(typeof (userEmailId))
                let questionnaireObj = {
                    participants: {
                        $elemMatch: { $eq: userEmailId }
                    }
                };
                let data = await Questionnaires.getDataByQuery(questionnaireObj);
                console.log(data);
                return utils.sendResponse(req, res, data, "SUCCESS", "SUCCESS");
            }
            else {
                console.log(error);
                return utils.sendCustomError(req, res, "NOT_AUTHORIZED", "NOT_AUTHORIZED");
            }
        } catch (error) {
            console.log(error);
            return utils.sendDBCallbackErrs(req, res, error, null);
        }

    };


    questionnaireCtrl.acceptQuestionnaire = async function (req, res) {
        try {
            if (req.user) {
                let queryObj = {
                    _id: req.params.questionnaireId
                };
                let data = await Questionnaires.getDataByQuery(queryObj);
                data = data[0];
                if (!data) {
                    return utils.sendCustomError(req, res, "NOT_FOUND", "QUE_NOT_EXISTS");
                }
                else {
                    let isAgreed = req.body.isAgreed;

                    if (isAgreed === "true") {
                        data = await Questionnaires.updateData(queryObj, { $pull: { participants: req.user.emailId } });
                        return utils.sendResponse(req, res, data, "SUCCESS", "SUCCESS");
                    }
                    else {
                        return utils.sendCustomError(req, res, "PARAM_MISSING", "NOT_AGREED");
                    }
                }

            }
            else {
                return utils.sendCustomError(req, res, "NOT_AUTHORIZED", "NOT_AUTHORIZED");
            }
        } catch (error) {
            console.log(error);
            return utils.sendDBCallbackErrs(req, res, error, null);
        }
    };


    return questionnaireCtrl;
};



//********************************************** */
