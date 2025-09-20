import { ProjectionType, UpdateQuery, UpdateWriteOpResult } from "mongoose";
import { RootFilterQuery } from "mongoose";
import { HydratedDocument, Model } from "mongoose";



export abstract class dbRepository <TDocument>{

    constructor (protected readonly model : Model <TDocument>) { }

    async create (data : Partial <TDocument> ) : Promise<HydratedDocument<TDocument>> { 
        return this.model.create(data)
    }

    async findOne (filter : RootFilterQuery <TDocument> ,select? : ProjectionType<TDocument> ) :
    Promise<HydratedDocument<TDocument> |null > { 
        return this.model.findOne(filter,select)
    }
    async updateOne (filter : RootFilterQuery <TDocument> ,update : UpdateQuery<TDocument> ) :
    Promise<UpdateWriteOpResult> { 
        return this.model.updateOne(filter,update)
    }

}