import { DeleteResult, ProjectionType, QueryOptions, Types, UpdateQuery, UpdateWriteOpResult } from "mongoose";
import { RootFilterQuery } from "mongoose";
import { HydratedDocument, Model } from "mongoose";



export abstract class dbRepository <TDocument>{

    constructor (protected readonly model : Model <TDocument>) { }

    async create (data : Partial <TDocument> ) : Promise<HydratedDocument<TDocument>> { 
        return await this.model.create(data)
    }

    async findOne (filter : RootFilterQuery <TDocument> ,select? : ProjectionType<TDocument> , options?: QueryOptions<TDocument>) :
    Promise<HydratedDocument<TDocument> |null > { 
        return  this.model.findOne(filter,select ,options)
    }
    async find ({
        filter,
        select,
        options
    }
    :{
        filter : RootFilterQuery <TDocument> ,
        select? : ProjectionType<TDocument> ,
        options?: QueryOptions<TDocument>
    }
    ) :
    Promise<HydratedDocument<TDocument> []> { 
        return this.model.find(filter,select ,options)
    }


    async paginate ({
        filter,
        query,
        select,
        options
    }
    :{
        filter : RootFilterQuery <TDocument> ,
        query: { page : number , limit : number},
        select? : ProjectionType<TDocument> ,
        options?: QueryOptions<TDocument>
    }
    ) { 

    let {page =1, limit = 5 } = query

    if (page< 0) page = 1

      page = page * 1 || 1

    const skip =  (page - 1) * limit
    const finalOptions = { 
        ...options,
        skip ,
        limit
    }

    const count = await this.model.countDocuments({deletedAt : { $exists: false}})
    const pageOfNumber = Math.ceil(count/limit)
    const docs = await this.model.find(filter,select ,finalOptions)

        return {docs ,pageOfNumber, currentPage  : page , count}
    }

async findById(id : string | Types.ObjectId , select?: ProjectionType<TDocument>):
    Promise<HydratedDocument<TDocument> | null> {
        return await this.model.findById(id, select);
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