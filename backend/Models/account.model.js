import mongoose from "mongoose";

const accountSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "paytmUsers",
    required: true,
  },
  balance: {
    type: Number,
    required: true,
  },
});

const Accounts = mongoose.model("paytmAccount", accountSchema);
export default Accounts;
