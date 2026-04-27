import {resolve} from "path"
import {config} from "dotenv"
config({path : resolve("./config/.env")})
import express, { Request , Response , NextFunction} from "express"
import {rateLimit} from "express-rate-limit"
import cors from "cors"
import helmet from "helmet"
import { AppError } from "./utils/security/error/classError"
import userRouter from "./modules/users/user.controller"
import { GlobalError } from './middlewares/GlobalError';
import connectionDB from "./dataBase/connectionDB"
import postRouter from "./modules/posts/post.controller"
import { initializeIo } from "./modules/gateway/gateway"
import { createHandler } from 'graphql-http/lib/use/express';
import { schemaGql } from "./modules/graphQl/schema.gql"

const app:express.Application = express()
const port : string | number = process.env.PORT || 5000
const limiter = rateLimit({
    windowMs : 5 *60*1000,
    limit: 50,
    message : {
        error :"Game Over........🤦‍♂️"
    },
    statusCode: 429,
    legacyHeaders:false
})


const bootstrap = () => { 

    app.use(express.json())
    app.use(cors())
    app.use(helmet())
    app.use(limiter)

    app.get("/" ,( req : Request, res : Response, next :NextFunction )=> {
        return res.status(200).json({message : "welcome My SocailMediaApp......✌❤"})
    })



    
    app.all('/graphql', createHandler({ schema  :schemaGql}));





    app.use("/upload", express.static("upload"));
    app.use("/users", userRouter)
    app.use("/posts", postRouter)

    app.use("{/*demo}" ,( req : Request, res : Response, next :NextFunction )=> {
        throw new AppError(` Url not found  ${req.originalUrl}` ,404 );
        
    })

    connectionDB()
    app.use(GlobalError)

    const server = app.listen(port , () => { 
        console.log(`server is ruining ${port}...✌❤ `);
        
    })

    initializeIo(server)
}


export default bootstrap