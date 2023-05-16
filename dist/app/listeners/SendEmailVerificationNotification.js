"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class SendEmailVerificationNotification {
    async dispatch(user) {
        await user.sendVerificationEmail();
    }
}
exports.default = SendEmailVerificationNotification;
