"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthorGuestRouter = void 0;
const express_1 = require("express");
const authors_controller_1 = require("../../controllers/authors.controller");
const express_validator_1 = require("express-validator");
const router = (0, express_1.Router)();
exports.AuthorGuestRouter = router;
router.get('/', (0, express_validator_1.query)('page').optional().isInt().withMessage('Query page should be an integer'), (0, express_validator_1.query)('size').optional().isInt().withMessage('Query size should be an integer'), 
// eslint-disable-next-line @typescript-eslint/no-misused-promises
authors_controller_1.GetAllBookOneAuthors);
