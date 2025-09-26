import { Upload } from "@aws-sdk/lib-storage"
import { s3Client } from "./Client"
import { StorageType } from "../../common/enum"
import { ObjectCannedACL } from "@aws-sdk/client-s3"
import { uuidv4 } from "zod"
import { createReadStream } from 'node:fs';
import { AppError } from "../security"



export const  uploadLargeFile = async ({
        storeType = StorageType.cloud ,
        Bucket=process.env.AWS_BUCKET!,
        path =  "general",
        ACL = "private" as ObjectCannedACL,
        file
} : {  
        storeType : StorageType
        Bucket?:string,
        path : string,
        ACL?: ObjectCannedACL,
        file : Express.Multer.File
    }) => { 

    const  uploadLargeFile = new Upload({
        client: s3Client() , 
        params:{
        Bucket,
        Key : `${process.env.AWS_APPLICATION}/${path}/${uuidv4()}_${file.originalname}`,
        ACL,
        Body :storeType ===StorageType.cloud ? file.buffer :createReadStream(file.path),
        ContentType : file.mimetype,
        }
    })

    const {Key} = await uploadLargeFile.done()
        if (!Key) {
            throw new AppError("Failed to uploadLargeFile to aws " ,500);
        }
        return Key
}