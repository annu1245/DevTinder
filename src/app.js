const express = require("express");
const connectDB = require("../config/database.js");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");

const authRouter = require("../router/auth.router.js");
const profileRouter = require("../router/profile.router.js");
const requestRouter = require("../router/request.router.js");
const userRouter = require("../router/user.router.js");

app.use(cors({
  "origin": " http://localhost:5173",
  "credentials": true 
}))
app.use(express.json())
app.use(cookieParser());


app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);



connectDB()
.then(() => {
  console.log("DB is connected")
  app.listen(7777, () => {
    console.log("app listingin on port 7777")
  })
})
.catch((err) => {
  console.log(err);
})

