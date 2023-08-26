"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const pino_http_1 = __importDefault(require("pino-http"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const cors_1 = __importDefault(require("cors"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const logger_utils_1 = __importDefault(require("./utils/logger.utils"));
const error_handler_middleware_1 = require("./middlewares/error-handler.middleware");
const routes_1 = require("./routes");
// server application
const app = (0, express_1.default)();
// middlewares for server handling
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// cors config
app.use((0, cors_1.default)());
if (process.env.NODE_ENV === 'development') {
    app.use((0, morgan_1.default)('dev'));
}
if (process.env.NODE_ENV === 'production') {
    app.use((0, pino_http_1.default)({
        logger: logger_utils_1.default,
        serializers: {
            // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
            req: req => `-> ${req.method} ${req.url}`,
            // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
            res: res => `<- ${res.statusCode} ${res.headers['content-type']}`
        }
    }));
}
// root rotue for checking server functioning
app.get('/api', (req, res) => {
    try {
        res.status(http_status_codes_1.default.OK).json({
            success: true,
            message: 'Api server is alive'
        });
    }
    catch (err) {
        logger_utils_1.default.error(err, 'Error in / route');
        res.status(http_status_codes_1.default.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: 'Api server Error'
        });
    }
});
// api docs
const swaggerFile = process.cwd() + '/src/swagger/swagger.json';
const swaggerData = fs_1.default.readFileSync(swaggerFile, 'utf-8');
const swaggerDocs = JSON.parse(swaggerData);
app.use('/api/docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerDocs));
// root api router
app.use('/', routes_1.RootRouter);
// custom erorr handler middlewares
app.use(error_handler_middleware_1.errorLogger);
app.use(error_handler_middleware_1.errorResponder);
app.use(error_handler_middleware_1.errorFailSafeHandler);
exports.default = app;
