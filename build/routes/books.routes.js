"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookRouter = void 0;
const express_1 = __importDefault(require("express"));
const books_controller_1 = require("../controllers/books.controller");
const express_validator_1 = require("express-validator");
const admin_middleware_1 = require("../middlewares/admin.middleware");
const passport_config_1 = __importDefault(require("../configs/passport.config"));
const multer_utils_1 = __importDefault(require("../utils/multer.utils"));
const router = express_1.default.Router();
exports.BookRouter = router;
// eslint-disable-next-line @typescript-eslint/no-misused-promises
router.get('/', books_controller_1.GetAllOneBooks);
// eslint-disable-next-line @typescript-eslint/no-misused-promises
router.get('/:bookid', (0, express_validator_1.param)('bookid').isNumeric().withMessage('Param bookid should be integer'), 
// eslint-disable-next-line @typescript-eslint/no-misused-promises
books_controller_1.GetBookById);
router.post('/', (0, express_validator_1.body)('title').notEmpty().withMessage('Book Title Should not be empty'), (0, express_validator_1.body)('price').notEmpty().withMessage('Book Price Should not be empty'), (0, express_validator_1.body)('publication_date').notEmpty().withMessage('Book Publication Date Should not be empty'), (0, express_validator_1.body)('book_type').notEmpty().withMessage('Book Type Should not be empty'), (0, express_validator_1.body)('book_condition')
    .notEmpty()
    .withMessage('Book Condition should not be empty')
    .isIn(['GOOD', 'ACCEPTABLE', 'OLD'])
    .withMessage('Book Condition should either be GOOD or ACCEPTABLE or OLD'), (0, express_validator_1.body)('available_quantity').notEmpty().withMessage('Book Available Quantity Should not be empty'), (0, express_validator_1.body)('isbn').notEmpty().withMessage('Book isbn Should not be empty'), (0, express_validator_1.body)('description').optional().isString().withMessage('Book description Should should be string'), (0, express_validator_1.body)('authorFirstname').notEmpty().withMessage('Book author firstname Should not be empty'), (0, express_validator_1.body)('authorLastname').notEmpty().withMessage('Book author lastname Should not be empty'), 
// user authorization
passport_config_1.default.authenticate('jwt', { session: false }), 
// admin authorization
admin_middleware_1.isAdmin, 
// eslint-disable-next-line @typescript-eslint/no-misused-promises
books_controller_1.addOneNewBook);
// route to add book image to book with bookid
router.post('/:bookid/image', (0, express_validator_1.param)('bookid').isInt().withMessage('Param bookid must be integer'), (0, express_validator_1.query)('type').isIn(['front', 'FRONT', 'back', 'BACK']).withMessage('Query must be either front or back'), 
// user authorization
passport_config_1.default.authenticate('jwt', { session: false }), 
// admin authorization
admin_middleware_1.isAdmin, multer_utils_1.default.single('bookimage'), 
// eslint-disable-next-line @typescript-eslint/no-misused-promises
books_controller_1.AddBookImage);
// route to update book image to book with bookid
router.patch('/:bookid/image', (0, express_validator_1.param)('bookid').isInt().withMessage('Param bookid must be integer'), (0, express_validator_1.query)('type').isIn(['front', 'FRONT', 'back', 'BACK']).withMessage('Query must be either front or back'), 
// user authorization
passport_config_1.default.authenticate('jwt', { session: false }), 
// admin authorization
admin_middleware_1.isAdmin, multer_utils_1.default.single('bookimage'), 
// eslint-disable-next-line @typescript-eslint/no-misused-promises
books_controller_1.UploadBookImage);
router.patch('/:bookid', (0, express_validator_1.param)('bookid').isNumeric().withMessage('Param bookid should be integer'), (0, express_validator_1.body)('title').optional().isAlphanumeric().withMessage('Book Title Should be string'), (0, express_validator_1.body)('price').optional().isInt().withMessage('Book Price Should be integer'), (0, express_validator_1.body)('publication_date').optional().trim().isDate().withMessage('Book Publication Date Should be valid date'), (0, express_validator_1.body)('book_type').optional().isAlpha().withMessage('Book Type should be string'), (0, express_validator_1.body)('book_condition')
    .optional()
    .isIn(['GOOD', 'ACCEPTABLE', 'OLD'])
    .withMessage('Book Condition should either be GOOD or ACCEPTABLE or OLD'), (0, express_validator_1.body)('available_quantity').optional().isInt().withMessage('Book Available Quantity Should be integer'), (0, express_validator_1.body)('isbn').optional().isAlphanumeric().withMessage('Book isbn Should should be string'), (0, express_validator_1.body)('description').optional().isString().withMessage('Book description Should should be string'), 
// user authorization
passport_config_1.default.authenticate('jwt', { session: false }), 
// admin authorization
admin_middleware_1.isAdmin, 
// eslint-disable-next-line @typescript-eslint/no-misused-promises
books_controller_1.UpdateOneBook);
router.delete('/:bookid', (0, express_validator_1.param)('bookid').isNumeric().withMessage('Param bookid should be integer'), 
// user authorization
passport_config_1.default.authenticate('jwt', { session: false }), 
// admin authorization
admin_middleware_1.isAdmin, 
// eslint-disable-next-line @typescript-eslint/no-misused-promises
books_controller_1.RemoveOneBook);
router.delete('/:bookid/image', (0, express_validator_1.param)('bookid').isInt().withMessage('Param bookid must be integer'), (0, express_validator_1.query)('type').isIn(['front', 'FRONT', 'back', 'BACK']).withMessage('Query must be either front or back'), 
// user authorization
passport_config_1.default.authenticate('jwt', { session: false }), 
// admin authorization
admin_middleware_1.isAdmin, 
// eslint-disable-next-line @typescript-eslint/no-misused-promises
books_controller_1.RemoveBookImage);
