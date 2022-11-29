require("dotenv").config();

const path = require("path");
const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");

const routes = require("./routes");
const { addMockData } = require("./database");

const app = express();

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, "build")));
app.use(routes);

mongoose.connect(process.env.MONGO_URI).then(async () => {
  if (process.env.NODE_ENV !== "production") {
    await addMockData();
  }
  const port = process.env.PORT;
  app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
});
