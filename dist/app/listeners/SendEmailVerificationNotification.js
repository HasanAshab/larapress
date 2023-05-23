"use strict";
Object.defineProperty(exports, "esModule", { value: true });
class SendEmailVerificationNotification {
    async dispatch(user) {
        await user.sendVerificationEmail();
    }
}
exports.default = SendEmailVerificationNotification;
