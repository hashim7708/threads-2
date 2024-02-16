import mongoose from "mongoose";

// Function to connect to MongoDB
export async function connectToDatabase() {
  try {
    await mongoose.connect(process.env.MONGO_DB_URI || "", {});
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    // You might want to handle the error accordingly, such as throwing it or exiting the application
  }
}

// Function to disconnect from MongoDB
export async function disconnectFromDatabase() {
  try {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  } catch (error) {
    console.error("Error disconnecting from MongoDB:", error);
    // You might want to handle the error accordingly
  }
}
