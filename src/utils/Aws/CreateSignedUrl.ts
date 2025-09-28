import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import { s3Client } from "./Client"
import { PutObjectCommand } from "@aws-sdk/client-s3"
import {v4 as uuidv4} from "uuid"



export const CreateSignedUrl = async ( {
        Bucket=process.env.AWS_BUCKET!,
        path =  "general",
        ContentType  ,
        originalname,
        expiresIn =  60* 60 
} : {  
        Bucket?:string,
        path? : string,
        ContentType : string,
        originalname : string,
        expiresIn?: number
    }) =>  { 

    const Key =`${process.env.AWS_APPLICATION}/${path}/${uuidv4()}_${originalname}`
    const command =  new PutObjectCommand({
        Bucket, 
        Key , 
        ContentType,
    })

    const url = await getSignedUrl(s3Client() , command , { expiresIn })
    return {url , Key}
}