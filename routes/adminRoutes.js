import express from "express";
import { addAdmin, getAllAdmin, getAdminById, updateAdminById, deleteAdmin } from "../controllers/adminControllers.js";

const router = express.Router();

router.post("/addAdmin", addAdmin);
router.get("/getAllAdmin", getAllAdmin);
router.get("/getAdminById/:id", getAdminById);
router.put("/updateAdmin/:id", updateAdminById);
router.delete("/deleteAdmin/:id", deleteAdmin);

export default router;
