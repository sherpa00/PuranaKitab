"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewsGuestRouter = void 0;
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const reivew_controller_1 = require("../../controllers/reivew.controller");
const router = (0, express_1.Router)();
exports.ReviewsGuestRouter = router;
// get all reviews
router.get('/', (0, express_validator_1.body)('bookid')
    .notEmpty()
    .withMessage('Body bookid should not be empty')
    .isNumeric()
    .withMessage('Body bookid should be an integer'), 
// eslint-disable-next-line @typescript-eslint/no-misused-promises
reivew_controller_1.GetAllOneBookReview);
