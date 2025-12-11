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

import mongoose from "mongoose";
export const connectDB = async () => {
  try {
    await mongoose.connect(
      process.env.MONGO_URI,
    );
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    // Don't exit process in serverless environment - let it retry on next invocation
  }
};
