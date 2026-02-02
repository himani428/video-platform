const router = require("express").Router();
const fs = require("fs");
const path = require("path");
const Video = require("../models/Video");
const upload = require("../middleware/upload");
const auth = require("../middleware/auth");
const processVideo = require("../utils/processVideo");

/* ================= UPLOAD VIDEO ================= */
router.post(
  "/",
  auth(["admin", "editor"]),
  upload.single("video"),
  async (req, res) => {
    const video = await Video.create({
      userId: req.user.id,
      filename: req.file.filename,
      path: req.file.path,
      status: "processing",
    });

    processVideo(req.io, video._id).then(async (safety) => {
      video.status = "done";
      video.safety = safety;
      await video.save();
    });

    res.json(video);
  }
);

/* ================= LIST VIDEOS ================= */
router.get("/", auth(), async (req, res) => {
  const videos = await Video.find({ userId: req.user.id });
  res.json(videos);
});

/* ================= DELETE VIDEO (EDITOR) ================= */
router.delete("/:id", auth(["admin", "editor"]), async (req, res) => {
  const video = await Video.findById(req.params.id);
  if (!video) return res.sendStatus(404);

  if (video.userId.toString() !== req.user.id) {
    return res.sendStatus(403);
  }

  fs.unlinkSync(video.path);
  await video.deleteOne();

  res.json({ message: "Video deleted" });
});

/* ================= RENAME VIDEO (EDITOR) ================= */
router.patch("/:id", auth(["admin", "editor"]), async (req, res) => {
  const video = await Video.findById(req.params.id);
  if (!video) return res.sendStatus(404);

  if (video.userId.toString() !== req.user.id) {
    return res.sendStatus(403);
  }

  video.filename = req.body.filename;
  await video.save();

  res.json(video);
});

/* ================= STREAM VIDEO (PUBLIC) ================= */
router.get("/stream/:id", async (req, res) => {
  const video = await Video.findById(req.params.id);
  if (!video) return res.sendStatus(404);

  const videoPath = path.resolve(video.path);
  const stat = fs.statSync(videoPath);
  const fileSize = stat.size;
  const range = req.headers.range;

  if (!range) {
    res.writeHead(200, {
      "Content-Length": fileSize,
      "Content-Type": "video/mp4",
    });
    fs.createReadStream(videoPath).pipe(res);
    return;
  }

  const parts = range.replace(/bytes=/, "").split("-");
  const start = parseInt(parts[0], 10);
  const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
  const chunkSize = end - start + 1;

  res.writeHead(206, {
    "Content-Range": `bytes ${start}-${end}/${fileSize}`,
    "Accept-Ranges": "bytes",
    "Content-Length": chunkSize,
    "Content-Type": "video/mp4",
  });

  fs.createReadStream(videoPath, { start, end }).pipe(res);
});

module.exports = router;
