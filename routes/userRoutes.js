import express from "express";
import { addUser, getAllUser, updateUserById, deleteUser, getUserById } from "../controllers/userControllers.js";
const router = express.Router();

router.post("/addUser", addUser);
router.get("/getAllUser", getAllUser);
router.get("/getUserById/:id", getUserById);
router.put("/updateUser/:id", updateUserById);
router.delete("/deleteUser/:id", deleteUser);

export default router;
