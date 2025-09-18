const express = require("express");
const router = express.Router();
const multer = require("multer");
const { Chat, User } = require("../models");
const { Op } = require("sequelize");
const upload = multer({
  limits: { fileSize: 5 * 1024 * 1024 },
  storage: multer.diskStorage({
    filename(req, file, cb) {
      file.originalname = Buffer.from(file.originalname, "latin1").toString(
        "utf8"
      );
      cb(null,file.originalname)
    },
    destination:(req,file,cb){
      cb(null,"uploads/")
    }
  }),
});
router.post('/images',upload.array('images'),async(req,res)=>{
  try{
req.files.map(file=>{
  sharp(file.path)
})
  }catch(e){}
})
