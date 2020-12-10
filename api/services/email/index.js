var nodemailer = require("nodemailer");
const config = require("../../configs/config");
const utils = require("../../utils/util");

var Mailgen = require("mailgen");
// https://medium.com/javascript-in-plain-english/how-to-send-emails-with-node-js-1bb282f334fe
module.exports = {
    sendResetPasswordMail: async function (name, email, token) {
        try {
            let MailGenerator = new Mailgen({
                theme: "default",
                product: {
                    name: "Robosoft",
                    link: "https://robosoftin.com",
                },
            });
            let emailContent = {
                body: {
                    name: name,
                    intro: "You have received this email because a password reset request for your account was received.",
                    action: {
                        instructions: 'Click the button below to reset your password:',
                        button: {
                            color: 'red', // Optional action button color
                            text: 'Reset Password',
                            link: `${config.baseUrl}/authentication/resetPassword?token=${token}`
                        }
                    }
                }
            };
            let mail = MailGenerator.generate(emailContent);

            let transporter = await nodemailer.createTransport({
                service: "Yahoo",
                secure: true,
                auth: {
                    user: config.email.user,
                    pass: config.email.pass
                },
            });
            let message = {
                from: config.email.user,
                to: email,
                subject: "Reset password",
                html: mail
            };
            let data = await transporter.sendMail(message);
        } catch (error) {
            console.log(error);
            return utils.sendDBCallbackErrs(req, res, error, null);
        }
    },

    sendQuestionnaireMail: async function (name, email, mailBody) {
        try {
            let MailGenerator = new Mailgen({
                theme: "default",
                product: {
                    name: "Robosoft",
                    link: "https://robosoftin.com",
                },
            });
            let emailContent = {
                body: {
                    name: name,
                    action: {
                        instructions: mailBody,
                        button: {
                            color: 'red', // Optional action button color
                            text: "Click here",
                            link: `${config.baseUrl}/authentication/login`
                        }
                    }
                }
            };
            let mail = MailGenerator.generate(emailContent);

            let transporter = await nodemailer.createTransport({
                service: "Yahoo",
                secure: true,
                auth: {
                    user: config.email.user,
                    pass: config.email.pass
                },
            });
            let message = {
                from: config.email.user,
                to: email,
                subject: "Policy trying with array",
                html: mail
            };
            let data = await transporter.sendMail(message);
        } catch (error) {
            console.log(error);
            return utils.sendDBCallbackErrs(req, res, error, null);
        }
    }
};
