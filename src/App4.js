import React, { useState, useEffect } from "react";

// 🔹 Replace this with your Firebase Project ID
const PROJECT_ID = "my-crud-app-2b66d";
const BASE_URL = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents`;

function App() {
  const [name, setName] = useState("");
  const [users, setUsers] = useState([]);
  const [editId, setEditId] = useState(null);

  // ----------------------
  // Fetch all users
  // ----------------------
  const fetchUsers = async () => {
    try {
      const res = await fetch(`${BASE_URL}/users`);
      const data = await res.json();

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

  // ----------------------
  // Create a user
  // ----------------------
  const createUser = async () => {
    if (!name.trim()) return;
    try {
      await fetch(`${BASE_URL}/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fields: {
            name: { stringValue: name },
          },
        }),
      });
      setName("");
      fetchUsers();
    } catch (err) {
      console.error("Error creating user:", err);
    }
  };

  // ----------------------
  // Update a user
  // ----------------------
  const updateUser = async (id) => {
    try {
      await fetch(
        `${BASE_URL}/users/${id}?updateMask.fieldPaths=name`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fields: {
              name: { stringValue: name },
            },
          }),
        }
      );
      setName("");
      setEditId(null);
      fetchUsers();
    } catch (err) {
      console.error("Error updating user:", err);
    }
  };

  // ----------------------
  // Delete a user
  // ----------------------
  const deleteUser = async (id) => {
    try {
      await fetch(`${BASE_URL}/users/${id}`, {
        method: "DELETE",
      });
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
            <button onClick={() => { setEditId(user.id); setName(user.name); }}>
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
