
import { HydratedDocument, Model } from 'mongoose';
import { dbRepository } from './db.Repository';
import { IPost } from '../model/post.model';
import { AppError } from '../../utils';



export class postRepository extends dbRepository <IPost>{

    constructor (protected readonly model : Model <IPost>) {
        super(model)
    }
    async createOnePost (data : Partial <IPost> ) : Promise<HydratedDocument<IPost>> { 
        const post : HydratedDocument<IPost> = await  this.model.create(data)
        if (!post) {
            throw new AppError(" fail to create" , 400)
            
        }
        return post
    }
}