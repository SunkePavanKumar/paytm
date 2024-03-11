import express from "express";
import {
  signUp,
  signin,
  updateUser,
  getUsers,
} from "../controllers/users.controller.js";
import authMiddleware from "../middlewares/autth.middleware.js";

const app = express();
const router = express.Router();

router.get("/test", (req, res) => {
  res.send("users routes are working");
});

router.post("/signup", signUp);

router.post("/signin", signin);

router.put("/", authMiddleware, updateUser);

router.get("/bulk", authMiddleware, getUsers);
export default router;
