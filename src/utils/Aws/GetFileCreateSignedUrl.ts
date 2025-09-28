import { GetObjectCommand } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import { s3Client } from "./Client"


export const GetFileCreateSignedUrl = async ( {
        Bucket=process.env.AWS_BUCKET!,
        expiresIn =   60 ,
        Key,
        DownloadName
} : {  
        Bucket?:string,
        Key : string,
        expiresIn?: number,
        DownloadName: string
    }) =>  { 

    const command =  new GetObjectCommand({
        Bucket, 
        Key , 
        ResponseContentDisposition:  `attachment; filename="${DownloadName || Key.split("/").pop()}"`
    })

    const url = await getSignedUrl(s3Client() , command , { expiresIn })
    return url
}