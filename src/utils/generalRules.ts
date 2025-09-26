import z from "zod";

export const generalRules = {
    id : z.string().regex(/^[0-9a-fA-F]{24}$/),
    email: z.email(),
    password: z.string().regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/),
    rePassword: z.string(),
    file: z.object({
 	size: z.number().positive(),
        path: z.string(),
        filename: z.string(),
        destination: z.string(),
        mimetype: z.string(),
        encoding: z.string(),
        originalname: z.string(),
        fieldname: z.string()
    })
};