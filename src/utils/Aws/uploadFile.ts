import { ObjectCannedACL, PutObjectCommand } from "@aws-sdk/client-s3"
import {v4 as uuidv4} from "uuid"
import { StorageType } from "../../common/enum/StorageType"
import { s3Client } from "./Client"
import { AppError } from "../security/error/classError"
import { createReadStream } from 'node:fs';

export const uploadFile = async ({
        storeType = StorageType.cloud ,
        Bucket=process.env.AWS_BUCKET!,
        path =  "general",
        ACL = "private" as ObjectCannedACL,
        file
} : {  
        storeType? : StorageType
        Bucket?:string,
        path : string,
        ACL?: ObjectCannedACL,
        file : Express.Multer.File
    }) : Promise<string> => { 
    const commend = new PutObjectCommand ({
        Bucket,
        Key : `${process.env.AWS_APPLICATION}/${path}/${uuidv4()}_${file.originalname}`,
        ACL,
        // Body : file.buffer,
        Body :storeType ===StorageType.cloud ? file.buffer :createReadStream(file.path),
        ContentType : file.mimetype,
    })
    await s3Client().send(commend)
    if (!commend.input.Key) {
        throw new AppError("Failed to Upload File to aws " ,500);
    }
    return commend.input.Key
}