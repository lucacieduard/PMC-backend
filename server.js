import dotenv from "dotenv";
dotenv.config({ path: "./.env" });
import { app } from "./app.js";
import mongoose from "mongoose";

mongoose.connect(process.env.DB_URL).then(() => {
  console.log("Connected to DB!");
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log("App running on port " + port);
});
