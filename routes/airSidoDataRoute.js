const express = require("express")
const router = express.Router()
const { getAirSidoData } = require("../controller/GetAirSidoData")

router.get("/air/data", getAirSidoData)

module.exports = router
