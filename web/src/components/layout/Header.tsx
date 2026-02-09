import { useLocation } from 'wouter';

const NAV_ITEMS = [
  { label: 'HOME', path: '/' },
  { label: 'BLOG', path: '/blog' },
  { label: 'ABOUT', path: '/about' },
];

export function Header() {
  const [location, setLocation] = useLocation();

  const isActive = (path: string) => {
    if (path === '/') return location === '/';
    return location.startsWith(path);
  };

  return (
    <header className="terminal-header">
      <div
        className="terminal-logo glitch"
        onClick={() => setLocation('/')}
      >
        {'>'} ABARNES.DEV<span className="cursor-blink">_</span>
      </div>
      <nav className="terminal-nav">
        {NAV_ITEMS.map((item) => (
          <div
            key={item.path}
            className={`terminal-nav-item ${isActive(item.path) ? 'active' : ''}`}
            onClick={() => setLocation(item.path)}
          >
            [{item.label}]
          </div>
        ))}
      </nav>
    </header>
  );
}
