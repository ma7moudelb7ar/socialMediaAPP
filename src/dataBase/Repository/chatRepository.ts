import { Model } from 'mongoose';
import { dbRepository } from './db.Repository';
import { IChat } from '../../dataBase/model/chat.model';





export class chatRepository extends dbRepository <IChat>{
    constructor (protected readonly model : Model <IChat>) {
        super(model)
    }
}