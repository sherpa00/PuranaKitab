"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersCustomerRouter = void 0;
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const orders_controller_1 = require("../../controllers/orders.controller");
const passport_config_1 = __importDefault(require("../../configs/passport.config"));
const router = express_1.default.Router();
exports.OrdersCustomerRouter = router;
router.get('/my-orders', 
// customer user authentication and authorization
passport_config_1.default.authenticate('jwt', { session: false }), 
// eslint-disable-next-line @typescript-eslint/no-misused-promises
orders_controller_1.ShowMyOrdersOne);
router.post('/place-order/offline', (0, express_validator_1.body)('carts')
    .notEmpty()
    .withMessage('Body carts should not be empty')
    .isArray()
    .withMessage('carts should be an array of cartids'), (0, express_validator_1.body)('phone_number')
    .notEmpty()
    .withMessage('Body Phone Number should not be empty')
    .isMobilePhone('ne-NP')
    .withMessage('Body Phone number should be valid phone number'), 
// customer user authentication and authorization
passport_config_1.default.authenticate('jwt', { session: false }), 
// eslint-disable-next-line @typescript-eslint/no-misused-promises
orders_controller_1.PlaceOrderOfflineOne);
router.post('/place-order/online', (0, express_validator_1.body)('carts')
    .notEmpty()
    .withMessage('Body carts should not be empty')
    .isArray()
    .withMessage('carts should be an array of cartids'), (0, express_validator_1.body)('phone_number')
    .notEmpty()
    .withMessage('Body Phone Number should not be empty')
    .isMobilePhone('ne-NP')
    .withMessage('Body Phone number should be valid phone number'), (0, express_validator_1.body)('card_details')
    .notEmpty()
    .withMessage('Card details should not be empty')
    .isObject()
    .withMessage('Card should be valid'), (0, express_validator_1.body)('card_details.creditCard')
    .notEmpty()
    .withMessage('Credit card number should be given')
    .isString()
    .withMessage('Credit card number should a string'), (0, express_validator_1.body)('card_details.expMonth')
    .notEmpty()
    .withMessage('Credit card expiry month should be given')
    .isInt()
    .withMessage('Credit card expiry month should a integer'), (0, express_validator_1.body)('card_details.expYear')
    .notEmpty()
    .withMessage('Credit card expiry year should be given')
    .isInt()
    .withMessage('Credit card expiry year should a integer'), (0, express_validator_1.body)('card_details.cvc')
    .notEmpty()
    .withMessage('Credit card cvc should be given')
    .isString()
    .withMessage('Credit card cvc should a string'), 
// customer user authentication and authorization
passport_config_1.default.authenticate('jwt', { session: false }), 
// eslint-disable-next-line @typescript-eslint/no-misused-promises
orders_controller_1.PlaceOrderOnlineOne);
