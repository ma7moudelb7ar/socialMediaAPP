import { DeleteObjectCommand } from "@aws-sdk/client-s3"
import { s3Client } from "./Client"



export const DeleteFile =  async ({ 
        Bucket = process.env.AWS_BUCKET!,
        Key,
} : { 
        Bucket? : string,
        Key :string,
})=> { 

    const command =  new DeleteObjectCommand({
        Bucket,
        Key,
    })

    return await s3Client().send(command)

}