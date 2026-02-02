require("dotenv").config();

const app = require("./app");
const http = require("http");
const { Server } = require("socket.io");
const connectDB = require("./config/db");

connectDB();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: [
      "https://video-platform-murex.vercel.app",
      "https://video-platform-git-main-himani428s-projects.vercel.app",
      "https://video-platform-ne0570xg4-himani428s-projects.vercel.app",
      "http://localhost:5173"
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  },
});

app.use((req, res, next) => {
  req.io = io;
  next();
});

app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/videos", require("./routes/video.routes"));

const PORT = process.env.PORT || 5000;

server.listen(PORT, () =>
  console.log(`Backend running on ${PORT}`)
);
