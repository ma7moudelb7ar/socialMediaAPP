import { Server, Socket } from "socket.io";
import { Server as httpServer } from "http";
import { AppError, DecodedTokenAndFetchUser, GetSignature } from "../../utils";
import { TokenType } from "../../common";
import { ChatGateway } from "../chat/chat.gateway";

export const connectionSocket = new Map<string, string[]>();

let io: Server | null = null;

export const initializeIo = (server: httpServer) => {

    io = new Server(server, {
        cors: {
            origin: "*",
        }
    });

    // ================= Authentication Middleware =================
    io.use(async (socket: Socket, next) => {
        try {
            const { authorization } = socket.handshake.auth;

            if (!authorization) {
                return next(new AppError("Authorization header missing", 401));
            }

            const [prefix, token] = authorization.split(" ") || [];

            if (!prefix || !token) {
                return next(new AppError("Invalid prefix or token", 400));
            }

            const signature = await GetSignature(TokenType.access, prefix);

            if (!signature) {
                return next(new AppError("Invalid signature", 400));
            }

            const { decoded, user } = await DecodedTokenAndFetchUser(token, signature);

            
            if (!decoded || !user) {
                return next(new AppError("Invalid token", 401));
            }

            const userId = user._id.toString();

            const userSocketIds = connectionSocket.get(userId) || [];
            userSocketIds.push(socket.id);
            connectionSocket.set(userId, userSocketIds);

            socket.data.user = user;
            socket.data.decoded = decoded;

            getIo().emit("online_user", userId);

            return next();

        } catch (error: any) {
            return next(error);
        }
    });

    // ================= Gateways =================
    const chatGateway = new ChatGateway();

    io.on("connection", (socket: Socket) => {

        chatGateway.register(socket, getIo());

        const removeSocketId = () => {
            const userId = socket.data.user?._id?.toString();
            if (!userId) return;

            const remainingTabs =
                connectionSocket
                    .get(userId)
                    ?.filter((id) => id !== socket.id) || [];

            if (remainingTabs.length) {
                connectionSocket.set(userId, remainingTabs);
            } else {
                connectionSocket.delete(userId);

                getIo().emit("offline_user", userId);
            }
        };

        socket.on("disconnect", removeSocketId);
    });
};

// ================= Getter =================
export const getIo = () => {
    if (!io) {
        throw new AppError("IO not initialized", 500);
    }
    return io;
};
