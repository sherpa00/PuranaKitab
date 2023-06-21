"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RemoveAllCart = exports.RemoveSingleCart = exports.UpdateCart = exports.AddCart = exports.GetAllCart = void 0;
const db_configs_1 = require("../configs/db.configs");
const logger_utils_1 = __importDefault(require("../utils/logger.utils"));
// service to get all cart for user
const GetAllCart = (userID) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // get cart from userid
        const getCartStatus = yield db_configs_1.db.query('SELECT * FROM carts WHERE carts.userid = $1', [userID]);
        if (getCartStatus.rowCount <= 0) {
            return {
                success: true,
                message: 'Empty Cart',
                data: []
            };
        }
        return {
            success: true,
            message: 'Successfully got all cart',
            data: getCartStatus.rows
        };
    }
    catch (err) {
        logger_utils_1.default.error(err, 'Error while gettting all cart');
        return {
            success: false,
            message: 'Error while gettting all cart'
        };
    }
});
exports.GetAllCart = GetAllCart;
// service to add new cart for user
const AddCart = (userID, bookID, bookQuantity) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // get the book from db by bookid
        const foundBookWithBookid = yield db_configs_1.db.query('SELECT * FROM books WHERE bookid = $1', [bookID]);
        if (foundBookWithBookid.rowCount <= 0) {
            return {
                success: false,
                message: 'Book is not available'
            };
        }
        // retreive price and available quantity of book
        const originalBookPrice = foundBookWithBookid.rows[0].price;
        const originalBookAvailableQuantity = foundBookWithBookid.rows[0].available_quantity;
        // verify book quantity is available
        const isBookAvailable = originalBookAvailableQuantity >= bookQuantity;
        if (!isBookAvailable) {
            return {
                success: false,
                message: 'Book is not in available quantity'
            };
        }
        // compute total price of book with quantiy
        const totalBookPrice = originalBookAvailableQuantity * originalBookPrice;
        // add new cart to db
        const addNewCartStatus = yield db_configs_1.db.query('INSERT INTO carts (userid, bookid, quantity, original_price, total_price) VALUES ($1, $2, $3, $4, $5) RETURNING *', [userID, bookID, bookQuantity, originalBookPrice, totalBookPrice]);
        if (addNewCartStatus.rowCount <= 0) {
            return {
                success: false,
                message: 'Failed to add new cart'
            };
        }
        return {
            success: true,
            message: 'Succesfully added cart',
            data: addNewCartStatus.rows[0]
        };
    }
    catch (err) {
        logger_utils_1.default.error(err, 'Error while adding new cart');
        return {
            success: false,
            message: 'Error while adding new cart'
        };
    }
});
exports.AddCart = AddCart;
// service for updating cart
const UpdateCart = (userID, cartID, bookQuantity) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // first verify if cart exits or not with cartID
        const foundCart = yield db_configs_1.db.query('SELECT * FROM carts WHERE carts.cartid = $1 AND carts.userid = $2', [
            cartID,
            userID
        ]);
        if (foundCart.rowCount <= 0) {
            return {
                success: false,
                message: 'No Cart Found'
            };
        }
        const bookFound = yield db_configs_1.db.query('SELECT available_quantity FROM books WHERE bookid = $1', [
            foundCart.rows[0].bookid
        ]);
        if (bookFound.rowCount <= 0) {
            return {
                success: false,
                message: 'No Book found for cart'
            };
        }
        const originalBookAvailableQuantity = parseInt(bookFound.rows[0].available_quantity);
        // verify book quantity is available
        const isBookAvailable = originalBookAvailableQuantity >= bookQuantity;
        if (!isBookAvailable) {
            return {
                success: false,
                message: 'Book is not in available quantity'
            };
        }
        // new total price with updated quantity
        const newTotalPrice = parseInt(foundCart.rows[0].original_price) * bookQuantity;
        // update cart
        const updateCartStatus = yield db_configs_1.db.query('UPDATE carts SET quantity = $1, total_price = $2 RETURNING *', [
            bookQuantity,
            newTotalPrice
        ]);
        if (updateCartStatus.rowCount <= 0) {
            return {
                success: false,
                message: 'Failed to update a cart'
            };
        }
        return {
            success: true,
            message: 'Successfully updated a cart',
            data: updateCartStatus.rows[0]
        };
    }
    catch (err) {
        logger_utils_1.default.error(err, 'Error while updating a cart');
        return {
            success: false,
            message: 'Error while updating a cart'
        };
    }
});
exports.UpdateCart = UpdateCart;
// service for removing single cart
const RemoveSingleCart = (userID, cartID) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // verify if cart exists or not
        const foundCart = yield db_configs_1.db.query('SELECT * FROM carts WHERE carts.cartid = $1 AND carts.userid = $2', [
            cartID,
            userID
        ]);
        if (foundCart.rowCount <= 0) {
            return {
                success: false,
                message: 'No Cart Found'
            };
        }
        // remove cart
        const removeSingleCartStatus = yield db_configs_1.db.query('DELETE FROM carts WHERE carts.cartid = $1 AND carts.userid = $2', [
            cartID,
            userID
        ]);
        if (removeSingleCartStatus.rowCount <= 0) {
            return {
                success: false,
                message: 'Failed to remove a single cart'
            };
        }
        return {
            success: true,
            message: 'Successfully removed a single cart'
        };
    }
    catch (err) {
        logger_utils_1.default.error(err, 'Error while removing a single cart');
        return {
            success: false,
            message: 'Error while removing a sigle cart'
        };
    }
});
exports.RemoveSingleCart = RemoveSingleCart;
// service for removing single cart
const RemoveAllCart = (userID) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // verify if cart exists or not
        const foundCart = yield db_configs_1.db.query('SELECT * FROM carts WHERE carts.userid = $1', [userID]);
        if (foundCart.rowCount <= 0) {
            return {
                success: false,
                message: 'No Carts Found'
            };
        }
        // remove cart
        const removeAllCartStatus = yield db_configs_1.db.query('DELETE FROM carts WHERE carts.userid = $1', [userID]);
        if (removeAllCartStatus.rowCount <= 0) {
            return {
                success: false,
                message: 'Failed to remove all carts'
            };
        }
        return {
            success: true,
            message: 'Successfully removed all carts'
        };
    }
    catch (err) {
        logger_utils_1.default.error(err, 'Error while removing all carts');
        return {
            success: false,
            message: 'Error while removing all carts'
        };
    }
});
exports.RemoveAllCart = RemoveAllCart;
