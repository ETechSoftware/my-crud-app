import React, { useState, useEffect } from "react";
import { BASE_URL } from "./firebase";

function App() {
  const [name, setName] = useState("");
  const [users, setUsers] = useState([]);
  const [editId, setEditId] = useState(null);

  const fetchUsers = async () => {
    try {
      const res = await fetch(`${BASE_URL}/users`);
      const data = await res.json();
      console.log("Fetch response:", data);

      if (!data.documents) {
        setUsers([]);
        return;
      }

      const list = data.documents.map((doc) => ({
        id: doc.name.split("/").pop(),
        name: doc.fields.name.stringValue,
      }));
      setUsers(list);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  const createUser = async () => {
    if (!name.trim()) return;
    try {
      const res = await fetch(`${BASE_URL}/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fields: { name: { stringValue: name } },
        }),
      });
      const data = await res.json();
      console.log("Create response:", data);
      setName("");
      fetchUsers();
    } catch (err) {
      console.error("Error creating user:", err);
    }
  };

  const updateUser = async (id) => {
    try {
      const res = await fetch(`${BASE_URL}/users/${id}?updateMask.fieldPaths=name`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fields: { name: { stringValue: name } },
        }),
      });
      const data = await res.json();
      console.log("Update response:", data);
      setName("");
      setEditId(null);
      fetchUsers();
    } catch (err) {
      console.error("Error updating user:", err);
    }
  };

  const deleteUser = async (id) => {
    try {
      await fetch(`${BASE_URL}/users/${id}`, { method: "DELETE" });
      fetchUsers();
    } catch (err) {
      console.error("Error deleting user:", err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div style={{ padding: 20, fontFamily: "Arial" }}>
      <h1>🔥 React CRUD with Firebase REST API</h1>

      <input
        type="text"
        placeholder="Enter name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      {editId ? (
        <button onClick={() => updateUser(editId)}>Update</button>
      ) : (
        <button onClick={createUser}>Add</button>
      )}

      <ul>
        {users.map((user) => (
          <li key={user.id}>
            {user.name}{" "}
            <button
              onClick={() => {
                setEditId(user.id);
                setName(user.name);
              }}
            >
              Edit
            </button>
            <button onClick={() => deleteUser(user.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
