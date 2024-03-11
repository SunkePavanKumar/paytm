import express from "express";
import connect from "./db.js";
import "dotenv/config.js";
import router from "./routes/index.js";
import userRouter from "./routes/users.js";
import accountRouter from "./routes/account.js";
const app = express();
import cors from "cors";
connect();

app.use(express.json());
app.use(cors());
app.use("/api/v1", router);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/accounts", accountRouter);
app.listen(4000, (err) => {
  if (err) throw err;
  console.log("App is listening ro the port 4000");
});

export default app;
