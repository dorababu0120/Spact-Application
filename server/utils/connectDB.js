import mongoose from "mongoose";

const dbConnection = async () => {
  try {
    const mongoURI = process.env.MONGO_URL || process.env.MONGODB_URI;

    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("✅ Database Connected");
  } catch (error) {
    console.error("❌ DB Error:", error.message);
    process.exit(1);
  }
};

export default dbConnection;
