import React, { useState, useEffect } from "react";

const PROJECT_ID = "my-firebase-project-86e8d"; // 🔹 replace with your Firebase project ID
const BASE_URL = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents`;

function App() {
  const [name, setName] = useState("");
  const [photo, setPhoto] = useState(null); // store Base64 image
  const [users, setUsers] = useState([]);
  const [editId, setEditId] = useState(null);

  // Convert selected image to Base64
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setPhoto(reader.result); // Base64 string
    };
    reader.readAsDataURL(file);
  };

  // Fetch all users
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
        photo: doc.fields.photoBase64 ? doc.fields.photoBase64.stringValue : null,
      }));
      setUsers(list);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  // Create user
  const createUser = async () => {
    if (!name.trim()) return;
    try {
      await fetch(`${BASE_URL}/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fields: {
            name: { stringValue: name },
            photoBase64: photo ? { stringValue: photo } : undefined,
          },
        }),
      });
      setName("");
      setPhoto(null);
      fetchUsers();
    } catch (err) {
      console.error("Error creating user:", err);
    }
  };

  // Update user
  const updateUser = async (id) => {
    try {
      await fetch(`${BASE_URL}/users/${id}?updateMask.fieldPaths=name&updateMask.fieldPaths=photoBase64`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fields: {
            name: { stringValue: name },
            photoBase64: photo ? { stringValue: photo } : undefined,
          },
        }),
      });
      setName("");
      setPhoto(null);
      setEditId(null);
      fetchUsers();
    } catch (err) {
      console.error("Error updating user:", err);
    }
  };

  // Delete user
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
      <h1>🔥 React CRUD with Firebase REST API (Base64 Images)</h1>

      <input
        type="text"
        placeholder="Enter name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <input type="file" accept="image/*" onChange={handleImageChange} />

      {photo && (
        <div>
          <p>Preview:</p>
          <img src={photo} alt="preview" width={80} height={80} />
        </div>
      )}

      {editId ? (
        <button onClick={() => updateUser(editId)}>Update</button>
      ) : (
        <button onClick={createUser}>Add</button>
      )}

      <h2>📋 Users Table</h2>
      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>Name</th>
            <th>Photo</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>
                {user.photo ? (
                  <img src={user.photo} alt="user" width={60} height={60} />
                ) : (
                  "No photo"
                )}
              </td>
              <td>
                <button
                  onClick={() => {
                    setEditId(user.id);
                    setName(user.name);
                    setPhoto(user.photo);
                  }}
                >
                  Edit
                </button>
                <button onClick={() => deleteUser(user.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
