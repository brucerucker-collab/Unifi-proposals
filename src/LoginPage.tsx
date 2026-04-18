import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from './firebase';

export function LoginPage({
  loading,
}: {
  loading: boolean;
}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  if (loading) {
    return <div style={{ padding: 24 }}>Loading…</div>;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);

    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
    } catch (err: any) {
      setError(err?.message ?? 'Login failed');
      setBusy(false);
    }
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background:
          'radial-gradient(circle at top left, rgba(99,102,241,0.14), transparent 24%), radial-gradient(circle at top right, rgba(14,165,233,0.12), transparent 22%), linear-gradient(to bottom, #f8fafc, #eef2ff)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 460,
          background: 'rgba(255,255,255,0.9)',
          border: '1px solid rgba(255,255,255,0.6)',
          borderRadius: 28,
          padding: 28,
          boxShadow: '0 10px 40px rgba(15,23,42,0.08)',
          backdropFilter: 'blur(10px)',
        }}
      >
        <div style={{ fontSize: 12, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#64748b' }}>
          UniFi Proposal Platform
        </div>

        <h1 style={{ margin: '12px 0 8px 0', fontSize: 30, lineHeight: 1.1, color: '#0f172a' }}>
          Sign in to your workspace
        </h1>

        <p style={{ margin: '0 0 24px 0', color: '#475569', fontSize: 14 }}>
          Use the Firebase email and password you created for this project.
        </p>

        <form onSubmit={onSubmit}>
          <div style={{ marginBottom: 14 }}>
            <label style={{ display: 'block', fontSize: 14, color: '#475569', marginBottom: 6 }}>
              Email
            </label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              required
              placeholder="you@example.com"
              style={{
                width: '100%',
                padding: '14px 16px',
                borderRadius: 16,
                border: '1px solid #cbd5e1',
                fontSize: 15,
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <div style={{ marginBottom: 18 }}>
            <label style={{ display: 'block', fontSize: 14, color: '#475569', marginBottom: 6 }}>
              Password
            </label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              required
              placeholder="Enter password"
              style={{
                width: '100%',
                padding: '14px 16px',
                borderRadius: 16,
                border: '1px solid #cbd5e1',
                fontSize: 15,
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>

          {error && (
            <div
              style={{
                marginBottom: 16,
                padding: '12px 14px',
                borderRadius: 14,
                background: '#fef2f2',
                color: '#b91c1c',
                border: '1px solid #fecaca',
                fontSize: 14,
              }}
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={busy}
            style={{
              width: '100%',
              padding: '14px 16px',
              borderRadius: 16,
              border: 'none',
              background: '#0f172a',
              color: '#ffffff',
              fontSize: 15,
              fontWeight: 600,
              cursor: busy ? 'not-allowed' : 'pointer',
              opacity: busy ? 0.7 : 1,
            }}
          >
            {busy ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  );
}
