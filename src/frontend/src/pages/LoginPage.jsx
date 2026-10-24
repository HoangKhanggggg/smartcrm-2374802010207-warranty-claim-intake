import { useState } from 'react';
import { login } from '../api/ticket.api';
import { tokenStore } from '../api/client';

export default function LoginPage({ onLoggedIn, notice }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit() {
    setBusy(true);
    setError('');
    try {
      const result = await login(username, password);
      tokenStore.set(result.token);
      onLoggedIn(result.username);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="panel narrow">
      <h2>Đăng nhập</h2>
      {notice && <p className="state state-error" role="alert">{notice}</p>}
      <label>Tài khoản
        <input value={username} onChange={(e) => setUsername(e.target.value)} />
      </label>
      <label>Mật khẩu
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </label>
      {error && <p className="field-error" role="alert">{error}</p>}
      <button onClick={submit} disabled={busy}>{busy ? 'Đang đăng nhập...' : 'Đăng nhập'}</button>
    </section>
  );
}
