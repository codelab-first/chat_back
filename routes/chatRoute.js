const express = require("express");
const router = express.Router();
const multer = require("multer");
const sharp = require("sharp");
const { Chat, User } = require("../models");
const { Op } = require("sequelize");

const upload = multer({
  limits: { fileSize: 5 * 1024 * 1024 },
  storage: multer.diskStorage({
    filename(req, file, cb) {
      file.originalname = Buffer.from(file.originalname, "latin1").toString(
        "utf8"
      );
      cb(null, file.originalname);
    },
    destination(req, file, cb) {
      cb(null, "uploads/");
    },
  }),
});
const resizeImage = (path) => {
  console.log("path is", path);
  try {
    sharp(path)
      .resize(200, 200)
      .withMetadata()
      .toFile(`uploads/...`, (err, info) => {
        //파일 이름을 변경해야하나
        if (err) throw err;
      });
  } catch (e) {
    console.error(e);
  }
};
router.post("/chat", async (req, res, next) => {
  const {
    message,
    user: { id },
  } = req.body;
  // console.log(name);
  // console.log(app.get("io"));
  // const decoded=jwt.verify()
  // console.log("message", message);
  const user = await User.findOne({ where: { id } });
  const chats = await Chat.create({ chat: message, name: user.name });
  user.addChats(chats);

  req.app.get("io").emit("message", { message, name: user.name });
  return res.send("ok");
  // return res.status(200).json({ success: "ok" });
});
router.get("/all", async (req, res) => {
  try {
    const startDay = new Date();
    const endDay = new Date();
    startDay.setDate(startDay.getDate() - 1);
    endDay.setDate(endDay.getDate());
    const chats = await Chat.findAll({
      where: {
        createdAt: { [Op.between]: [startDay, endDay] },
      },
    });
    return res.status(200).json(chats);
  } catch (e) {
    console.error(e);
    return res.status(400).json(e.message);
  }
});
router.get("/searchByDay", async (req, res) => {
  try {
    const { startDay, endDay } = req.query;
    // console.log(startDay, endDay);
    const start = new Date(startDay);
    const end = new Date(endDay);
    console.log(start, end);
    start.setDate(start.getDate() - 1);
    end.setDate(end.getDate() + 1);
    const chats = await Chat.findAll({
      where: {
        createdAt: { [Op.between]: [start, end] },
      },
    });
    console.log(chats);
    return res.status(200).json({ message: chats.message, name: chats.chat });
  } catch (e) {
    console.error(e);
    return res.status(400).json(e.message);
  }
});
router.post("/images", upload.array("images"), async (req, res) => {
  // try {
  //   req.files.map((file) => {
  //     sharp(file.path);
  //   });
  // } catch (e) {}
});
module.exports = router;
