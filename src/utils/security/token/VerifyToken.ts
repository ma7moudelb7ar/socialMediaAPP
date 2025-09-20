
import jwt, { JwtPayload } from "jsonwebtoken"

export const VerifyToken = async ({token , signature} :{ 
    token: string,
    signature: string
}) : Promise<JwtPayload>=> { 
    return jwt.verify(
        token, 
        signature
    ) as JwtPayload ; 
}