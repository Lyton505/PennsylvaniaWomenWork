import express from "express";
import bodyParser from "body-parser";
import connectDB from "./config/db";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "../.env") });

import * as routes from "./routes/index";

var cors = require("cors");

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/user", routes.user);
app.use("/workshop", routes.workshop);

connectDB();

app.listen(process.env.PORT || 8000, () =>
  console.log(`Server running on port ${process.env.PORT || 8000}`)
);
