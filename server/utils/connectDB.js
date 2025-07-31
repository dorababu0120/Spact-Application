import mongoose from "mongoose";

const dbConnection = async () => {
  try {
    const mongoURI = process.env.MONGO_URL || process.env.MONGODB_URI;

    await mongoose.connect(mongoURI); // No need for extra options

    console.log("✅ Database Connected");
  } catch (error) {
    console.error("❌ DB Error:", error.message);
    process.exit(1); // Exit with failure
  }
};

export default dbConnection;
