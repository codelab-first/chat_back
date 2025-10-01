require("./common/module/dotenv")()
const express = require("express")
const path = require("path")
const cors = require("cors")
const notFoundRouter = require("./common/error/not-found-mw")
const errorRouter = require("./common/error/error-mw")
const { sequelize } = require("./models")
const { createServer } = require("http")
const insertPosition = require("./script/insertPosition")
const initAirCondition = require("./script/initAirCondition")
const jwt = require("jsonwebtoken")
const { Server } = require("socket.io")

const app = express()

sequelize
  .sync({ force: false })
  .then(async () => {
    console.log("db 연결됨.")
    await insertPosition()
    await initAirCondition()
  })
  .catch((e) => {
    console.error(e)
  })
app.use(cors(require("./common/module/cors")()))

// app.use(cors(require("./common/module/cors")()));
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use("/", express.static("./public"))
app.use("/img", express.static(path.join(__dirname, "uploads")))
// app.use("/img", express.static("uploads/"));
// app.use("/upload", express.static("./storages"));

const airRoute = require("./routes/airRoute")
const authRoute = require("./routes/authRoute")
const chatRoute = require("./routes/chatRoute")

const airSidoDataRoute = require("./routes/airSidoDataRoute")
const indexRoute = require("./routes")

app.use("/auth", authRoute)
app.use("/chat", chatRoute)
app.use("/", indexRoute)

const positionRoute = require("./routes/postionRoute")
app.use("/api", positionRoute)
app.use("/api", airRoute)

app.use("/api", airSidoDataRoute)

app.use(notFoundRouter)
app.use(errorRouter)

const server = createServer(app)
const io = new Server(server, {
  cors: { origin: "http://localhost:5173", methods: ["GET", "POST"] },
})

io.use((socket, next) => {
  const token = socket.handshake.auth.token // 클라이언트가 보낸 토큰을 가져옴
  if (!token) {
    return next(new Error("인증 토큰이 없습니다."))
  }

  jwt.verify(token, process.env.SALT_JWT, (err, decoded) => {
    if (err) {
      return next(new Error("유효하지 않은 토큰입니다."))
    }
    // 토큰이 유효하면, 디코딩된 정보를 소켓 객체에 저장
    socket.user = decoded
    next()
  })
})
io.on("connection", (socket) => {
  // console.log("socket", socket);
  // console.log(`${socket.user.data.name}가 소켓에 연결되었습니다.`);

  socket.on("message", (data) => {
    console.log(`${socket.user.data.name}으로부터 메시지 수신:`, data.message)
    // 모든 클라이언트에게 메시지 전송
    io.emit("message", {
      user: socket.user.id,
      message: data.message,
    })
  })
})
app.set("io", io)
server.listen(process.env.port, () => {
  console.log(`${process.env.port}번 포트에서 서버 대기 중`)
})
