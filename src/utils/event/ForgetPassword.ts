import {sendEmail } from "../../service/sendEmail"
import { emailTemplate } from "../../service/EmailTemplate"
import { eventEmitter } from "./eventEmitter"



eventEmitter.on("ForgetPassword" , async (data : any) => { 

    const {email ,otp}  = data

        await sendEmail({to : email , subject :"ForgetPassword" , html : emailTemplate(otp as unknown as string , "ForgetPassword")} )
})
