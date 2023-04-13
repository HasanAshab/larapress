const express = require('express');
const router = express.Router();
const authRouter = express.Router();
const AuthController = controller('AuthController');

router.use(middleware('limit:60'));
router.use('/auth', authRouter);

// Endpoints to authenticate users
authRouter.post('/register', AuthController.register);
authRouter.post('/login', AuthController.login);

authRouter.get('/verify', AuthController.verifyEmail);
authRouter.post('/verify/resend', middleware('auth:api'), AuthController.resendEmailVerification);

authRouter.post('/password/forgot', AuthController.forgotPassword);
authRouter.post('/password/reset', AuthController.resetPassword);
authRouter.post('/password/change', AuthController.changePassword);

authRouter.get('/profile', middleware(['auth:api', 'verified']), AuthController.profile);

authRouter.post('/', AuthController.test);

module.exports = router;