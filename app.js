require("./common/module/dotenv")()
const express = require("express")
const app = express()
const path = require("path")
const cors = require("cors")
const notFoundRouter = require("./common/error/not-found-mw")
const errorRouter = require("./common/error/error-mw")
const { sequelize } = require("./models")

const insertPosition = require("./script/insertPosition")
sequelize
  .sync({ force: false })
  .then(async () => {
    console.log("db 연결됨.")
    // await insertPosition()
  })
  .catch((e) => {
    console.error(e)
  })
app.listen(process.env.port, () => {
  console.log(`${process.env.port}번 포트에서 서버 대기 중`)
})

app.use(cors(require("./common/module/cors")()))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use("/", express.static("./public"))
app.use("/upload", express.static("./storages"))

const airRoute = require("./routes/airRoute")
const authRoute = require("./routes/authRoute")
const chatRoute = require("./routes/chatRoute")
const indexRoute = require("./routes")
// const publicRouter = require("./routes/public-router");
// const { isApi } = require("./middlewares/auth-mw");

// app.use("/admin", isAdmin(), publicRouter)
app.use("/air", airRoute)
app.use("/auth", authRoute)
app.use("/chat", chatRoute)
app.use("/", indexRoute)
// app.use("/public", publicRouter);

const positionRoute = require("./routes/postionRoute")
app.use("/api", positionRoute)

app.use(notFoundRouter)
app.use(errorRouter)
