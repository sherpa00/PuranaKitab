"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookAdminRouter = void 0;
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const books_controller_1 = require("../../controllers/books.controller");
const multer_utils_1 = __importDefault(require("../../utils/multer.utils"));
const passport_config_1 = __importDefault(require("../../configs/passport.config"));
const admin_middleware_1 = require("../../middlewares/admin.middleware");
const router = express_1.default.Router();
exports.BookAdminRouter = router;
router.post('/', (0, express_validator_1.body)('title').notEmpty().withMessage('Book Title Should not be empty'), (0, express_validator_1.body)('price').notEmpty().withMessage('Book Price Should not be empty'), (0, express_validator_1.body)('publication_date').notEmpty().withMessage('Book Publication Date Should not be empty'), (0, express_validator_1.body)('book_type').notEmpty().withMessage('Book Type Should not be empty'), (0, express_validator_1.body)('book_condition')
    .notEmpty()
    .withMessage('Book Condition should not be empty')
    .isIn(['GOOD', 'ACCEPTABLE', 'OLD'])
    .withMessage('Book Condition should either be GOOD or ACCEPTABLE or OLD'), (0, express_validator_1.body)('available_quantity').notEmpty().withMessage('Book Available Quantity Should not be empty'), (0, express_validator_1.body)('isbn').notEmpty().withMessage('Book isbn Should not be empty'), (0, express_validator_1.body)('description').notEmpty().isString().withMessage('Book description Should should be string'), (0, express_validator_1.body)('genre').notEmpty().isString().withMessage('Book genre should be a string'), (0, express_validator_1.body)('authorFirstname').notEmpty().withMessage('Book author firstname Should not be empty'), (0, express_validator_1.body)('authorLastname').notEmpty().withMessage('Book author lastname Should not be empty'), passport_config_1.default.authenticate('jwt', { session: false }), admin_middleware_1.isAdmin, 
// eslint-disable-next-line @typescript-eslint/no-misused-promises
books_controller_1.addOneNewBook);
// route to add book image to book with bookid
router.post('/:bookid/image', (0, express_validator_1.param)('bookid').isInt().withMessage('Param bookid must be integer'), (0, express_validator_1.query)('type').isIn(['front', 'FRONT', 'back', 'BACK']).withMessage('Query must be either front or back'), multer_utils_1.default.single('bookimage'), passport_config_1.default.authenticate('jwt', { session: false }), admin_middleware_1.isAdmin, 
// eslint-disable-next-line @typescript-eslint/no-misused-promises
books_controller_1.AddBookImage);
// route to update book image to book with bookid
router.patch('/:bookid/image', (0, express_validator_1.param)('bookid').isInt().withMessage('Param bookid must be integer'), (0, express_validator_1.query)('type').isIn(['front', 'FRONT', 'back', 'BACK']).withMessage('Query must be either front or back'), multer_utils_1.default.single('bookimage'), passport_config_1.default.authenticate('jwt', { session: false }), admin_middleware_1.isAdmin, 
// eslint-disable-next-line @typescript-eslint/no-misused-promises
books_controller_1.UploadBookImage);
router.patch('/:bookid', (0, express_validator_1.param)('bookid').isNumeric().withMessage('Param bookid should be integer'), (0, express_validator_1.body)('title').optional().isString().withMessage('Book Title Should be string'), (0, express_validator_1.body)('price').optional().isInt().withMessage('Book Price Should be integer'), (0, express_validator_1.body)('publication_date').optional().trim().isDate().withMessage('Book Publication Date Should be valid date'), (0, express_validator_1.body)('book_type').optional().isString().withMessage('Book Type should be string'), (0, express_validator_1.body)('book_condition')
    .optional()
    .isIn(['GOOD', 'ACCEPTABLE', 'OLD'])
    .withMessage('Book Condition should either be GOOD or ACCEPTABLE or OLD'), (0, express_validator_1.body)('available_quantity').optional().isInt().withMessage('Book Available Quantity Should be integer'), (0, express_validator_1.body)('isbn').optional().isAlphanumeric().withMessage('Book isbn Should should be string'), (0, express_validator_1.body)('description').optional().isString().withMessage('Book description Should should be string'), passport_config_1.default.authenticate('jwt', { session: false }), admin_middleware_1.isAdmin, 
// eslint-disable-next-line @typescript-eslint/no-misused-promises
books_controller_1.UpdateOneBook);
router.patch('/:bookid/author', (0, express_validator_1.param)('bookid').isInt().withMessage('Param bookid should be integer'), (0, express_validator_1.body)('firstname')
    .notEmpty()
    .withMessage('Body firsname should not be empty')
    .isString()
    .withMessage('Body firstname should be a string'), (0, express_validator_1.body)('lastname')
    .notEmpty()
    .withMessage('Body lastname should not be empty')
    .isString()
    .withMessage('Body lastname should be a string'), passport_config_1.default.authenticate('jwt', { session: false }), admin_middleware_1.isAdmin, 
// eslint-disable-next-line @typescript-eslint/no-misused-promises
books_controller_1.UpdateOneBookAuthor);
router.patch('/:bookid/genre', (0, express_validator_1.param)('bookid').isInt().withMessage('Param bookid should be integer'), (0, express_validator_1.body)('genre')
    .notEmpty()
    .withMessage('Body genre should not be empty')
    .isString()
    .withMessage('Body genre should be a string'), passport_config_1.default.authenticate('jwt', { session: false }), admin_middleware_1.isAdmin, 
// eslint-disable-next-line @typescript-eslint/no-misused-promises
books_controller_1.UpdateOneBookGenre);
router.delete('/:bookid', (0, express_validator_1.param)('bookid').isNumeric().withMessage('Param bookid should be integer'), passport_config_1.default.authenticate('jwt', { session: false }), admin_middleware_1.isAdmin, 
// eslint-disable-next-line @typescript-eslint/no-misused-promises
books_controller_1.RemoveOneBook);
router.delete('/:bookid/image', (0, express_validator_1.param)('bookid').isInt().withMessage('Param bookid must be integer'), (0, express_validator_1.query)('type').isIn(['front', 'FRONT', 'back', 'BACK']).withMessage('Query must be either front or back'), passport_config_1.default.authenticate('jwt', { session: false }), admin_middleware_1.isAdmin, 
// eslint-disable-next-line @typescript-eslint/no-misused-promises
books_controller_1.RemoveBookImage);
