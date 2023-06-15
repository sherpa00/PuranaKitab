"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const pino_http_1 = __importDefault(require("pino-http"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const logger_utils_1 = __importDefault(require("./utils/logger.utils"));
const register_route_1 = require("./routes/register.route");
const login_route_1 = require("./routes/login.route");
const passport_config_1 = __importDefault(require("./configs/passport.config"));
const user_route_1 = require("./routes/user.route");
const books_routes_1 = require("./routes/books.routes");
const logout_route_1 = require("./routes/logout.route");
const admin_middleware_1 = require("./middlewares/admin.middleware");
const error_handler_middleware_1 = require("./middlewares/error-handler.middleware");
const cart_route_1 = require("./routes/cart.route");
const review_route_1 = require("./routes/review.route");
const healthCheck_1 = require("./routes/healthCheck");
// server application
const app = (0, express_1.default)();
// middlewares for server handling
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
if (process.env.NODE_ENV === 'development') {
    app.use((0, morgan_1.default)('dev'));
}
if (process.env.NODE_ENV === 'production') {
    app.use((0, pino_http_1.default)({
        logger: logger_utils_1.default,
        serializers: {
            // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
            req: (req) => `> ${req.method} ${req.url}`,
            // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
            res: (res) => `< ${res.statusCode} ${res.headers['content-type']}`
        }
    }));
}
// root rotue for checking server functioning
app.get('/', (req, res) => {
    try {
        res.status(http_status_codes_1.default.OK).json({
            success: true,
            message: 'Api server is alive'
        });
    }
    catch (err) {
        console.log(err);
        res.status(http_status_codes_1.default.BAD_REQUEST).json({
            success: false,
            message: 'Api server Error'
        });
    }
});
// private route for testing authorizations
app.get('/private', passport_config_1.default.authenticate('jwt', { session: false }), (req, res) => {
    res.status(http_status_codes_1.default.OK).json({
        success: true,
        message: 'Authorization Success',
        data: req.user
    });
});
// health check
app.get('/healthcheck', healthCheck_1.HealthCheckRouter);
// private route for admin
app.get('/isadmin', passport_config_1.default.authenticate('jwt', { session: false }), admin_middleware_1.isAdmin, (req, res) => {
    res.status(http_status_codes_1.default.OK).json({
        success: true,
        message: 'WELCOME ADMIN'
    });
});
// register new user
app.use('/register', register_route_1.registerRouter);
// login user
app.use('/login', login_route_1.loginRouter);
// logout user
app.use('/logout', logout_route_1.LogoutRouter);
// user routes
app.use('/users', passport_config_1.default.authenticate('jwt', { session: false }), user_route_1.UserRouter);
// book routes
app.use('/books', books_routes_1.BookRouter);
// cart routes
app.use('/carts', cart_route_1.CartRouter);
// book reviews
app.use('/reviews', review_route_1.ReviewRouter);
// custom erorr handler middlewares
app.use(error_handler_middleware_1.errorLogger);
app.use(error_handler_middleware_1.errorResponder);
app.use(error_handler_middleware_1.errorFailSafeHandler);
exports.default = app;
