import React, { useState } from "react";
import { createDocument } from "../api";

export default function UsersFormPage() {
  const [serialNumber, setSerialNumber] = useState("");
  const [userName, setUserName] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [userId, setUserId] = useState("");
  const [passport, setPassport] = useState(null); // base64
  const [msg, setMsg] = useState("");

  const onFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setPassport(reader.result);
    reader.readAsDataURL(file);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    try {
      await createDocument("users", {
        serialNumber: { integerValue: String(Number(serialNumber) || 0) },
        userName: { stringValue: userName },
        userPassword: { stringValue: userPassword },
        userId: { stringValue: userId },
        ...(passport ? { passport: { stringValue: passport } } : {}),
      });
      setMsg("✅ User saved.");
      setSerialNumber(""); setUserName(""); setUserPassword(""); setUserId(""); setPassport(null);
    } catch (e2) {
      setMsg("❌ " + e2.message);
    }
  };

  return (
    <div className="card">
      <h2>Add User</h2>
      <form onSubmit={onSubmit}>
        <div className="form-row">
          <label>Serial number</label>
          <input type="number" value={serialNumber} onChange={(e)=>setSerialNumber(e.target.value)} required />
        </div>
        <div className="form-row">
          <label>User Name</label>
          <input value={userName} onChange={(e)=>setUserName(e.target.value)} required />
        </div>
        <div className="form-row">
          <label>User Password</label>
          <input type="password" value={userPassword} onChange={(e)=>setUserPassword(e.target.value)} required />
        </div>
        <div className="form-row">
          <label>User Id</label>
          <input value={userId} onChange={(e)=>setUserId(e.target.value)} required />
        </div>
        <div className="form-row">
          <label>Passport</label>
          <input type="file" accept="image/*" onChange={onFileChange} />
        </div>
        {passport && <img className="passport" src={passport} alt="preview" />}
        <div className="note">Note: Do NOT store raw passwords in production; use Firebase Auth or hash them.</div>
        <div style={{ marginTop: 12 }}>
          <button type="submit">Save User</button>
        </div>
        {msg && <div className={msg.startsWith("✅") ? "success" : "error"}>{msg}</div>}
      </form>
    </div>
  );
}
