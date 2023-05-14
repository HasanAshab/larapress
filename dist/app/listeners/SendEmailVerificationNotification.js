"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class SendEmailVerificationNotification {
    async dispatch(user) {
        await user.notify();
    }
}
exports.default = SendEmailVerificationNotification;
