const express = require("express");
const router = express.Router();
const axios = require("axios");
const { Air, Position } = require("../models");

const getParameters = {
  serviceKey:
    "c2ca734d4287b322ad5dc378d514a451d79b33692adb188a1677d70cd4a9e40a",
  returnType: "json",
  numOfRows: "100",
  pageNo: "1",
  ver: "1.0",
};
router.get("/api", async (req, res) => {
  const si = "전국"; //시도 이름(전국, 서울, 부산, 대구, 인천, 광주, 대전, 울산, 경기, 강원, 충북, 충남, 전북, 전남, 경북, 경남, 제주, 세종)
  const positionData = await axios.get(
    `https://apis.data.go.kr/B552584/MsrstnInfoInqireSvc/getMsrstnList?serviceKey=c2ca734d4287b322ad5dc378d514a451d79b33692adb188a1677d70cd4a9e40a&returnType=json&numOfRows=100&pageNo=1`
    //측정소 목록 조회
  );
  const airData = await axios.get(
    `https://apis.data.go.kr/B552584/ArpltnInforInqireSvc/getCtprvnRltmMesureDnsty?serviceKey=c2ca734d4287b322ad5dc378d514a451d79b33692adb188a1677d70cd4a9e40a&returnType=${getParameters["returnType"]}&numOfRows=100&pageNo=1&sidoName=${si}&ver=1.0` //시도별 실시간 측정정보 조회
  );
  console.log(positionData);
  await Position.bulkCreate(positionData.data.response.body.items);
  await Air.bulkCreate(airData.data.response.body.items);

  // res.status(200).json(positionData.data.response.body.items);
  res.status(200).json(positionData.data.response.body.items);
});

module.exports = router;
