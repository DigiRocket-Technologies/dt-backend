import mongoose from "mongoose";

const UserSchema = mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    gender: { type: String, required: true }
}, { timestamps: true })

const UserModel = mongoose.model("user", UserSchema);
export default UserModel;