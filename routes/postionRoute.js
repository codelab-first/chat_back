const express = require("express")
const router = express.Router()
const { Op } = require("sequelize")
const Position = require("../models/position")

// GET /api/positions 엔드포인트
router.get("/positions", async (req, res) => {
  try {
    const { sw_lat, sw_lng, ne_lat, ne_lng } = req.query

    if (!sw_lat || !sw_lng || !ne_lat || !ne_lng) {
      const positions = await Position.findAll({
        attributes: ["stationName", "dmX", "dmY"],
      })
      return res.json(positions || [])
    }
    const positions = await Position.findAll({
      attributes: ["stationName", "dmX", "dmY"],
      where: {
        dmX: {
          [Op.between]: [sw_lat, ne_lat],
        },
        dmY: {
          [Op.between]: [sw_lng, ne_lng],
        },
      },
    })
    res.json(positions || [])
  } catch (error) {
    console.error("위치 데이터 조회 중 서버 오류 발생:", error)
    res.status(500).json([])
  }
})

module.exports = router
