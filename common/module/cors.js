module.exports = () => {
  const originArr = process.env.ORIGINS.split(",").map((origin) =>
    origin.trim()
  )
  return { origin: originArr, credentials: true }
}
