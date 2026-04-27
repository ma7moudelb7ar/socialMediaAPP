import { Server, Socket } from "socket.io";
import { ChatEvents } from "./chat.events";

export class ChatGateway {

    private chatEvents: ChatEvents;

    constructor() {
        this.chatEvents = new ChatEvents();
    }

    register(socket: Socket, io: Server) {
        this.chatEvents.register(socket, io);
    }
}
