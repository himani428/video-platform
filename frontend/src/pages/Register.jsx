import { useState } from "react";
import axios from "axios";

export default function Register({ switchToLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("editor");
  const [success, setSuccess] = useState("");

  const register = async () => {
    await axios.post("https://video-platform-d68z.onrender.com/api/auth/register", {
      email,
      password,
      role,
    });
    setSuccess("Account created. Please login.");
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Create Account</h2>
        <p className="auth-sub">Start uploading videos</p>

        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="editor">Editor</option>
          <option value="viewer">Viewer</option>
        </select>

        {success && <p className="auth-success">{success}</p>}

        <button className="auth-btn" onClick={register}>
          Register
        </button>

        <p className="auth-switch">
          Already have an account?
          <span onClick={switchToLogin}> Login</span>
        </p>
      </div>
    </div>
  );
}
