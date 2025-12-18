import mongoose from "mongoose";

const AdminSchema = mongoose.Schema(
    {
        email: String,
        password: String
    }
)

const AdminModel = mongoose.model('admin', AdminSchema);
export default AdminModel;