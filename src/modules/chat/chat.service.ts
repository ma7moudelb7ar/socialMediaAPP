import { Request, Response, NextFunction } from "express";
import { chatRepository } from "../../dataBase/Repository/chatRepository";
import { chatModel } from "../../dataBase/model/chat.model";
import { messageModel } from "../../dataBase/model/message.model";
import { AppError } from "../../utils";
import { Server, Socket } from "socket.io";
import { userRepository } from "../../dataBase/Repository/user.Repository";
import userModel from "../../dataBase/model/user.model";
import { IChat } from "../../common";
import { ProjectionType, Types } from "mongoose";
import { messageRepository } from "../../dataBase/Repository/message.repository";
import { getIo } from "../gateway/gateway";

export class chatService {

    private _chatModel = new chatRepository(chatModel);
    private _userModel = new userRepository(userModel);
    private _messageModel = new messageRepository(messageModel);

    // =====================================================
    // ======================= REST =========================
    // =====================================================

    getChat = async (req: Request, res: Response) => {
        const { userId } = req.params;
        const currentUserId = req?.user?._id;

        if (!currentUserId) {
            throw new AppError("Unauthorized", 401);
        }

        const chat = await this._chatModel.findOne(
            {
                participants: { $all: [userId, currentUserId] },
                group: false
            },
            null as unknown as ProjectionType<IChat>,
            {},
            {
                path: "participants",
                select: "FName LName ProfileImage"
            }
        );

        if (!chat) {
            return res.status(200).json({
                message: "no chat yet",
                chat: null,
                messages: []
            });
        }

        const messages = await this._messageModel.getChatMessages(chat._id.toString());

        res.status(200).json({
            message: "get chat success",
            chat,
            messages
        });
    };

    createGroup = async (req: Request, res: Response) => {
    const { groupName, participants = [] } = req.body;
    const currentUserId = req?.user?._id;

    if (!currentUserId) {
        throw new AppError("Unauthorized", 401);
    }

    if (!groupName) {
        throw new AppError("Group name is required", 400);
    }

    if (!participants.length) {
        throw new AppError("Participants required", 400);
    }

    // تأكد إن كل المشاركين موجودين
    const users = await this._userModel.find({filter : {
        _id: { $in: participants }
    }});

    if (users.length !== participants.length) {
        throw new AppError("Some users not found", 404);
    }

    const chat = await this._chatModel.create({
        group: true,
        groupName,
        participants: [...new Set([...participants, currentUserId])],
        createdBy: currentUserId,
        roomId: new Types.ObjectId().toString()
    });

    res.status(201).json({
        message: "Group created successfully",
        chat
    });
};

getGroupChat = async (req: Request, res: Response) => {
    const { groupId } = req.params;
    const currentUserId = req?.user?._id;

    if (!currentUserId) {
        throw new AppError("Unauthorized", 401);
    }

    if (!groupId) {
        throw new AppError("Group ID is required", 400);
    }
    const chat = await this._chatModel.findById(
        groupId,
        null as unknown as ProjectionType<IChat>,
        {
            path: "participants",
            select: "FName LName ProfileImage"
        }
    );

    if (!chat || !chat.group) {
        throw new AppError("Group not found", 404);
    }

    // تحقق من العضوية
    const isMember = chat.participants.some(
        (p: any) => p._id.toString() === currentUserId.toString()
    );

    if (!isMember) {
        throw new AppError("Access denied", 403);
    }

    const messages = await this._messageModel.getChatMessages(
        groupId.toString()
    );

    res.status(200).json({
        message: "Group chat",
        chat,
        messages
    });
};
getUserChats = async (req: Request, res: Response) => {
    const currentUserId = req?.user?._id;

    if (!currentUserId) {
        throw new AppError("Unauthorized", 401);
    }

    const chats = await this._chatModel.find({filter : {
        participants: currentUserId
    }});

    res.status(200).json({
        message: "User chats",
        chats
    });
};

markChatSeen = async (req: Request, res: Response) => {
    const userId = req.user?._id;
    const { chatId } = req.params;

    if (!userId) throw new AppError("Unauthorized", 401);

    await this.markAsSeen(userId.toString(), chatId as string);

    // ================= الحل هنا =================
    const io = getIo();

    io.to(chatId as string).emit("message:seen", {
        chatId,
        userId
    });

    res.json({ message: "seen updated" });
};



    // =====================================================
    // ===================== SOCKET =========================
    // =====================================================

    // -------- Check membership (مطلوبة للـ Events)
    isUserInChat = async (userId: string, chatId: string) => {
        const chat = await this._chatModel.findOne({
            _id: chatId,
            participants: userId
        });

        return !!chat;
    };

    // -------- Send Message (Private + Group)
    sendMessage = async (socket: Socket, io: Server, data: any) => {

        const { chatId, content, attachments = [], sendTo } = data;
        const userId = socket.data.user?._id;

        if (!userId) {
            throw new AppError("Unauthorized", 401);
        }

        let chat;

        // ================= Private Chat =================
        if (!chatId && sendTo) {

            const receiver = await this._userModel.findOne({ _id: sendTo });
            if (!receiver) {
                throw new AppError("Receiver not found", 404);
            }

            chat = await this._chatModel.findOne({
                participants: { $all: [sendTo, userId] },
                group: false
            });

            if (!chat) {
                chat = await this._chatModel.create({
                    participants: [sendTo, userId],
                    group: false,
                    createdBy: userId
                });
            }
        }

        // ================= Existing Chat (Group or Private) =================
        if (chatId) {
            chat = await this._chatModel.findById(chatId);

            if (!chat) {
                throw new AppError("Chat not found", 404);
            }

            const isMember = chat.participants.some(
                (p: any) => p.toString() === userId.toString()
            );

            if (!isMember) {
                throw new AppError("Access denied", 403);
            }
        }

        if (!chat) {
            throw new AppError("Chat not found", 404);
        }

        // ================= Create Message =================
        const message = await this._messageModel.create({
            chatId: chat._id,
            content,
            attachments,
            createdBy: userId,
            seenBy: [userId]
        });

        const populatedMessage = await message.populate(
            "createdBy",
            "FName LName ProfileImage"
        );

        // ================= Update lastMessage =================
        await this._chatModel.findByIdAndUpdate(chat._id, {
            lastMessage: {
                content,
                attachments,
                createdBy: userId,
                createdAt: message.createdAt
            }
        });

        // ================= Emit to Room =================
        const payload = {
            chatId: chat._id,
            message: populatedMessage
        };

        io.to(chat._id.toString()).emit("message:new", payload);

        // ================= Update Chat List =================
        io.to(chat._id.toString()).emit("chat:updated", {
            chatId: chat._id,
            lastMessage: populatedMessage
        });

        return populatedMessage;
    };

    // -------- Seen Messages
    markAsSeen = async (userId: string, chatId: string) => {

        await messageModel.updateMany(
            {
                chatId,
                seenBy: { $ne: userId }
            },
            {
                $addToSet: { seenBy: userId }
            }
        );

        return true;
    };
}
