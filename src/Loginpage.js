import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Loginpage = ({ setIsLoggedIn }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    if (username === "adminhemz" && password === "admin@123") {
      setIsLoggedIn(true);
      navigate("/portal"); // Redirect to Portal page
    } else {
      setErrorMsg("Invalid username or password");
      setTimeout(() => setErrorMsg(""), 3000);
    }
  };

  return (
    <>
     <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
        body, html { height: 100%; }
        .login-container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          background: linear-gradient(135deg, #6a11cb, #2575fc);
          padding: 20px;
        }
        .login-box {
          background: white;
          padding: 40px 30px;
          border-radius: 12px;
          box-shadow: 0 10px 25px rgba(0,0,0,0.2);
          width: 100%;
          max-width: 400px;
          text-align: center;
        }
        .login-box h2 { margin-bottom: 30px; color: #333; }
        .input-group { margin-bottom: 20px; }
        .input-group input {
          width: 100%;
          padding: 12px 15px;
          border-radius: 8px;
          border: 1px solid #ccc;
          outline: none;
          font-size: 16px;
          transition: border 0.3s, box-shadow 0.3s;
        }
        .input-group input:focus {
          border-color: #6a11cb;
          box-shadow: 0 0 5px rgba(106,17,203,0.5);
        }
        button {
          width: 100%;
          padding: 12px;
          border: none;
          border-radius: 8px;
          background: #6a11cb;
          color: white;
          font-size: 18px;
          cursor: pointer;
          transition: background 0.3s, transform 0.2s;
        }
        button:hover { background: #2575fc; transform: translateY(-2px); }
        .error-toast {
          margin-top: 15px;
          padding: 10px;
          background: #ff4d4d;
          color: white;
          border-radius: 6px;
          font-size: 14px;
          animation: fadeIn 0.5s;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @media (max-width: 768px) {
          .login-box { padding: 30px 20px; }
          .login-box h2 { font-size: 22px; }
          button { font-size: 16px; }
        }
        @media (max-width: 480px) {
          .login-box { padding: 25px 15px; }
          .login-box h2 { font-size: 20px; }
        }
      `}</style>


      <div className="login-container">
        <div className="login-box">
          <h2>Welcome Back</h2>
          <div className="input-group">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="input-group">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button onClick={handleLogin}>Login</button>
          {errorMsg && <div className="error-toast">{errorMsg}</div>}
        </div>
      </div>
    </>
  );
};

export default Loginpage;