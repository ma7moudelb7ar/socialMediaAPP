import { HydratedDocument, Model } from 'mongoose';
import { dbRepository } from './db.Repository';
import { AppError } from '../../utils';
import { IPost } from '../../common';



export class postRepository extends dbRepository <IPost>{
    constructor (protected readonly model : Model <IPost>) {
        super(model)
    }
}