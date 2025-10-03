import {sendEmail } from "../../service/sendEmail"
import { emailTemplate } from "../../service/EmailTemplate"
import { eventEmitter } from "./eventEmitter"



eventEmitter.on("TwoFAEnable" , async (data : any) => { 

    const {email ,otp}  = data

        await sendEmail({to : email , subject :"TwoFAEnable" , html : emailTemplate(otp as unknown as string , "TwoFAEnable")} )
})
