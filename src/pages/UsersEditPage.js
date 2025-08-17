import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getDocument, updateDocument } from "../api";

export default function UsersEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    serialNumber: 0, userName: "", userPassword: "", userId: "", passport: null
  });
  const [msg, setMsg] = useState("");

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const doc = await getDocument("users", id);
        const f = doc.fields || {};
        if (!mounted) return;
        setForm({
          serialNumber: Number(f.serialNumber?.integerValue || 0),
          userName: f.userName?.stringValue || "",
          userPassword: f.userPassword?.stringValue || "",
          userId: f.userId?.stringValue || "",
          passport: f.passport?.stringValue || null
        });
      } catch (e) {
        setMsg("❌ " + e.message);
      } finally {
        setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, [id]);

  const onFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setForm(prev => ({ ...prev, passport: reader.result }));
    reader.readAsDataURL(file);
  };

  const handle = (k, v) => setForm(prev => ({ ...prev, [k]: v }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    try {
      await updateDocument("users", id, {
        serialNumber: Number(form.serialNumber || 0),
        userName: form.userName,
        userPassword: form.userPassword,
        userId: form.userId,
        passport: form.passport
      });
      navigate("/users");
    } catch (e) {
      setMsg("❌ " + e.message);
    }
  };

  if (loading) return <div>Loading…</div>;

  return (
    <div className="card">
      <h2>Edit User</h2>
      <form onSubmit={onSubmit}>
        <div className="form-row">
          <label>Serial number</label>
          <input type="number" value={form.serialNumber} onChange={(e)=>handle("serialNumber", e.target.value)} required />
        </div>
        <div className="form-row">
          <label>User Name</label>
          <input value={form.userName} onChange={(e)=>handle("userName", e.target.value)} required />
        </div>
        <div className="form-row">
          <label>User Password</label>
          <input type="password" value={form.userPassword} onChange={(e)=>handle("userPassword", e.target.value)} required />
        </div>
        <div className="form-row">
          <label>User Id</label>
          <input value={form.userId} onChange={(e)=>handle("userId", e.target.value)} required />
        </div>
        <div className="form-row">
          <label>Passport</label>
          <input type="file" accept="image/*" onChange={onFile} />
        </div>
        {form.passport && <img className="passport" src={form.passport} alt="preview" />}
        <div style={{ marginTop: 12 }}>
          <button type="submit">Update User</button>
        </div>
        {msg && <div className="error">{msg}</div>}
      </form>
    </div>
  );
}
