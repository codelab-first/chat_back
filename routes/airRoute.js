const express = require("express")
const router = express.Router()
const Air = require("../models/air")

router.get("/air", async (req, res) => {
  try {
    const airData = await Air.findAll({
      attributes: [
        "stationName",
        "pm10Grade",
        "pm25Grade",
        "khaiGrade",
        "o3Grade",
        "so2Grade",
        "no2Grade",
        "dataTime",
        "sidoName",
      ],
      order: [["stationName", "DESC"]],
    })

    const uniqueStation = {}
    airData.forEach((item) => {
      if (!uniqueStation[item.stationName]) {
        uniqueStation[item.stationName] = item
      }
    })

    const result = Object.values(uniqueStation)
    res.json(result)
  } catch (error) {
    console.error("대기 데이터 조회 중 서버 오류 발생:", error)
    res.status(500).json([])
  }
})

module.exports = router
