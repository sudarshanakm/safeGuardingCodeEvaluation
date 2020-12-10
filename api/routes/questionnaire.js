"use strict";

const express = require("express");

module.exports = function (app, mongoose, utils, config, constants, upload) {

    var questionnaireCtrl = require("../controllers/questionnaire")(mongoose, utils, config, constants);
    var questionnaireRouter = express.Router();
    var isAuthenticated = require("../auth/bearer").isAuthenticated;


    questionnaireRouter.get("/:questionnaireId", isAuthenticated, questionnaireCtrl.getQuestionnaireById);

    questionnaireRouter.get("/created", isAuthenticated, questionnaireCtrl.getCreatedQuestionnaire);

    questionnaireRouter.post("/save", isAuthenticated,upload.any(),questionnaireCtrl.saveQuestionnaire);
    
    questionnaireRouter.put("/save/:questionnaireId", isAuthenticated,upload.any(),questionnaireCtrl.updateQuestionnaire);

    questionnaireRouter.post("/publish/:questionnaireId", isAuthenticated,questionnaireCtrl.publishQuestionnaire);

    questionnaireRouter.post("/preview/:questionnaireId", isAuthenticated, questionnaireCtrl.previewQuestionnaire);

    questionnaireRouter.get("/generateReport/:questionnaireId", isAuthenticated, questionnaireCtrl.generateReport);

    questionnaireRouter.get("/remind/:questionnaireId", isAuthenticated, questionnaireCtrl.remindQuestionnaire);

    questionnaireRouter.get("/received", isAuthenticated, questionnaireCtrl.getReceivedQuestionnaire);

    questionnaireRouter.post("/received/:questionnaireId", isAuthenticated, questionnaireCtrl.acceptQuestionnaire);

    
    app.use("/questionnaires", questionnaireRouter);

};