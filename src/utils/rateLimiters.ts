import rateLimit from 'express-rate-limit'

// create account rate limit
const createAccountLimit = rateLimit({
  windowMs: 60 * 60 * 1000, // 1hr,
  max: 50,
  message: 'Too many account creations from this IP, please try again later',
  standardHeaders: true,
  legacyHeaders: false
})

// login account rate limit
const loginAccountLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15mins,
  max: 50,
  message: 'Too many account login from this IP, please try again later',
  standardHeaders: true,
  legacyHeaders: false
})

// login account rate limit
const logoutAccountLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15mins,
  max: 10,
  message: 'Too many account logout from this IP, please try again later',
  standardHeaders: true,
  legacyHeaders: false
})

// forgot password rate limit
const forgotPasswordAccountLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15mins,
  max: 5,
  message: 'To many account forgot password requests from this IP, please try again later',
  standardHeaders: true,
  legacyHeaders: false
})

// reset password rate limit
const resettPasswordAccountLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15mins,
  max: 5,
  message: 'To many account reset password requests from this IP, please try again later',
  standardHeaders: true,
  legacyHeaders: false
})

export {
  createAccountLimit,
  loginAccountLimit,
  logoutAccountLimit,
  forgotPasswordAccountLimit,
  resettPasswordAccountLimit
}
