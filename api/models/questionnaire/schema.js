"use strict";

module.exports = function (mongoose) {
    var Schema = mongoose.Schema;

    var QuestionnaireSchema = new Schema({
        content : {
            title : {
                type: String,
                unique: true,
                required:true
            },
            description : {
                type: String
            },
            buttonTitle: {
                type: String
            },
            buttonText : {
                type: String
            },
            checkBoxText : {
                type: String
            },
            startDate: {
                type: Date
            },
            endDate: {
                type: Date
            },
            autoReminder : {
                type: Number
            },
            contentPpt : {
                type: String
            },
            participantXl : {
                type: String
            },
            mailBody : {
                type: String
            }
        },
        participants : {
            type : Array
        },
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Employees"
        },
        __v: {
            type: Number,
            select: false
        }
    }, { timestamps: true });

    QuestionnaireSchema = require('../../utils/db_queries')(QuestionnaireSchema);
    return mongoose.model('Questionnaires', QuestionnaireSchema);
};
