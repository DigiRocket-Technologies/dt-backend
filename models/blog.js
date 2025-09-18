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
    type: String, // stores HTML content
    required: true,
  },
  thumbnail: {
    type: String, // Cloudinary image URL
  },
  metaDescription: {
    type: String,
  },
  scripts: {
    type: [String], // array of script URLs or inline script strings
    default: [],
  },
  live:{
    type:Boolean,
    default:false
  }
}, { timestamps: true }); // adds createdAt and updatedAt automatically

const Blog = mongoose.model('Blog', blogSchema);

export default Blog