import express from "express";
import morgan from "morgan";

const app = express();

app.use(express.json());
app.use(morgan("dev"));

const port = 3000;

app.listen(port, () => {
  console.log("App running on port " + port);
});
