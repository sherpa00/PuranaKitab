import type { Request, Response, NextFunction } from 'express'
import { validationResult } from 'express-validator'
import CustomError from '../utils/custom-error'
import { type ServiceResponse } from '../types'
import { ConfirmOrders, type OnlineCardDetails, PlaceOrderOffline, PlaceOrderOnline, ShowMyOrders, RemoveOrder } from '../services/orders.service'
import { StatusCodes } from 'http-status-codes'
import logger from '../utils/logger.utils'

// controller for place order offline
const PlaceOrderOfflineOne =async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        // validation error
        const validationErrors = validationResult(req)
        if (!validationErrors.isEmpty()) {
            const error = new CustomError('Validation Error', 403)
            throw error
        }

        // req body
        // eslint-disable-next-line @typescript-eslint/naming-convention
        const {carts,phone_number} = req.body

        // params for place order service
        const authenticatedUser: any = req.user
        const authenticatedUserId: number = authenticatedUser.userid

        // call place order service
        const placeOrderStatus: ServiceResponse = await PlaceOrderOffline(carts,authenticatedUserId,phone_number)

        if (!placeOrderStatus.success) {
            res.status(StatusCodes.BAD_REQUEST).json({
                ...placeOrderStatus
            })
            return
        }

        res.status(StatusCodes.OK).json({
            ...placeOrderStatus
        })
    } catch (err) {
        next(err)
    }
}

// controller for place order online
const PlaceOrderOnlineOne =async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        // validation error
        const validationErrors = validationResult(req)
        if (!validationErrors.isEmpty()) {
            const error = new CustomError('Validation Error', 403)
            logger.info(validationErrors.array())
            throw error
        }

        // req body
        // eslint-disable-next-line @typescript-eslint/naming-convention
        const {carts,phone_number} = req.body
        const cardDetails: OnlineCardDetails = {
            cardNumber: req.body.card_details.creditCard,
            expiryMonth: req.body.card_details.expMonth,
            expiryYear: req.body.card_details.expYear,
            cardCVC: req.body.card_details.cvc
        }

        // params for place order service
        const authenticatedUser: any = req.user
        const authenticatedUserId: number = authenticatedUser.userid
        const authenticatedUserEmail: string = authenticatedUser.email

        // call place order service
        const placeOrderStatus: ServiceResponse = await PlaceOrderOnline(carts,authenticatedUserId,phone_number,authenticatedUserEmail,cardDetails)

        if (!placeOrderStatus.success) {
            res.status(StatusCodes.BAD_REQUEST).json({
                ...placeOrderStatus
            })
            return
        }

        res.status(StatusCodes.OK).json({
            ...placeOrderStatus
        })
    } catch (err) {
        next(err)
    }
}

// controller for showing orders
const ShowMyOrdersOne = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        // authenticated user
        const authenticatedUser: any = req.user
        const authenticatedUserId: number = authenticatedUser.userid

        // call show my orders service
        const showMyOrdersStatus: ServiceResponse = await ShowMyOrders(authenticatedUserId)

        if (!showMyOrdersStatus.success) {
            res.status(StatusCodes.BAD_REQUEST).json({
                ...showMyOrdersStatus
            })
            return
        }

        res.status(StatusCodes.OK).json({
            ...showMyOrdersStatus
        })
    } catch (err) {
        next(err)
    }
}

// controller for confirming orders
const ConfirmOrdersOne = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {

        // req params 
        const orderid: number = parseInt(req.params.orderid)

        // call confirm orders service
        const confirmOrdersStatus: ServiceResponse = await ConfirmOrders(orderid)

        if (!confirmOrdersStatus.success) {
            res.status(StatusCodes.BAD_REQUEST).json({
                ...confirmOrdersStatus
            })
            return
        }

        res.status(StatusCodes.OK).json({
            ...confirmOrdersStatus
        })
    } catch (err) {
        next(err)
    }
}

// controller for confirming orders
const RemoveOrderOne = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {

        // req params 
        const orderid: number = parseInt(req.params.orderid)

        // call remove orders service
        const removeOrderStatus: ServiceResponse = await RemoveOrder(orderid)

        if (!removeOrderStatus.success) {
            res.status(StatusCodes.BAD_REQUEST).json({
                ...removeOrderStatus
            })
            return
        }

        res.status(StatusCodes.OK).json({
            ...removeOrderStatus
        })
    } catch (err) {
        next(err)
    }
}

export {PlaceOrderOfflineOne, PlaceOrderOnlineOne, ShowMyOrdersOne, ConfirmOrdersOne, RemoveOrderOne}