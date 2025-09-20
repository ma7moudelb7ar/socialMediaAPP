"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.eventEmitter = void 0;
const events_1 = require("events");
const sendEmail_1 = require("../../service/sendEmail");
const EmailTemplate_1 = require("../../service/EmailTemplate");
exports.eventEmitter = new events_1.EventEmitter();
exports.eventEmitter.on("confirmEmail", async (data) => {
    const { email, otp } = data;
    await (0, sendEmail_1.sendEmail)({ to: email, subject: "confirmEmail", html: (0, EmailTemplate_1.emailTemplate)(otp, "Email confirmation") });
});
exports.eventEmitter.on("ForgetPassword", async (data) => {
    const { email, otp } = data;
    await (0, sendEmail_1.sendEmail)({ to: email, subject: "ForgetPassword", html: (0, EmailTemplate_1.emailTemplate)(otp, "ForgetPassword") });
});
