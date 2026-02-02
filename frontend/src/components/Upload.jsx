import axios from "axios";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Upload({ onUpload }) {
  const { token } = useContext(AuthContext);
  const [uploading, setUploading] = useState(false);

  const upload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("video", file);

    setUploading(true);
    await axios.post("http://localhost:5000/api/videos", formData, {
      headers: { Authorization: `Bearer ${token}` },
    });

    setUploading(false);
    e.target.value = "";
    onUpload();
  };

  return (
    <div className="upload-box">
      <h2>Upload Video</h2>
      <input type="file" accept="video/*" onChange={upload} />
      {uploading && <p style={{ opacity: 0.7 }}>Uploading & processing…</p>}
    </div>
  );
}
