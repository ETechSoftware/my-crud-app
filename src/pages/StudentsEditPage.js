import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getDocument, updateDocument } from "../api";

export default function StudentsEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    serialNumber: 0, studentName: "", studentClass: "", classArm: "", userId: ""
  });
  const [msg, setMsg] = useState("");

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const doc = await getDocument("students", id);
        const f = doc.fields || {};
        if (!mounted) return;
        setForm({
          serialNumber: Number(f.serialNumber?.integerValue || 0),
          studentName: f.studentName?.stringValue || "",
          studentClass: f.studentClass?.stringValue || "",
          classArm: f.classArm?.stringValue || "",
          userId: f.userId?.stringValue || ""
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

  const handle = (k, v) => setForm(prev => ({ ...prev, [k]: v }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    try {
      await updateDocument("students", id, {
        serialNumber: Number(form.serialNumber || 0),
        studentName: form.studentName,
        studentClass: form.studentClass,
        classArm: form.classArm,
        userId: form.userId
      });
      navigate("/students");
    } catch (e) {
      setMsg("❌ " + e.message);
    }
  };

  if (loading) return <div>Loading…</div>;

  return (
    <div className="card">
      <h2>Edit Student</h2>
      <form onSubmit={onSubmit}>
        <div className="form-row">
          <label>Serial number</label>
          <input type="number" value={form.serialNumber} onChange={(e)=>handle("serialNumber", e.target.value)} required />
        </div>
        <div className="form-row">
          <label>Student name</label>
          <input value={form.studentName} onChange={(e)=>handle("studentName", e.target.value)} required />
        </div>
        <div className="form-row">
          <label>Student class</label>
          <input value={form.studentClass} onChange={(e)=>handle("studentClass", e.target.value)} required />
        </div>
        <div className="form-row">
          <label>Class Arm</label>
          <input value={form.classArm} onChange={(e)=>handle("classArm", e.target.value)} required />
        </div>
        <div className="form-row">
          <label>User Id</label>
          <input value={form.userId} onChange={(e)=>handle("userId", e.target.value)} required />
        </div>
        <div style={{ marginTop: 12 }}>
          <button type="submit">Update Student</button>
        </div>
        {msg && <div className="error">{msg}</div>}
      </form>
    </div>
  );
}
