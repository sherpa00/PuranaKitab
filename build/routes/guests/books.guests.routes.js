"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookGuestRouter = void 0;
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const books_controller_1 = require("../../controllers/books.controller");
const router = (0, express_1.Router)();
exports.BookGuestRouter = router;
router.get('/', (0, express_validator_1.query)('genre').optional().isString().withMessage('Query genre should be a string'), (0, express_validator_1.query)('author').optional().isString().withMessage('Query author should be a string'), (0, express_validator_1.query)('page').optional().isInt().withMessage('Query page should be an integer'), (0, express_validator_1.query)('size').optional().isInt().withMessage('Query size should be an integere'), 
// eslint-disable-next-line @typescript-eslint/no-misused-promises
books_controller_1.GetAllOneBooks);
router.get('/:bookid', (0, express_validator_1.param)('bookid').isNumeric().withMessage('Param bookid should be integer'), 
// eslint-disable-next-line @typescript-eslint/no-misused-promises
books_controller_1.GetBookById);
