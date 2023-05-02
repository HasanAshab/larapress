const express = require('express');
const router = express.Router();
const authRouter = express.Router();
const AuthController = controller('AuthController');
const MediaController = controller('MediaController');

//router.use(middleware('limit:60'));
router.use('/auth', authRouter);


// Endpoints to authenticate users
authRouter.post('/register', AuthController.register);
authRouter.post('/login', AuthController.login);


authRouter.get('/verify', AuthController.verifyEmail);
authRouter.post('/verify/resend', middleware('auth:api'), AuthController.resendEmailVerification);

authRouter.post('/password/forgot', AuthController.forgotPassword);
authRouter.put('/password/reset', AuthController.resetPassword);
authRouter.put('/password/change', middleware('auth'), AuthController.changePassword);

authRouter.route('/profile')
  .get(middleware('auth'), AuthController.profile)
  .put(middleware('auth'), AuthController.updateProfile);

// Endpoints for serving files
router.get('/media/:id', MediaController.index);

module.exports = router;