import express from "express";

const app = express();

const router = express.Router();

router.get("/", (req, res) => {
  res.send("app is running");
});

export default router;
