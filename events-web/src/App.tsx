import { useAuth } from './auth';
import { AuthPanel } from './components/AuthPanel';

export default function App() {
  const { user, signOut } = useAuth();

  return (
    <div className="shell">
      <header className="topbar">
        <div className="brand">
          <span className="dot" />
          Events
        </div>
        {user ? (
          <div className="who">
            <span>{user.name}</span>
            <button className="ghost" onClick={signOut}>Sign out</button>
          </div>
        ) : null}
      </header>
      <main className="grid">
        <section className="col">
          {!user && <AuthPanel />}
        </section>
      </main>
    </div>
  );
}
