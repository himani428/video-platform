import axios from "axios";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";

const API_URL = "https://video-platform-d68z.onrender.com";

export default function Upload({ onUpload }) {
  const { token, role } = useContext(AuthContext);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  const upload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("video", file);

    try {
      setUploading(true);
      setMessage("Uploading & processing...");

      await axios.post(`${API_URL}/api/videos`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setMessage("Upload successful!");
      onUpload(); // 🔥 this forces VideoList refresh
    } catch (err) {
      console.error("Upload failed:", err);
      setMessage("Upload failed — check console");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  if (role === "viewer") return null;

  return (
    <div className="upload-box">
      <h2>Upload Video</h2>
      <input type="file" accept="video/*" onChange={upload} />
      {uploading && <p>Uploading & processing…</p>}
      {message && <p>{message}</p>}
    </div>
  );
}
