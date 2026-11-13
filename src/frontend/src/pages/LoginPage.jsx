
import { useState } from 'react';
import { sessionStore, tokenStore } from '../api/client';
import { login } from '../api/ticket.api';

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

      // Chỉ chấp nhận hai vai trò được quy định trong L02.
      const allowedRoles = [
        'NHAN_VIEN_TIEP_NHAN',
        'QUAN_LY_TRUNG_TAM',
      ];

      if (!result.token || !result.username || !allowedRoles.includes(result.role)) {
        throw new Error('Thông tin đăng nhập từ máy chủ không hợp lệ.');
      }

      tokenStore.set(result.token);
      sessionStore.set({
        username: result.username,
        role: result.role,
      });

      onLoggedIn({
        username: result.username,
        role: result.role,
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="panel narrow">
      <h2>Đăng nhập</h2>

      {notice && (
        <p className="state state-error" role="alert">
          {notice}
        </p>
      )}

      <label>
        Tài khoản
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          autoComplete="username"
        />
      </label>

      <label>
        Mật khẩu
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
        />
      </label>

      {error && (
        <p className="field-error" role="alert">
          {error}
        </p>
      )}

      <button onClick={submit} disabled={busy || !username || !password}>
        {busy ? 'Đang đăng nhập...' : 'Đăng nhập'}
      </button>
    </section>
  );
}
