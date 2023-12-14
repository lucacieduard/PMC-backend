import { app } from "./app.js";
import dotenv from "dotenv";

const port = 3000;

dotenv.config({ path: "./.env" });
// console.log(process.env.TEST);

app.listen(port, () => {
  console.log("App running on port " + port);
});
