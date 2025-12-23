import UserModel from "../models/user.js";
import bcrypt from 'bcrypt';

export const addUser = async(req, res) => {
    const { firstName, lastName, email, password, gender, createdBy } = req.body;

    try {
      if(!firstName || !lastName || !email || !password || !gender) {
        return res.status(400).json({success: false, message: "Please Enter All Details"});
      }
      const checkEmail = await UserModel.findOne({email});
      if(checkEmail) {
        return res.status(400).json({success: false, message: "Please Enter Valid Details"});
      }

      const emailTrimmed = email.trim().toLowerCase();
      const hashPassword = await bcrypt.hash(password.trim(), 10);
      const user = await UserModel.create({
        firstName, lastName, email:emailTrimmed, password: hashPassword, gender, createdBy
      })

      res.status(200).json({success: true, message: "User Added Succesful"});
    } catch(err) {
      res.status(500).json({success: false, message: err.message});
    }
}

export const getAllUser = async (req, res) => {
  try {
    const { pageNo } = req.params;
    const limit = 6;
    const skip = (pageNo - 1) * limit;

    const total = await UserModel.countDocuments({})
    const users = await UserModel.find({}).skip(skip).limit(limit);

    res.status(200).json({
      success: true,
      message: "Users fetched successfully",
      users,
      noOfPage: Math.ceil(total / limit),
      currentPage: pageNo
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getAllUserSearch = async (req, res) => {
  try {
    const user = await UserModel.find({});
    if(!user) {
      return res.status(404).json({success: false, message: "User not Found"});
    }
    res.status(200).json({success: true, message:"successful", user});
  } catch(err) {
    res.status(500).json({success:false, message: err.message});
  }
}

export const updateUserById = async(req, res) => {
    const { id } = req.params;
    const { firstName, lastName, email, gender } = req.body;
  
    try {
      const user = await UserModel.findOne({_id: id});
      if(!user) {
        return res.status(404).json({success: false, message:"User Not Found"});
      }

      Object.assign(user,{firstName, lastName, email, gender});
      await user.save();

      res.status(200).json({success: true, message: "User Updated successfully"})
    } catch(err) {
        res.status(500).json({success: false, message: err.message})
    }
}

export const deleteUser = async(req, res) => {
    const { id } = req.params;

    try {
      const fUser = await UserModel.findOne({_id: id});
      if(!fUser) {
        return res.status(404).json({success: false, message: "User Not Found"});
      }

      const user = await UserModel.deleteOne({_id: id});
      res.status(200).json({success: true, message: "User Deleted Successfully"});

    } catch(err) {
      res.status(500).json({success: false, message: err.message});
    }
}

export const getUserById = async(req, res) => {
    const { id } = req.params;
    
    try {
      const user = await UserModel.findOne({_id: id});
      if(!user) {
        return res.status(404).json({success: false, message: "User Not Found"});
      }

      res.status(200).json({success: true, user});
    } catch(err) {
        res.status(500).json({success: false, message: err.message});
   }
}