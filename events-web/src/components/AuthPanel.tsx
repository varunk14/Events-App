import { useState } from 'react';
import { api } from '../api';
import { useAuth } from '../auth';

export function AuthPanel() {
  const { signIn } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(''); setBusy(true);
    try {
      const res = mode === 'login'
        ? await api.login(email, password)
        : await api.register(email, name, password);
      signIn(res.accessToken, res.user);
    } catch (e: any) { setErr(e.message); }
    finally { setBusy(false); }
  };

  return (
    <div className="card">
      <div className="tabs">
        <button type="button" className={mode === 'login' ? 'tab on' : 'tab'}
          onClick={() => setMode('login')}>Sign in</button>
        <button type="button" className={mode === 'register' ? 'tab on' : 'tab'}
          onClick={() => setMode('register')}>Register</button>
      </div>
      <form onSubmit={submit} className="form">
        {mode === 'register' && (
          <label>Name
            <input value={name} onChange={(e) => setName(e.target.value)}
              required placeholder="Varun Krishna" />
          </label>
        )}
        <label>Email
          <input type="email" value={email}
            onChange={(e) => setEmail(e.target.value)}
            required placeholder="you@example.com" />
        </label>
        <label>Password
          <input type="password" value={password}
            onChange={(e) => setPassword(e.target.value)}
            required minLength={8} placeholder="min 8 chars" />
        </label>
        {err && <p className="error">{err}</p>}
        <button className="primary" disabled={busy}>
          {busy ? 'Please wait…' : mode === 'login' ? 'Sign in' : 'Create account'}
        </button>
      </form>
    </div>
  );
}
