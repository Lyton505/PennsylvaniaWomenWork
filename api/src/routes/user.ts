import express from "express"

const router = express.Router()
const axios = require("axios").default

router.post("/test", async (req: any, res: any) => {
  console.log("Received group data:")
  const {name} = req.body;

  return res.status(200).json(name)
})

export default router
