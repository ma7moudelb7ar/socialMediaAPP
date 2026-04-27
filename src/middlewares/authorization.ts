import { RoleType } from "../common"
import { NextFunction, Request, Response } from "express"



const authorization = ({accessRole = []}: {accessRole: RoleType[]}) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        if (!accessRole.includes(req.user?.role!)) {
            return res.status(403).json({ message: "Forbidden" });
        }
        next();
    }
}

export default authorization

