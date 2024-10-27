import express from "express"

const router = express.Router()
const axios = require("axios").default

router.post("/test", async (req: any, res: any) => {
  console.log("Received group data:")

  return res.status(200).json({})
})

export default router
