const path = require("path")
const moment = require("moment")
const { nanoid } = require("nanoid")

const isProd = () => process.env.NODE_ENV === "production"

const uploadPath = (rootUrl, storageUrl, baseUrl) => {
  const dPath = moment().format("YYYYMMDD/HH")
  const uploadPath = path.join(rootUrl, storageUrl, baseUrl, dPath)
  return uploadPath
}

const createFileNm = (uploadUrl, originalNm) => {
  const ext = path.extname(originalNm)
  const arr = uploadUrl.split("\\")
  return `${arr.at(-3)}_${arr.at(-2)}_${arr.at(
    -1
  )}_${Date.now()}_${nanoid()}${ext}`
}

const createVirtualPath = (fileNm) => {
  const arr = fileNm.split("_")
  return "/upload/" + arr[0] + "/" + arr[1] + "/" + arr[2] + "/" + fileNm
}

module.exports = { isProd, uploadPath, createFileNm, createVirtualPath }
