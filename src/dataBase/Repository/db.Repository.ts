import { DeleteResult, ProjectionType, QueryOptions, Types, UpdateQuery, UpdateWriteOpResult } from "mongoose";
import { RootFilterQuery } from "mongoose";
import { HydratedDocument, Model } from "mongoose";



export abstract class dbRepository <TDocument>{

    constructor (protected readonly model : Model <TDocument>) { }

    async create (data : Partial <TDocument> ) : Promise<HydratedDocument<TDocument>> { 
        return await this.model.create(data)
    }

    async findOne (filter : RootFilterQuery <TDocument> ,select? : ProjectionType<TDocument> ) :
    Promise<HydratedDocument<TDocument> |null > { 
        return  this.model.findOne(filter,select)
    }
    async find (filter : RootFilterQuery <TDocument> ,select? : ProjectionType<TDocument> ,
        options?: QueryOptions<TDocument>
     ) :
    Promise<HydratedDocument<TDocument> []> { 
        return  this.model.find(filter,select , options)
    }

async findById(id : string | Types.ObjectId , select?: ProjectionType<TDocument>):
    Promise<HydratedDocument<TDocument> | null> {
        return this.model.findById(id, select);
}

    async updateOne (filter : RootFilterQuery <TDocument> ,update : UpdateQuery<TDocument> ) :
    Promise<UpdateWriteOpResult> { 
        return await this.model.updateOne(filter,update)
    }

    async findOneAndUpdate (filter : RootFilterQuery <TDocument> ,update : UpdateQuery<TDocument> ,options : QueryOptions<TDocument> | null = {new : true}  ) :
    Promise<HydratedDocument<TDocument> |null >  { 
        return  await this.model.findOneAndUpdate(filter,update , options)
    }

    async findByIdAndUpdate (id : string | Types.ObjectId ,update : UpdateQuery<TDocument> ,options : QueryOptions<TDocument>  = {new : true}  ) :
    Promise<HydratedDocument<TDocument> |null >  { 
        return   this.model.findByIdAndUpdate(id,update , options)
    }

    async deleteOne (filter : RootFilterQuery <TDocument>  ) :
    Promise<DeleteResult> { 
        return await this.model.deleteOne(filter)
    }
}