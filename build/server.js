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
exports.server = void 0;
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
const db_configs_1 = require("./configs/db.configs");
const index_1 = __importDefault(require("./index"));
const dotenv = __importStar(require("dotenv"));
dotenv.config();
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const PORT = parseInt(process.env.PORT);
// start server with db
const server = index_1.default.listen(PORT, (() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('\x1b[32m', '\n -- SERVER CONNECTION: SUCCESS --\n', '\x1b[0m');
        // connect to db
        yield (0, db_configs_1.connectToDb)();
    }
    catch (err) {
        console.log('\x1b[31m', 'Error while starting server & database..\n', '\x1b[0m', err);
    }
})));
exports.server = server;
// Handle SIGINT signal to gracefully shut down the server and database
// eslint-disable-next-line @typescript-eslint/no-misused-promises
process.on('SIGINT', () => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`Received SIGINT signal from ${process.pid}`);
    // close http server
    const closeServer = new Promise((resolve, reject) => {
        server.close(err => {
            if (err) {
                reject(err);
            }
            else {
                resolve();
            }
        });
    });
    try {
        // end http server
        yield closeServer;
        console.log('Http server closed');
        // end db server
        // await db.end()
        // console.log('DB server closed')
        // Exit the process with a success code
        process.exit(0);
    }
    catch (err) {
        console.error('Error while closing the database connection:', err);
        // Exit the process with an error code
        process.exit(1);
    }
}));
process.on('uncaughtException', err => {
    console.error('Uncaught Exception:', err);
});
