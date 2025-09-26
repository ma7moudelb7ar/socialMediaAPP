import {sendEmail } from "../../service/sendEmail"
import { emailTemplate } from "../../service/EmailTemplate"
import { eventEmitter } from "./eventEmitter"





eventEmitter.on("confirmEmail" , async (data : any) => { 

    const {email ,otp}  = data

        await sendEmail({to : email , subject :"confirmEmail" , html : emailTemplate(otp as unknown as string , "Email confirmation")} )
})


