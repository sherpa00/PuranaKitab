"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RootRouter = void 0;
const express_1 = __importDefault(require("express"));
const guests_1 = require("./guests");
const customers_1 = require("./customers");
const admin_1 = require("./admin");
const router = (0, express_1.default)();
exports.RootRouter = router;
router.use('/api', guests_1.GuestRouter);
router.use('/api', customers_1.CustomerRouter);
router.use('/api', admin_1.AdminRouter);
