"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersAdminRouter = void 0;
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const orders_controller_1 = require("../../controllers/orders.controller");
const passport_config_1 = __importDefault(require("../../configs/passport.config"));
const admin_middleware_1 = require("../../middlewares/admin.middleware");
const router = express_1.default.Router();
exports.OrdersAdminRouter = router;
router.get('/confirm-order/:orderid', (0, express_validator_1.param)('orderid')
    .notEmpty()
    .withMessage('Param orderid should not be empty')
    .isInt()
    .withMessage('Param orderid must be integer'), passport_config_1.default.authenticate('jwt', { session: false }), admin_middleware_1.isAdmin, 
// eslint-disable-next-line @typescript-eslint/no-misused-promises
orders_controller_1.ConfirmOrdersOne);
router.delete('/:orderid', (0, express_validator_1.param)('orderid')
    .notEmpty()
    .withMessage('Param orderid should not be empty')
    .isInt()
    .withMessage('Param orderid must be integer'), passport_config_1.default.authenticate('jwt', { session: false }), admin_middleware_1.isAdmin, 
// eslint-disable-next-line @typescript-eslint/no-misused-promises
orders_controller_1.RemoveOrderOne);
