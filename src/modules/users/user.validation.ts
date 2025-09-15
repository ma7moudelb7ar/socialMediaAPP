import z, { number } from 'zod';
import { GenderType } from '../../common/enum/enumGender';

export const SignUpSchema = {
        body : z.object({
            UserName : z.string().min(2).max(20),
            email : z.email(),
            password : z.string().regex( /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/),
            confirmPassword : z.string(),
            age : z.number().min(18).max(60),
            phone: z.string(),
            gender: z.enum([GenderType.male , GenderType.female])
        }).required().refine((data)=> { 
            return data.password === data.confirmPassword
        },{
        message: "Passwords don't match",
        path: ["confirm"], 
        })
}



export type signUpSchemaType  = z.infer<typeof SignUpSchema.body>