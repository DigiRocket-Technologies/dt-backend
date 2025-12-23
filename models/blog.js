import mongoose from "mongoose";

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  slug:{
    type:String,
    required:true,
    unique:true
  },
  h1:{
    type:String,
  },
  content: {
    type: String,
    required: true,
  },
  thumbnail: {
    type: String, 
  },
  metaDescription: {
    type: String,
  },
  scripts: {
    type: [String], 
    default: [],
  },
  live:{
    type:Boolean,
    default:false
  },
  createdBy: { type: String, default: "Admin" }
}, { timestamps: true }); 

const Blog = mongoose.model('Blog', blogSchema);

export default Blog

