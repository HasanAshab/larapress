const express = require('express');
const router = express.Router();
const authRouter = express.Router();
const AuthController = controller('AuthController');
const MediaController = controller('MediaController');

router.use(middleware('limit:60'));
router.use('/auth', authRouter);


// Endpoints to authenticate users
authRouter.post('/register', middleware('validate:Register'), AuthController.register);
authRouter.post('/login', AuthController.login);


//authRouter.get('/verify', middleware('validate:VerifyEmail'), AuthController.verifyEmail);
//authRouter.post('/verify/resend', middleware('auth:api'), AuthController.resendEmailVerification);

//authRouter.post('/password/forgot', middleware('validate:ForgotPassword'), AuthController.forgotPassword);
//authRouter.put('/password/reset', middleware('validate:ResetPassword'), AuthController.resetPassword);
//authRouter.put('/password/change', middleware('validate:ChangePassword'), AuthController.changePassword);

authRouter.route('/profile')
.get(middleware('auth:api'), AuthController.profile)
.put(middleware(['auth:api', 'validate:UpdateProfile']), AuthController.updateProfile);

// Endpoints for serving files
//router.get('/media/:id', MediaController.index);

module.exports = router;