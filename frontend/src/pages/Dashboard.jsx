import { useContext, useState } from "react";
import Upload from "../components/Upload";
import VideoList from "../components/VideoList";
import { AuthContext } from "../context/AuthContext";

export default function Dashboard() {
  const { role, logout } = useContext(AuthContext);
  const [refresh, setRefresh] = useState(false);

  return (
    <div className="app">
      <div className="dashboard-header">
        <h1>Video Dashboard</h1>

        <div className="user-bar">
          <span className="role">{role}</span>
          <button className="logout-btn" onClick={logout}>
            Logout
          </button>
        </div>
      </div>

      {/* Only Editor/Admin can upload */}
      {(role === "admin" || role === "editor") && (
        <Upload onUpload={() => setRefresh((p) => !p)} />
      )}

      {/* Viewer must still see VideoList */}
      <VideoList refresh={refresh} />
    </div>
  );
}
