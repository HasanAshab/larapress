/**
 * Base url: http://127.0.0.1:8000/api
 * 
 * Response Schema: 
 * {
 *    success: true || false,
 *    data:{}
 * }
 */

/**
 * Auth API endpoints
 */
 
 /**
  * Register user
  * 
  * @route POST /auth/register
  * @param {string} name User's name
  * @param {string} email User's email
  * @param {string} password User's password
  * @param {string} password_confirmation User's password confirmation
  * @returns {Object} Returns success status and token
  * @example {
  *    message: "Verification email sent!",
  *    token: 'user-token'
  * }
  */
