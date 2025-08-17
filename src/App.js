import React from "react";
import { NavLink, Routes, Route, Navigate } from "react-router-dom";
import UsersFormPage from "./pages/UsersFormPage";
import UsersListPage from "./pages/UsersListPage";
import UsersEditPage from "./pages/UsersEditPage";
import StudentsFormPage from "./pages/StudentsFormPage";
import StudentsListPage from "./pages/StudentsListPage";
import StudentsEditPage from "./pages/StudentsEditPage";

export default function App() {
  return (
    <div className="container">
      <h1>Firebase REST Multi‑Page CRUD (with Edit)</h1>
      <nav>
        <NavLink to="/users/new">Add User</NavLink>
        <NavLink to="/users">View Users</NavLink>
        <NavLink to="/students/new">Add Student</NavLink>
        <NavLink to="/students">View Students</NavLink>
      </nav>

      <Routes>
        <Route path="/" element={<Navigate to="/users" replace />} />
        <Route path="/users" element={<UsersListPage />} />
        <Route path="/users/new" element={<UsersFormPage />} />
        <Route path="/users/edit/:id" element={<UsersEditPage />} />

        <Route path="/students" element={<StudentsListPage />} />
        <Route path="/students/new" element={<StudentsFormPage />} />
        <Route path="/students/edit/:id" element={<StudentsEditPage />} />

        <Route path="*" element={<div>Not found</div>} />
      </Routes>
    </div>
  );
}
