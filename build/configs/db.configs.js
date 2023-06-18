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
Object.defineProperty(exports, '__esModule', { value: true })
exports.disconnectToDb = exports.connectToDb = exports.db = void 0
const pg_1 = require('pg')
const dotenv = __importStar(require('dotenv'))
dotenv.config()
const db = new pg_1.Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  port: parseInt(process.env.DB_PORT)
})
exports.db = db
const connectToDb = () =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      yield db.connect()
      console.log('\x1b[32m', '\n -- DATABASE CONNECTION: SUCCESS --\n', '\x1b[0m')
    } catch (err) {
      console.log(err)
      console.log('\x1b[31m', 'Error while connecting to server database..\n', '\x1b[0m')
    }
  })
exports.connectToDb = connectToDb
const disconnectToDb = () =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      yield db.end()
      console.log('\x1b[32m', '\n -- DATABASE DISCONNECTION: SUCCESS --\n', '\x1b[0m')
    } catch (err) {
      console.log(err)
      console.log('\x1b[31m', 'Error while disconnecting to server database..\n', '\x1b[0m')
    }
  })
exports.disconnectToDb = disconnectToDb
