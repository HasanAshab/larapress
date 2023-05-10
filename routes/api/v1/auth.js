const express = require('express');
const router = express.Router();
const AuthController = require(base('app/http/controllers/AuthController'));

// Endpoints to authenticate users
router.post('/register', AuthController.register);
router.post('/login', AuthController.login);


router.get('/verify', AuthController.verifyEmail);
router.post('/verify/resend', middleware('auth'), AuthController.resendEmailVerification);

router.post('/password/forgot', AuthController.forgotPassword);
router.put('/password/reset', AuthController.resetPassword);
router.put('/password/change', middleware('auth'), AuthController.changePassword);

router.route('/profile')
  .get(middleware('auth'), AuthController.profile)
  .put(middleware('auth'), AuthController.updateProfile);

module.exports = router;