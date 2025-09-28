import { ListObjectsV2Command } from "@aws-sdk/client-s3"
import { s3Client } from "./Client"


export const listFile = async ({
    Bucket =process.env.AWS_BUCKET!,
    path ,
} :{
    Bucket: string,
    path :string ,
}) => { 

    const command = new ListObjectsV2Command({
        Bucket,
        Prefix:`${process.env.AWS_APPLICATION}/${path}`
    })
    return s3Client().send(command)
}