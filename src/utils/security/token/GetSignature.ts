import { TokenType } from "../../../common/enum/TokenType"


    export const GetSignature = async ( tokenType :TokenType ,  prefix : string) => { 
        if (tokenType==TokenType.access) {
    if (prefix == process.env.BEARER_USER) {
        return process.env.SIGNATURE_USER_TOKEN
    }
    else if (prefix == process.env.BEARER_ADMIN) {
        return process.env.SIGNATURE_ADMIN_TOKEN
    }
    else {
        return null
    }
        }
        if (tokenType==TokenType.refresh) {
    if (prefix == process.env.BEARER_USER) {
        return process.env.REFRESH_SIGNATURE_USER_TOKEN
    }
    else if (prefix == process.env.BEARER_ADMIN) {
        return process.env.REFRESH_SIGNATURE_ADMIN_TOKEN
    }
    else {
        return null
    }
        }
        return null
    }
