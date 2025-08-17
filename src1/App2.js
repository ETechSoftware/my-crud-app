import React, { useState, useEffect } from "react";
import { BASE_URL, STORAGE_BUCKET } from "./firebase";

function App() {
  const [name, setName] = useState("");
  const [photo, setPhoto] = useState(null);
  const [users, setUsers] = useState([]);
  const [editId, setEditId] = useState(null);

  // Upload Image to Storage
  const uploadImage = async (file) => {
    const uploadUrl = `https://firebasestorage.googleapis.com/v0/b/${STORAGE_BUCKET}/o/${encodeURIComponent(
      file.name
    )}?uploadType=media`;

    const res = await fetch(uploadUrl, {
      method: "POST",
      headers: { "Content-Type": file.type },
      body: file,
    });

    const data = await res.json();
    return `https://firebasestorage.googleapis.com/v0/b/${STORAGE_BUCKET}/o/${encodeURIComponent(
      file.name
    )}?alt=media`;
  };

  // Fetch all users
  const fetchUsers = async () => {
    const res = await fetch(`${BASE_URL}/users`);
    const data = await res.json();

    if (!data.documents) {
      setUsers([]);
      return;
    }

    const list = data.documents.map((doc) => ({
      id: doc.name.split("/").pop(),
      name: doc.fields.name.stringValue,
      photoUrl: doc.fields.photoUrl
        ? doc.fields.photoUrl.stringValue
        : null,
    }));
    setUsers(list);
  };

  // Fetch one user
  const fetchUser = async (id) => {
    const res = await fetch(`${BASE_URL}/users/${id}`);
    const data = await res.json();
    console.log("Single user:", data);
    alert(`User: ${data.fields?.name?.stringValue}`);
  };

  // Create user
  const createUser = async () => {
    if (!name.trim()) return;

    let photoUrl = null;
    if (photo) {
      photoUrl = await uploadImage(photo);
    }

    await fetch(`${BASE_URL}/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fields: {
          name: { stringValue: name },
          ...(photoUrl && { photoUrl: { stringValue: photoUrl } }),
        },
      }),
    });

    setName("");
    setPhoto(null);
    fetchUsers();
  };

  // Update user
  const updateUser = async (id) => {
    let photoUrl = null;
    if (photo) {
      photoUrl = await uploadImage(photo);
    }

    await fetch(
      `${BASE_URL}/users/${id}?updateMask.fieldPaths=name&updateMask.fieldPaths=photoUrl`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fields: {
            name: { stringValue: name },
            ...(photoUrl && { photoUrl: { stringValue: photoUrl } }),
          },
        }),
      }
    );

    setName("");
    setPhoto(null);
    setEditId(null);
    fetchUsers();
  };

  // Delete user
  const deleteUser = async (id) => {
    await fetch(`${BASE_URL}/users/${id}`, { method: "DELETE" });
    fetchUsers();
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div style={{ padding: 20, fontFamily: "Arial" }}>
      <h1>🔥 React CRUD + Images + Table</h1>

      <input
        type="text"
        placeholder="Enter name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input type="file" onChange={(e) => setPhoto(e.target.files[0])} />

      {editId ? (
        <button onClick={() => updateUser(editId)}>Update</button>
      ) : (
        <button onClick={createUser}>Add</button>
      )}

      <table border="1" cellPadding="8" style={{ marginTop: 20, width: "100%" }}>
        <thead>
          <tr>
            <th>Photo</th>
            <th>Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? (
            users.map((user) => (
              <tr key={user.id}>
                <td>
                  {user.photoUrl ? (
                    <img
                      src={user.photoUrl}
                      alt=""
                      width="50"
                      height="50"
                      style={{ borderRadius: "5px" }}
                    />
                  ) : (
                    "No Photo"
                  )}
                </td>
                <td>{user.name}</td>
                <td>
                  <button
                    onClick={() => {
                      setEditId(user.id);
                      setName(user.name);
                    }}
                  >
                    Edit
                  </button>
                  <button onClick={() => deleteUser(user.id)}>Delete</button>
                  <button onClick={() => fetchUser(user.id)}>View</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" align="center">
                No users found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default App;
