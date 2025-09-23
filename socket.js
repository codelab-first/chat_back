const { Server } = require("socket.io");
// const userList = new Set();
// function onlyForHandshake(middleware) {
//   return (req, res, next) => {
//     const isHandshake = req._query.sid === undefined;
//     if (isHandshake) {
//       middleware(req, res, next);
//     } else {
//       next();
//     }
//   };
// }
module.exports = (app, server, passport) => {
  const io = new Server(server, {
    withCredentials: true,
    path: "/socket.io",
    pingTimeout: 30000,
  });
  app.set("io", io);

  // io.engine.use(onlyForHandshake(sessionMiddleware));
  // io.engine.use(onlyForHandshake(passport.session()));
  io.engine.use(
    (req, res, next) => {
      const isHandshake = req._query.sid === undefined;
      if (isHandshake) {
        passport.authenticate("jwt", { session: false })(req, res, next);
      } else {
        next();
      }
    }
    // onlyForHandshake((req, res, next) => {
    //   if (req.user) {
    //     next();
    //   } else {
    //     res.writeHead(401);
    //     res.end();
    //   }
    // })
  );

  // const room = io.of("/room");
  // const chat = io.of("/chat");
  io.on("connection", (socket) => {
    const user = socket.request.user;
    socket.join("chat");
    console.log(`${user.name}이 room 네임스페이스에 연결됨.`);

    // socket.on("login_user", (data) => {
    //   userList.add(data);
    //   console.log(userList);
    //   socket.to("chat").emit("login_response", Array.from(userList.values()));
    // });
    // socket.on("logout_user", (data) => {
    //   userList.delete(data);
    //   console.log(userList);
    //   socket.to("chat").emit("logout_response", Array.from(userList.values()));
    // });

    socket.on("disconnect", () => {
      socket.leave("chat");
      console.log(`${req.user.name}이 room 네임스페이스에 연결 해제됨.`);
      // userList.delete(req.user.name);
      // console.log("userList", userList);
      // socket.to("chat").emit("logout_response", Array.from(userList.values()));
    });
  });
};
