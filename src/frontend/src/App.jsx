import { useEffect, useState } from 'react';
import './App.css';
import { UNAUTHORIZED_EVENT, tokenStore } from './api/client';
import LoginPage from './pages/LoginPage';
import LookupPage from './pages/LookupPage';
import IntakePage from './pages/IntakePage';
import TicketListPage from './pages/TicketListPage';

const TABS = [
  { id: 'lookup', label: '1. Tra cứu' },
  { id: 'intake', label: '2. Tiếp nhận' },
  { id: 'list', label: '3. Danh sách phiếu' },
];

export default function App() {
  const [loggedIn, setLoggedIn] = useState(Boolean(tokenStore.get()));
  const [notice, setNotice] = useState('');
  const [tab, setTab] = useState('lookup');
  const [customer, setCustomer] = useState(null);
  const [device, setDevice] = useState(null);

  // Nhận 401 từ client.js: token đã bị xoá, quay về trang đăng nhập
  useEffect(() => {
    const onUnauthorized = () => {
      setLoggedIn(false);
      setNotice('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
    };
    window.addEventListener(UNAUTHORIZED_EVENT, onUnauthorized);
    return () => window.removeEventListener(UNAUTHORIZED_EVENT, onUnauthorized);
  }, []);

  function logout() {
    tokenStore.clear();
    setLoggedIn(false);
    setNotice('');
  }

  function resetFlow() {
    setCustomer(null);
    setDevice(null);
    setTab('lookup');
  }

  return (
    <main className="container">
      <h1>Quản lý phiếu bảo hành</h1>
      <p>Smart CRM – Mekong Mobile</p>

      {!loggedIn ? (
        <LoginPage notice={notice} onLoggedIn={() => { setLoggedIn(true); setNotice(''); }} />
      ) : (
        <>
          <nav className="tabs">
            {TABS.map((t) => (
              <button key={t.id} className={tab === t.id ? 'active' : ''} onClick={() => setTab(t.id)}>
                {t.label}
              </button>
            ))}
            <button className="logout" onClick={logout}>Đăng xuất</button>
          </nav>

          {tab === 'lookup' && (
            <LookupPage
              customer={customer} setCustomer={setCustomer}
              device={device} setDevice={setDevice}
              onContinue={() => setTab('intake')}
            />
          )}
          {tab === 'intake' && (
            <IntakePage
              customer={customer} device={device}
              onGoLookup={() => setTab('lookup')}
              onGoList={() => { resetFlow(); setTab("list"); }}
            />
          )}
          {tab === 'list' && <TicketListPage />}
        </>
      )}
    </main>
  );
}
