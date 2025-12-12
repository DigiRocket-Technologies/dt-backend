import express from "express";
import { addblog, altervisibility, deleteblog, editblogdetails, getallblogs, getallblogsadmin, getblogdetails } from "../controllers/blogControllers.js";

const router=express.Router();


router.get("/getallblogsadmin",getallblogsadmin); 
router.get("/getallblogs",getallblogs);
router.get("/getblogdetails/:slug",getblogdetails);
router.post("/addblog",addblog) 
router.put("/editblogdetails",editblogdetails); 
router.delete("/deleteblog",deleteblog); 
router.put("/altervisibility",altervisibility);

export default router;
