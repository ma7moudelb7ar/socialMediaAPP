import z from 'zod';
import { GenderType } from '../../common/enum/enumGender';
import { logDevices } from '../../common/enum/logDevices';


export const signInSchema = {
        body : z.object({
            email : z.email(),
            password : z.string().regex( /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/),
        }).required()
}
export const SignUpSchema = {
        body :signInSchema.body.extend({
            UserName : z.string().min(2).max(20),
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
export const loginWithGmailSchema = {
        body : z.object({
            idToken :z.string()
        }).required()
}

export const confirmEmailSchema = {
        body : z.object({
            otp : z.string().regex(/^\d{6}$/, 'OTP must be 6 digits'),
            email : z.email(),
        }).required()
}
export const logoutSchema = {
        body : z.object({
            flag :z.enum([logDevices.all ,logDevices.current])
        }).required()
}
export const ForgetPasswordSchema = {
        body : z.object({
            email : z.email(),
        }).required()
}
export const resetPasswordSchema = {
        body :signInSchema.body.extend({
            confirmPassword : z.string(),
            otp : z.string().regex(/^\d{6}$/, 'OTP must be 6 digits'),
        }).required().refine((data)=> { 
            return data.password === data.confirmPassword
        },{
        message: "Passwords don't match",
        path: ["confirm"], 
        })
}
export type signUpSchemaType  = z.infer<typeof SignUpSchema.body>
export type confirmEmailSchemaType  = z.infer<typeof confirmEmailSchema.body>
export type signInSchemaType  = z.infer<typeof signInSchema.body>
export type logoutSchemaType  = z.infer<typeof logoutSchema.body>
export type loginWithGmailSchemaType  = z.infer<typeof loginWithGmailSchema.body>
export type ForgetPasswordSchemaType  = z.infer<typeof ForgetPasswordSchema.body>
export type resetPasswordSchemaType  = z.infer<typeof resetPasswordSchema.body>