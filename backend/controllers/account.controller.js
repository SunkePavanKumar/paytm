import Accounts from "../Models/account.model.js";
import mongoose from "mongoose";
export const balance = async (req, res) => {
  try {
    let userId = req.userId;
    // let objectId = new mongoose.Types.ObjectId(userId);
    let accountData = await Accounts.findOne({
      userId: userId,
    })
      .populate("userId")
      .lean()
      .exec();
    res.send({
      success: true,
      balance: accountData.balance,
    });
  } catch (error) {
    console.log(error);
    res.status("500").send({
      message: "Internal Server Error",
    });
  }
};

export const transfer = async (req, res) => {
  try {
    let { to, amount } = req.body;
    let userId = req.userId;
    // check the balance is sufficient or not
    // start the mongoose transaction session
    const session = await mongoose.startSession();
    session.startTransaction();
    const accountDetails = await Accounts.findOne({ userId: userId })
      .lean()
      .session(session);

    if (!accountDetails || accountDetails.balance < amount) {
      await session.abortTransaction();
      res.send({
        success: false,
        message: "Insufficient Balance",
      });
    }

    // check the "TO" user account is valid or not

    const toUserAcount = await Accounts.findOne({ userId: to })
      .lean()
      .session(session);
    if (!toUserAcount) {
      await session.abortTransaction();
      res.send({
        success: false,
        message: "Invalid Account Details",
      });
    }

    // Perform the transfer
    await Accounts.updateOne(
      { userId: userId },
      { $inc: { balance: -amount } }
    ).session(session);
    await Accounts.updateOne(
      { userId: to },
      { $inc: { balance: amount } }
    ).session(session);

    // commit the transaction
    await session.commitTransaction(session);
    res.json({
      message: "Transfer successful",
    });
  } catch (err) {
    console.log(err);
    res.send({
      success: false,
      Error: err,
    });
  }
};
