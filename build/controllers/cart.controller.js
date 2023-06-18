'use strict'
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value)
          })
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value))
        } catch (e) {
          reject(e)
        }
      }
      function rejected(value) {
        try {
          step(generator['throw'](value))
        } catch (e) {
          reject(e)
        }
      }
      function step(result) {
        result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected)
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next())
    })
  }
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod }
  }
Object.defineProperty(exports, '__esModule', { value: true })
exports.RemoveAllOneCart =
  exports.RemoveSingleOneCart =
  exports.UpdateOneCart =
  exports.AddOneCart =
  exports.GetOneAllCart =
    void 0
const express_validator_1 = require('express-validator')
const custom_error_1 = __importDefault(require('../utils/custom-error'))
const cart_service_1 = require('../services/cart.service')
const http_status_codes_1 = require('http-status-codes')
// controller for adding cart
const GetOneAllCart = (req, res, next) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      // get the authorized user and userid
      const authenticatedUser = req.user
      const authenticatedUserId = authenticatedUser.userid
      // call the add cart service
      const getCartStatus = yield (0, cart_service_1.GetAllCart)(authenticatedUserId)
      if (!getCartStatus.success) {
        res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json(Object.assign({}, getCartStatus))
        return
      }
      res.status(http_status_codes_1.StatusCodes.OK).json(Object.assign({}, getCartStatus))
    } catch (err) {
      next(err)
    }
  })
exports.GetOneAllCart = GetOneAllCart
// controller for adding cart
const AddOneCart = (req, res, next) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      // validation error
      const cartInputErrors = (0, express_validator_1.validationResult)(req)
      if (!cartInputErrors.isEmpty()) {
        const error = new custom_error_1.default('Validation Error', 403)
        throw error
      }
      // get the authorized user and userid
      const authenticatedUser = req.user
      const authenticatedUserId = authenticatedUser.userid
      // get params
      const { quantity, bookid } = req.body
      // call the add cart service
      const addNewCartStatus = yield (0, cart_service_1.AddCart)(authenticatedUserId, bookid, quantity)
      if (!addNewCartStatus.success) {
        res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json(Object.assign({}, addNewCartStatus))
        return
      }
      res.status(http_status_codes_1.StatusCodes.OK).json(Object.assign({}, addNewCartStatus))
    } catch (err) {
      next(err)
    }
  })
exports.AddOneCart = AddOneCart
// controller for updating cart
const UpdateOneCart = (req, res, next) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      // validation error
      const cartInputErrors = (0, express_validator_1.validationResult)(req)
      if (!cartInputErrors.isEmpty()) {
        const errror = new custom_error_1.default('Validation Error', 403)
        throw errror
      }
      // get the authorized user and userid
      const authenticatedUser = req.user
      const authenticatedUserId = authenticatedUser.userid
      // req body and params
      const cartID = parseInt(req.params.cartid)
      const newBookQuantity = parseInt(req.body.quantity)
      // call updated cart service
      const updateCartStatus = yield (0, cart_service_1.UpdateCart)(authenticatedUserId, cartID, newBookQuantity)
      if (!updateCartStatus.success) {
        res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json(Object.assign({}, updateCartStatus))
        return
      }
      res.status(http_status_codes_1.StatusCodes.OK).json(Object.assign({}, updateCartStatus))
    } catch (err) {
      next(err)
    }
  })
exports.UpdateOneCart = UpdateOneCart
// controller for deleting single cart
const RemoveSingleOneCart = (req, res, next) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      // validation error
      const cartInputErrors = (0, express_validator_1.validationResult)(req)
      if (!cartInputErrors.isEmpty()) {
        const error = new custom_error_1.default('Validation Error', 403)
        throw error
      }
      // get the authorized user and userid
      const authenticatedUser = req.user
      const authenticatedUserId = authenticatedUser.userid
      // req params
      const cartID = parseInt(req.params.cartid)
      // call remove single cart service
      const removeSingleCartStatus = yield (0, cart_service_1.RemoveSingleCart)(authenticatedUserId, cartID)
      if (!removeSingleCartStatus.success) {
        res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json(Object.assign({}, removeSingleCartStatus))
        return
      }
      res.status(http_status_codes_1.StatusCodes.OK).json(Object.assign({}, removeSingleCartStatus))
    } catch (err) {
      next(err)
    }
  })
exports.RemoveSingleOneCart = RemoveSingleOneCart
// controller for deleting single cart
const RemoveAllOneCart = (req, res, next) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      // get the authorized user and userid
      const authenticatedUser = req.user
      const authenticatedUserId = authenticatedUser.userid
      // call remove single cart service
      const removeAllCartStatus = yield (0, cart_service_1.RemoveAllCart)(authenticatedUserId)
      if (!removeAllCartStatus.success) {
        res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json(Object.assign({}, removeAllCartStatus))
        return
      }
      res.status(http_status_codes_1.StatusCodes.OK).json(Object.assign({}, removeAllCartStatus))
    } catch (err) {
      next(err)
    }
  })
exports.RemoveAllOneCart = RemoveAllOneCart
