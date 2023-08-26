"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoriesBestSellerRouter = void 0;
const express_1 = __importDefault(require("express"));
const categories_controller_1 = require("../../controllers/categories.controller");
const express_validator_1 = require("express-validator");
const router = express_1.default.Router();
exports.CategoriesBestSellerRouter = router;
// category router -> best seller books
router.get('/best-seller', (0, express_validator_1.query)('page').optional().isInt().withMessage('Query page should be an integer'), (0, express_validator_1.query)('size').optional().isInt().withMessage('Query size should be an integer'), 
// eslint-disable-next-line @typescript-eslint/no-misused-promises
categories_controller_1.GetOneCategoryBestSeller);
// category router -> top rated
router.get('/top-rated', (0, express_validator_1.query)('page').optional().isInt().withMessage('Query page should be an integer'), (0, express_validator_1.query)('size').optional().isInt().withMessage('Query size should be an integer'), 
// eslint-disable-next-line @typescript-eslint/no-misused-promises
categories_controller_1.GetOneCategoryTopRated);
// category router -> new arrivals
router.get('/new-arrivals', (0, express_validator_1.query)('page').optional().isInt().withMessage('Query page should be an integer'), (0, express_validator_1.query)('size').optional().isInt().withMessage('Query size should be an integer'), 
// eslint-disable-next-line @typescript-eslint/no-misused-promises
categories_controller_1.GetOneCategoryNewArrivals);
// category router -> recently added
router.get('/recently-added', (0, express_validator_1.query)('page').optional().isInt().withMessage('Query page should be an integer'), (0, express_validator_1.query)('size').optional().isInt().withMessage('Query size should be an integer'), 
// eslint-disable-next-line @typescript-eslint/no-misused-promises
categories_controller_1.GetOneCategoryRecentlyAdded);
