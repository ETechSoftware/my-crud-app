import React, { useEffect, useState } from "react";
import { listDocuments, deleteDocument, docToStudent } from "../api";
import { useNavigate } from "react-router-dom";

export default function StudentsListPage() {
  const [students, setStudents] = useState([]);
  const [filterUserId, setFilterUserId] = useState("");
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const load = async () => {
    setLoading(true);
    setMsg("");
    try {
      const docs = await listDocuments("students");
      const mapped = docs.map(docToStudent);
      setStudents(mapped);
    } catch (e) {
      setMsg("❌ " + e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const filtered = filterUserId.trim()
    ? students.filter(s => s.userId.toLowerCase().includes(filterUserId.toLowerCase()))
    : students;

  return (
    <div className="card">
      <h2>Students</h2>

      <div className="filter">
        <input placeholder="Display by specified User Id…" value={filterUserId} onChange={(e)=>setFilterUserId(e.target.value)} />
        <button onClick={load}>Display All</button>
      </div>

      {loading ? <div>Loading…</div> : (
        <table>
          <thead>
            <tr>
              <th>Serial No</th>
              <th>Student name</th>
              <th>Student class</th>
              <th>Class Arm</th>
              <th>User Id</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length ? filtered.map(s => (
              <tr key={s.id}>
                <td>{s.serialNumber}</td>
                <td>{s.studentName}</td>
                <td>{s.studentClass}</td>
                <td>{s.classArm}</td>
                <td>{s.userId}</td>
                <td className="actions">
                  <button onClick={() => navigate(`/students/edit/${s.id}`)}>Edit</button>
                  <button onClick={async ()=>{ try { await deleteDocument("students", s.id); load(); } catch(e){ setMsg("❌ "+e.message); } }}>Delete</button>
                </td>
              </tr>
            )) : (
              <tr><td colSpan="6">No students found.</td></tr>
            )}
          </tbody>
        </table>
      )}
      {msg && <div className="error" style={{marginTop: 8}}>{msg}</div>}
    </div>
  );
}
