import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils";
import { RoleType } from "../common";

const checkOwnership = (paramKey: string = "userId") => {
    return (req: Request, res: Response, next: NextFunction) => {
        const paramUserId = req.params[paramKey];
        const currentUserId = req.user?._id?.toString();

        if (!req.user) {
            return next(new AppError("Unauthorized", 401));
        }

        // الأدمن مسموح له بكل شيء
        if (req.user.role === RoleType.admin) {
            return next();
        }

        if (!paramUserId) {
            return next(new AppError(`Missing param: ${paramKey}`, 400));
        }

        if (paramUserId !== currentUserId) {
            return next(
                new AppError(
                    "Forbidden: You cannot access another user's data",
                    403
                )
            );
        }

        next();
    };
};

export default checkOwnership;
