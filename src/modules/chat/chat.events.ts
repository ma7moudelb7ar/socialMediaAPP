import { Server, Socket } from "socket.io";
import { chatService } from "./chat.service";
import { ISendMessageData } from "../../common";

export class ChatEvents {
    private _chatService: chatService;

    constructor() {
        this._chatService = new chatService();
    }

    chatJoin(socket: Socket) {
        socket.on("chat:join", async ({ chatId }) => {
            try {
                if (!chatId) return;

                const isMember = await this._chatService.isUserInChat(
                    socket.data.user._id,
                    chatId
                );

                if (!isMember) {
                    return socket.emit("error", {
                        message: "Access denied to this chat"
                    });
                }

                socket.join(chatId);

                console.log(
                    `User ${socket.data.user._id} joined chat ${chatId}`
                );
            } catch (error: any) {
                socket.emit("error", {
                    message: error.message
                });
            }
        });
    }

    sendMessage(socket: Socket, io: Server) {
        socket.on(
            "message:send",
            async (data: ISendMessageData, callback?: Function) => {
                try {
                    const message = await this._chatService.sendMessage(
                        socket,
                        io,
                        data
                    );

                    // Acknowledgement للفرونت
                    if (callback) {
                        callback({
                            success: true,
                            message
                        });
                    }
                } catch (error: any) {
                    console.error("message:send error:", error.message);

                    if (callback) {
                        callback({
                            success: false,
                            message: error.message
                        });
                    } else {
                        socket.emit("error", {
                            message: error.message
                        });
                    }
                }
            }
        );
    }

    // ================= Message Seen =================
    messageSeen(socket: Socket, io: Server) {
        socket.on("message:seen", async ({ chatId }) => {
            try {
                if (!chatId) return;

                const userId = socket.data.user._id;

                await this._chatService.markAsSeen(userId, chatId);

                // إشعار باقي المشاركين
                socket.to(chatId).emit("message:seen", {
                    chatId,
                    userId
                });
            } catch (error: any) {
                socket.emit("error", {
                    message: error.message
                });
            }
        });
    }

    // ================= Register All Events =================
    register(socket: Socket, io: Server) {
        this.chatJoin(socket);
        this.sendMessage(socket, io);
        this.messageSeen(socket, io);
    }
}
