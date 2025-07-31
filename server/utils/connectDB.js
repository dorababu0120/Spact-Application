import mongoose from "mongoose";

const dbConnection = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ Database Connected");
  } catch (error) {
    console.error("❌ DB Error:", error.message);
    process.exit(1); // Exit with failure
  }
};

export default dbConnection;
