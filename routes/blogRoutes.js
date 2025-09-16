import express from "express"
import { protectedRoute } from "../middlewares/protectedRoute.js";
import { addblog, altervisibility, deleteblog, editblogdetails, getallblogs, getallblogsadmin, getblogdetails } from "../controllers/blogControllers.js";

const router=express.Router();


router.get("/getallblogsadmin",protectedRoute,getallblogsadmin);
router.get("/getallblogs",getallblogs);
router.get("/getblogdetails/:id",getblogdetails);
router.post("/addblog",protectedRoute,addblog)
router.put("/editblogdetails",protectedRoute,editblogdetails);
router.delete("/deleteblog",protectedRoute,deleteblog);
router.put("/altervisibility",protectedRoute,altervisibility)


export default router