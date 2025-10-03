import z from 'zod';
import { GenderType } from '../../common/enum/enumGender';
import { logDevices } from '../../common/enum/logDevices';
import { Types } from 'mongoose';


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

export const FreezeAccountSchema = {
        params : z.strictObject({
            userId :  z.string().optional()
        }).refine((value)=> { 
            return value?.userId ? Types.ObjectId.isValid(value.userId) : true 
        },{
        message: "userId is required",
        path: ["userId"], 
        })
}


export const updatePasswordSchema = {
        body : z.strictObject({
        oldPassword:z.string() ,
        newPassword : z.string().regex( /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/),
        confirmPassword:z.string()
        }).required().refine((data)=> { 
            return data.newPassword === data.confirmPassword
        },{
        message: "Passwords don't match",
        path: ["confirm"], 
        })
}
export const unFreezeAccountSchema = {
        params : z.strictObject({
            userId :  z.string().optional()
        }).refine((value)=> { 
            return value?.userId ? Types.ObjectId.isValid(value.userId) : true 
        },{
        message: "userId is required",
        path: ["userId"], 
        })
}

export const updateProfileSchema = {
  body: z.strictObject({
    FName: z.string().optional(),
    LName: z.string().optional(),
    age: z.number().optional(),
  }).superRefine((data, ctx) => {
    if (!Object.values(data).length) {
      ctx.addIssue({
        code: "custom",
        message: "FName and LName and age is empty you must fill one",
      });
    }
  }),
};

export const updateEmailSchema = {
        body : z.strictObject({
        newEmail : z.email(),
        }).required()
}
export const updateEmailConfirmSchema = {
        body : z.strictObject({
        otp : z.string().regex(/^\d{6}$/, 'OTP must be 6 digits'),
        }).required()
}
export const TwoFAEnableSchema = {
        body : z.strictObject({
        otp : z.string().regex(/^\d{6}$/, 'OTP must be 6 digits'),
        }).required()
}
export const TwoFAEnableConfirmSchema = {
        body : z.strictObject({
        otp : z.string().regex(/^\d{6}$/, 'OTP must be 6 digits'),
        }).required()
}
export const TwoFADisableSchema = {
        body : z.strictObject({
        otp : z.string().regex(/^\d{6}$/, 'OTP must be 6 digits'),
        }).required()
}

export type signUpSchemaType  = z.infer<typeof SignUpSchema.body>
export type confirmEmailSchemaType  = z.infer<typeof confirmEmailSchema.body>
export type signInSchemaType  = z.infer<typeof signInSchema.body>
export type logoutSchemaType  = z.infer<typeof logoutSchema.body>
export type loginWithGmailSchemaType  = z.infer<typeof loginWithGmailSchema.body>
export type ForgetPasswordSchemaType  = z.infer<typeof ForgetPasswordSchema.body>
export type resetPasswordSchemaType  = z.infer<typeof resetPasswordSchema.body>
export type updatePasswordSchemaType  = z.infer<typeof updatePasswordSchema.body>
export type FreezeAccountSchemaType  = z.infer<typeof FreezeAccountSchema.params>
export type unFreezeAccountSchemaType  = z.infer<typeof unFreezeAccountSchema.params>
export type updateProfileSchemaType  = z.infer<typeof updateProfileSchema.body>
export type updateEmailSchemaType  = z.infer<typeof updateEmailSchema.body>
export type updateEmailConfirmSchemaType  = z.infer<typeof updateEmailConfirmSchema.body>
