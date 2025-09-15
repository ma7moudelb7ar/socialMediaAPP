import {EventEmitter} from "events"
import { generateOtp, sendEmail } from "../../service/sendEmail"
import { emailTemplate } from "../../service/EmailTemplate"


export const eventEmitter = new EventEmitter()



eventEmitter.on("confirmEmail" , async (data : any) => { 

    const {email}  = data
        const otp = generateOtp()
        await sendEmail({to : email , subject :"confirmEmail" , html : emailTemplate(otp as unknown as string , "Email confirmation")} )
})
