
import { Model } from 'mongoose';
import { IUser } from './../../common/interface/interfaceUser';
import { HydratedDocument } from 'mongoose';
import { dbRepository } from './db.Repository';
import { AppError } from '../../utils/security/error/classError';



export class userRepository extends dbRepository <IUser>{

    constructor (protected readonly model : Model <IUser>) {
        super(model)
    }

    async createOneUser (data : Partial <IUser> ) : Promise<HydratedDocument<IUser>> { 
        const user : HydratedDocument<IUser> = await  this.model.create(data)
        if (!user) {
            throw new AppError(" fail to create" , 400)
            
        }
        return user
    }
}