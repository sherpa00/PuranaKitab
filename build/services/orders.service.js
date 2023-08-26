"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.RemoveOrder = exports.ConfirmOrders = exports.ShowMyOrders = exports.PlaceOrderOnline = exports.PlaceOrderOffline = void 0;
const dotenv = __importStar(require("dotenv"));
const stripe_1 = __importDefault(require("stripe"));
const db_configs_1 = require("../configs/db.configs");
const logger_utils_1 = __importDefault(require("../utils/logger.utils"));
dotenv.config({
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    path: `.env.${process.env.NODE_ENV}`
});
// strip init
const STRIPE_SECRET = String(process.env.STRIPE_SECRET);
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const STRIPE = new stripe_1.default(STRIPE_SECRET, {
    apiVersion: '2022-11-15'
});
// service for place order process offline (cash on delivery)
const PlaceOrderOffline = (cartsList, userid, phoneNumber) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let totalCartsAmount = 0;
        const totalOrderedBooks = [];
        // check if cart in cartsList exist for correct userid or not
        for (let i = 0; i < cartsList.length; i++) {
            const foundCart = yield db_configs_1.db.query('SELECT * FROM carts WHERE carts.cartid = $1 AND carts.userid = $2', [
                cartsList[i].cartid,
                userid
            ]);
            if (foundCart.rowCount <= 0) {
                return {
                    success: false,
                    message: 'Cart is unavailable'
                };
            }
            totalCartsAmount += parseInt(foundCart.rows[0].total_price);
            const tempOrderdSingleBook = {
                bookid: foundCart.rows[0].bookid,
                total_quantity: foundCart.rows[0].quantity,
                book_original_price: foundCart.rows[0].original_price,
                book_total_price: foundCart.rows[0].total_price
            };
            totalOrderedBooks.push(tempOrderdSingleBook);
        }
        // add to db order
        const addOrderStatus = yield db_configs_1.db.query(`
                INSERT INTO
                    orders (
                        userid,
                        phone_number,
                        ordered_books,
                        total_amount,
                        payment_status,
                        payment_method
                    )
                VALUES (
                    $1,
                    $2,
                    $3,
                    $4,
                    $5,
                    $6
                ) RETURNING *
            `, [userid, phoneNumber, totalOrderedBooks, totalCartsAmount, 'unpaid', 'cash_on_delivery']);
        if (addOrderStatus.rowCount <= 0) {
            return {
                success: false,
                message: 'Failed to place your order'
            };
        }
        // create stripe payment intent
        const paymentIntent = yield STRIPE.paymentIntents.create({
            amount: totalCartsAmount,
            currency: 'usd',
            metadata: {
                orderid: addOrderStatus.rows[0].orderid
            }
        });
        // update order with attached payemnt intent id
        const updatedOrderWithPayment = yield db_configs_1.db.query('UPDATE orders SET payment_intent_id = $1 WHERE orders.userid = $2 AND orders.orderid = $3 RETURNING *', [String(paymentIntent.id), userid, parseInt(addOrderStatus.rows[0].orderid)]);
        if (updatedOrderWithPayment.rowCount <= 0) {
            // delete orders after failing in payments
            yield db_configs_1.db.query('DELETE FROM orders WHERE orders.userid = $1 AND orders.orderid = $2', [
                userid,
                parseInt(addOrderStatus.rows[0].orderid)
            ]);
            return {
                success: false,
                message: 'Failed to place your orders'
            };
        }
        // clear carts and also reduce books quantity
        for (let i = 0; i < cartsList.length; i++) {
            const foundCart = yield db_configs_1.db.query('SELECT * FROM carts WHERE carts.cartid = $1 AND carts.userid = $2', [
                cartsList[i].cartid,
                userid
            ]);
            const originalBookQuantity = yield db_configs_1.db.query('SELECT available_quantity FROM books WHERE bookid = $1', [
                parseInt(foundCart.rows[0].bookid)
            ]);
            const newBookQuantity = parseInt(originalBookQuantity.rows[0].available_quantity) - parseInt(foundCart.rows[0].quantity);
            yield db_configs_1.db.query(`
                    UPDATE
                        books
                    SET
                        available_quantity = $1
                    WHERE
                        bookid = $2
                    RETURNING available_quantity
                `, [
                // eslint-disable-next-line no-sequences
                newBookQuantity,
                parseInt(foundCart.rows[0].bookid)
            ]);
            // clear user carts
            yield db_configs_1.db.query(`
                    DELETE FROM
                        carts
                    WHERE 
                        carts.userid = $1 AND carts.bookid = $2 
                `, [userid, foundCart.rows[0].bookid]);
        }
        return {
            success: true,
            message: 'Successfully placed your orders',
            data: Object.assign({}, updatedOrderWithPayment.rows[0])
        };
    }
    catch (err) {
        logger_utils_1.default.error(err, 'Error while placing order');
        return {
            success: false,
            message: 'Failed to place your order'
        };
    }
});
exports.PlaceOrderOffline = PlaceOrderOffline;
// service for place order process online (card)
const PlaceOrderOnline = (cartsList, userid, phoneNumber, userEmail, cardDetails) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let totalCartsAmount = 0;
        const totalOrderedBooks = [];
        // check if cart in cartsList exist for correct userid or not
        for (let i = 0; i < cartsList.length; i++) {
            const foundCart = yield db_configs_1.db.query('SELECT * FROM carts WHERE carts.cartid = $1 AND carts.userid = $2', [
                cartsList[i].cartid,
                userid
            ]);
            if (foundCart.rowCount <= 0) {
                return {
                    success: false,
                    message: 'Cart is unavailable'
                };
            }
            totalCartsAmount += parseInt(foundCart.rows[0].total_price);
            const tempOrderdSingleBook = {
                bookid: foundCart.rows[0].bookid,
                total_quantity: foundCart.rows[0].quantity,
                book_original_price: foundCart.rows[0].original_price,
                book_total_price: foundCart.rows[0].total_price
            };
            totalOrderedBooks.push(tempOrderdSingleBook);
        }
        // add to db order
        const addOrderStatus = yield db_configs_1.db.query(`
                INSERT INTO
                    orders (
                        userid,
                        phone_number,
                        ordered_books,
                        total_amount,
                        payment_status,
                        payment_method
                    )
                VALUES (
                    $1,
                    $2,
                    $3,
                    $4,
                    $5,
                    $6
                ) RETURNING *
            `, [userid, phoneNumber, totalOrderedBooks, totalCartsAmount, 'unpaid', 'card']);
        if (addOrderStatus.rowCount <= 0) {
            return {
                success: false,
                message: 'Failed to place your order'
            };
        }
        // create payment mehtod id
        const paymentMethod = yield STRIPE.paymentMethods.create({
            type: 'card',
            card: {
                number: cardDetails.cardNumber,
                exp_month: cardDetails.expiryMonth,
                exp_year: cardDetails.expiryYear,
                cvc: cardDetails.cardCVC
            }
        });
        // create payment customer id
        const paymentCustomer = yield STRIPE.customers.create({
            email: userEmail,
            payment_method: paymentMethod.id,
            invoice_settings: {
                default_payment_method: paymentMethod.id
            }
        });
        // crreate payment intent
        const paymentIntent = yield STRIPE.paymentIntents.create({
            amount: totalCartsAmount,
            currency: 'usd',
            customer: paymentCustomer.id,
            payment_method: paymentMethod.id,
            confirm: true
        });
        if (paymentIntent.status !== 'succeeded') {
            return {
                success: false,
                message: 'Failed to place your order'
            };
        }
        // update order with attached orere payemnt intent id
        const updatedOrderWithPayment = yield db_configs_1.db.query('UPDATE orders SET payment_intent_id = $1, payment_status = $2 WHERE orders.userid = $3 AND orders.orderid = $4 RETURNING *', [String(paymentIntent.id), 'paid', userid, parseInt(addOrderStatus.rows[0].orderid)]);
        if (updatedOrderWithPayment.rowCount <= 0) {
            // delete orders after failing in payments
            yield db_configs_1.db.query('DELETE FROM orders WHERE orders.userid = $1 AND orders.orderid = $2', [
                userid,
                parseInt(addOrderStatus.rows[0].orderid)
            ]);
            return {
                success: false,
                message: 'Failed to place your orders'
            };
        }
        // clear carts and also reduce books quantity
        for (let i = 0; i < cartsList.length; i++) {
            const foundCart = yield db_configs_1.db.query('SELECT * FROM carts WHERE carts.cartid = $1 AND carts.userid = $2', [
                cartsList[i].cartid,
                userid
            ]);
            const originalBookQuantity = yield db_configs_1.db.query('SELECT available_quantity FROM books WHERE bookid = $1', [
                parseInt(foundCart.rows[0].bookid)
            ]);
            const newBookQuantity = parseInt(originalBookQuantity.rows[0].available_quantity) - parseInt(foundCart.rows[0].quantity);
            yield db_configs_1.db.query(`
                    UPDATE
                        books
                    SET
                        available_quantity = $1
                    WHERE
                        bookid = $2
                    RETURNING *
                `, [
                // eslint-disable-next-line no-sequences
                newBookQuantity,
                parseInt(foundCart.rows[0].bookid)
            ]);
            // clear user carts
            yield db_configs_1.db.query(`
                    DELETE FROM
                        carts
                    WHERE 
                        carts.userid = $1 AND carts.bookid = $2 
                `, [userid, foundCart.rows[0].bookid]);
        }
        return {
            success: true,
            message: 'Successfully placed your orders',
            data: Object.assign({}, updatedOrderWithPayment.rows[0])
        };
    }
    catch (err) {
        logger_utils_1.default.error(err, 'Error while placing order');
        return {
            success: false,
            message: 'Failed to place your order'
        };
    }
});
exports.PlaceOrderOnline = PlaceOrderOnline;
// service for showing user orders
const ShowMyOrders = (userid) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // check if order exits or not
        const countOrders = yield db_configs_1.db.query('SELECT COUNT(*) FROM orders WHERE orders.userid = $1', [userid]);
        if (countOrders.rows[0].count < 0) {
            return {
                success: false,
                message: 'Failed to get my orders'
            };
        }
        // get user orders from db
        const showOrdersStatus = yield db_configs_1.db.query('SELECT * FROM orders WHERE orders.userid = $1', [userid]);
        return {
            success: true,
            message: 'Successfully got my orders',
            data: showOrdersStatus.rows
        };
    }
    catch (err) {
        logger_utils_1.default.error(err, 'Error while getting my orders');
        return {
            success: false,
            message: 'Failed to get my orders'
        };
    }
});
exports.ShowMyOrders = ShowMyOrders;
// service for order confirmation
const ConfirmOrders = (orderid) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // check if order exists or not
        const orderFound = yield db_configs_1.db.query('SELECT payment_status FROM orders WHERE orders.orderid = $1', [orderid]);
        if (orderFound.rowCount <= 0) {
            return {
                success: false,
                message: 'No order found'
            };
        }
        // check if order already paid
        if (orderFound.rows[0].payment_status === 'paid') {
            return {
                success: false,
                message: 'Order already confirmed'
            };
        }
        // confirm payment status for this order
        const confirmOrderStatus = yield db_configs_1.db.query(`
                UPDATE
                    orders
                SET
                    payment_status = $1
                WHERE
                    orderid = $2
                RETURNING *
            `, ['paid', orderid]);
        if (confirmOrderStatus.rowCount <= 0) {
            return {
                success: false,
                message: 'Failed to confirm order'
            };
        }
        return {
            success: true,
            message: 'Successfully confirmed the order',
            data: confirmOrderStatus.rows[0]
        };
    }
    catch (err) {
        logger_utils_1.default.error(err, 'Error while confirming order');
        return {
            success: false,
            message: 'Failed to confirm order'
        };
    }
});
exports.ConfirmOrders = ConfirmOrders;
// service for removing order after confirmation
const RemoveOrder = (orderid) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // check if order exists
        const foundOrder = yield db_configs_1.db.query('SELECT payment_status FROM orders WHERE orders.orderid = $1', [orderid]);
        if (foundOrder.rowCount <= 0) {
            return {
                success: false,
                message: 'No Order Found'
            };
        }
        // check if order payment status is paid
        const isOrderPaymentPaid = foundOrder.rows[0].payment_status === 'paid';
        if (!isOrderPaymentPaid) {
            return {
                success: false,
                message: 'Order payment is due'
            };
        }
        // remove order from db
        const removeOrderStatus = yield db_configs_1.db.query('DELETE FROM orders WHERE orders.orderid = $1 RETURNING *', [orderid]);
        if (removeOrderStatus.rowCount <= 0) {
            return {
                success: false,
                message: 'Failed to remove order'
            };
        }
        return {
            success: true,
            message: 'Successfully removed order',
            data: removeOrderStatus.rows[0]
        };
    }
    catch (err) {
        logger_utils_1.default.error(err, 'Error while removing order');
        return {
            success: false,
            message: 'Failed to remove order'
        };
    }
});
exports.RemoveOrder = RemoveOrder;
