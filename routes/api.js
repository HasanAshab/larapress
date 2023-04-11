const express = require('express');
const router = express.Router();
const authRouter = express.Router();
const AuthController = controller('AuthController');

router.use('/auth', authRouter);

// Endpoints to authenticate users
authRouter.post('/register', AuthController.register.validator, middleware('validation.message'), AuthController.register.method);
authRouter.post('/login', AuthController.login.validator, middleware('validation.message'), AuthController.login.method);

authRouter.get('/verify', AuthController.verifyEmail.method);
authRouter.post('/verify/resend', middleware('auth:api'), AuthController.resendEmailVerification.method);

authRouter.post('/password/forgot', AuthController.forgotPassword.validator, middleware('validation.message'), AuthController.forgotPassword.method);
authRouter.post('/password/reset', AuthController.resetPassword.validator, middleware('validation.message'), AuthController.resetPassword.method);
authRouter.post('/password/change', AuthController.changePassword.validator, middleware(['validation.message', 'auth:api']), AuthController.changePassword.method);

//authRouter.get('/profile', middleware(['auth:api', 'verified']), AuthController.profile.method);
authRouter.get('/profile', AuthController.profile.method);

module.exports = router;