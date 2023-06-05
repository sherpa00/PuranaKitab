import type { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import CustomError from "../utils/custom-error";
import { AddCart, type CartInfoResponse } from "../services/cart.service";
import { StatusCodes } from "http-status-codes";

// controller for adding cart
const AddOneCart = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        // validation error
        const cartInputErrors = validationResult(req)

        if (!cartInputErrors.isEmpty()) {
            const error = new CustomError('Validation Error', 403)
            throw error
        }

        // get the authorized user and userid
        const authenticatedUser: any = req.user
        const authenticatedUserId: number = authenticatedUser.userid

        // get params
        const {quantity, bookid} = req.body

        // call the add cart service
        const addNewCartStatus: CartInfoResponse = await AddCart(authenticatedUserId, bookid, quantity)

        if (!addNewCartStatus.success) {
            res.status(StatusCodes.BAD_REQUEST).json({
                ...addNewCartStatus
            })
            return
        }

        res.status(StatusCodes.OK).json({
            ...addNewCartStatus
        })

    } catch (err) {
        next(err)
    }
}

export {AddOneCart}