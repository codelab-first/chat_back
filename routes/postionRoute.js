const express = require("express")
const router = express.Router()
const Position = require("../models/position")

// GET /api/positions 엔드포인트
router.get("/positions", async (req, res) => {
  try {
    const positions = await Position.findAll({
      attributes: ["stationName", "dmX", "dmY"],
    })
    // 데이터가 항상 배열이도록 보장
    res.json(positions || [])
  } catch (error) {
    console.error("위치 데이터 조회 중 서버 오류 발생:", error)
    res.status(500).json([])
  }
})

module.exports = router
