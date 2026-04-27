import * as z from "zod";


    export const createChatSchema = z.object({
        participants : z.array(z.string())
        .refine((data) => {
            return new Set(data).size === data?.length;
        }, {
            message: "duplicated participants"
        })
    })




