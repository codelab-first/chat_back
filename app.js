require("./common/module/dotenv")();
const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");
const notFoundRouter = require("./common/error/not-found-mw");
const errorRouter = require("./common/error/error-mw");
const { sequelize } = require("./models");
sequelize
  .sync({ force: false })
  .then(() => {
    console.log("db 연결됨.");
  })
  .catch((e) => {
    console.error(e);
  });
app.listen(process.env.port);

app.use(cors(require("./common/module/cors")()));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/", express.static("./public"));
app.use("/upload", express.static("./storages"));

const airRoute = require("./routes/airRoute");
const authRoute = require("./routes/authRoute");
const chatRoute = require("./routes/chatRoute");
// const publicRouter = require("./routes/public-router");
// const { isApi } = require("./middlewares/auth-mw");

// app.use("/admin", isAdmin(), publicRouter)
app.use("/air", airRoute);
app.use("/auth", authRoute);
app.use("/chat", chatRoute);
// app.use("/public", publicRouter);

app.use(notFoundRouter);
app.use(errorRouter);
