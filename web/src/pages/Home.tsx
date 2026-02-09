import { useLocation } from 'wouter';
import { useState, useEffect } from 'react';
import pfp from '../assets/pfp.png';

const ASCII_ART = `        _                                        _            
   __ _| |__   __ _ _ __ _ __   ___  ___      __| | _____   __
  / _\` | '_ \\ / _\` | '__| '_ \\ / _ \\/ __|    / _\` |/ _ \\ \\ / /
 | (_| | |_) | (_| | |  | | | |  __/\\__ \\ _ | (_| |  __/\\ V / 
  \\__,_|_.__/ \\__,_|_|  |_| |_|\\___||___/(_) \\__,_|\\___| \\_/  
` as const;

const TYPED_TEXT = 'A showcase of projects and experiments.';

export function Home() {
  const [, setLocation] = useLocation();
  const [displayText, setDisplayText] = useState('');
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    let index = 0;
    const timer = setInterval(() => {
      if (index < TYPED_TEXT.length) {
        setDisplayText(TYPED_TEXT.slice(0, index + 1));
        index++;
      } else {
        clearInterval(timer);
      }
    }, 50);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const cursorTimer = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 530);

    return () => clearInterval(cursorTimer);
  }, []);

  return (
    <div className="terminal-hero">
      <img src={pfp} alt="Profile" className="pfp fade-in-up" />

      <pre className="terminal-hero-ascii fade-in-up stagger-1">{ASCII_ART}</pre>

      <h1 className="terminal-hero-title fade-in-up stagger-2">
        WELCOME TO
      </h1>

      <p className="terminal-hero-subtitle fade-in-up stagger-3">
        {displayText}
        <span style={{ opacity: showCursor ? 1 : 0 }}>█</span>
      </p>

      <div className="terminal-hero-prompt fade-in-up stagger-4">
        $ select_destination
      </div>

      <div className="terminal-hero-actions fade-in-up stagger-5">
        <button
          className="terminal-btn terminal-btn-primary"
          onClick={() => setLocation('/blog')}
        >
          read_blog
        </button>
        <button
          className="terminal-btn"
          onClick={() => setLocation('/about')}
        >
          about_me
        </button>
      </div>
    </div>
  );
}
