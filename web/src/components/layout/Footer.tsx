import { useState } from 'react';
import { useAdmin } from '../../context';

export function Footer() {
  const { isAuthenticated, isLoading, login, logout } = useAdmin();
  const [showInput, setShowInput] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const valid = await login(apiKey);
    if (valid) {
      setShowInput(false);
      setApiKey('');
      setError(false);
    } else {
      setError(true);
    }
  };

  const handleToggle = () => {
    if (isAuthenticated) {
      logout();
    } else {
      setShowInput(true);
      setError(false);
    }
  };

  const handleCancel = () => {
    setShowInput(false);
    setApiKey('');
    setError(false);
  };

  return (
    <footer className="terminal-footer">
      <div className="terminal-footer-center">
        <span>&copy; {new Date().getFullYear()} ANDREW BARNES</span>
        <span className="terminal-footer-divider">//</span>
        <span>BUILT WITH REACT + SPRING BOOT</span>
      </div>

      <div className="terminal-footer-right">
        {!isLoading && (
          showInput ? (
            <form onSubmit={handleSubmit} className="footer-auth-form">
              <input
                type="password"
                value={apiKey}
                onChange={(e) => { setApiKey(e.target.value); setError(false); }}
                placeholder="API KEY"
                className={`footer-auth-input ${error ? 'footer-auth-input--error' : ''}`}
                autoFocus
              />
              <button type="submit" className="footer-auth-btn">[OK]</button>
              <button type="button" onClick={handleCancel} className="footer-auth-btn">[X]</button>
            </form>
          ) : (
            <button onClick={handleToggle} className="footer-admin-toggle">
              {isAuthenticated ? '[EXIT ADMIN]' : '[ADMIN]'}
            </button>
          )
        )}
      </div>
    </footer>
  );
}
