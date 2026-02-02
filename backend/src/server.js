require("dotenv").config();

const app = require("./app");
const http = require("http");
const { Server } = require("socket.io");
const connectDB = require("./config/db");

connectDB();

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "https://video-platform.vercel.app",
    methods: ["GET", "POST"],
  },
});

app.use((req, res, next) => {
  req.io = io;
  next();
});

app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/videos", require("./routes/video.routes"));

server.listen(process.env.PORT, () =>
  console.log(`Backend running on ${process.env.PORT}`)
);
