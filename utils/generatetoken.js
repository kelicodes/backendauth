import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config();
const JWT_SECRET= "blackwater"
const NODE_ENV= "development"
export const generateTokenAndSetCookie=(res,userId) =>{
    const token = jwt.sign({userId},JWT_SECRET, {
        expiresIn:"7d"
    })

    res.cookie("token", token, {
        httpOnly: true,
        secure:NODE_ENV === "production",
        sameSite: "strict",
        MaxAge: 7 *24 * 60 * 60 * 10000
    });
    return token
}