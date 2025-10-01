const express = require('express');
const router = express.Router();
const { getAirSidoData } = require('../controller/GetAirSidoData');

router.get('/air/sido', getAirSidoData);