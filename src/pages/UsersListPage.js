import React, { useEffect, useState } from "react";
import { listDocuments, deleteDocument, docToUser } from "../api";
import { useNavigate } from "react-router-dom";

export default function UsersListPage() {
  const [users, setUsers] = useState([]);
  const [filterUserId, setFilterUserId] = useState("");
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const load = async () => {
    setLoading(true);
    setMsg("");
    try {
      const docs = await listDocuments("users");
      const mapped = docs.map(docToUser);
      setUsers(mapped);
    } catch (e) {
      setMsg("❌ " + e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const filtered = filterUserId.trim()
    ? users.filter(u => u.userId.toLowerCase().includes(filterUserId.toLowerCase()))
    : users;

  return (
    <div className="card">
      <h2>Users</h2>

      <div className="filter">
        <input placeholder="Display by specified User Id…" value={filterUserId} onChange={(e)=>setFilterUserId(e.target.value)} />
        <button onClick={load}>Display All</button>
      </div>

      {loading ? <div>Loading…</div> : (
        <table>
          <thead>
            <tr>
              <th>Serial No</th>
              <th>User Name</th>
              <th>User Password</th>
              <th>User Id</th>
              <th>Passport</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length ? filtered.map(u => (
              <tr key={u.id}>
                <td>{u.serialNumber}</td>
                <td>{u.userName}</td>
                <td>{u.userPassword}</td>
                <td>{u.userId}</td>
                <td>{u.passport ? <img className="passport" src={u.passport} alt="" /> : "—"}</td>
                <td className="actions">
                  <button onClick={() => navigate(`/users/edit/${u.id}`)}>Edit</button>
                  <button onClick={async ()=>{ try { await deleteDocument("users", u.id); load(); } catch(e){ setMsg("❌ "+e.message); } }}>Delete</button>
                </td>
              </tr>
            )) : (
              <tr><td colSpan="6">No users found.</td></tr>
            )}
          </tbody>
        </table>
      )}
      {msg && <div className="error" style={{marginTop: 8}}>{msg}</div>}
    </div>
  );
}
