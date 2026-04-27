import { Model } from 'mongoose';
import { dbRepository } from './db.Repository';
import { IFriend } from '../../common';





export class FriendRepository extends dbRepository <IFriend>{
    constructor (protected readonly model : Model <IFriend>) {
        super(model)
    }
}