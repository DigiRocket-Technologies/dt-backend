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
  }
};

// import mongoose from "mongoose";

// let cached = global.mongoose;

// if (!cached) {
//   cached = global.mongoose = { conn: null, promise: null };
// }

// export const connectDB = async () => {
//   if (cached.conn) {
//     return cached.conn;
//   }

//   if (!cached.promise) {
//     cached.promise = mongoose.connect(process.env.MONGO_URI, {
//       bufferCommands: false,
//       serverSelectionTimeoutMS: 10000, 
//     })
//     .then((mongoose) => {
//       console.log("✅ MongoDB connected successfully");
//       return mongoose;
//     })
//     .catch((err) => {
//       console.error("❌ MongoDB connection error:", err);
//       throw err;
//     });
//   }

//   cached.conn = await cached.promise;
//   return cached.conn;
// };


// import mongoose from "mongoose";

// let isConnected = false;

// export const connectDB = async () => {
//   if (isConnected) return; // already connected

//   try {
//     const conn = await mongoose.connect(process.env.MONGO_URI, {
//       serverSelectionTimeoutMS: 5000,
//       bufferCommands: false,
//     });

//     isConnected = conn.connections[0].readyState === 1; // true if connected
//     console.log("✅ MongoDB connected successfully");
//   } catch (err) {
//     console.error("❌ MongoDB connection error:", err.message);
//     throw new Error("MongoDB connection failed");
//   }
// };


