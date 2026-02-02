import { useEffect, useState, useContext } from "react";
import axios from "axios";
import io from "socket.io-client";
import { AuthContext } from "../context/AuthContext";

const API_URL = "https://video-platform-d68z.onrender.com";
const socket = io(API_URL);

export default function VideoList({ refresh }) {
  const { token, role } = useContext(AuthContext);
  const [videos, setVideos] = useState([]);
  const [progress, setProgress] = useState({});
  const [activeVideo, setActiveVideo] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [newName, setNewName] = useState("");

  useEffect(() => {
    fetchVideos();
  }, [refresh]);

  useEffect(() => {
    socket.on("progress", ({ videoId, progress }) => {
      setProgress((p) => ({ ...p, [videoId]: progress }));
    });

    return () => socket.off("progress");
  }, []);

  const fetchVideos = async () => {
    const res = await axios.get(`${API_URL}/api/videos`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setVideos(res.data);
  };

  const deleteVideo = async (id) => {
    await axios.delete(`${API_URL}/api/videos/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchVideos();
  };

  const renameVideo = async (id) => {
    await axios.patch(
      `${API_URL}/api/videos/${id}`,
      { filename: newName },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setEditingId(null);
    fetchVideos();
  };

  if (videos.length === 0) {
    return (
      <div className="empty-state">
        <h3>No videos available</h3>
        {role === "viewer" ? (
          <p>You don’t have access to any videos yet.</p>
        ) : (
          <p>Upload your first video to get started.</p>
        )}
      </div>
    );
  }

  return (
    <div className="video-list">
      {videos.map((video) => {
        const open = activeVideo === video._id;

        return (
          <div className="video-card" key={video._id}>
            {editingId === video._id ? (
              <>
                <input
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                />
                <button onClick={() => renameVideo(video._id)}>Save</button>
              </>
            ) : (
              <div className="video-title">{video.filename}</div>
            )}

            <span className={`badge ${video.safety || "processing"}`}>
              {video.safety || "processing"}
            </span>

            <div className="progress-container">
              <div
                className="progress-bar"
                style={{ width: `${progress[video._id] || 0}%` }}
              />
            </div>

            {video.status === "done" && (
              <>
                <button
                  className="play-btn"
                  onClick={() =>
                    setActiveVideo(open ? null : video._id)
                  }
                >
                  {open ? "Close" : "Play"}
                </button>

                {open && (
                  <video controls preload="metadata">
                    <source
                      src={`${API_URL}/api/videos/stream/${video._id}`}
                      type="video/mp4"
                    />
                  </video>
                )}
              </>
            )}

            {(role === "editor" || role === "admin") && (
              <div className="editor-actions">
                <button
                  onClick={() => {
                    setEditingId(video._id);
                    setNewName(video.filename);
                  }}
                >
                  Rename
                </button>
                <button onClick={() => deleteVideo(video._id)}>
                  Delete
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
