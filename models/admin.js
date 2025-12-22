import mongoose from "mongoose";

const AdminSchema = mongoose.Schema(
    {
        firstName: { type: String, required: true },
        lastName: { type: String },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        gender: { type: String, required: true },
        author: { type: String, default: "admin"}
    }
)

const AdminModel = mongoose.model('admin', AdminSchema);
export default AdminModel;