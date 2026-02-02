const express = require("express");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const allowedOrigins = [
  "https://video-platform-murex.vercel.app",
  "https://video-platform-git-main-himani428s-projects.vercel.app",
  "https://video-platform-ne0570xg4-himani428s-projects.vercel.app",
  "http://localhost:5173"
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// 🔥 CRITICAL: handle preflight requests for ALL routes (including /api/auth)
app.options("*", cors());

module.exports = app;
