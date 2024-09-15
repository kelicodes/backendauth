import express from 'express'
import { login, logout, signup, verifyemail,forgotpassword,resetpassword,checkauth} from '../controlers/auth.controlers.js';
import { verifyToken } from '../MIddleware/verifytoken.js';

const router = express.Router();

router.get("/checkauth",verifyToken, checkauth)

router.post('/signup', signup )
router.post('/login', login )
router.post('/logout', logout)

router.post('/verifyemail', verifyemail)
router.post('/forgot-password', forgotpassword)
router.post('/reset-password/:token', resetpassword)
export default router;