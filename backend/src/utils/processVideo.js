module.exports = async (io, videoId) => {
  let progress = 0;

  const interval = setInterval(() => {
    progress += 20;
    io.emit("progress", { videoId, progress });

    if (progress >= 100) clearInterval(interval);
  }, 1000);

  return Math.random() > 0.3 ? "safe" : "flagged";
};
