import React from 'react';

export function Footer() {
  return (
    <footer
      style={{
        backgroundColor: '#190814',
        color: 'var(--color-accent)',
        marginTop: 'auto',
        borderTop: '2px solid rgba(255, 183, 197, 0.16)',
        padding: 'var(--space-6) 0'
      }}
    >
      <div
        className="container"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 'var(--space-4)',
          fontSize: 'var(--font-size-sm)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          <span>🌸</span>
          <span style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, fontSize: 'var(--font-size-lg)', color: '#FFFFFF' }}>
            Cherry Cake
          </span>
          <span style={{ opacity: 0.7 }}>— ремесленная кондитерская & кафе</span>
        </div>
        <div style={{ opacity: 0.8 }}>
          © {new Date().getFullYear()} Cherry Cake Inc. Все права защищены.
        </div>
      </div>
    </footer>
  );
}

export default Footer;
