'use strict'
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod }
  }
Object.defineProperty(exports, '__esModule', { value: true })
exports.HealthCheckRouter = void 0
const express_1 = __importDefault(require('express'))
const http_status_codes_1 = require('http-status-codes')
const logger_utils_1 = __importDefault(require('../utils/logger.utils'))
const router = express_1.default.Router()
exports.HealthCheckRouter = router
router.get('/', (req, res) => {
  // health json
  const healthCheckInfo = {
    uptime: process.uptime(),
    responsetime: process.hrtime(),
    message: 'Good Health',
    timestamp: Date.now()
  }
  try {
    res.status(http_status_codes_1.StatusCodes.OK).json(Object.assign({}, healthCheckInfo))
  } catch (err) {
    logger_utils_1.default.error(err)
    healthCheckInfo.message = err.message
    res.status(http_status_codes_1.StatusCodes.SERVICE_UNAVAILABLE).json({})
  }
})
