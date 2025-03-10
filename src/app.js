const express = require("express");

const app = express();

app.use("/hi", (req, res) => {
  res.send("hello")
})

app.use("/test", (req, res) => {
  res.send("Hey this is test route!!");
})

app.listen(7777, () => {
  console.log("app listning");
})