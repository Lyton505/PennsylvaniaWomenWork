import path from "path";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "../.env") });

import express from "express";
import bodyParser from "body-parser";
import connectDB from "./config/db";

var cors = require("cors");

const app = express();
app.use(cors({ origin: "http://localhost:3000" })); // Connect to the frontend PORT 3000
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

connectDB();

import * as routes from "./routes/index";
app.use("/user", routes.user);
app.use("/api", routes.workshop); // New workshop route

app.listen(process.env.PORT || 8000, () => console.log("Server running..."));
