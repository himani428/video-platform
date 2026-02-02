const express = require("express");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: [
      "https://video-platform-muadoltep-himani428s-projects.vercel.app",
      "http://localhost:5173"
    ],
    credentials: true,
  })
);

module.exports = app;
