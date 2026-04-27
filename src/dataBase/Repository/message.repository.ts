

import { Model } from 'mongoose';
import { dbRepository } from './db.Repository';
import { IMessage } from '../../common';




export class messageRepository extends dbRepository<IMessage> {

    async getChatMessages(chatId: string, page = 1, limit = 10) {

        const skip = (page - 1) * limit;

        const [messages, total] = await Promise.all([
            this.model
                .find({ chatId })
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .populate("createdBy", "FName LName ProfileImage"),

            this.model.countDocuments({ chatId })
        ]);

        return {
            messages,
            total,
            totalPages: Math.ceil(total / limit),
            currentPage: page
        };
    }
}
