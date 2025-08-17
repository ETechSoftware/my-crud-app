import React, { useState, useEffect, useCallback } from "react";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "./firebase";

function App() {
  const [name, setName] = useState("");
  const [users, setUsers] = useState([]);
  const [editId, setEditId] = useState(null);

  const usersCollection = collection(db, "users");

  // ✅ useCallback makes this stable across renders
  const fetchUsers = useCallback(async () => {
    const data = await getDocs(usersCollection);
    setUsers(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  }, [usersCollection]);

  const createUser = useCallback(async () => {
    if (!name.trim()) return;
    await addDoc(usersCollection, { name });
    setName("");
    fetchUsers();
  }, [name, usersCollection, fetchUsers]);

  const updateUser = useCallback(
    async (id) => {
      const userDoc = doc(db, "users", id);
      await updateDoc(userDoc, { name });
      setName("");
      setEditId(null);
      fetchUsers();
    },
    [name, fetchUsers]
  );

  const deleteUser = useCallback(
    async (id) => {
      await deleteDoc(doc(db, "users", id));
      fetchUsers();
    },
    [fetchUsers]
  );

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return (
    <div style={{ padding: 20 }}>
      <h1>React + Firebase CRUD</h1>
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
