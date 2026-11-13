
import { useEffect, useState } from 'react';
import './App.css';
import {
  UNAUTHORIZED_EVENT,
  sessionStore,
  tokenStore,
} from './api/client';

import IntakePage from './pages/IntakePage';
import LoginPage from './pages/LoginPage';
import LookupPage from './pages/LookupPage';
import TicketListPage from './pages/TicketListPage';

const STAFF_ROLE = 'NHAN_VIEN_TIEP_NHAN';
const MANAGER_ROLE = 'QUAN_LY_TRUNG_TAM';

const STAFF_TABS = [
  { id: 'lookup', label: '1. Tra cứu' },
  { id: 'intake', label: '2. Tiếp nhận' },
];

const MANAGER_TABS = [
  { id: 'list', label: 'Danh sách phiếu' },
];

function getInitialSession() {
  const token = tokenStore.get();
  const session = sessionStore.get();

  if (
    !token ||
    !session ||
    ![STAFF_ROLE, MANAGER_ROLE].includes(session.role)
  ) {
    tokenStore.clear();
    return null;
  }

  return session;
}

export default function App() {
  const [session, setSession] = useState(getInitialSession);
  const [notice, setNotice] = useState('');
  const [tab, setTab] = useState(
    session?.role === MANAGER_ROLE ? 'list' : 'lookup'
  );
  const [customer, setCustomer] = useState(null);
  const [device, setDevice] = useState(null);

  const isStaff = session?.role === STAFF_ROLE;
  const isManager = session?.role === MANAGER_ROLE;

  const tabs = isStaff
    ? STAFF_TABS
    : isManager
      ? MANAGER_TABS
      : [];

  // Khi token hết hạn hoặc backend trả về 401, quay lại đăng nhập.
  useEffect(() => {
    const onUnauthorized = () => {
      setSession(null);
      setCustomer(null);
      setDevice(null);
      setTab('lookup');
      setNotice('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
    };

    window.addEventListener(UNAUTHORIZED_EVENT, onUnauthorized);

    return () => {
      window.removeEventListener(UNAUTHORIZED_EVENT, onUnauthorized);
    };
  }, []);

  function handleLoggedIn(newSession) {
    setSession(newSession);
    setNotice('');
    setCustomer(null);
    setDevice(null);
    setTab(newSession.role === MANAGER_ROLE ? 'list' : 'lookup');
  }

  function logout() {
    tokenStore.clear();
    setSession(null);
    setCustomer(null);
    setDevice(null);
    setTab('lookup');
    setNotice('');
  }

  function resetFlow() {
    setCustomer(null);
    setDevice(null);
  }

  return (
    <main className="container">
      <h1>Quản lý phiếu bảo hành</h1>
      <p>Smart CRM – Mekong Mobile</p>

      {!session ? (
        <LoginPage
          notice={notice}
          onLoggedIn={handleLoggedIn}
        />
      ) : (
        <>
          <p>
            Tài khoản: <strong>{session.username}</strong>
            {' — '}
            Vai trò: <strong>
              {isStaff ? 'Nhân viên tiếp nhận' : 'Quản lý trung tâm'}
            </strong>
          </p>

          <nav className="tabs">
            {tabs.map((item) => (
              <button
                key={item.id}
                className={tab === item.id ? 'active' : ''}
                onClick={() => setTab(item.id)}
              >
                {item.label}
              </button>
            ))}

            <button className="logout" onClick={logout}>
              Đăng xuất
            </button>
          </nav>

          {isStaff && tab === 'lookup' && (
            <LookupPage
              customer={customer}
              setCustomer={setCustomer}
              device={device}
              setDevice={setDevice}
              onContinue={() => setTab('intake')}
            />
          )}

          {isStaff && tab === 'intake' && (
            <IntakePage
              customer={customer}
              device={device}
              onGoLookup={() => setTab('lookup')}
              onGoList={() => {
                resetFlow();
                setTab('lookup');
              }}
            />
          )}

          {isManager && tab === 'list' && (
            <TicketListPage />
          )}
        </>
      )}
    </main>
  );
}
