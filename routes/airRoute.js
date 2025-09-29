const express = require("express")
const router = express.Router()
const Air = require("../models/air")

router.get("/air", async (req, res) => {
  try {
    const { stationName } = req.query

    let whereCondition = {}
    if (stationName) {
      whereCondition = { stationName: stationName }
    }

    const airData = await Air.findAll({
      attributes: [
        "stationName",
        "pm10Grade",
        "pm10Value",
        "pm25Grade",
        "pm25Value",
        "khaiGrade",
        "khaiValue",
        "o3Grade",
        "o3Value",
        "so2Grade",
        "so2Value",
        "no2Grade",
        "no2Value",
        "dataTime",
        "sidoName",
      ],
      where: whereCondition,
      order: [["dataTime", "DESC"]],
      limit: 1,
    })

    if (stationName) {
      res.json(airData[0] || null)
    } else {
      const uniqueStations = {}
      airData.forEach((item) => {
        if (!uniqueStations[item.stationName]) {
          uniqueStations[item.stationName] = item
        }
      })
      const result = Object.values(uniqueStations)
      res.json(result)
    }
  } catch (error) {
    console.error("대기 데이터 조회 중 서버 오류 발생:", error)
    res.status(500).json({ message: "서버 오류 발생" })
  }
})

module.exports = router
