import { GetObjectCommand } from "@aws-sdk/client-s3"
import { s3Client } from "./Client"


export const getFile = async ({ 
        Bucket = process.env.AWS_BUCKET!,
        Key,
} : { 
        Bucket? : string,
        Key :string,
})=> { 

    const command =  new GetObjectCommand({
        Bucket : process.env.AWS_BUCKET!,
        Key,
    })

    return await s3Client().send(command)

}