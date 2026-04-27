import { Router } from "express";
import { chatService } from "./chat.service";
import { authentication } from "../../middlewares/authentication";
import authorization from "../../middlewares/authorization";
import checkOwnership from "../../middlewares/checkOwnership";
import { RoleType } from "../../common";

const CS = new chatService();

const chatRouter = Router({ mergeParams: true });


chatRouter.use(authentication());

chatRouter.use(
    authorization({
        accessRole: [RoleType.user, RoleType.admin]
    })
);

chatRouter.use(checkOwnership("userId"));


chatRouter.get("/", CS.getUserChats);


chatRouter.get("/private/:receiverId", CS.getChat);


chatRouter.post("/groups", CS.createGroup);


chatRouter.get("/groups/:groupId", CS.getGroupChat);

chatRouter.post("/:chatId/seen", CS.markChatSeen);




export default chatRouter;
