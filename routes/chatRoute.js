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
  const user = await User.findOne({ where: { id } });
  const chats = await Chat.create({ chat: message, name: user.name });
  user.addChats(chats);
  req.app.get("io").emit("message", { chat: message, name: user.name });
  return res.send("ok");
});
router.get("/init", async (req, res) => {
  try {
    const startDay = new Date();
    const endDay = new Date();
    startDay.setDate(startDay.getDate() - 1);
    endDay.setDate(endDay.getDate() );
    const chats = await Chat.findAll({
      where: {
        createdAt: { [Op.between]: [startDay, endDay] },
      },
    });
    console.log(chats);
    console.log(startDay, endDay);
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
    // console.log(start, end);
    start.setDate(start.getDate());
    end.setDate(end.getDate() + 1);
    const chats = await Chat.findAll({
      where: {
        createdAt: { [Op.between]: [start, end] },
      },
    });
    // console.log(chats);
    return res.status(200).json(chats);
  } catch (e) {
    console.error(e);
    return res.status(400).json(e.message);
  }
});
router.post("/images", upload.array("images"), async (req, res) => {
  try {
    const files = req.files.map((file) => ({ url: `/img/${file.filename}` }));
    const userId = JSON.parse(req.body.user).id;
    const user = await User.findOne({
      where: { id: userId },
    });
    const images = files.map((file) => file.url);
    const imageString = files.map((file) => file.url).toString();
    const image = await Chat.create({
      image: imageString,
      name: user.name,
    });
    user.addChats(image);
    req.app.get("io").emit("message", { name: user.name, image: images });
    res.status(200).json({ success: true });
  } catch (e) {
    console.error(e);
  }
});
module.exports = router;
