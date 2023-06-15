"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartRouter = void 0;
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const passport_config_1 = __importDefault(require("../configs/passport.config"));
const cart_controller_1 = require("../controllers/cart.controller");
const router = express_1.default.Router();
exports.CartRouter = router;
// get all cart
router.get('/', 
// user authentication
passport_config_1.default.authenticate('jwt', { session: false }), 
// eslint-disable-next-line @typescript-eslint/no-misused-promises
cart_controller_1.GetOneAllCart);
// post new cart
router.post('/', (0, express_validator_1.body)('bookid')
    .notEmpty()
    .withMessage('Bookid should not be empty')
    .isNumeric()
    .withMessage('Bookid should be integer'), (0, express_validator_1.body)('quantity')
    .notEmpty()
    .withMessage('Quantity should not be empty')
    .isNumeric()
    .withMessage('Quantity should be integer'), 
// user authentication
passport_config_1.default.authenticate('jwt', { session: false }), 
// eslint-disable-next-line @typescript-eslint/no-misused-promises
cart_controller_1.AddOneCart);
router.patch('/:cartid', (0, express_validator_1.param)('cartid')
    .notEmpty()
    .withMessage('Param cartid should not be empty')
    .isNumeric()
    .withMessage('Param cartid should be an integer'), (0, express_validator_1.body)('quantity')
    .notEmpty()
    .withMessage('Quantity should ot be empty')
    .isNumeric()
    .withMessage('Quantity should be an integer'), 
// user authentication
passport_config_1.default.authenticate('jwt', { session: false }), 
// eslint-disable-next-line @typescript-eslint/no-misused-promises
cart_controller_1.UpdateOneCart);
router.delete('/', 
// user authentication
passport_config_1.default.authenticate('jwt', { session: false }), 
// eslint-disable-next-line @typescript-eslint/no-misused-promises
cart_controller_1.RemoveAllOneCart);
router.delete('/:cartid', (0, express_validator_1.param)('cartid').isNumeric().withMessage('Param cartid should be an integer'), 
// user authentication
passport_config_1.default.authenticate('jwt', { session: false }), 
// eslint-disable-next-line @typescript-eslint/no-misused-promises
cart_controller_1.RemoveSingleOneCart);
