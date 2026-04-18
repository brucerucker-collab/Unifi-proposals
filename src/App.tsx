import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useFirebaseAuth } from './useFirebaseAuth';
import { LoginPage } from './LoginPage';
import CanonicalApp from '../App.canonical';

function ProtectedLayout() {
  const { user, loading } = useFirebaseAuth();

  if (loading) {
    return <div style={{ padding: 24 }}>Loading…</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <CanonicalApp />;
}

export default function App() {
  const { user, loading } = useFirebaseAuth();

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={<LoginPage loading={loading} isAuthed={!!user} />}
        />
        <Route path="/*" element={<ProtectedLayout />} />
      </Routes>
    </BrowserRouter>
  );
}
