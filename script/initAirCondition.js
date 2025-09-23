const fs = require("fs")
const path = require("path")
const Air = require("../models/air")

const initAirCondition = async () => {
  try {
    const count = await Air.count()
    if (count > 0) {
      console.log("데이터가 이미 존재합니다. 데이터 삽입을 건너뜁니다.")
      return
    }

    const jsonPath = path.join(__dirname, "json", "airMeasurementExample.json")
    const fileData = fs.readFileSync(jsonPath, "utf8")
    const parsedData = JSON.parse(fileData)

    const itemsToInsert = parsedData.response.body.items

    await Air.bulkCreate(itemsToInsert, {
      ignoreDuplicates: true,
    })

    console.log("데이터가 성공적으로 삽입되었습니다!")
  } catch (error) {
    console.error("데이터 삽입 중 오류가 발생했습니다:", error)
  }
}

module.exports = initAirCondition
