import { ObjectCannedACL } from "@aws-sdk/client-s3"
import { StorageType } from "../../common/enum"
import { uploadFile } from "./uploadFile"
import { uploadLargeFile } from "./uploadLargeFile"




export const uploadFiles = async ({
        storeType = StorageType.cloud ,
        Bucket=process.env.AWS_BUCKET!,
        path =  "general",
        ACL = "private" as ObjectCannedACL,
        files,
        useLarge = false,
} : {  
        storeType : StorageType
        Bucket?:string,
        path : string,
        ACL?: ObjectCannedACL,
        files : Express.Multer.File[],
        useLarge? : boolean
    }) => { 

        let urls : string[]= []
        if (useLarge == true) {
        urls = await Promise.all(files.map( file=> uploadLargeFile ({file , path ,ACL , Bucket,storeType})))
        }else{
        urls = await Promise.all(  files.map((file) => uploadFile({ storeType, Bucket, ACL, path, file })))
        }
    return urls
}