import express from "express";
import { addblog, altervisibility, deleteblog, editblogdetails, getallblogs, getallblogsadmin, getblogdetails, getallblogsadminSearch } from "../controllers/blogControllers.js";
import { getallblogs, getblogdetails } from "../controllers/blogControllers.js";
const router=express.Router();


router.get("/getallblogsadmin/:ToggleValue/:pageNo/:sortNo",getallblogsadmin); 
router.get("/getallblogsadminSearch", getallblogsadminSearch);
router.get("/getallblogs/:pageNo",getallblogs);
router.get("/getblogdetails/:slug",getblogdetails);
router.post("/addblog",addblog) 
router.put("/editblogdetails",editblogdetails); 
router.delete("/deleteblog",deleteblog); 
router.put("/altervisibility",altervisibility);

export default router;
