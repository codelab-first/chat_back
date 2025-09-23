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
  const { message } = req.body;
  const user = await User.findOne({ where: { id: req.user.id } });
  const chats = await Chat.create({ chat: message, name: req.user.name });
  user.addChats(chats);
  req.app
    .get("io")
    .to("chat")
    .emit("chat", { chat: message, name: req.user.name });
  return res.send("ok");
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
router.get("/searchChat", async (req, res) => {
  try {
    const { startDay, endDay } = req.query;
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
router.post("/images", upload.array("images"), async (req, res) => {
  // try {
  //   req.files.map((file) => {
  //     sharp(file.path);
  //   });
  // } catch (e) {}
});
module.exports = router;
