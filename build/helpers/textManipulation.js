"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.capitalize = exports.convertToAcceptableFullname = void 0;
const authors_controller_1 = require("../controllers/authors.controller");
Object.defineProperty(exports, "capitalize", { enumerable: true, get: function () { return authors_controller_1.capitalize; } });
// req.query fullname into acceptable format with Capital Firstname and Capital Lastname
const convertToAcceptableFullname = (unProcessedFullname) => {
    const arrDividedFullname = unProcessedFullname.split('_').map(data => (0, authors_controller_1.capitalize)(data));
    const processedFullname = arrDividedFullname.join(' ');
    return processedFullname;
};
exports.convertToAcceptableFullname = convertToAcceptableFullname;
