import  { Types } from "mongoose";
import z from "zod";

export const generalRules = {
    id : z.string().refine((data) => {
        return Types.ObjectId.isValid(data);
        }, {
        message: "duplicated tags"
        }),
    email: z.email(),
    password:  z.string().regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/),
    file: z.object({
    size: z.number(),
        path: z.string().optional(),
        filename: z.string(),
        destination: z.string(),
        mimetype: z.string(),
        encoding: z.string(),
        originalname: z.string(),
        fieldname: z.string(),
        buffer:z.any().optional()
    })
};