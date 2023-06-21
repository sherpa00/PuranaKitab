'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.isAdmin = void 0
const http_status_codes_1 = require('http-status-codes')
// middleware to verify if the current authenticated user is admin
const isAdmin = (req, res, next) => {
  // get the authenticated user info from req
  const authenticatedUserData = req.user
  if (Boolean(authenticatedUserData.role) && authenticatedUserData.role === 'ADMIN') {
    next()
  } else {
    res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).json({
      success: false,
      message: 'Unauthorized access'
    })
  }
}
exports.isAdmin = isAdmin
