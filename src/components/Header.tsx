import React from 'react';
import { FaQuoteLeft } from 'react-icons/fa';

export function Header() {
  return (
    <header id="main-header">
      <h1>OpinionBoard</h1>
      <p>
        Strong opinions, judged by anonymous internet users. What could possibly
        go wrong?
      </p>
      <FaQuoteLeft style={{ color: '#fd9217', fontSize: '2rem', marginTop: '1rem' }} />
    </header>
  );
}
