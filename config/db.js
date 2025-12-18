// import mongoose from "mongoose";
// export const connectDB = async () => {
//   try {
//     await mongoose.connect(
//       process.env.MONGO_URI,
//     );
//     console.log("MongoDB connected successfully");
//   } catch (error) {
//     console.error("MongoDB connection error:", error);
//     process.exit(1);
//   }
// };

// import mongoose from "mongoose";
// export const connectDB = async () => {
//   try {
//     await mongoose.connect(
//       process.env.MONGO_URI,
//     );
//     console.log("MongoDB connected successfully");
//   } catch (error) {
//     console.error("MongoDB connection error:", error);
//   }
// };

import mongoose from "mongoose";

let isConnected = false;

export const connectDB = async () => {
  if (isConnected) return;

  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
      bufferCommands: false,
    });

    isConnected = conn.connections[0].readyState;
    console.log("✅ MongoDB connected successfully");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
    throw new Error("MongoDB connection failed");
  }
};

