const express = require("express");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: [
      "https://video-platform-murex.vercel.app",
      "https://video-platform-git-main-himani428s-projects.vercel.app",
      "https://video-platform-ne0570xg4-himani428s-projects.vercel.app",
      "http://localhost:5173"
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// IMPORTANT: handle preflight requests
app.options("*", cors());

module.exports = app;
