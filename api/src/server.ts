import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "../.env") });

import express from "express";
import bodyParser from "body-parser";
import connectDB from "./config/db";
import * as routes from "./routes/index";
import router from "./routes";

var cors = require("cors");

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/user", routes.user);
app.use("/workshop", routes.workshop);

connectDB();

app.use("/api", router); // connect routes (prefix as api), what is the lin 7 logic for?: import * as routes from "./routes/index"

app.listen(process.env.PORT || 8000, () =>
  console.log(`Server running on port ${process.env.PORT || 8000}`)
);
