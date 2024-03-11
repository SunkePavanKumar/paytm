import signupSchema from "../Validations/signUp.validate.js";
import signinSchema from "../Validations/signin.validate.js";
import updateUserSchema from "../Validations/updataUser.validate.js";
import Accounts from "../Models/account.model.js";
import "dotenv/config.js";
import User from "../Models/user.model.js";
import jwt from "jsonwebtoken";
export async function signUp(req, res) {
  try {
    await signupSchema.parse(req.body); // zod validation

    // check if the user already exists in the system or not

    const findUser = await User.findOne({
      email: req.body.email,
    });
    if (findUser) {
      return res.send({
        message: "User Already Exists",
      });
    }
    const newUser = new User(req.body);
    await newUser.save();

    // create the balance for the user
    await Accounts.create({
      userId: newUser._id,
      balance: 1 + Math.random() * 10000,
    });
    console.log(process.env.JWT_SCRECT);
    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SCRECT, {
      expiresIn: "1h",
    });

    res.status(201).json({ message: "Signup successful", token });
  } catch (error) {
    res.status("404").send(error);
    console.error("User Registration failed", error);
  }
}

export async function signin(req, res) {
  try {
    // zod validation
    signinSchema.parse(req.body);

    const findUser = await User.findOne({
      email: req.body.email,
      password: req.body.password,
    })
      .lean()
      .exec();
    if (findUser) {
      let token = jwt.sign(
        {
          userId: findUser._id,
        },
        process.env.JWT_SCRECT
      );

      res.json({
        message: "Login in Successfully",
        token,
      });
      return;
    }
    res.status("404").send({
      message: "Login in failed",
    });
  } catch (error) {
    res.status(404).send(error);
  }
}

export async function updateUser(req, res) {
  //zod Validation
  try {
    const response = updateUserSchema.parse(req.body);
    if (response) {
      const response = await User.updateOne(req.body);
      res.send({
        message: "User updated successfully",
        data: response,
      });

      return;
    }
    res.send({
      message: "Failed to update the User",
    });
  } catch (error) {
    console.error(error);
  }
}

export async function getUsers(req, res) {
  try {
    console.log(req.query);
    const { filter } = req.query || "";
    const users = await User.find({
      $or: [
        { firstName: { $regex: filter } },
        { lastName: { $regex: filter } },
      ],
    })
      .lean()
      .exec();
    if (users.length === 0) {
      res.send({
        message: "No users found",
      });
      return;
    }
    res.send({
      users: users,
    });
  } catch (error) {
    res.status("404").send(error);
  }
}
