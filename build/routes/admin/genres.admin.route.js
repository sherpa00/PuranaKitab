"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GenresAdminRouter = void 0;
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const genres_controller_1 = require("../../controllers/genres.controller");
const passport_config_1 = __importDefault(require("../../configs/passport.config"));
const admin_middleware_1 = require("../../middlewares/admin.middleware");
const router = express_1.default.Router();
exports.GenresAdminRouter = router;
router.post('/', (0, express_validator_1.body)('genre')
    .notEmpty()
    .withMessage('Body genre should not be empty')
    .isString()
    .withMessage('Body genre should be a string'), passport_config_1.default.authenticate('jwt', { session: false }), admin_middleware_1.isAdmin, 
// eslint-disable-next-line @typescript-eslint/no-misused-promises
genres_controller_1.AddBookOneGenre);
router.patch('/:genreid', (0, express_validator_1.param)('genreid')
    .notEmpty()
    .withMessage('Param genreid should not be empty')
    .isInt()
    .withMessage('Param genreid should be an integer'), (0, express_validator_1.body)('genre')
    .notEmpty()
    .withMessage('Body genre should not be empty')
    .isString()
    .withMessage('Body genre should be a string'), passport_config_1.default.authenticate('jwt', { session: false }), admin_middleware_1.isAdmin, 
// eslint-disable-next-line @typescript-eslint/no-misused-promises
genres_controller_1.UpdateOneGenre);
router.delete('/:genreid', (0, express_validator_1.param)('genreid')
    .notEmpty()
    .withMessage('Param genreid should not be empty')
    .isInt()
    .withMessage('Param genreid should be an integer'), passport_config_1.default.authenticate('jwt', { session: false }), admin_middleware_1.isAdmin, 
// eslint-disable-next-line @typescript-eslint/no-misused-promises
genres_controller_1.DeleteOneGenre);
