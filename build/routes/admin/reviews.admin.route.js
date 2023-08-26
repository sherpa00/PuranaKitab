"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewsAdminRouter = void 0;
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const reivew_controller_1 = require("../../controllers/reivew.controller");
const admin_middleware_1 = require("../../middlewares/admin.middleware");
const passport_config_1 = __importDefault(require("../../configs/passport.config"));
const router = express_1.default.Router();
exports.ReviewsAdminRouter = router;
// get single reviews
router.delete('/:reviewid', (0, express_validator_1.param)('reviewid').isNumeric().withMessage('Param reviewid should be an integer'), passport_config_1.default.authenticate('jwt', { session: false }), admin_middleware_1.isAdmin, 
// eslint-disable-next-line @typescript-eslint/no-misused-promises
reivew_controller_1.RemoveSingleOneBookReview);
// get all reviews
router.delete('/', (0, express_validator_1.body)('bookid')
    .notEmpty()
    .withMessage('Body bookid should not be empty')
    .isNumeric()
    .withMessage('Body bookid should be an integer'), passport_config_1.default.authenticate('jwt', { session: false }), admin_middleware_1.isAdmin, 
// eslint-disable-next-line @typescript-eslint/no-misused-promises
reivew_controller_1.RemoveAllOneBookReviews);
