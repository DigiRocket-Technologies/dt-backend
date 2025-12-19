import UserModel from "../models/user";

export const addUser = async(req, res) => {
    const { firstName, lastName, email, password, gender } = req.body;

    try {
      if(!firstName || !lastName || !email || !password || !gender) {
        return res.status(400).json({success: false, message: "Please Enter All Details"});
      }
      const checkEmail = await UserModel.findOne({email});
      if(checkEmail) {
        return res.status(400).json({success: false, message: "Please Enter Valid Details"});
      }
      const user = await UserModel.create({
        firstName, lastName, email, password, gender
      })

      res.status(200).json({success: true, message: "User Added Succesful"});
    } catch(err) {
      res.status(500).json({success: false, message: err.message});
    }
}

export const getAllUser = async(req, res) => {
    try {
      const user = await UserModel.find({});
      res.status(200).json({success: true, message: "User Fetched Successful", user})
    } catch(err) {
      res.status(500).json({success: false, message: err.message});
    }
}

export const updateUserById = async(req, res) => {
    const { id } = req.params;
    const { firstName, lastName, email, password, gender } = req.body;
  
    try {
      const user = await UserModel.findOne({_id: id});
      if(!user) {
        return res.status(404).json({success: false, message:"User Not Found"});
      }

      Object.assign(user,{firstName, lastName, email, password, gender});
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