import AdminModel from "../models/admin.js";
import bcrypt from 'bcrypt';

export const addAdmin = async (req, res) => {
  const { firstName, lastName, email, password, gender } = req.body;

  try {
    if (!firstName || !lastName || !email || !password || !gender) {
      return res
        .status(400)
        .json({ success: false, message: "Please Enter All Details" });
    }

    const checkEmail = await AdminModel.findOne({ email });
    if (checkEmail) {
      return res
        .status(400)
        .json({ success: false, message: "Email already exists" });
    }

    const emailTrimmed = email.trim().toLowerCase();
    const hashPassword = await bcrypt.hash(password.trim(), 10);

    await AdminModel.create({
      firstName,
      lastName,
      email: emailTrimmed,
      password: hashPassword,
      gender,
    });

    res
      .status(201)
      .json({ success: true, message: "Admin Added Successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getAllAdmin = async (req, res) => {
  try {
    const admins = await AdminModel.find({});
    res
      .status(200)
      .json({ success: true, message: "Admins Fetched Successfully", admins });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getAdminById = async (req, res) => {
  const { id } = req.params;

  try {
    const admin = await AdminModel.findById(id);
    if (!admin) {
      return res
        .status(404)
        .json({ success: false, message: "Admin Not Found" });
    }

    res.status(200).json({ success: true, admin });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const updateAdminById = async (req, res) => {
  const { id } = req.params;
  const { firstName, lastName, email, password, gender } = req.body;

  try {
    const admin = await AdminModel.findById(id);
    if (!admin) {
      return res
        .status(404)
        .json({ success: false, message: "Admin Not Found" });
    }

    Object.assign(admin, { firstName, lastName, email, password, gender });
    await admin.save();

    res
      .status(200)
      .json({ success: true, message: "Admin Updated Successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const deleteAdmin = async (req, res) => {
  const { id } = req.params;

  try {
    const admin = await AdminModel.findById(id);
    if (!admin) {
      return res
        .status(404)
        .json({ success: false, message: "Admin Not Found" });
    }

    await AdminModel.deleteOne({ _id: id });
    res
      .status(200)
      .json({ success: true, message: "Admin Deleted Successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
