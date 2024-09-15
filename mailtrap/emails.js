import { MailtrapClient } from "mailtrap"
import { mailTrapclient, sender } from "../../backend/mailtrap/mailtrap.js"
import { VERIFICATION_EMAIL_TEMPLATE,PASSWORD_RESET_REQUEST_TEMPLATE,PASSWORD_RESET_SUCCESS_TEMPLATE } from '../mailtrap/emailtemplates.js'

export const sendVerificationEmail = async (email, verificationToken) => {
    const recepient = [{ email }]

    try {
        const response = await mailTrapclient.send({
            from: sender,
            to: recepient,
            subject: "verfiy mail",
            html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationToken),
            category: "Email Veriication"
        })
        console.log("Email sent successfully", response);

    } catch (error) {
        console.error(`Error sending verifiction mail email`, error);
        throw new Error(`Error sending verifiction mail email:${error}`);

    }
}

export const sendwelcomeemail = async (email, name) => {
    const recepient = [{ email }];

    try {
        const response = await mailTrapclient.send({
            from: sender,
            to: recepient,
            template_uuid: "ebd9ce58-d6cd-41b1-8aaa-27e54448dbf8",
            template_variables:{
            company_info_name: "AUTH COMPANY",
            name: name,
        },
        });
    console.log("Email sent successfully",response);

} catch (error) {
    console.log("error sending welcome email", error);
    throw new Error(`error sending welcome email ${error}`);
}
}

export const sendPasswordResetEmail = async(email,resetURL)=>{
    const recepient = [{ email }]

    try {
        const response = await mailTrapclient.send({
            from:sender,
            to:recepient,
            subject:"PASS-WORD RESET",
            html:PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL),
            category: "password reset"
        })
    } catch (error) {
        console.log("Error sending password reset email", error);
        throw new Error(`Error sending password reset email:${error}`)
        
    }
}

export const sendResetSuccessfullEmail= async(email)=>{
    const recepient = [{ email }]
    try {
        const response = await mailTrapclient.send({
            from:sender,
            to:recepient,
            subject:"PASS-WORD RESET SUCCESSFULL",
            html:PASSWORD_RESET_SUCCESS_TEMPLATE,
            category: "password reset"
        })
    } catch (error) {
        console.log("Error sending password reset email", error);
        throw new Error(`Error sending password reset email:${error}`)
        
    }
}