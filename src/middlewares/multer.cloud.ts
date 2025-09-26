import { Request } from "express"
import multer, { FileFilterCallback } from "multer"
import { AppError } from './../utils/security/error/classError';
import os from "node:os"
import { v4 as uuidv4} from "uuid"
import { StorageType } from "../common/enum/StorageType";

export const FileValidation = {
    image:['application/octet-stream' ,'image/jpeg','/png','image/jpg','image/gif','image/webp' , "image/x-icon" , "image/bmp"],
    pdf:['application/pdf' , "application/x-pdf"  , "application/pdf"  ],
    video : ["video/mp4" , "video/quicktime"]
} 

export const multerCloud = ({
    FileTypes = FileValidation.image ,
    storeType = StorageType.cloud,
    maxSize = 5
}:{
    FileTypes?:string[]
    storeType? :StorageType
    maxSize? : number
}) => { 

    const storage = storeType == StorageType.cloud ? multer.memoryStorage() : multer.diskStorage ({
        destination:os.tmpdir(),
        filename :(req : Request , file: Express.Multer.File, cb ) => { 
            cb(null ,  `${uuidv4}_${file.originalname}` )
        }
    })

    const fileFilter = (req : Request , file: Express.Multer.File, cb :FileFilterCallback) => { 
        if (FileTypes.includes(file.mimetype)) {
            cb(null ,  true )
        }else{
            return  cb(new AppError("invalid file Type" , 400))
    }
    }

    const upload = multer({storage , limits : { fileSize : 1024 * 1024 * maxSize },fileFilter})
    return upload
}

