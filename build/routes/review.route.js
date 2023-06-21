"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewRouter = void 0;
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const passport_config_1 = __importDefault(require("../configs/passport.config"));
const reivew_controller_1 = require("../controllers/reivew.controller");
const admin_middleware_1 = require("../middlewares/admin.middleware");
const router = express_1.default.Router();
exports.ReviewRouter = router;
// get all reviews
router.get('/', (0, express_validator_1.body)('bookid')
    .notEmpty()
    .withMessage('Body bookid should not be empty')
    .isNumeric()
    .withMessage('Body bookid should be an integer'), 
// eslint-disable-next-line @typescript-eslint/no-misused-promises
reivew_controller_1.GetAllOneBookReview);
// post review
router.post('/', (0, express_validator_1.body)('bookid')
    .notEmpty()
    .withMessage('bookid should not be empty')
    .isNumeric()
    .withMessage('bookid should be an integer'), (0, express_validator_1.body)('stars')
    .notEmpty()
    .withMessage('Review Stars should not be empty')
    .isInt({ min: 0, max: 5 })
    .withMessage('Review Stars should be an integer(0-5)'), (0, express_validator_1.body)('message')
    .notEmpty()
    .withMessage('Review message should not be empty')
    .isString()
    .withMessage('Review message should be an integer'), 
// user authencticatin
passport_config_1.default.authenticate('jwt', { session: false }), 
// eslint-disable-next-line @typescript-eslint/no-misused-promises
reivew_controller_1.AddOneReview);
// get single reviews
router.delete('/:reviewid', (0, express_validator_1.param)('reviewid').isNumeric().withMessage('Param reviewid should be an integer'), 
// user authorization
passport_config_1.default.authenticate('jwt', { session: false }), 
// admin authorization
admin_middleware_1.isAdmin, 
// eslint-disable-next-line @typescript-eslint/no-misused-promises
reivew_controller_1.RemoveSingleOneBookReview);
// get all reviews
router.delete('/', (0, express_validator_1.body)('bookid')
    .notEmpty()
    .withMessage('Body bookid should not be empty')
    .isNumeric()
    .withMessage('Body bookid should be an integer'), 
// user authorization
passport_config_1.default.authenticate('jwt', { session: false }), 
// admin authorization
admin_middleware_1.isAdmin, 
// eslint-disable-next-line @typescript-eslint/no-misused-promises
reivew_controller_1.RemoveAllOneBookReviews);
