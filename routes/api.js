const express = require('express');
const router = express.Router();
const authRouter = express.Router();
const AuthController = controller('AuthController');

router.use('/auth', authRouter);

// Endpoints to authenticate users
authRouter.post('/register', AuthController.register);
authRouter.post('/login', AuthController.login);

//authRouter.get('/verify', AuthController.verifyEmail.method);
//authRouter.post('/verify/resend', middleware('auth:api'), AuthController.resendEmailVerification.method);

//authRouter.post('/password/forgot', AuthController.forgotPassword.validator, middleware('validation.message'), AuthController.forgotPassword.method);
//authRouter.post('/password/reset', AuthController.resetPassword.validator, middleware('validation.message'), AuthController.resetPassword.method);
authRouter.post('/password/change', AuthController.changePassword);

authRouter.get('/profile', middleware(['auth:api', 'verified']), AuthController.profile);

module.exports = router;