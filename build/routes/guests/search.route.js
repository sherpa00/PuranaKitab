"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchRouter = void 0;
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const search_controller_1 = require("../../controllers/search.controller");
const router = express_1.default.Router();
exports.SearchRouter = router;
// search book routes
router.get('/', (0, express_validator_1.query)('query').isString().withMessage('Search query must be a string'), (0, express_validator_1.query)('search_by')
    .isIn(['title', 'author', 'description'])
    .withMessage('Search by must be either title, author or description'), (0, express_validator_1.query)('genre').optional().isString().withMessage('Query genre should be a string'), (0, express_validator_1.query)('page').optional().isInt().withMessage('Query page should be an integer'), (0, express_validator_1.query)('size').optional().isInt().withMessage('Query size should be an integer'), (0, express_validator_1.query)('sort_by').optional().isAlpha().withMessage('Query sort_by should be a string'), (0, express_validator_1.query)('condition')
    .optional()
    .isString()
    .withMessage('Query book condition should be a string')
    .isIn(['OLD', 'old', 'GOOD', 'good', 'ACCEPTABLE', 'acceptable'])
    .withMessage('Query book condition must be either old, good or acceptable'), (0, express_validator_1.query)('min_price').optional().isInt().withMessage('Query Min Price should be an integer'), (0, express_validator_1.query)('max_price').optional().isInt().withMessage('Query Max Price should be an integer'), 
// eslint-disable-next-line @typescript-eslint/no-misused-promises
search_controller_1.SearchBooksOne);
