"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GenreGuestRouter = void 0;
const express_1 = require("express");
const genres_controller_1 = require("../../controllers/genres.controller");
const express_validator_1 = require("express-validator");
const router = (0, express_1.Router)();
exports.GenreGuestRouter = router;
router.get('/', (0, express_validator_1.query)('page').optional().isInt().withMessage('Query page should be an integer'), (0, express_validator_1.query)('size').optional().isInt().withMessage('Query size should be an integer'), 
// eslint-disable-next-line @typescript-eslint/no-misused-promises
genres_controller_1.GetBookOneGenres);
