import type { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import CustomError from "../utils/custom-error";
import type { ServiceResponse } from "../types";
import { ResetPassword } from "../services/reset-password.service";
import { StatusCodes } from "http-status-codes";

// contorller for resetting password
const ResetPasswordOne = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        // validation error
        const ValidationError = validationResult(req)
        if (!ValidationError.isEmpty()) {
            const error = new CustomError('Invalidation Error', 403)
            throw error
        }

        // req params for reset token  
        const resetToken: string = req.params.token
        // req body for new password
        const newPassword: string = req.body.password

        // call reset password service
        const resetPasswordStatus: ServiceResponse = await ResetPassword(resetToken, newPassword)

        if (!resetPasswordStatus.success) {
            res.status(StatusCodes.BAD_REQUEST).json({
                ...resetPasswordStatus
            })
        }

        res.status(StatusCodes.OK).json({
            ...resetPasswordStatus
        })
    } catch (err) {
        next(err)
    }
}

export {ResetPasswordOne}