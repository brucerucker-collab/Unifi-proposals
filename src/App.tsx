import React from 'react';
import { useFirebaseAuth } from './useFirebaseAuth';
import { LoginPage } from './LoginPage';
import CanonicalApp from '../App.canonical';

export default function App() {
  const { user, loading } = useFirebaseAuth();

  if (loading) {
    return <div style={{ padding: 24 }}>Loading…</div>;
  }

  if (!user) {
    return <LoginPage loading={false} isAuthed={false} />;
  }

  return <CanonicalApp />;
}
