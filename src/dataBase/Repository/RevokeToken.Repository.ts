
import { Model } from 'mongoose';
import { dbRepository } from './db.Repository';
import { IRevokeToken } from '../../common/interface/interfaceRevokeToken';



export class revokeTokenRepository extends dbRepository <IRevokeToken>{
    constructor (protected readonly model : Model <IRevokeToken>) {
        super(model)
    }
}