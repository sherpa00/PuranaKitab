'use strict'
var __createBinding =
  (this && this.__createBinding) ||
  (Object.create
    ? function (o, m, k, k2) {
        if (k2 === undefined) k2 = k
        var desc = Object.getOwnPropertyDescriptor(m, k)
        if (!desc || ('get' in desc ? !m.__esModule : desc.writable || desc.configurable)) {
          desc = {
            enumerable: true,
            get: function () {
              return m[k]
            }
          }
        }
        Object.defineProperty(o, k2, desc)
      }
    : function (o, m, k, k2) {
        if (k2 === undefined) k2 = k
        o[k2] = m[k]
      })
var __setModuleDefault =
  (this && this.__setModuleDefault) ||
  (Object.create
    ? function (o, v) {
        Object.defineProperty(o, 'default', { enumerable: true, value: v })
      }
    : function (o, v) {
        o['default'] = v
      })
var __importStar =
  (this && this.__importStar) ||
  function (mod) {
    if (mod && mod.__esModule) return mod
    var result = {}
    if (mod != null)
      for (var k in mod)
        if (k !== 'default' && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k)
    __setModuleDefault(result, mod)
    return result
  }
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value)
          })
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value))
        } catch (e) {
          reject(e)
        }
      }
      function rejected(value) {
        try {
          step(generator['throw'](value))
        } catch (e) {
          reject(e)
        }
      }
      function step(result) {
        result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected)
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next())
    })
  }
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod }
  }
Object.defineProperty(exports, '__esModule', { value: true })
const passport_1 = __importDefault(require('passport'))
const dotenv = __importStar(require('dotenv'))
const passport_jwt_1 = require('passport-jwt')
const db_configs_1 = require('./db.configs')
const logger_utils_1 = __importDefault(require('../utils/logger.utils'))
dotenv.config()
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const PUBLIC_KEY = process.env.PUBLIC_KEY
passport_1.default.use(
  new passport_jwt_1.Strategy(
    {
      jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: PUBLIC_KEY,
      passReqToCallback: true,
      algorithms: ['RS256']
    },
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    (req, payload, done) =>
      __awaiter(void 0, void 0, void 0, function* () {
        try {
          // find the user
          const foundUser = yield db_configs_1.db.query(
            'SELECT userid,username,email,role,createat,last_logout FROM users WHERE userid = $1 AND password = $2',
            [payload.sub, payload.subPass]
          )
          if (foundUser.rowCount <= 0) {
            done(null, false, { message: 'User not found' })
            return
          }
          // comparing issuedat and last_logout for logout verification
          // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
          const jwtIssuedAt = payload.iat ? new Date(payload.iat * 1000) : null // null check
          const lastLogOut = new Date(foundUser.rows[0].last_logout)
          // check if token created after last logout time (valid) or before (invalid)
          if (jwtIssuedAt != null && jwtIssuedAt < lastLogOut) {
            done(null, false, { message: 'TOKEN INVALID ' })
            return
          }
          // assign req.user to userdata
          const userData = {
            userid: foundUser.rows[0].userid,
            email: foundUser.rows[0].email,
            username: foundUser.rows[0].username,
            role: foundUser.rows[0].role
          }
          req.user = foundUser.rows[0].userdata
          done(null, userData, { message: 'Logged in' })
        } catch (err) {
          logger_utils_1.default.error(err, 'Error while passport configs')
        }
      })
  )
)
exports.default = passport_1.default
