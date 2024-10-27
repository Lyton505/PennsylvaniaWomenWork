import express from "express"
import connectDB from "./config/db"

import * as routes from "./routes/index"

var cors = require("cors")

const app = express()
app.use(cors())

app.use("/user", routes.user)

app.listen(process.env.PORT || 8000, () => console.log("Server running..."))
