"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.eventEmitter = void 0;
const events_1 = require("events");
const sendEmail_1 = require("../../service/sendEmail");
const EmailTemplate_1 = require("../../service/EmailTemplate");
exports.eventEmitter = new events_1.EventEmitter();
exports.eventEmitter.on("confirmEmail", async (data) => {
    const { email } = data;
    const otp = (0, sendEmail_1.generateOtp)();
    await (0, sendEmail_1.sendEmail)({ to: email, subject: "confirmEmail", html: (0, EmailTemplate_1.emailTemplate)(otp, "Email confirmation") });
});
