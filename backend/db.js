import mongoose from "mongoose";

function connect() {
  try {
    mongoose.connect(process.env.MONGO_URI);
    console.log("connected to the database successfully");
  } catch (error) {
    console.error("Error while connecting to the database", error);
  }
}

export default connect;
