import { DeleteObjectsCommand } from "@aws-sdk/client-s3"
import { s3Client } from "./Client"



export const DeleteFiles =  async ({ 
        Bucket = process.env.AWS_BUCKET!,
        urls ,
        Quiet = false
} : { 
        Bucket? : string,
        urls :string[]
        Quiet?:boolean
})=> { 

    const command =  new DeleteObjectsCommand({
        Bucket,
        Delete: {
            Objects :urls.map(url => ({Key : url})),
            Quiet,
        }
    })

    return await s3Client().send(command)

}