"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthorsAdminRouter = void 0;
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const authors_controller_1 = require("../../controllers/authors.controller");
const passport_config_1 = __importDefault(require("../../configs/passport.config"));
const admin_middleware_1 = require("../../middlewares/admin.middleware");
const router = express_1.default.Router();
exports.AuthorsAdminRouter = router;
router.post('/', (0, express_validator_1.body)('firstname')
    .notEmpty()
    .withMessage('Body firstname should not be empty')
    .isString()
    .withMessage('Body firstname should be a string'), (0, express_validator_1.body)('lastname')
    .notEmpty()
    .withMessage('Body lastname should not be empty')
    .isString()
    .withMessage('Body lastname should be a string'), passport_config_1.default.authenticate('jwt', { session: false }), admin_middleware_1.isAdmin, 
// eslint-disable-next-line @typescript-eslint/no-misused-promises
authors_controller_1.AddNewBookOneAuthor);
router.patch('/:authorid', (0, express_validator_1.param)('authorid')
    .notEmpty()
    .withMessage('Param authorid should not be empty')
    .isInt()
    .withMessage('Param authorid should be an integer'), (0, express_validator_1.body)('firstname').optional().isString().withMessage('Body firstname should be a string'), (0, express_validator_1.body)('lastname').optional().isString().withMessage('Body lastname should be a string'), passport_config_1.default.authenticate('jwt', { session: false }), admin_middleware_1.isAdmin, 
// eslint-disable-next-line @typescript-eslint/no-misused-promises
authors_controller_1.UpdateOneAuthor);
router.delete('/:authorid', (0, express_validator_1.param)('authorid')
    .notEmpty()
    .withMessage('Param authorid should not be empty')
    .isInt()
    .withMessage('Param authorid should be an integer'), passport_config_1.default.authenticate('jwt', { session: false }), admin_middleware_1.isAdmin, 
// eslint-disable-next-line @typescript-eslint/no-misused-promises
authors_controller_1.RemoveOneAuthor);
