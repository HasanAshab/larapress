const express = require('express');
const router = express.Router();
const authRouter = express.Router();
const AuthController = controller('AuthController');
const MediaController = controller('MediaController');
const multer = require('multer');

router.use(middleware('limit:60'));
router.use('/auth', authRouter);


// Endpoints to authenticate users
authRouter.post('/register', middleware(['upload:profile,image', 'validate:Register']), AuthController.register);
authRouter.post('/login', AuthController.login);


authRouter.get('/verify', middleware('validate:VerifyEmail'), AuthController.verifyEmail);
authRouter.post('/verify/resend', middleware('auth:api'), AuthController.resendEmailVerification);

authRouter.post('/password/forgot', middleware('validate:ForgotPassword'), AuthController.forgotPassword);
authRouter.post('/password/reset', middleware('validate:ResetPassword'), AuthController.resetPassword);
authRouter.post('/password/change', middleware('validate:ChangePassword'), AuthController.changePassword);

authRouter.get('/profile', middleware('verified:api'), AuthController.profile);

//authRouter.post('/', middleware('upload:file,image'), AuthController.t);
//authRouter.get('/', middleware('validate:Test'), AuthController.t);

router.get('/media/:id', MediaController.index);

module.exports = router;