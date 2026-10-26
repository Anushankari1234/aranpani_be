'use client';

import { useState } from 'react';

export default function Home() {
  const [count, setCount] = useState(0);

  function resetCount() {
    if (window.confirm('Reset the counter to zero?')) {
      setCount(0);
    }
  }

  return (
    <main className="counter-shell">
      <section className="counter-panel" aria-labelledby="counter-title">
        <div className="counter-heading">
          <p className="eyebrow">Daily tally</p>
          <h1 id="counter-title">Keep count.</h1>
          <p className="counter-description">A quiet space for one number at a time.</p>
        </div>

        <div className="count-display" aria-live="polite" aria-atomic="true">
          {count}
        </div>

        <div className="counter-controls" aria-label="Counter controls">
          <button
            type="button"
            className="count-button count-button-secondary"
            onClick={() => setCount((current) => current - 1)}
            aria-label="Decrease count"
          >
            <span aria-hidden="true">−</span>
          </button>
          <button
            type="button"
            className="count-button count-button-primary"
            onClick={() => setCount((current) => current + 1)}
            aria-label="Increase count"
          >
            <span aria-hidden="true">+</span>
          </button>
        </div>

        <div className="counter-footer">
          <p>Use the controls or your keyboard to adjust the tally.</p>
          <button type="button" className="reset-button" onClick={resetCount}>
            Reset to zero
          </button>
        </div>
      </section>
    </main>
  );
}
