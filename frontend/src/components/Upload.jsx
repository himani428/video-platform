import axios from "axios";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";

const API_URL = "https://video-platform-d68z.onrender.com";

export default function Upload({ onUpload }) {
  const { token } = useContext(AuthContext);
  const [uploading, setUploading] = useState(false);

  const upload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("video", file);

    try {
      setUploading(true);

      await axios.post(`${API_URL}/api/videos`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      onUpload(); // 🔥 refresh list immediately
    } catch (err) {
      console.error("Upload failed:", err);
      alert("Upload failed — check console");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  return (
    <div className="upload-box">
      <h2>Upload Video</h2>
      <input type="file" accept="video/*" onChange={upload} />
      {uploading && <p style={{ opacity: 0.7 }}>Uploading & processing…</p>}
    </div>
  );
}
