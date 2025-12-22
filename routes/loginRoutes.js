import express from "express";
import { login, verifyAuth } from "../controllers/loginControllers.js";
const router = express.Router();

router.post('/login', login);
router.get('/verifyAuth', verifyAuth);

export default router;