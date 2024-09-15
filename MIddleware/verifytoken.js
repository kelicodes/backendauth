import jwt from "jsonwebtoken"

export const verifyToken = async (req, res, next) => {
    const token = req.cookies.token;
    let JWT_SECRET = "blackwater"
    if (!token) {
        res.status(401).json({ success: false, message: "Unautorized entry no toke provided" })
    }
    try {
        const decode = jwt.verify(token,JWT_SECRET);
        req.userId= decode.userId;
        if(!decode){
            res.status(401).json({ success: false, message: "Unautorized entry invalid token provided" })
        }
        next()
      
    } catch (error) {
        console.log("Error in log in verify token middleware");
        res.status(400).json({ success: false, message: error.message })
    }
}