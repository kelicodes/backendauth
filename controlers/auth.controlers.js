import { User } from "../models/user.model.js";
import { generateTokenAndSetCookie } from "../utils/generatetoken.js";
import { sendVerificationEmail } from "../mailtrap/emails.js"
import { sendwelcomeemail, sendPasswordResetEmail,sendResetSuccessfullEmail } from "../mailtrap/emails.js";
import bcrypt from 'bcryptjs'
import crypto from "crypto"

export const signup = async (req, res) => {
    const { email, password, name } = req.body;
    try {
        if (!email || !password || !name) {
            throw new Error("All fields are required.");

        }

        const useralreadyexists = await User.findOne({ email })
        if (useralreadyexists) {
            return res.status(400).json({ success: false, message: "User already exists" })
        }

        const hashedpassword = await bcrypt.hash(password, 10);
        const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();

        const user = new User({
            password: hashedpassword,
            name,
            email,
            verificationToken,
            verificationTokenExpiresAt: Date.now() + 240 * 60 * 60 * 1000
        })

        await user.save();

        //JSON WEB TOKEN
        generateTokenAndSetCookie(res, user._id);


        await sendVerificationEmail(user.email, verificationToken)

        res.status(200).json({
            success: true,
            message: "user created successfully",
            user: {
                ...user._doc,
                password: undefined
            }
        })
    } catch (error) {
        res.status(400).json({ success: false, message: error.message })
    }
}

export const verifyemail = async (req, res) => {
    const { code } = req.body;
    try {
        const user = await User.findOne({
            verificationToken: code,
            verificationTokenExpiresAt: { $gt: Date.now() }
        })
        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid / expired verification code", user })
        }

        user.isverified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpiresAt = undefined;
        await user.save();


        await sendwelcomeemail(user.email, user.name)
        res.status(200).json({
            success: true, message: "email verified successfully", user: {
                ...user._doc,
                password: undefined,
            },
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Error verifying email" })
    }
}
export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(500).json({ success: false, message: "Invalid credentials" })
        }
        const ispasswordvalid = await bcrypt.compare(password, user.password);
        if (!ispasswordvalid) {
            return res.status(500).json({ success: false, message: "Invalid credentials" })
        }
        generateTokenAndSetCookie(res, user._id)

        user.lastlogin = new Date();
        await user.save();
        res.json({
            success: true,
            message: "User loged in successfully",
            user: {
                ...user._doc,
                password: undefined,
            },
        })
    } catch (error) {
        console.log("Error in log in fuction");
        res.status(400).json({ success: false, message: error.message })

    }
}

export const logout = async (req, res) => {
    res.clearCookie("token")
    res.status(200).json({ success: true, message: "Looged out successfully" })
}

export const forgotpassword = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({ success: true, message: "Invalid mail" })
        }
        //generate token
        const resetToken = crypto.randomBytes(20).toString('hex')
        const resetTokenExpiresAt = Date.now() + 24 * 60 * 60 * 1000;//1 hour
        user.resetPasswordToken = resetToken
        user.resetPasswordExpiresAt = resetTokenExpiresAt

        await user.save();

        //send password reset email
        let CLIENT_URL= "https://localhost:5173"
        await sendPasswordResetEmail(email, `${CLIENT_URL}/reset-password/${resetToken}`);
        res.status(200).json({ success: true, messsage: "Password reset link successfully send" })

    } catch (error) {
        console.log("Error in log in fuction");
        res.status(400).json({ success: false, message: error.message })
    }

}

export const resetpassword= async(req,res)=>{
    try {
        const {token} = req.params;
        const {password} = req.body;
        const user = await User.findOne({
            resetPasswordToken:token,
            resetPasswordExpiresAt: { $gt: Date.now() }
        });

        if(!user){
            return res.status(400).json({success:false,message:"Invalid token"})
        }

        //u[pdate password
        const hashedpassword = await bcrypt.hash(password,10)
        user.password = hashedpassword;
        user.resetPasswordExpiresAt= undefined;
        user.resetPasswordToken =undefined;
        await user.save()

        await sendResetSuccessfullEmail(user.email);

        res.status(200).json({success:true,message:"Passowrd reset successfully"})    }
         catch (error) {
            console.log("Error in password reset fuction");
            res.status(400).json({ success: false, message: error.message })
    }
}

export const checkauth = async(req,res)=>{
    try {
        const user = await User.findById(req.userId).select("-password")
        if(!user){
            return res.status(200).json({success:false,message:"User not found"})
        }

        res.status(200).json({success:true,user})
    } catch (error) {
        console.log("Error in check aut");
        res.status(400).json({ success: false, message: error.message })
    }
}
