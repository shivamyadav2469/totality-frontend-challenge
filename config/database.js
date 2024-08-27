import mongoose from 'mongoose';

const connectDB = async () => {
  if (mongoose.connection.readyState === 1) return; // Already connected

  try {
    await mongoose.connect(process.env.MONGO_DB_URL, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log("MongoDB connected");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw new Error("Failed to connect to database");
  }
};

export default connectDB;
