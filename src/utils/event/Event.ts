import {EventEmitter} from "events"
import {sendEmail } from "../../service/sendEmail"
import { emailTemplate } from "../../service/EmailTemplate"


export const eventEmitter = new EventEmitter()



eventEmitter.on("confirmEmail" , async (data : any) => { 

    const {email ,otp}  = data

        await sendEmail({to : email , subject :"confirmEmail" , html : emailTemplate(otp as unknown as string , "Email confirmation")} )
})

eventEmitter.on("ForgetPassword" , async (data : any) => { 

    const {email ,otp}  = data

        await sendEmail({to : email , subject :"ForgetPassword" , html : emailTemplate(otp as unknown as string , "ForgetPassword")} )
})
