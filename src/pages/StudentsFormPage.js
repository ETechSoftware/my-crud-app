import React, { useState } from "react";
import { createDocument } from "../api";

export default function StudentsFormPage() {
  const [serialNumber, setSerialNumber] = useState("");
  const [studentName, setStudentName] = useState("");
  const [studentClass, setStudentClass] = useState("");
  const [classArm, setClassArm] = useState("");
  const [userId, setUserId] = useState("");
  const [msg, setMsg] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    try {
      await createDocument("students", {
        serialNumber: { integerValue: String(Number(serialNumber) || 0) },
        studentName: { stringValue: studentName },
        studentClass: { stringValue: studentClass },
        classArm: { stringValue: classArm },
        userId: { stringValue: userId }
      });
      setMsg("✅ Student saved.");
      setSerialNumber(""); setStudentName(""); setStudentClass(""); setClassArm(""); setUserId("");
    } catch (e2) {
      setMsg("❌ " + e2.message);
    }
  };

  return (
    <div className="card">
      <h2>Add Student</h2>
      <form onSubmit={onSubmit}>
        <div className="form-row">
          <label>Serial number</label>
          <input type="number" value={serialNumber} onChange={(e)=>setSerialNumber(e.target.value)} required />
        </div>
        <div className="form-row">
          <label>Student name</label>
          <input value={studentName} onChange={(e)=>setStudentName(e.target.value)} required />
        </div>
        <div className="form-row">
          <label>Student class</label>
          <input value={studentClass} onChange={(e)=>setStudentClass(e.target.value)} required />
        </div>
        <div className="form-row">
          <label>Class Arm</label>
          <input value={classArm} onChange={(e)=>setClassArm(e.target.value)} required />
        </div>
        <div className="form-row">
          <label>User Id</label>
          <input value={userId} onChange={(e)=>setUserId(e.target.value)} required />
        </div>
        <div style={{ marginTop: 12 }}>
          <button type="submit">Save Student</button>
        </div>
        {msg && <div className={msg.startsWith("✅") ? "success" : "error"}>{msg}</div>}
      </form>
    </div>
  );
}
