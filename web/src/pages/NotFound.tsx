import { useLocation } from 'wouter';

export function NotFound() {
  const [, setLocation] = useLocation();

  return (
    <div className="terminal-center">

      <h1 className="fade-in-up stagger-1" style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>
        404
      </h1>

      <p className="fade-in-up stagger-2" style={{ marginBottom: '0.5rem' }}>
        ERROR: Page not found
      </p>

      <p className="fade-in-up stagger-3" style={{ color: 'var(--accent)', marginBottom: '2rem' }}>
        The requested resource does not exist.
      </p>

      <button
        className="terminal-btn terminal-btn-primary fade-in-up stagger-4"
        onClick={() => setLocation('/')}
      >
        return_home
      </button>
    </div>
  );
}
