import { compare} from "bcrypt"


export const Compare = async ( plainText : string , cipherText: string) => { 

    return compare(plainText ,cipherText )
}
