import { Model } from 'mongoose';
import { dbRepository } from './db.Repository';
import { IComment } from '../../common';




export class commentRepository extends dbRepository <IComment>{
    constructor (protected readonly model : Model <IComment>) {
        super(model)
    }
}